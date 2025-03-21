'use client';

import Link from 'next/link';
import JoinMatchingForm from '../components/JoinMatchingForm';

/**
 * Home page component
 * Displays welcome message, options to create or join a matching
 */
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Restaurant Matcher</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find a restaurant you and your friend both love, without the decision fatigue.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
            <ol className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-blue-500 text-white w-6 h-6 mt-0.5 mr-2 text-sm">1</span>
                <span>Create a new matching by entering your location and preferred search radius.</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-blue-500 text-white w-6 h-6 mt-0.5 mr-2 text-sm">2</span>
                <span>Share the 4-digit code with a friend so they can join your matching.</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-blue-500 text-white w-6 h-6 mt-0.5 mr-2 text-sm">3</span>
                <span>Swipe through restaurant options (swipe right for yes, left for no).</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-blue-500 text-white w-6 h-6 mt-0.5 mr-2 text-sm">4</span>
                <span>Get notified when you and your friend both like the same restaurant!</span>
              </li>
            </ol>
            
            <div className="mt-8">
              <Link
                href="/create-matching"
                className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors"
              >
                Create a New Matching
              </Link>
            </div>
          </div>
          
          <div className="flex-1">
            <JoinMatchingForm />
            
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No matching ID?</h3>
              <p className="text-gray-600 mb-4">
                Create a new matching and invite a friend to join you!
              </p>
              <Link
                href="/create-matching"
                className="text-blue-600 hover:underline"
              >
                Create a matching →
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Restaurant Matcher. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
}
