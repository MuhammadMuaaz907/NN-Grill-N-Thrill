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
  const [navbarVisible, setNavbarVisible] = useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const navRef = React.useRef<HTMLElement>(null);
  const hoveredCategoryRef = React.useRef<string | null>(null);
  const isHoveringRef = React.useRef(false);

  // Check if navbar is visible (navbar can hide on scroll down)
  useEffect(() => {
    const checkNavbarVisibility = () => {
      const navbarWrapper = document.querySelector('div[class*="fixed"][class*="z-50"]') as HTMLElement;
      if (navbarWrapper) {
        const navElement = navbarWrapper.querySelector('nav');
        if (navElement) {
          // Check if navbar is visible by checking its bounding rect
          // If navbar is translated up (hidden), its top will be negative or very small
          const rect = navElement.getBoundingClientRect();
          const isVisible = rect.top >= -10; // Allow small tolerance
          setNavbarVisible(isVisible);
        } else {
          // Fallback: check if navbar wrapper has height > 0
          const height = navbarWrapper.getBoundingClientRect().height;
          setNavbarVisible(height > 0);
        }
      }
    };
    
    checkNavbarVisibility();
    
    // Check on scroll (navbar visibility changes on scroll)
    const handleScrollForNavbar = () => {
      checkNavbarVisibility();
    };
    
    window.addEventListener('scroll', handleScrollForNavbar, { passive: true });
    
    // Also check periodically to catch any transitions
    const interval = setInterval(checkNavbarVisibility, 200);
    
    return () => {
      window.removeEventListener('scroll', handleScrollForNavbar);
      clearInterval(interval);
    };
  }, []);

  // Detect which category is in view while scrolling
  useEffect(() => {
    const handleScroll = () => {
      // Check if menu should be sticky
      const shouldBeSticky = window.scrollY > 400;
      setIsSticky(shouldBeSticky);

      // Don't update scroll active category if user is hovering over a button
      if (isHoveringRef.current) {
        return;
      }

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

      if (currentCategory && currentCategory !== hoveredCategoryRef.current) {
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
    hoveredCategoryRef.current = category.id;
    onCategorySelect(category);

    // Smooth scroll to category section with proper offset for fixed/sticky elements
    requestAnimationFrame(() => {
      setTimeout(() => {
        const categorySection = document.getElementById(`category-${category.id}`);
        if (categorySection) {
          // Check if menu will be sticky (scroll position > 400)
          const willBeSticky = window.scrollY > 400;
          
          // Get navbar wrapper to check if it's visible
          const navbarWrapper = document.querySelector('div[class*="fixed"][class*="z-50"]') as HTMLElement;
          let currentNavbarHeight = 0;
          let isNavbarCurrentlyVisible = true;
          
          if (navbarWrapper) {
            const navElement = navbarWrapper.querySelector('nav');
            if (navElement) {
              // Check visibility by bounding rect
              const rect = navElement.getBoundingClientRect();
              isNavbarCurrentlyVisible = rect.top >= -10;
            }
            if (isNavbarCurrentlyVisible) {
              currentNavbarHeight = navbarWrapper.getBoundingClientRect().height;
            }
          }
          
          // Get category menu nav element height
          let categoryMenuHeight = 0;
          if (navRef.current) {
            categoryMenuHeight = navRef.current.getBoundingClientRect().height;
          }
          
          // Calculate offset:
          // When sticky: menu is at top: 0, so we need menu height + padding (navbar is above it if visible)
          // When not sticky: category menu is in normal flow, so navbar height + padding
          const totalOffset = willBeSticky 
            ? categoryMenuHeight + 20  // When sticky: menu is at top: 0, so only menu height + padding
            : currentNavbarHeight + 20; // When not sticky: navbar + padding
          
          // Get element's absolute position from document top
          const elementRect = categorySection.getBoundingClientRect();
          const elementTop = elementRect.top + window.pageYOffset;
          
          // Calculate scroll position with offset
          const scrollPosition = elementTop - totalOffset;
          
          // Smooth scroll with offset
          window.scrollTo({
            top: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });
          
          // Reset hover state after scroll completes
          setTimeout(() => {
            isHoveringRef.current = false;
            hoveredCategoryRef.current = null;
          }, 800);
        }
      }, 100);
    });
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

  // When sticky, menu should be at top: 0 (not below navbar)
  // When navbar hides, menu will take its place at top: 0
  const stickyTop = isSticky ? 0 : undefined;
  
  // Z-index: if navbar is visible and sticky, menu should be below navbar (z-40 < z-50)
  // But if navbar is hidden, menu is at top so z-index doesn't matter much
  const stickyZIndex = isSticky && navbarVisible ? 'z-40' : isSticky ? 'z-50' : 'z-40';

  return (
    <nav
      ref={navRef}
      className={`${
        isSticky
          ? `fixed left-0 right-0 shadow-lg ${stickyZIndex}`
          : 'relative z-40'
      } bg-white transition-all duration-300`}
      style={isSticky ? { 
        top: `${stickyTop}px`,
        marginTop: '0',
        position: 'fixed'
      } : undefined}
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
          <div className="flex gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 w-max md:w-full md:justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                data-category={category.id}
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={() => {
                  isHoveringRef.current = true;
                  hoveredCategoryRef.current = category.id;
                  setScrollActiveCategory(category.id);
                }}
                onMouseLeave={() => {
                  isHoveringRef.current = false;
                  // Don't immediately reset, let scroll handler update it naturally
                  setTimeout(() => {
                    if (!isHoveringRef.current) {
                      hoveredCategoryRef.current = null;
                    }
                  }, 100);
                }}
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