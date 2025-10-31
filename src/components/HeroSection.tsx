// src/components/HeroSection.tsx
'use client';

import React from 'react';
import { Carousel, CarouselItem } from './Carousel';

interface HeroSectionProps {
  items: CarouselItem[];
  onSlideChange?: (index: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  items,
  onSlideChange
}) => {
  return (
    <section className="pt-16 sm:pt-20 md:pt-24 pb-0">
      {/* Decorative flower branch */}
      <div className="absolute top-24 left-4 sm:left-6 md:left-10 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 opacity-40 pointer-events-none hidden sm:block">
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

      <Carousel
        items={items}
        autoPlay={true}
        autoPlayInterval={5000}
        onSlideChange={onSlideChange}
      />
    </section>
  );
};