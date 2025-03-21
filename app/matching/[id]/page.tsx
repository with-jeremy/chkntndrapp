'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Matching from '../../../components/Matching';
import { useMatchingStore } from '../../../lib/store';
import { isValidMatchingId } from '../../../utils/generateMatchingId';
import { initializeStore, ensureMatchingLoaded } from '../../../lib/initStore';

/**
 * Page component for a specific matching session
 * Dynamic route that displays restaurant cards and matching results
 */
export default function MatchingPage() {
  const params = useParams();
  const router = useRouter();
  // We're not using the store directly via hook to avoid stale data issues
  // Instead we'll use the store's getState() and setState() methods
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = useMatchingStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get matching ID from URL parameters
  const matchingId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  // Validate and check for matching on load
  useEffect(() => {
    const checkMatching = async () => {
      try {
        // First ensure the store is initialized 
        initializeStore();

        if (!matchingId || !isValidMatchingId(matchingId)) {
          setError('Invalid matching ID');
          setLoading(false);
          return;
        }
        
        console.log('Checking for matching with ID:', matchingId);
        
        // Use a direct check of localStorage to verify if the matching exists there
        let matchingFound = false;
        try {
          const storedData = localStorage.getItem('restaurant-matcher-storage');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.state && 
                parsedData.state.matchings && 
                parsedData.state.matchings[matchingId]) {
              console.log('Found matching directly in localStorage:', matchingId);
              matchingFound = true;
              
              // Force-load the matching into the store
              useMatchingStore.setState((state) => ({
                matchings: {
                  ...state.matchings,
                  [matchingId]: parsedData.state.matchings[matchingId]
                }
              }));
            }
          }
        } catch (err) {
          console.error('Error checking localStorage:', err);
        }
        
        // Also ensure the matching is loaded via our utility function
        const loadedFromStorage = ensureMatchingLoaded(matchingId);
        console.log('Matching loaded from ensureMatchingLoaded:', loadedFromStorage);
        
        // Get the latest state directly
        const freshMatchings = useMatchingStore.getState().matchings;
        const matchingExists = matchingId in freshMatchings;
        console.log('Final check - Matching exists in store:', matchingExists, freshMatchings);
        
        if (!matchingExists && !matchingFound) {
          setError('Matching not found. It may have expired or been deleted.');
          setLoading(false);
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in checkMatching:', err);
        setError('An error occurred while loading the matching.');
        setLoading(false);
      }
    };
    
    checkMatching();
  }, [matchingId]);
  
  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading matching...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:underline flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              Back to Home
            </Link>
          </div>
          
          <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700">{error}</p>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push('/join-matching')}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Join a Different Matching
              </button>
              <button
                onClick={() => router.push('/create-matching')}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Create a New Matching
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  // Show matching content
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <Matching matchingId={matchingId} />
        
        <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Share this matching</h3>
          <p className="text-gray-600 mb-4">
            Ask your friend to enter code: <span className="font-bold text-lg">{matchingId}</span>
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Join my Restaurant Matcher',
                    text: `Join my Restaurant Matcher with code: ${matchingId}`,
                    url: window.location.href,
                  });
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(
                    `Join my Restaurant Matcher with code: ${matchingId} at ${window.location.href}`
                  );
                  alert('Link copied to clipboard!');
                }
              }}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Share
            </button>
            
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(matchingId);
                  alert('Matching code copied to clipboard!');
                }
              }}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Copy Code
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
