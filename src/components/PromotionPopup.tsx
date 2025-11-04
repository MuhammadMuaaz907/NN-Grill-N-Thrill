// src/components/PromotionPopup.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Tag, Sparkles, Clock, ChevronRight, Percent } from 'lucide-react';

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

interface PromotionPopupProps {
  promotions: Promotion[];
  onClose: () => void;
  onShopNow?: () => void;
}

export function PromotionPopup({ promotions, onClose, onShopNow }: PromotionPopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // Auto-close after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate promotions every 4 seconds
  useEffect(() => {
    if (promotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [promotions.length]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleShopNow = () => {
    if (onShopNow) {
      onShopNow();
    }
    handleClose();
  };

  if (promotions.length === 0) return null;

  const currentPromotion = promotions[currentIndex];
  const daysRemaining = Math.ceil(
    (new Date(currentPromotion.valid_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
      isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Backdrop - covers entire screen */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup Content - Centered in viewport */}
      <div className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md sm:max-w-lg w-full transform transition-all duration-300 z-10 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Close Button - Top right corner */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          aria-label="Close"
        >
          <X size={16} className="sm:w-5 sm:h-5 text-gray-700" />
        </button>

        {/* Promotion Content */}
        <div className="relative overflow-hidden">
          {/* Background Image or Gradient */}
          <div className="relative h-56 sm:h-64 md:h-72 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 overflow-hidden">
            {currentPromotion.cloudinary_url || currentPromotion.image_url ? (
              <img
                src={currentPromotion.cloudinary_url || currentPromotion.image_url}
                alt={currentPromotion.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles size={80} className="text-white/30" />
              </div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Discount Badge - Smaller, top-right */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 shadow-lg animate-pulse">
                <Tag size={16} className="sm:w-5 sm:h-5" />
                {currentPromotion.discount_percentage ? (
                  <>
                    <Percent size={16} className="sm:w-5 sm:h-5" />
                    <span>{currentPromotion.discount_percentage}% OFF</span>
                  </>
                ) : (
                  <span>Rs. {currentPromotion.discount_amount} OFF</span>
                )}
              </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
                {currentPromotion.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-3 sm:mb-4 drop-shadow-md">
                {currentPromotion.description}
              </p>
              
              {/* Days Remaining */}
              {daysRemaining > 0 && (
                <div className="inline-flex items-center gap-2 text-sm sm:text-base bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Clock size={16} className="sm:w-5 sm:h-5" />
                  <span>{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining</span>
                </div>
              )}
            </div>

            {/* Promotion Indicators */}
            {promotions.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                {promotions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to promotion ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-5 sm:p-6 md:p-8 bg-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShopNow}
                className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg"
              >
                <span>Shop Now</span>
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-3 sm:py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-base sm:text-lg"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

