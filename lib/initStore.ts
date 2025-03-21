/**
 * Utility to synchronize Zustand store with localStorage
 * Helps when pages are accessed directly via URL or in different tabs
 */
import { useMatchingStore } from './store';

/**
 * Initialize the store by checking localStorage for matching data
 * This is useful when a user directly accesses a matching URL 
 * or when tabs need to be synchronized
 */
export function initializeStore(): void {
  try {
    // Get the current matchings from the store
    const currentMatchings = useMatchingStore.getState().matchings;
    
    // Try to load matchings from localStorage
    const storedData = localStorage.getItem('restaurant-matcher-storage');
    if (!storedData) {
      console.log('No stored data found in localStorage');
      return;
    }
    
    const parsedData = JSON.parse(storedData);
    if (!parsedData.state || !parsedData.state.matchings) {
      console.log('No matchings found in stored data');
      return;
    }
    
    const storedMatchings = parsedData.state.matchings;
    console.log('Found stored matchings:', storedMatchings);
    
    // Merge any matchings that aren't already in the store
    const matchingsToMerge: Record<string, unknown> = {};
    let needsUpdate = false;
    
    Object.entries(storedMatchings).forEach(([id, matching]) => {
      if (!currentMatchings[id]) {
        matchingsToMerge[id] = matching;
        needsUpdate = true;
      }
    });
    
    // Update the store if needed
    if (needsUpdate) {
      console.log('Merging matchings into store:', matchingsToMerge);
      useMatchingStore.setState((state) => ({
        matchings: {
          ...state.matchings,
          ...matchingsToMerge,
        },
      }));
    }
  } catch (error) {
    console.error('Error initializing store from localStorage:', error);
  }
}

/**
 * Utility to ensure a matching with a specific ID is loaded
 * Useful for direct access to matching pages
 */
export function ensureMatchingLoaded(matchingId: string): boolean {
  try {
    // First check if it's already in the store
    const currentMatchings = useMatchingStore.getState().matchings;
    if (currentMatchings[matchingId]) {
      console.log('Matching already in store:', matchingId);
      return true;
    }
    
    // Try to load it from localStorage
    const storedData = localStorage.getItem('restaurant-matcher-storage');
    if (!storedData) {
      console.log('No stored data found in localStorage');
      return false;
    }
    
    const parsedData = JSON.parse(storedData);
    if (!parsedData.state || !parsedData.state.matchings || !parsedData.state.matchings[matchingId]) {
      console.log('Matching not found in stored data:', matchingId);
      return false;
    }
    
    // Add the matching to the store
    const matching = parsedData.state.matchings[matchingId];
    console.log('Found matching in localStorage:', matching);
    
    useMatchingStore.setState((state) => ({
      matchings: {
        ...state.matchings,
        [matchingId]: matching,
      },
    }));
    
    return true;
  } catch (error) {
    console.error('Error loading matching from localStorage:', error);
    return false;
  }
}
