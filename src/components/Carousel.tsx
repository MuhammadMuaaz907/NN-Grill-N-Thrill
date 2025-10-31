// src/components/Carousel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselItem {
  id: number;
  title: string;
  image?: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onSlideChange?: (index: number) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  onSlideChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length]);

  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-b from-pink-50 to-white overflow-hidden">
      {/* Carousel Content */}
      <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl mx-auto items-center">
          {/* Left Text Content */}
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pink-600 mb-2 sm:mb-3 md:mb-4 leading-tight">
              {currentItem.title.split(' ')[0]}
              <br />
              {currentItem.title.split(' ').slice(1).join(' ')}
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-pink-600 font-script italic mb-4 sm:mb-6 md:mb-8">
              {currentItem.description || 'Meets Happiness'}
            </p>
          </div>

          {/* Right Visual Content */}
          <div className="relative flex justify-center hidden md:flex">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Pink blob background */}
              <div className="absolute inset-0 rounded-full opacity-30 bg-pink-300"></div>

              {/* Plate/Circle Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white shadow-lg flex items-center justify-center border-4 md:border-8 border-white relative overflow-hidden">
                  {/* Image or Placeholder */}
                  <div className="absolute inset-0 rounded-full flex items-center justify-center">
                    {currentItem.image ? (
                      <img
                        src={currentItem.image}
                        alt={currentItem.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-2xl md:text-4xl mb-2 md:mb-4">🍽️</div>
                        <p className="text-pink-600 font-semibold text-xs md:text-sm">{currentItem.title}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 sm:p-2.5 md:p-3 rounded transition z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="md:w-6 md:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white p-2 sm:p-2.5 md:p-3 rounded transition z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="md:w-6 md:h-6" />
      </button>

      {/* Carousel Dots */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 ${
              idx === currentIndex
                ? 'bg-pink-600 w-5 h-1.5 md:w-6 md:h-2 rounded-full'
                : 'bg-pink-300 hover:bg-pink-400 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};