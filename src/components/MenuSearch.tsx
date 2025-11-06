// src/components/MenuSearch.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Category } from '@/types';

interface MenuSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  categories?: Category[];
}

export const MenuSearch: React.FC<MenuSearchProps> = ({
  placeholder = 'Search for',
  onSearch,
  onClear,
  categories = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animatedText, setAnimatedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentCategoryIndexRef = useRef(0);
  const currentCharIndexRef = useRef(0);
  const isTypingRef = useRef(true);
  const isDeletingRef = useRef(false);
  const hasTypedBaseTextRef = useRef(false);
  const isTypingBaseTextRef = useRef(true);

  const baseText = 'Search for ';
  // Hardcoded category names for smooth animation
  const categoryNames = ['Pizza..', 'Burgers..', 'Tacos..', 'Breakfast & Waffles..', 'Deals..'];

  // Blinking cursor effect
  useEffect(() => {
    if (searchQuery) {
      setShowCursor(false);
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
        cursorIntervalRef.current = null;
      }
      return;
    }

    // Start cursor blinking
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
        cursorIntervalRef.current = null;
      }
    };
  }, [searchQuery]);

  // Continuous animation loop for category names
  useEffect(() => {
    if (searchQuery) {
      setAnimatedText('');
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isTypingRef.current = true;
      isDeletingRef.current = false;
      currentCharIndexRef.current = 0;
      hasTypedBaseTextRef.current = false;
      isTypingBaseTextRef.current = true;
      return;
    }

    if (categoryNames.length === 0) return;

    const startAnimation = () => {
      // Clean up any existing intervals/timeouts
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // First, type "Search for " completely if not typed yet
      if (isTypingBaseTextRef.current && !hasTypedBaseTextRef.current) {
        currentCharIndexRef.current = 0;
        setAnimatedText('');

        animationRef.current = setInterval(() => {
          if (currentCharIndexRef.current < baseText.length) {
            setAnimatedText(baseText.substring(0, currentCharIndexRef.current + 1));
            currentCharIndexRef.current++;
          } else {
            // Finished typing base text
            if (animationRef.current) {
              clearInterval(animationRef.current);
              animationRef.current = null;
            }
            hasTypedBaseTextRef.current = true;
            isTypingBaseTextRef.current = false;
            
            // Wait 1 second then start typing category name
            timeoutRef.current = setTimeout(() => {
              startAnimation();
            }, 1000);
          }
        }, 100); // Typing speed for base text
        return;
      }

      // Now animate category names
      const currentCategory = categoryNames[currentCategoryIndexRef.current];
      if (!currentCategory) return;

      if (isTypingRef.current && !isDeletingRef.current) {
        // Typing category: Left to right
        currentCharIndexRef.current = 0;

        animationRef.current = setInterval(() => {
          if (currentCharIndexRef.current < currentCategory.length) {
            setAnimatedText(baseText + currentCategory.substring(0, currentCharIndexRef.current + 1));
            currentCharIndexRef.current++;
          } else {
            // Finished typing category, wait then start deleting
            if (animationRef.current) {
              clearInterval(animationRef.current);
              animationRef.current = null;
            }
            isTypingRef.current = false;
            
            // Wait 2 seconds then start deleting
            timeoutRef.current = setTimeout(() => {
              isDeletingRef.current = true;
              currentCharIndexRef.current = currentCategory.length;
              
              // Start deleting animation
              animationRef.current = setInterval(() => {
                if (currentCharIndexRef.current > 0) {
                  setAnimatedText(baseText + currentCategory.substring(0, currentCharIndexRef.current - 1));
                  currentCharIndexRef.current--;
                } else {
                  // Finished deleting, move to next category
                  if (animationRef.current) {
                    clearInterval(animationRef.current);
                    animationRef.current = null;
                  }
                  setAnimatedText(baseText);
                  isDeletingRef.current = false;
                  isTypingRef.current = true;
                  currentCharIndexRef.current = 0;
                  
                  // Move to next category (loop back to first)
                  currentCategoryIndexRef.current = (currentCategoryIndexRef.current + 1) % categoryNames.length;
                  
                  // Wait 0.6 seconds then start next animation
                  timeoutRef.current = setTimeout(() => {
                    startAnimation();
                  }, 600);
                }
              }, 100); // Deleting speed
            }, 2000);
          }
        }, 150); // Typing speed for category
      }
    };

    // Start the animation
    startAnimation();

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear?.();
  };

  const displayPlaceholder = searchQuery 
    ? '' 
    : (animatedText || baseText) + (showCursor && !searchQuery ? '|' : '');

  return (
    <form onSubmit={handleSubmit} className="my-6 md:my-8 px-4 sm:px-6">
      <div className="relative max-w-6xl mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={displayPlaceholder || placeholder}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full border-2 border-pink-400 focus:border-pink-600 focus:outline-none text-gray-900 placeholder-pink-400 transition-colors text-sm sm:text-base"
          aria-label="Search menu items"
        />
        <button
          type="submit"
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-pink-600 hover:bg-pink-700 text-white p-2 sm:p-3 rounded-full transition duration-200"
          aria-label="Search"
        >
          <Search size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </form>
  );
};