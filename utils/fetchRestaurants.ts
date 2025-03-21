import type { Restaurant, GooglePlacesResponse, GooglePlaceResult } from '../lib/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch restaurants from Google Places API
 * 
 * @param location [longitude, latitude]
 * @param radius Radius in meters
 * @param limit Number of restaurants to return (max 5)
 * @returns Promise that resolves to an array of restaurants
 */
export async function fetchRestaurants(
  location: [number, number],
  radius: number,
  limit: number = 5
): Promise<Restaurant[]> {
  try {
    // Make the API request through our server endpoint
    const response = await fetch('/api/create-matching', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        radius,
        limit,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data: GooglePlacesResponse = await response.json();

    // Check if the API response is valid
    if (data.status !== 'OK' || !data.results || !Array.isArray(data.results)) {
      throw new Error(`API returned invalid data: ${data.status}`);
    }

    // Transform the Google Places results to our Restaurant type
    const restaurants = data.results
      .slice(0, limit)
      .map((result: GooglePlaceResult) => transformToRestaurant(result));

    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
}

/**
 * Transform a Google Places result to our Restaurant type
 * 
 * @param result GooglePlaceResult from the API
 * @returns Restaurant object
 */
function transformToRestaurant(result: GooglePlaceResult): Restaurant {
  return {
    id: uuidv4(), // Generate a unique ID for this restaurant
    name: result.name,
    address: result.vicinity,
    location: [
      result.geometry.location.lng,
      result.geometry.location.lat,
    ],
    placeId: result.place_id,
    rating: result.rating,
    photos: result.photos
      ? result.photos.map(photo => `/api/place-photo?reference=${photo.photo_reference}`)
      : undefined,
  };
}
