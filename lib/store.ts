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
        const matching = get().matchings[matchingId];
        const userId = get().userId;
        
        if (!matching) {
          return false;
        }
        
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
        
        return true;
      },
      
      /**
       * Set the current active matching
       * @param id The matching ID to set as current
       */
      setCurrentMatching: (id: string) => {
        const matching = get().matchings[id];
        if (!matching) return;
        
        const userId = get().userId;
        let userRole: 'initiator' | 'joiner' | null = null;
        
        if (matching.initiatorId === userId) {
          userRole = 'initiator';
        } else if (matching.joinerIds.includes(userId)) {
          userRole = 'joiner';
        }
        
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
    }
  )
);
