# Restaurant Matcher

Restaurant Matcher is a Next.js 15 application that helps pairs of users decide on a restaurant together. Inspired by the classic scenario: "Where do you want to eat?" followed by "I don't care," but then having all suggestions rejected, the app turns restaurant selection into a fun, Tinder-style swiping experience.

## Features

- **Create & Share Matchings**: Generate a unique 4-digit code to share with a friend
- **Location-Based Search**: Find restaurants near a specified location
- **Tinder-Style Swiping**: Swipe right (like) or left (dislike) on restaurant options
- **Real-Time Match Detection**: Get notified when both users like the same restaurant
- **Persistent State**: Data is stored in localStorage for session persistence
- **Responsive Design**: Works on both mobile and desktop devices

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Language**: TypeScript
- **External API**: Google Places API
- **Animation**: React Spring for swipe animations

## Project Structure

```
/app                        # Next.js App Router pages
  /create-matching          # Create matching page
  /join-matching            # Join matching page
  /matching/[id]            # Dynamic route for specific matching
  /api                      # API routes
    /create-matching        # API for fetching restaurant data
/components                 # Reusable UI components
/lib                        # Core functionality
/utils                      # Utility functions
/memory-bank                # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn package manager
- Google Places API key (get it from [Google Cloud Console](https://console.cloud.google.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd restaurant-matcher
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Google Places API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Creating a Matching

1. Click "Create a New Matching" on the homepage
2. Enter your location coordinates (or use the "Use My Current Location" button)
3. Set a search radius for restaurant discovery
4. Click "Create Matching"
5. Share the generated 4-digit code with a friend

### Joining a Matching

1. Click "Join a Matching" on the homepage (or navigate to /join-matching)
2. Enter the 4-digit code shared by your friend
3. Click "Join Matching"

### Finding a Match

1. Once both users have joined, swipe right (like) or left (dislike) on restaurant cards
2. Continue swiping until you both like the same restaurant
3. When a match is found, both users will be notified!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspiration from Tinder's swiping interface
- Google Places API for restaurant data
- Next.js team for the amazing framework
