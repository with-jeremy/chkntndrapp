'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMatchingStore } from '../lib/store';
import { isValidMatchingId } from '../utils/generateMatchingId';
import { initializeStore, ensureMatchingLoaded } from '../lib/initStore';

/**
 * Form component for joining an existing matching
 * Collects the matching ID from the user
 */
export default function JoinMatchingForm() {
  const router = useRouter();
  const { joinMatching } = useMatchingStore();

  // Initialize the store when the component mounts
  useEffect(() => {
    // This ensures any existing matchings in localStorage are loaded into the store
    initializeStore();
  }, []);
  
  const [matchingId, setMatchingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate matching ID
      if (!matchingId || !isValidMatchingId(matchingId)) {
        throw new Error('Please enter a valid 4-digit matching ID');
      }
      
      console.log('Attempting to join matching with ID:', matchingId);
      
      // Direct check of localStorage to ensure we're finding the matching
      // This is more reliable than relying on the Zustand store alone
      let matchingDirectlyFound = false;
      try {
        const storedData = localStorage.getItem('restaurant-matcher-storage');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.state && 
              parsedData.state.matchings && 
              parsedData.state.matchings[matchingId]) {
            console.log('Found matching directly in localStorage:', matchingId);
            matchingDirectlyFound = true;
            
            // Force-load the matching into the store
            useMatchingStore.setState((state) => ({
              matchings: {
                ...state.matchings,
                [matchingId]: parsedData.state.matchings[matchingId]
              }
            }));
          } else {
            console.log('Matching not found directly in localStorage:', matchingId);
          }
        } else {
          console.log('No localStorage data found for restaurant-matcher-storage');
        }
      } catch (err) {
        console.error('Error checking localStorage:', err);
      }
      
      // Also try our utility function
      const matchingExists = ensureMatchingLoaded(matchingId);
      console.log('Matching exists after ensureMatchingLoaded:', matchingExists);
      
      // Get the latest state directly from the store
      const currentMatchings = useMatchingStore.getState().matchings;
      const matchingInStore = !!currentMatchings[matchingId];
      console.log('Final check - Matching in store:', matchingInStore, 'Matchings:', currentMatchings);
      
      if (!matchingInStore && !matchingDirectlyFound) {
        throw new Error('Matching not found. Please check the ID and try again.');
      }
      
      // Try to join the matching with the loaded data
      const success = await joinMatching(matchingId);
      console.log('Join matching result:', success);
      
      if (!success) {
        throw new Error('Error joining matching. Please try again.');
      }
      
      // Navigate to the matching page
      router.push(`/matching/${matchingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and limit to 4 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setMatchingId(value);
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Join a Matching</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="matchingId" className="block text-sm font-medium text-gray-700">
            Matching ID
          </label>
          <input
            type="text"
            id="matchingId"
            value={matchingId}
            onChange={handleChange}
            placeholder="Enter 4-digit code"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center text-2xl tracking-wider"
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Enter the 4-digit code shared by your friend
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || matchingId.length !== 4}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Join Matching'}
        </button>
      </form>
    </div>
  );
}
