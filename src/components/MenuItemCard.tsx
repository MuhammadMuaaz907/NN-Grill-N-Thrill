// src/components/MenuItemCard.tsx (Complete Implementation)
'use client';

import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MenuItem } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
  onProductClick?: (product: MenuItem) => void;
  onAddToCart?: (item: MenuItem) => void; // Keep for backward compatibility
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onProductClick,
  onAddToCart
}) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle card click - opens modal
  const handleCardClick = () => {
    onProductClick?.(item);
  };

  // Handle add to cart click - add item and show confirmation
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsLoading(true);

    // Simulate API call or processing
    setTimeout(() => {
      // Use provided onAddToCart or default addToCart
      if (onAddToCart) {
        onAddToCart(item);
      } else {
        addToCart(item);
      }
      setIsLoading(false);
      
      // Show confirmation state
      setIsAdded(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 300);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
    >
      {/* Image Container - Fully Clickable */}
      <div className="relative flex-1 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden min-h-48 sm:min-h-56 md:min-h-64">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl sm:text-5xl md:text-6xl">🍽️</span>
          </div>
        )}

        {/* Price Badge - Fully Clickable */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-md font-bold text-gray-900 pointer-events-none text-sm sm:text-base">
          Rs. {item.price}
        </div>

        {/* Overlay on Hover - Fully Clickable */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300" />
        )}
      </div>

      {/* Content Section - Fully Clickable */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
            {item.name}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Add to Cart Button - With Loading and Success States */}
        <button
          onClick={handleAddToCartClick}
          disabled={isLoading || isAdded}
          className={`w-full font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 text-sm sm:text-base ${
            isAdded
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : isLoading
              ? 'bg-pink-400 text-white cursor-wait'
              : 'bg-pink-600 hover:bg-pink-700 text-white'
          }`}
          aria-label={`Add ${item.name} to cart`}
        >
          {isAdded ? (
            <>
              <Check size={18} className="sm:w-5 sm:h-5" />
              <span>Added to Cart</span>
            </>
          ) : isLoading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};