/**
 * Core types for the Restaurant Matcher application
 */

/**
 * Represents a matching session
 */
export interface Matching {
  id: string;
  location: [number, number]; // [longitude, latitude]
  radius: number; // in meters
  createdAt: string;
  restaurants: Restaurant[];
  initiatorId: string; // User ID of matching creator
  joinerIds: string[]; // IDs of users who joined the matching
}

/**
 * Represents a restaurant returned from the Google Places API
 */
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  location: [number, number]; // [longitude, latitude]
  placeId: string; // Google Places ID
  photos?: string[]; // Optional photo URLs
  rating?: number; // Optional rating
}

/**
 * Represents a user in the application
 */
export interface User {
  id: string;
  role: 'initiator' | 'joiner';
  matchingId: string;
}

/**
 * Represents a swipe action on a restaurant
 */
export interface SwipeData {
  userId: string;
  restaurantId: string;
  liked: boolean;
  timestamp: string;
}

/**
 * Input for creating a new matching
 */
export interface MatchingFormInput {
  latitude: number;
  longitude: number;
  radius: number;
}

/**
 * Input for joining an existing matching
 */
export interface JoinMatchingInput {
  matchingId: string;
}

/**
 * Response from Google Places API
 */
export interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
  error_message?: string;
}

/**
 * Restaurant data from Google Places API
 */
export interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  }
  photos?: {
    photo_reference: string;
    width: number;
    height: number;
  }[];
  rating?: number;
}

/**
 * Result of a match between users
 */
export interface MatchResult {
  restaurantId: string;
  restaurant: Restaurant;
  initiatorLiked: boolean;
  joinerLiked: boolean;
  matchedAt: string;
}
