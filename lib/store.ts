import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { generateMatchingId } from '../utils/generateMatchingId';
import type { Matching, Restaurant } from './types';

/**
 * Interface for the global state of the application
 */
interface MatchingStore {
  // Matching data
  matchings: Record<string, Matching>; // matchingId: Matching
  currentMatchingId: string | null;
  
  // User data
  userId: string;
  userRole: 'initiator' | 'joiner' | null;
  
  // Swipe data
  userSwipes: Record<string, boolean>; // restaurantId: liked
  partnerSwipes: Record<string, boolean>; // restaurantId: liked
  matches: string[]; // Array of matching restaurant IDs
  
  // Actions
  createMatching: (location: [number, number], radius: number) => Promise<string>;
  joinMatching: (matchingId: string) => Promise<boolean>;
  setCurrentMatching: (id: string) => void;
  addRestaurantsToMatching: (id: string, restaurants: Restaurant[]) => void;
  registerSwipe: (restaurantId: string, liked: boolean) => void;
  updatePartnerSwipes: (swipes: Record<string, boolean>) => void;
  checkForMatches: () => string[];
  clearCurrentMatching: () => void;
  getMatchingRestaurants: () => Restaurant[];
}

/**
 * Zustand store with localStorage persistence
 */
export const useMatchingStore = create<MatchingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      matchings: {},
      currentMatchingId: null,
      userId: uuidv4(), // Generate a unique user ID on initialization
      userRole: null,
      userSwipes: {},
      partnerSwipes: {},
      matches: [],
      
      /**
       * Create a new matching with location and radius
       * @param location [longitude, latitude]
       * @param radius Search radius in meters
       * @returns The new matching ID
       */
      createMatching: async (location: [number, number], radius: number): Promise<string> => {
        const id = generateMatchingId();
        const userId = get().userId;
        
        const newMatching: Matching = {
          id,
          location,
          radius,
          createdAt: new Date().toISOString(),
          restaurants: [],
          initiatorId: userId,
          joinerIds: [],
        };
        
        set((state) => ({
          matchings: {
            ...state.matchings,
            [id]: newMatching,
          },
          currentMatchingId: id,
          userRole: 'initiator',
          userSwipes: {},
          partnerSwipes: {},
          matches: [],
        }));
        
        return id;
      },
      
/**
 * Join an existing matching by ID
 * @param matchingId The matching ID to join
 * @returns Boolean indicating success
 */
joinMatching: async (matchingId: string): Promise<boolean> => {
  console.log('Join matching called with ID:', matchingId);
  
  // First check if we need to directly load from localStorage
  // This handles the case where we're joining a matching created by another user
  try {
    const storedState = JSON.parse(localStorage.getItem('restaurant-matcher-storage') || '{}');
    console.log('Direct localStorage check:', storedState);
    
    // Check if there are matchings in localStorage
    if (storedState.state && storedState.state.matchings) {
      const storedMatchings = storedState.state.matchings;
      console.log('Found stored matchings:', storedMatchings);
      
      // If the matching exists in localStorage but not in the current state, merge it
      if (storedMatchings[matchingId] && !get().matchings[matchingId]) {
        console.log('Matching found in localStorage but not in current state, merging...');
        
        // Update the store with the matching from localStorage
        set((state) => ({
          matchings: {
            ...state.matchings,
            [matchingId]: storedMatchings[matchingId],
          },
        }));
      }
    }
  } catch (error) {
    console.error('Error checking localStorage:', error);
  }
  
  // Now check the updated store state
  console.log('Current matchings in store after potential merge:', get().matchings);
  
  // Get the matching from the store
  const matching = get().matchings[matchingId];
  const userId = get().userId;
  
  if (!matching) {
    console.error('Matching not found for ID:', matchingId);
    return false;
  }
  
  console.log('Found matching to join:', matching);
  
  // Add user to joiners list
  const updatedMatching = {
    ...matching,
    joinerIds: [...matching.joinerIds, userId],
  };
  
  set((state) => ({
    matchings: {
      ...state.matchings,
      [matchingId]: updatedMatching,
    },
    currentMatchingId: matchingId,
    userRole: 'joiner',
    userSwipes: {},
    partnerSwipes: {},
    matches: [],
  }));
  
  // Verify the update was successful
  console.log('Updated matchings:', get().matchings);
  console.log('Current matching ID set to:', get().currentMatchingId);
  
  // Ensure the changes are persisted to localStorage
  try {
    const stateToSave = {
      matchings: {
        ...get().matchings
      },
      userId: get().userId
    };
    const serialized = JSON.stringify({ state: stateToSave, version: 0 });
    localStorage.setItem('restaurant-matcher-storage', serialized);
    console.log('Manually updated localStorage');
  } catch (error) {
    console.error('Error updating localStorage:', error);
  }
  
  return true;
},
      
/**
 * Set the current active matching
 * @param id The matching ID to set as current
 */
setCurrentMatching: (id: string) => {
  console.log('Setting current matching:', id);
  
  // First check if we need to directly load from localStorage
  try {
    const storedState = JSON.parse(localStorage.getItem('restaurant-matcher-storage') || '{}');
    
    // Check if there are matchings in localStorage
    if (storedState.state && storedState.state.matchings) {
      const storedMatchings = storedState.state.matchings;
      
      // If the matching exists in localStorage but not in the current state, merge it
      if (storedMatchings[id] && !get().matchings[id]) {
        console.log('Matching found in localStorage but not in current state, merging...');
        
        // Update the store with the matching from localStorage
        set((state) => ({
          matchings: {
            ...state.matchings,
            [id]: storedMatchings[id],
          },
        }));
      }
    }
  } catch (error) {
    console.error('Error checking localStorage:', error);
  }
  
  console.log('Available matchings after potential merge:', get().matchings);
  
  const matching = get().matchings[id];
  if (!matching) {
    console.error('No matching found with ID:', id);
    return;
  }
  
  const userId = get().userId;
  let userRole: 'initiator' | 'joiner' | null = null;
  
  if (matching.initiatorId === userId) {
    userRole = 'initiator';
  } else if (matching.joinerIds.includes(userId)) {
    userRole = 'joiner';
  }
  
  console.log('Setting user role:', userRole);
  
  set({
    currentMatchingId: id,
    userRole,
    userSwipes: {},
    partnerSwipes: {},
    matches: [],
  });
},
      
      /**
       * Add restaurants to a matching
       * @param id The matching ID
       * @param restaurants Array of restaurants to add
       */
      addRestaurantsToMatching: (id: string, restaurants: Restaurant[]) => {
        const matching = get().matchings[id];
        if (!matching) return;
        
        const updatedMatching = {
          ...matching,
          restaurants,
        };
        
        set((state) => ({
          matchings: {
            ...state.matchings,
            [id]: updatedMatching,
          },
        }));
      },
      
      /**
       * Register a swipe action for the current user
       * @param restaurantId The restaurant ID
       * @param liked Boolean indicating if the restaurant was liked (right swipe) or not (left swipe)
       */
      registerSwipe: (restaurantId: string, liked: boolean) => {
        set((state) => ({
          userSwipes: {
            ...state.userSwipes,
            [restaurantId]: liked,
          },
        }));
        
        // Check for matches after each swipe
        get().checkForMatches();
      },
      
      /**
       * Update the partner's swipes
       * @param swipes Record of the partner's swipes
       */
      updatePartnerSwipes: (swipes: Record<string, boolean>) => {
        set({
          partnerSwipes: swipes,
        });
        
        // Check for matches after updating partner swipes
        get().checkForMatches();
      },
      
      /**
       * Check for matching restaurants (both users swiped right)
       * @returns Array of restaurant IDs that match
       */
      checkForMatches: () => {
        const { userSwipes, partnerSwipes } = get();
        const matchingRestaurantIds: string[] = [];
        
        // Find restaurants where both users swiped right
        Object.entries(userSwipes).forEach(([restaurantId, liked]) => {
          if (liked && partnerSwipes[restaurantId]) {
            matchingRestaurantIds.push(restaurantId);
          }
        });
        
        set({
          matches: matchingRestaurantIds,
        });
        
        return matchingRestaurantIds;
      },
      
      /**
       * Clear the current matching selection
       */
      clearCurrentMatching: () => {
        set({
          currentMatchingId: null,
          userRole: null,
          userSwipes: {},
          partnerSwipes: {},
          matches: [],
        });
      },
      
      /**
       * Get restaurants from the current matching
       * @returns Array of restaurants or empty array if no matching selected
       */
      getMatchingRestaurants: () => {
        const { currentMatchingId, matchings } = get();
        if (!currentMatchingId || !matchings[currentMatchingId]) {
          return [];
        }
        
        return matchings[currentMatchingId].restaurants;
      },
    }),
    {
      name: 'restaurant-matcher-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        matchings: state.matchings,
        userId: state.userId,
        // Don't persist these as they should be set based on the current matchingId
        // currentMatchingId: state.currentMatchingId,
        // userRole: state.userRole,
        // userSwipes: state.userSwipes,
        // partnerSwipes: state.partnerSwipes,
        // matches: state.matches,
      }),
      // Provide debugging on store hydration
      onRehydrateStorage: () => (state) => {
        console.log('Hydrating store from localStorage');
        if (state) {
          console.log('Hydrated state:', state);
          console.log('Matchings after hydration:', state.matchings);
        } else {
          console.error('Failed to rehydrate store');
        }
      },
    }
  )
);
