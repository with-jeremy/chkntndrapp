# Active Context: Restaurant Matcher

## Current Work Focus
- Initial project setup and structure definition
- Establishing the core architecture and file organization
- Implementing the matching and swiping functionality
- Defining types and interfaces for the application
- Setting up Zustand store for state management with multi-user data
- Creating memory bank documentation

## Recent Changes
- Project initialized with Next.js 15, Tailwind CSS, and TypeScript
- Memory bank created with core documentation files
- Project architecture and patterns defined
- Technical stack and requirements documented

## Next Steps

### Immediate Tasks
1. Create basic folder structure according to the project brief
2. Set up Zustand store with localStorage persistence
3. Implement user identification and role assignment
4. Create matching ID generation functionality
5. Implement the MatchDetailsForm component
6. Create the JoinMatchingForm component 
7. Create API route for Google Places integration
8. Implement the fetchRestaurants utility
9. Build the create-matching page
10. Build the join-matching page
11. Develop the matching detail page with swipeable restaurant cards
12. Implement the matching algorithm for detecting mutual likes

### Technical Tasks
- Install required dependencies (Zustand, etc.)
- Set up environment variables for Google Places API
- Create type definitions for the application
- Implement server actions for data fetching

## Active Decisions & Considerations

### Architecture Decisions
- Using the repository pattern for API interactions
- Leveraging Zustand for state management instead of React Context
- Storing data in localStorage for persistence
- Using a polling mechanism for checking updates rather than WebSockets
- Generating unique matching IDs for easy sharing
- Implementing server actions for server-side operations

### UX Considerations
- Form design for location input (consider using a map picker vs manual coordinates)
- Tinder-style swipe animation for restaurant cards
- Matching celebration/notification design
- Sharing mechanism for the matching ID
- Navigation flow between matching creation, joining, and results
- Error handling for API failures and edge cases

### Technical Considerations
- Security of API key usage (server-side implementation)
- Multi-user state synchronization through localStorage
- Handling conflicting swipe data
- Generating unique but easy-to-share matching IDs
- Data validation for user inputs
- Error boundary implementation
- Loading state management
- Swipe gesture implementation for mobile devices
- Responsive design across device sizes

### Open Questions
- Should we implement geolocation to automatically detect user location?
- How should we handle API rate limiting?
- What's the best way to handle swipe synchronization between users?
- Should we implement a real-time notification when the other user swipes?
- Do we need to implement pagination for restaurant results?
- Should we add filtering options for restaurant types?
- How long should we keep matching data in localStorage?

## Current Development Environment
- Next.js 15 development server
- TypeScript type checking
- ESLint for code quality
- Tailwind CSS for styling

## Active Branch
- `main` - Initial project setup and documentation
