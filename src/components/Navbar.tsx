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

      // Show navbar when scrolling up
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      // Hide navbar when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
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
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-4 max-w-7xl mx-auto">
        {/* Left Buttons */}
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={onLocationClick}
            className="bg-pink-500 hover:bg-pink-600 text-white px-2 sm:px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 text-xs sm:text-sm font-semibold transition duration-200"
            aria-label="Change location"
          >
            <MapPin size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Change Location</span>
            <span className="sm:hidden">Loc</span>
            <span className="text-xs opacity-75 hidden md:inline">{location}</span>
          </button>

          <button
            className="bg-pink-600 hover:bg-pink-700 text-white px-2 sm:px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 text-xs sm:text-sm font-semibold transition duration-200"
            aria-label="Call restaurant"
          >
            <Phone size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">{phoneNumber}</span>
            <span className="sm:hidden">Call</span>
          </button>
        </div>

        {/* Center Logo */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-script text-pink-600 font-serif">
            NN
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-500 tracking-widest hidden sm:block">Grill N&apos; Thrill</p>
        </div>

        {/* Right Cart */}
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
    </nav>
  );
};