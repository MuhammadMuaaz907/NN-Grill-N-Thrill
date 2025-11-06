// src/components/Navbar.tsx (Updated with Cart Integration)
'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  onLocationClick?: () => void;
  location?: string;
  phoneNumber?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLocationClick,
  location = 'Clifton',
  phoneNumber = '0325 3652040'
}) => {
  const { cartCount, openCart } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Category menu sticky threshold (same as CategoryMenu component)
      const categoryMenuThreshold = 400;

      // Navbar show/hide logic:
      // 1. Always show if scroll position is below category menu threshold (before category menu becomes sticky)
      // 2. If scroll is above threshold, hide navbar when scrolling down
      // 3. Only show navbar when scrolling up AND scroll position reaches below category menu threshold
      
      if (currentScrollY <= categoryMenuThreshold) {
        // Below category menu threshold - always show navbar
        setIsVisible(true);
      } else {
        // Above category menu threshold
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide navbar
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - but only show when we reach below threshold
          // Don't show immediately, wait until scroll position is below threshold
          if (currentScrollY <= categoryMenuThreshold) {
            setIsVisible(true);
          } else {
            // Still above threshold, keep hidden
            setIsVisible(false);
          }
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`relative left-0 right-0 bg-white shadow-md transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="relative flex items-center py-3 md:py-4 w-full">
        {/* Left Buttons - Left se 16-20px padding */}
        <div className="flex gap-2 md:gap-3 pl-4 sm:pl-5 md:pl-5">
          <button
            onClick={onLocationClick}
            className="bg-pink-600 hover:bg-pink-700 text-white px-3 sm:px-3.5 md:px-4 py-2 rounded-lg flex items-center gap-1.5 text-xs sm:text-xs font-semibold transition duration-200"
            aria-label="Change location"
          >
            <MapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0 self-center" />
            <div className="flex flex-col items-start justify-center gap-0">
              <span className="text-[11px] sm:text-xs font-semibold leading-tight">Change Location</span>
              <span className="text-[10px] sm:text-[11px] opacity-90 font-normal leading-tight">{location}</span>
            </div>
          </button>

          <button
            className="bg-pink-600 hover:bg-pink-700 text-white px-3 sm:px-3 md:px-3.5 py-2 rounded-lg flex items-center gap-1 text-xs sm:text-xs font-semibold transition duration-200"
            aria-label="Call restaurant"
          >
            <Phone size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap text-xs">{phoneNumber}</span>
            <span className="sm:hidden">Call</span>
          </button>
        </div>

        {/* Center Logo - Bilkul screen center */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="text-xl sm:text-2xl font-script text-pink-600 font-serif">
            NN
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-500 tracking-widest hidden sm:block">Grill N&apos; Thrill</p>
        </div>

        {/* Right Cart - Bilkul right me - Right se 16-20px padding */}
        <div className="absolute right-4 sm:right-5 md:right-5">
          <button
            onClick={openCart}
            className="relative hover:opacity-80 transition duration-200"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={24} className="sm:w-7 sm:h-7 text-pink-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-pink-600 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};