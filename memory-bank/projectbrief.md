# Project Brief: Restaurant Matcher

## Project Overview
Restaurant Matcher is a Next.js 15 application that helps pairs of users decide on a restaurant together. One user creates a "matching" by providing their location (longitude and latitude) and a search radius. The application then fetches restaurant data from the Google Places API and generates a unique 4-digit matching ID. Both users can join the matching with this ID and swipe through restaurant options Tinder-style. When both users swipe right on the same restaurant, it's considered a match.

## Core Requirements

### Functional Requirements
- Users can create a new matching with location and radius parameters
- Application fetches 5 restaurant recommendations using Google Places API
- System generates a unique 4-digit matching ID for sharing
- Users can join an existing matching by entering the matching ID
- Both users can swipe through restaurant options Tinder-style
- System tracks swipes from both users and identifies matches
- Users can view restaurant details including name, address, and location
- Data persistence using Zustand and localStorage
- Responsive UI for all device sizes

### Technical Requirements
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Zustand for state management
- Clean and maintainable architecture
- Google Places API integration

## Project Structure
```
/app/create-matching/page.tsx        # Create matching page
/app/matching/[id]/page.tsx          # Single matching view
/app/api/create-matching/route.ts    # API route for Google Places integration
/components/MatchDetailsForm.tsx     # Form component for create matching
/components/Matching.tsx             # Matching component
/components/ShowSwipeCards.tsx       # Card UI for restaurant display
/utils/fetchRestaurants.ts           # Utility for API calls
/lib/actions.ts                      # Server actions
/lib/store.ts                        # Zustand store
```

## Key Features
1. **Matching Creation**: Users submit location data and radius
2. **Matching Sharing**: Generation of a unique 4-digit ID for joining
3. **Restaurant Fetching**: API integration with Google Places
4. **Restaurant Swiping**: Tinder-style card interface for decision making
5. **Match Detection**: System identifies when both users like the same restaurant
6. **State Management**: Persistent storage with Zustand
7. **Responsive Design**: Mobile-first approach with Tailwind

## Success Criteria
- Application successfully fetches and displays restaurant data
- User can create and view matchings
- Data persists across sessions using localStorage
- Clean architecture is maintained throughout development
- TypeScript types are used correctly throughout codebase
