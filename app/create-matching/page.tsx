'use client';

import Link from 'next/link';
import MatchDetailsForm from '../../components/MatchDetailsForm';

/**
 * Page component for creating a new matching
 */
export default function CreateMatchingPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create a Matching</h1>
          <p className="text-gray-600 mt-2">
            Enter your location details to find restaurants in your area
          </p>
        </div>
        
        <MatchDetailsForm />
        
        <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">How It Works</h2>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="flex items-center justify-center rounded-full bg-blue-500 text-white w-5 h-5 mt-0.5 mr-2 text-xs">1</span>
              <span>Enter your location coordinates (or use your current location)</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center rounded-full bg-blue-500 text-white w-5 h-5 mt-0.5 mr-2 text-xs">2</span>
              <span>Choose a search radius (how far are you willing to travel?)</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center rounded-full bg-blue-500 text-white w-5 h-5 mt-0.5 mr-2 text-xs">3</span>
              <span>The system will find restaurants in your area</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center rounded-full bg-blue-500 text-white w-5 h-5 mt-0.5 mr-2 text-xs">4</span>
              <span>You&apos;ll receive a 4-digit code to share with your friend</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center rounded-full bg-blue-500 text-white w-5 h-5 mt-0.5 mr-2 text-xs">5</span>
              <span>Start swiping on restaurants and find your match!</span>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}
