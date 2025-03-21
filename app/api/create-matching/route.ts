import { NextRequest, NextResponse } from 'next/server';
import type { GooglePlacesResponse } from '../../../lib/types';

/**
 * API Route to fetch restaurants from Google Places API
 * This server-side route protects the API key from being exposed to clients
 */
export async function POST(request: NextRequest) {
  try {
    // Get the API key from environment variables
    // Try both environment variable naming conventions
    const apiKey = process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.error('API key not configured in environment variables');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const { location, radius, limit = 5 } = body;
    
    console.log('Request body:', { location, radius, limit });
    
    // Validate request parameters
    if (!location || !Array.isArray(location) || location.length !== 2 || !radius) {
      console.error('Invalid parameters:', { location, radius });
      return NextResponse.json(
        { error: 'Invalid parameters. Required: location [lon, lat] and radius' },
        { status: 400 }
      );
    }
    
    const [longitude, latitude] = location;
    
    // Build the Google Places API URL
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.append('location', `${latitude},${longitude}`);
    url.searchParams.append('radius', radius.toString());
    url.searchParams.append('type', 'restaurant');
    url.searchParams.append('key', apiKey);
    
    console.log('Making request to Google Places API:', url.toString().replace(apiKey, '[REDACTED]'));
    
    // Make the request to Google Places API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`Google Places API response error: ${response.status}`, await response.text());
      return NextResponse.json(
        { error: `Google Places API responded with status: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data: GooglePlacesResponse = await response.json();
    console.log('Google Places API response status:', data.status);
    
    // Check if the API returned valid data
    if (data.status !== 'OK') {
      console.error('Google Places API error:', data);
      return NextResponse.json(
        { error: `Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}` },
        { status: 400 }
      );
    }
    
    // Limit the number of results as requested
    const results = data.results.slice(0, limit);
    console.log(`Found ${results.length} restaurants`);
    
    return NextResponse.json({
      status: data.status,
      results,
    });
  } catch (error) {
    console.error('Error fetching from Google Places API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}
