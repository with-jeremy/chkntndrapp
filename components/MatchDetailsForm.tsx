'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMatchingStore } from '../lib/store';
import { fetchRestaurants } from '../utils/fetchRestaurants';
import type { MatchingFormInput } from '../lib/types';

/**
 * Form component for creating a new matching
 * Collects location data and radius from the user
 */
export default function MatchDetailsForm() {
  const router = useRouter();
  const { createMatching, addRestaurantsToMatching } = useMatchingStore();
  
  const [formData, setFormData] = useState<MatchingFormInput>({
    latitude: 0,
    longitude: 0,
    radius: 1000, // Default radius 1km
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Handle form input changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate input
      if (!formData.latitude || !formData.longitude || !formData.radius) {
        throw new Error('Please provide valid location coordinates and radius');
      }
      
      // Fetch restaurants
      const location: [number, number] = [formData.longitude, formData.latitude];
      const restaurants = await fetchRestaurants(location, formData.radius);
      
      if (!restaurants || restaurants.length === 0) {
        throw new Error('No restaurants found in this area. Try a different location or larger radius.');
      }
      
      // Create new matching
      const matchingId = await createMatching(location, formData.radius);
      
      // Add restaurants to the matching
      addRestaurantsToMatching(matchingId, restaurants);
      
      // Navigate to matching page
      router.push(`/matching/${matchingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Request user's current location
   */
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      () => {
        setError('Unable to retrieve your location');
      }
    );
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create a Matching</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            id="latitude"
            name="latitude"
            value={formData.latitude || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            id="longitude"
            name="longitude"
            value={formData.longitude || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="radius" className="block text-sm font-medium text-gray-700">
            Search Radius (meters)
          </label>
          <input
            type="number"
            id="radius"
            name="radius"
            min="100"
            max="5000"
            value={formData.radius || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="button"
          onClick={handleGetLocation}
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Use My Current Location
        </button>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Create Matching'}
        </button>
      </form>
      
      <p className="mt-4 text-sm text-gray-500 text-center">
        After creating a matching, you&apos;ll get a 4-digit code to share with a friend
      </p>
    </div>
  );
}
