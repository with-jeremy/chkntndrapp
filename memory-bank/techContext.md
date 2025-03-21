# Technical Context: Restaurant Matcher

## Technology Stack

### Frontend Framework
- **Next.js 15**: Latest version with App Router
- **React 19**: Core UI library
- **TypeScript**: For type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling

### State Management
- **Zustand**: Lightweight state management library
- **localStorage**: Browser-based persistent storage

### External APIs
- **Google Places API**: For restaurant data retrieval

## Development Environment

### Required Tools
- Node.js 18.17.0 or later
- npm or yarn package manager
- Git for version control

### Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Project Structure

```
├── app/                        # Next.js App Router pages
│   ├── create-matching/        # Create matching page
│   │   └── page.tsx            # Create matching page component
│   ├── join-matching/          # Join matching page
│   │   └── page.tsx            # Join matching page component
│   ├── matching/               # Matching pages
│   │   └── [id]/               # Dynamic route for specific matching
│   │       └── page.tsx        # Matching detail page component
│   ├── api/                    # API routes
│   │   └── create-matching/    # Create matching API
│   │       └── route.ts        # API route handler
│   ├── layout.tsx              # Root layout component
│   ├── page.tsx                # Home page component
│   └── globals.css             # Global styles
├── components/                 # Reusable UI components
│   ├── MatchDetailsForm.tsx    # Form for creating a matching
│   ├── JoinMatchingForm.tsx    # Form for joining a matching
│   ├── Matching.tsx            # Matching display component
│   ├── ShowSwipeCards.tsx      # Restaurant card swiping component
│   └── MatchResults.tsx        # Match results display component
├── lib/                        # Core functionality
│   ├── actions.ts              # Server actions
│   ├── store.ts                # Zustand store
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Utility functions
├── utils/                      # Utility functions
│   ├── fetchRestaurants.ts     # Google Places API integration
│   └── generateMatchingId.ts   # Utility for generating matching IDs
├── public/                     # Static assets
├── .gitignore                  # Git ignore file
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## TypeScript Types

### Core Types
```typescript
// Matching
interface Matching {
  id: string;
  location: [number, number]; // [longitude, latitude]
  radius: number; // in meters
  createdAt: string;
  restaurants: Restaurant[];
  initiatorId: string; // User ID of matching creator
  joinerIds: string[]; // IDs of users who joined the matching
}

// Restaurant
interface Restaurant {
  id: string;
  name: string;
  address: string;
  location: [number, number]; // [longitude, latitude]
  placeId: string; // Google Places ID
  photos?: string[]; // Optional photo URLs
  rating?: number; // Optional rating
}

// User
interface User {
  id: string;
  role: 'initiator' | 'joiner';
  matchingId: string;
}

// Swipe Data
interface SwipeData {
  userId: string;
  restaurantId: string;
  liked: boolean;
  timestamp: string;
}

// Form Input
interface MatchingFormInput {
  latitude: number;
  longitude: number;
  radius: number;
}

// Join Matching Input
interface JoinMatchingInput {
  matchingId: string;
}

// API Response
interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
}

interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  }
  photos?: {
    photo_reference: string;
    width: number;
    height: number;
  }[];
  rating?: number;
}

// Match Result
interface MatchResult {
  restaurantId: string;
  restaurant: Restaurant;
  initiatorLiked: boolean;
  joinerLiked: boolean;
  matchedAt: string;
}
```

## Technical Constraints

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- No support required for IE11 or older browsers

### Performance Requirements
- Page load time under 2 seconds
- Time to interactive under 3 seconds
- First contentful paint under 1 second

### API Limitations
- Google Places API has usage limits and requires an API key
- Requests should be made server-side to protect API key

## Dependencies

### Production Dependencies
- next: ^15.0.0
- react: ^19.0.0
- react-dom: ^19.0.0
- zustand: ^5.0.0
- @uidotdev/usehooks: ^2.0.0  // For useful hooks like useLocalStorage
- tailwindcss: ^4.0.0
- typescript: ^5.0.0
- uuid: ^9.0.0               // For generating unique IDs
- react-spring: ^9.7.2       // For animation effects
- @headlessui/react: ^1.7.15 // For accessible UI components
- @heroicons/react: ^2.0.18  // For icons
- @types/react: ^19.0.0
- @types/node: ^20.0.0
- @types/react-dom: ^19.0.0
- @types/uuid: ^9.0.0

### Development Dependencies
- eslint: ^8.0.0
- eslint-config-next: ^15.0.0
- postcss: ^8.0.0
- autoprefixer: ^10.0.0

## API Integration

### Google Places API
- Requires API key stored in environment variables
- Uses the Nearby Search endpoint
- Authentication via API key in request headers
- Rate limited to queries per day based on billing plan

## Environment Variables
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Authentication and Security
- API keys stored in environment variables
- Server-side API requests to protect credentials
- Input validation on all form submissions
- Request validation in API routes
