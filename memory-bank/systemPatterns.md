# System Patterns: Restaurant Matcher

## Architecture Overview

The Restaurant Matcher application follows a clean architecture pattern with clear separation of concerns. The architecture is organized into the following layers:

```mermaid
flowchart TD
    UI[UI Layer] --> Domain[Domain Layer]
    Domain --> Data[Data Layer]
    Data --> External[External Services]
    
    subgraph UI Layer
        Pages[Pages]
        Components[Components]
    end
    
    subgraph Domain Layer
        Store[Zustand Store]
        Types[TypeScript Types]
        Actions[Server Actions]
    end
    
    subgraph Data Layer
        LocalStorage[Local Storage]
        APIRoutes[API Routes]
    end
    
    subgraph External Services
        GooglePlaces[Google Places API]
    end
```

## Design Patterns

### 1. Repository Pattern
- Used for data access abstraction through the `fetchRestaurants.ts` utility
- Isolates the data layer from the business logic
- Provides a clean API for accessing external data sources

### 2. Store Pattern (with Zustand)
- Centralizes application state management
- Provides a predictable state container
- Enables persistence through localStorage integration

### 3. Component Composition
- UI is composed of smaller, reusable components
- Clear separation between container and presentational components
- Props as the primary means of component communication

### 4. Server Actions
- Leverages Next.js server actions for server-side operations
- Clear separation between client and server functionality
- Typed API for enhanced type safety

## Data Flow

### Create Matching Flow
```mermaid
sequenceDiagram
    participant User
    participant UI as UI Components
    participant Store as Zustand Store
    participant Action as Server Action
    participant API as API Route
    participant Google as Google Places API
    
    User->>UI: Submit location & radius
    UI->>Store: Update form state
    UI->>Action: Submit form data
    Action->>API: Request restaurant data
    API->>Google: Fetch restaurant recommendations
    Google->>API: Return restaurant data
    API->>Action: Process restaurant data
    Action->>Store: Update with restaurant results and generate ID
    Store->>UI: Render updated UI with matching ID
    UI->>User: Display matching ID for sharing
```

### Join Matching Flow
```mermaid
sequenceDiagram
    participant User
    participant UI as UI Components
    participant Store as Zustand Store
    participant Action as Server Action
    
    User->>UI: Enter matching ID
    UI->>Action: Submit matching ID
    Action->>Store: Look up matching by ID
    Store-->>Action: Return matching data
    Action->>Store: Set current matching
    Store->>UI: Render matching UI
    UI->>User: Display restaurant cards for swiping
```

### Swiping and Matching Flow
```mermaid
sequenceDiagram
    participant User1 as User 1
    participant UI1 as UI (User 1)
    participant Store as Zustand Store
    participant UI2 as UI (User 2)
    participant User2 as User 2
    
    User1->>UI1: Swipe right/left on restaurant
    UI1->>Store: Register swipe (restaurant ID, liked/disliked)
    Store->>Store: Update user swipes in localStorage
    
    User2->>UI2: Swipe right/left on restaurant
    UI2->>Store: Register swipe (restaurant ID, liked/disliked)
    Store->>Store: Update partner swipes in localStorage
    Store->>Store: Check for matches
    
    alt Match Found
        Store->>UI1: Update with match result
        Store->>UI2: Update with match result
        UI1->>User1: Display match notification
        UI2->>User2: Display match notification
    end
```

## Component Structure

```mermaid
flowchart TD
    RootLayout[Root Layout] --> Home[Home Page]
    RootLayout --> CreateMatching[Create Matching Page]
    RootLayout --> JoinMatching[Join Matching Page]
    RootLayout --> MatchingDetails[Matching Details Page]
    
    Home --> JoinMatchingForm[Join Matching Form]
    CreateMatching --> MatchDetailsForm
    JoinMatching --> MatchingIdForm
    MatchingDetails --> Matching
    Matching --> ShowSwipeCards
    Matching --> MatchResults[Match Results]
```

## State Management

The application uses Zustand for state management with the following structure:

```typescript
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
  
  // Persistence
  persist: {
    getState: () => MatchingStore;
    setState: (state: MatchingStore) => void;
  }
}
```

## Folder Structure Patterns

- **/app**: Next.js App Router pages and API routes
- **/components**: Reusable UI components
- **/utils**: Utility functions
- **/lib**: Core functionality (actions, store, types)
- **/public**: Static assets

## API Integration Pattern

The application follows a clean API integration pattern:

1. **Client request** initiated from UI component
2. **Server action** processes the request
3. **API route** handles external service communication
4. **Data transformation** converts external data to application format
5. **State update** with processed data
6. **UI update** to reflect new data

## Performance Patterns

- Server-side rendering for initial page load
- Client-side state updates for interactive elements
- Optimistic UI updates where appropriate
- Lazy loading for non-critical resources

## Real-time Synchronization Pattern

The application implements a simplified real-time synchronization pattern for matching:

1. **Local State First**: All user actions are immediately reflected in local state
2. **Persistent Storage**: All state changes are persisted to localStorage
3. **Polling Strategy**: UI periodically checks for updates to partner swipes
4. **Match Detection**: When both users have swiped on the same restaurants, matches are calculated
5. **UI Updates**: Match results are propagated to both users' interfaces

This approach provides a lightweight alternative to WebSockets or Server-Sent Events for this specific use case where absolute real-time updates aren't critical.
