// src/components/PromotionBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import { Tag, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  cloudinary_url?: string;
  discount_percentage?: number;
  discount_amount?: number;
  valid_until: string;
}

interface PromotionBannerProps {
  promotions: Promotion[];
}

export function PromotionBanner({ promotions }: PromotionBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-rotate promotions
  useEffect(() => {
    if (promotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [promotions.length]);

  if (promotions.length === 0 || !isVisible) return null;

  const currentPromotion = promotions[currentIndex];

  return (
    <div className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left Arrow */}
          {promotions.length > 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length)}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Previous promotion"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Promotion Content */}
          <div className="flex-1 flex items-center justify-center gap-3 text-center">
            <Sparkles size={20} className="text-yellow-300 flex-shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm md:text-base truncate">
                {currentPromotion.title}
              </div>
              <div className="text-xs md:text-sm opacity-90 truncate">
                {currentPromotion.description}
              </div>
            </div>
            {(currentPromotion.discount_percentage || currentPromotion.discount_amount) && (
              <div className="flex-shrink-0 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold text-xs md:text-sm">
                {currentPromotion.discount_percentage 
                  ? `${currentPromotion.discount_percentage}% OFF`
                  : `Rs. ${currentPromotion.discount_amount} OFF`}
              </div>
            )}
          </div>

          {/* Right Arrow */}
          {promotions.length > 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % promotions.length)}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Next promotion"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close banner"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Indicators */}
        {promotions.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 w-1.5 hover:bg-white/75'
                }`}
                aria-label={`Go to promotion ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

