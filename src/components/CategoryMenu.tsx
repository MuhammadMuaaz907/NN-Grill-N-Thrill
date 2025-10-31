// src/components/CategoryMenu.tsx (Scroll-Aware Version)
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface CategoryMenuProps {
  categories: Category[];
  onCategorySelect: (category: Category) => void;
  activeCategory?: string | null;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({
  categories,
  onCategorySelect,
  activeCategory = categories[0]?.id
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [scrollActiveCategory, setScrollActiveCategory] = useState<string | null>(activeCategory || null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Detect which category is in view while scrolling
  useEffect(() => {
    const handleScroll = () => {
      // Check if menu should be sticky
      setIsSticky(window.scrollY > 400);

      // Find which category section is currently in view
      const categories = document.querySelectorAll('[id^="category-"]');
      let currentCategory: string | null = null;

      categories.forEach((element) => {
        const rect = element.getBoundingClientRect();
        // If section is in top half of viewport, mark it as active
        if (rect.top <= window.innerHeight / 2) {
          const categoryId = element.id.replace('category-', '');
          currentCategory = categoryId;
        }
      });

      if (currentCategory) {
        setScrollActiveCategory(currentCategory);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check scroll buttons visibility
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    checkScroll();
    const resizeObserver = new ResizeObserver(checkScroll);
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }

    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const handleCategoryClick = (category: Category) => {
    setScrollActiveCategory(category.id);
    onCategorySelect(category);

    // Smooth scroll to category section
    setTimeout(() => {
      const categorySection = document.getElementById(`category-${category.id}`);
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <nav
      className={`${
        isSticky
          ? 'fixed top-0 left-0 right-0 shadow-lg z-40'
          : 'relative z-40'
      } bg-white transition-all duration-3000`}
    >
      <div className="relative flex items-center">
        {/* Left Scroll Button - Appears on Sticky */}
        {canScrollLeft && isSticky && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white to-transparent hover:from-gray-100 z-10 p-2 rounded-r-lg transition"
            aria-label="Scroll categories left"
          >
            <ChevronLeft size={20} className="text-pink-600" />
          </button>
        )}

        {/* Categories Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide flex-1"
          onScroll={() => {
            // Update scroll buttons visibility on manual scroll
            if (scrollContainerRef.current) {
              const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
              setCanScrollLeft(scrollLeft > 0);
              setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
            }
          }}
        >
          <div className="flex gap-2 md:gap-3 px-4 md:px-6 py-3 w-max md:w-full md:justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                data-category={category.id}
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={() => setScrollActiveCategory(category.id)}
                className={`whitespace-nowrap font-bold text-xs md:text-sm px-3 md:px-4 py-2 rounded-full transition-all duration-200 ${
                  scrollActiveCategory === category.id
                    ? 'bg-pink-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={`View ${category.name}`}
                aria-current={scrollActiveCategory === category.id ? 'page' : undefined}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Scroll Button - Appears on Sticky */}
        {canScrollRight && isSticky && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white to-transparent hover:from-gray-100 z-10 p-2 rounded-l-lg transition"
            aria-label="Scroll categories right"
          >
            <ChevronRight size={20} className="text-pink-600" />
          </button>
        )}
      </div>
    </nav>
  );
};