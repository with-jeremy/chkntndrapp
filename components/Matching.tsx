'use client';

import { useState, useEffect } from 'react';
import { useMatchingStore } from '../lib/store';
import ShowSwipeCards from './ShowSwipeCards';
import type { Restaurant } from '../lib/types';
import { ensureMatchingLoaded } from '../lib/initStore';

interface MatchingProps {
  matchingId: string;
}

/**
 * Component that handles a matching session
 * Displays restaurant cards and matching results
 */
export default function Matching({ matchingId }: MatchingProps) {
  const {
    setCurrentMatching,
    getMatchingRestaurants,
    matches,
    userRole,
    userSwipes,
    partnerSwipes,
    // updatePartnerSwipes is imported but not directly used in this demo
  } = useMatchingStore();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [matchedRestaurant, setMatchedRestaurant] = useState<Restaurant | null>(null);

  // Initialize matching data
  useEffect(() => {
    const initMatching = async () => {
      try {
        setLoading(true);
        
        console.log('Initializing matching:', matchingId);
        
        // Direct check of localStorage for the matching
        let matchingDirectlyFound = false;
        let directlyLoadedRestaurants: Restaurant[] = [];
        
        try {
          const storedData = localStorage.getItem('restaurant-matcher-storage');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.state && 
                parsedData.state.matchings && 
                parsedData.state.matchings[matchingId]) {
              
              console.log('Found matching directly in localStorage:', matchingId);
              matchingDirectlyFound = true;
              
              // Get the restaurants directly from localStorage
              const storedMatching = parsedData.state.matchings[matchingId];
              if (storedMatching.restaurants && storedMatching.restaurants.length > 0) {
                directlyLoadedRestaurants = storedMatching.restaurants;
                console.log('Found restaurants directly in localStorage:', directlyLoadedRestaurants.length);
              }
              
              // Force-load the matching into the store
              useMatchingStore.setState((state) => ({
                matchings: {
                  ...state.matchings,
                  [matchingId]: storedMatching
                }
              }));
            }
          }
        } catch (err) {
          console.error('Error checking localStorage:', err);
        }
        
        // Also use our utility function as backup
        console.log('Ensuring matching is loaded via utility:', matchingId);
        const matchingLoaded = ensureMatchingLoaded(matchingId);
        console.log('Matching loaded status from utility:', matchingLoaded);
        
        // Set current matching in store
        console.log('Setting current matching in store');
        setCurrentMatching(matchingId);
        
        // Get restaurants from the matching via the store function
        const storeRestaurants = getMatchingRestaurants();
        console.log('Retrieved restaurants from store:', storeRestaurants.length);
        
        // Determine which restaurants to use - if we found them in localStorage
        // and the store doesn't have them, use the directly loaded ones
        const finalRestaurants = matchingDirectlyFound && storeRestaurants.length === 0 && directlyLoadedRestaurants.length > 0
          ? directlyLoadedRestaurants 
          : storeRestaurants;
        
        if (finalRestaurants.length === 0) {
          setError('No restaurants found for this matching.');
          return;
        }
        
        setRestaurants(finalRestaurants);
      } catch (err) {
        setError('Error loading matching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    initMatching();
    
    // Set up polling for partner swipes
    const pollInterval = setInterval(() => {
      // In a real app, this would fetch partner swipes from a server
      // For demo purposes, we'll simulate this by randomly updating some swipes
      if (userRole === 'initiator' || userRole === 'joiner') {
        // This is just a placeholder - in a real app we'd fetch from a server
        console.log('Polling for partner swipes...');
        // updatePartnerSwipes would be called with real data from the server
      }
    }, 5000);
    
    return () => clearInterval(pollInterval);
  }, [matchingId, setCurrentMatching, getMatchingRestaurants]);

  // Handle when a match is found
  const handleMatch = (restaurantId: string) => {
    // Find the matched restaurant
    const matched = restaurants.find(r => r.id === restaurantId);
    
    if (matched) {
      setMatchedRestaurant(matched);
      setShowMatchResult(true);
    }
  };

  // Get match status
  const matchStatus = showMatchResult ? 'match' : matches.length > 0 ? 'pending' : 'swiping';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading matching...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Match result view
  if (matchStatus === 'match' && matchedRestaurant) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">It&apos;s a Match!</h2>
          <p className="text-gray-700 mb-6">You and your partner both liked:</p>
          
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">{matchedRestaurant.name}</h3>
            <p className="text-gray-600 mt-1">{matchedRestaurant.address}</p>
            {matchedRestaurant.rating && (
              <div className="mt-2 flex items-center justify-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-gray-700">{matchedRestaurant.rating}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => window.open(`https://maps.google.com/?q=${matchedRestaurant.name} ${matchedRestaurant.address}`, '_blank')}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-2"
          >
            View on Maps
          </button>
          
          <button
            onClick={() => setShowMatchResult(false)}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Continue Swiping
          </button>
        </div>
      </div>
    );
  }

  // Main matching view
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Matching #{matchingId}
            </h2>
            <span className="text-sm text-gray-500">
              {userRole === 'initiator' ? 'You created this matching' : 'You joined this matching'}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <ShowSwipeCards
            restaurants={restaurants}
            onMatch={handleMatch}
          />
        </div>
        
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Your swipes: {Object.keys(userSwipes).length}/{restaurants.length}</span>
            <span>Partner swipes: {Object.keys(partnerSwipes).length}/{restaurants.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
