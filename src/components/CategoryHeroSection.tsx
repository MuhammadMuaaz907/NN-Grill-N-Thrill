// src/components/CategoryHeroSection.tsx
'use client';

import React from 'react';
import { Category } from '@/types';

interface CategoryHeroSectionProps {
  category: Category | null;
  categoryDescription?: Record<string, string>;
}

export const CategoryHeroSection: React.FC<CategoryHeroSectionProps> = ({
  category,
  categoryDescription = {
    eggs: 'Freshly cooked egg dishes',
    'breakfast-waffles': 'Golden crispy waffles and fluffy pancakes',
    'breakfast-sharing': 'Perfect for sharing with loved ones',
    'small-plates': 'Delicious appetizers and starters',
    salad: 'Fresh and healthy salad options',
    tacos: 'Authentic Mexican flavors',
    pizza: 'Wood-fired pizzas with premium toppings',
    sandwiches: 'Gourmet sandwiches and burgers'
  }
}) => {
  if (!category) {
    return null;
  }

  // Format category name for display
  const displayName = category.name.toUpperCase();
  const subtitle = categoryDescription[category.id] || category.name;

  return (
    <section className="relative w-full h-96 bg-gradient-to-b from-gray-50 to-white overflow-hidden pt-8">
      {/* Decorative SVG Elements */}
      <div className="absolute top-0 left-10 w-32 h-32 opacity-40 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50,80 Q40,60 30,40 Q25,20 50,10 Q75,20 70,40 Q60,60 50,80"
            stroke="#ec4899"
            fill="none"
            strokeWidth="2"
          />
          <circle cx="50" cy="20" r="3" fill="#ec4899" />
          <circle cx="45" cy="35" r="2.5" fill="#ec4899" />
          <circle cx="55" cy="35" r="2.5" fill="#ec4899" />
          <circle cx="35" cy="50" r="2.5" fill="#ec4899" />
          <circle cx="65" cy="50" r="2.5" fill="#ec4899" />
        </svg>
      </div>

      {/* City Skyline SVG (Right Side) */}
      <div className="absolute bottom-0 right-0 w-64 h-48 opacity-30 pointer-events-none">
        <svg viewBox="0 0 200 150" className="w-full h-full">
          <path
            d="M10,140 L20,100 L30,110 L40,80 L50,90 L60,70 L70,85 L80,75 L90,95 L100,60 L110,80 L120,70 L130,100 L140,65 L150,90 L160,70 L170,110 L180,85 L190,140"
            stroke="#ccc"
            fill="none"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-pink-600 mb-4 leading-tight">
            {displayName}
          </h1>

          {/* Subtitle (italicized) */}
          <p className="text-2xl md:text-3xl text-pink-600 font-script italic">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};