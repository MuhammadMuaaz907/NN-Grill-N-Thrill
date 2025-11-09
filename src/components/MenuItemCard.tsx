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

  const originalPrice =
    (item as unknown as { originalPrice?: number; original_price?: number }).originalPrice ??
    (item as unknown as { originalPrice?: number; original_price?: number }).original_price ??
    null;

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex items-stretch gap-2 sm:gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-xl transition-all duration-300 p-2 sm:px-3 sm:py-3 w-full max-w-[340px] sm:max-w-[360px] h-[160px] sm:h-[180px]"
    >
      {/* Thumbnail */}
      <div
        className="relative shrink-0 flex items-center justify-center w-32 sm:w-36 h-full bg-gray-100 rounded-2xl overflow-hidden"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl">
            🍽️
          </div>
        )}
        {isHovered && <div className="absolute inset-0 bg-black/10" />}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col h-full justify-between gap-1 sm:gap-1 pt-2 sm:pt-3 pb-2 sm:pb-3 pr-1 sm:pr-2">
        <div className="space-y-1 ">
          <h3 className="text-sm sm:text-sm font-bold text-gray-900 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs sm:text-xs text-gray-600 line-clamp-2">
            {item.description}
          </p>
           
        </div>

         <div className="pt-1 sm:pt-1 space-y-1">
         <div className="flex items-baseline">
             {originalPrice && (
               <span className="text-[11px] text-gray-400 line-through">
                 Rs. {originalPrice}
               </span>
             )}
             <span className="text-sm  font-bold text-pink-600">
               Rs. {item.price}
             </span>
           </div>
          <button
            onClick={handleAddToCartClick}
            disabled={isLoading || isAdded}
            className={`inline-flex items-center justify-center gap-2 px-4 sm:px-4 py-1.5 sm:py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 ${
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
                <Check size={16} className="sm:w-4 sm:h-4" />
                <span>Added</span>
              </>
            ) : isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus size={16} className="sm:w-4 sm:h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};