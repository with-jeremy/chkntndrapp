'use server';

import { fetchRestaurants } from '../utils/fetchRestaurants';
import type { MatchingFormInput, JoinMatchingInput } from './types';
import { isValidMatchingId } from '../utils/generateMatchingId';

/**
 * Server action to create a new matching
 * This processes the form data and fetches restaurants from the Google Places API
 * 
 * @param formData Form data containing location and radius
 */
export async function createMatchingAction(formData: MatchingFormInput): Promise<{ matchingId: string, success: boolean, error?: string }> {
  try {
    // Validate form data
    if (!formData.latitude || !formData.longitude || !formData.radius) {
      return {
        matchingId: '',
        success: false,
        error: 'Invalid location or radius. Please provide valid values.'
      };
    }

    // The store will generate a matching ID client-side, but we'll
    // return a placeholder for now. In a real app, we'd persist this server-side.
    const placeholderMatchingId = '1234'; // The actual ID will be handled by the Zustand store

    // Fetch restaurants
    const location: [number, number] = [formData.longitude, formData.latitude];
    const restaurants = await fetchRestaurants(location, formData.radius);

    if (!restaurants || restaurants.length === 0) {
      return {
        matchingId: '',
        success: false,
        error: 'No restaurants found in this area. Try a different location or larger radius.'
      };
    }

    // In a real-world app, we would save this matching to a database here
    // For now, we'll just return the ID for the client to handle with Zustand

    return {
      matchingId: placeholderMatchingId,
      success: true
    };
  } catch (error) {
    console.error('Error creating matching:', error);
    return {
      matchingId: '',
      success: false,
      error: 'Failed to create matching. Please try again.'
    };
  }
}

/**
 * Server action to join an existing matching
 * 
 * @param data Join matching form data
 */
export async function joinMatchingAction(data: JoinMatchingInput): Promise<{ success: boolean, error?: string }> {
  try {
    // Validate matching ID
    if (!data.matchingId || !isValidMatchingId(data.matchingId)) {
      return {
        success: false,
        error: 'Invalid matching ID. Please check and try again.'
      };
    }

    // In a real-world app, we would verify the matching exists in the database
    // For now, we'll just return success for the client to handle with Zustand

    return {
      success: true
    };
  } catch (error) {
    console.error('Error joining matching:', error);
    return {
      success: false,
      error: 'Failed to join matching. Please try again.'
    };
  }
}

/**
 * Server action to get matching details
 * 
 * @param matchingId Matching ID to retrieve
 */
export async function getMatchingDetailsAction(matchingId: string): Promise<{ success: boolean, error?: string }> {
  try {
    // Validate matching ID
    if (!matchingId || !isValidMatchingId(matchingId)) {
      return {
        success: false,
        error: 'Invalid matching ID. Please check and try again.'
      };
    }

    // In a real-world app, we would fetch the matching details from the database
    // For now, we'll just return success for the client to handle with Zustand

    return {
      success: true
    };
  } catch (error) {
    console.error('Error getting matching details:', error);
    return {
      success: false,
      error: 'Failed to get matching details. Please try again.'
    };
  }
}
