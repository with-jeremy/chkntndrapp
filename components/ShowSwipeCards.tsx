'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { useMatchingStore } from '../lib/store';
import type { Restaurant } from '../lib/types';

interface ShowSwipeCardsProps {
  restaurants: Restaurant[];
  onMatch?: (restaurantId: string) => void;
}

/**
 * Component that displays restaurants as swipeable cards
 * Provides Tinder-style swiping functionality
 */
export default function ShowSwipeCards({ restaurants, onMatch }: ShowSwipeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const { registerSwipe, matches } = useMatchingStore();
  
  // Configure spring animation
  const [{ x, y, rotation, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    config: { friction: 20, tension: 150 }
  }));

  // Set up gesture handling
  const bind = useGesture({
    onDrag: ({ down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = vx > 0.2; // Velocity required to trigger a swipe
      const isRight = xDir > 0;
      
      // If card is being dragged
      if (down) {
        // Calculate rotation based on horizontal movement
        const rotation = mx / 20;
        
        // Update spring values
        api.start({
          x: mx,
          rotation,
          scale: 1.05,
          immediate: down,
        });
        
        // Update direction indicator based on movement
        if (mx > 50) {
          setDirection('right');
        } else if (mx < -50) {
          setDirection('left');
        } else {
          setDirection(null);
        }
      } 
      // If card is released
      else {
        // If sufficient velocity or drag distance
        if (trigger || Math.abs(mx) > 100) {
          // Swipe off screen
          api.start({
            x: isRight ? 500 : -500,
            rotation: isRight ? 20 : -20,
            config: { friction: 30, tension: 200 },
          });
          
          // Process the swipe
          const liked = isRight;
          processSwipe(liked);
        } 
        // If not sufficient to trigger swipe
        else {
          // Reset card position
          api.start({
            x: 0,
            rotation: 0,
            scale: 1,
          });
          setDirection(null);
        }
      }
    },
  });

  /**
   * Process a swipe action
   * @param liked Whether the restaurant was liked (right swipe) or not (left swipe)
   */
  const processSwipe = (liked: boolean) => {
    if (currentIndex < restaurants.length) {
      const restaurant = restaurants[currentIndex];
      
      // Register the swipe in the store
      registerSwipe(restaurant.id, liked);
      
      // Move to next card after animation completes
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        
        // Reset card position
        api.start({
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          immediate: true,
        });
        
        setDirection(null);
      }, 300);
    }
  };

  /**
   * Programmatically trigger a swipe
   */
  const handleSwipe = (liked: boolean) => {
    if (currentIndex < restaurants.length) {
      // Animate card based on like/dislike
      api.start({
        x: liked ? 500 : -500,
        rotation: liked ? 20 : -20,
        config: { friction: 30, tension: 200 },
      });
      
      // Process the swipe after animation starts
      processSwipe(liked);
    }
  };

  // Check for matches when matches array changes
  useEffect(() => {
    if (matches.length > 0 && onMatch) {
      // Call onMatch for each match
      matches.forEach(restaurantId => {
        onMatch(restaurantId);
      });
    }
  }, [matches, onMatch]);

  // If all cards have been swiped
  if (currentIndex >= restaurants.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700">No more restaurants</h3>
        <p className="text-gray-500 mt-2">You&apos;ve seen all restaurants in this area</p>
        {matches.length > 0 ? (
          <p className="text-green-600 mt-4">
            You have {matches.length} match{matches.length > 1 ? 'es' : ''}!
          </p>
        ) : (
          <p className="text-gray-500 mt-4">
            Waiting for matches...
          </p>
        )}
      </div>
    );
  }

  const currentRestaurant = restaurants[currentIndex];

  return (
    <div className="relative flex flex-col items-center justify-center h-[500px] w-full">
      {/* Swipe indicators */}
      <div className="absolute top-10 left-0 w-full flex justify-between px-10 z-10">
        <div className={`text-2xl font-bold ${direction === 'left' ? 'text-red-500' : 'text-gray-200'}`}>
          NOPE
        </div>
        <div className={`text-2xl font-bold ${direction === 'right' ? 'text-green-500' : 'text-gray-200'}`}>
          LIKE
        </div>
      </div>
      
      {/* Card */}
      <animated.div
        {...bind()}
        style={{
          x,
          y,
          rotate: rotation,
          scale,
          touchAction: 'none',
        }}
        className="absolute cursor-grab w-[300px] h-[400px] bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {/* Restaurant image/placeholder */}
        <div className="w-full h-[200px] bg-gray-300 flex items-center justify-center">
          {currentRestaurant.photos && currentRestaurant.photos.length > 0 ? (
            <Image
              src={currentRestaurant.photos[0]}
              alt={currentRestaurant.name}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-500">No image available</div>
          )}
        </div>
        
        {/* Restaurant info */}
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">{currentRestaurant.name}</h3>
          <p className="text-gray-600 mt-1">{currentRestaurant.address}</p>
          {currentRestaurant.rating && (
            <div className="mt-2 flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-gray-700">{currentRestaurant.rating}</span>
            </div>
          )}
        </div>
      </animated.div>
      
      {/* Control buttons */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center gap-10">
        <button
          onClick={() => handleSwipe(false)}
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center"
        >
          <span className="text-red-500 text-2xl">✗</span>
        </button>
        <button
          onClick={() => handleSwipe(true)}
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center"
        >
          <span className="text-green-500 text-2xl">♥</span>
        </button>
      </div>
    </div>
  );
}
