// src/components/CategoryItemsSection.tsx
'use client';

import React from 'react';
import { MenuItemCard } from './MenuItemCard';
import { MenuItem, Category } from '@/types';

interface CategoryItemsSectionProps {
  category: Category | null;
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onFavorite?: (itemId: string) => void;
  favorites?: string[];
  isLoading?: boolean;
}

export const CategoryItemsSection: React.FC<CategoryItemsSectionProps> = ({
  category,
  items,
  onAddToCart,
  onFavorite,
  favorites = [],
  isLoading = false
}) => {
  // Filter items by category
  const categoryItems = items.filter(
    (item) => item.categoryId === category?.id
  );

  if (!category) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-200 rounded-2xl h-96 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (categoryItems.length === 0) {
    return (
      <section className="px-6 py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-600 text-lg">
          No items available in {category.name} category
        </p>
      </section>
    );
  }

  return (
    <section className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-gray-600 text-sm mb-8">
          Showing <span className="font-bold text-pink-600">{categoryItems.length}</span> items in{' '}
          <span className="font-bold text-pink-600">{category.name}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onFavorite={onFavorite}
              isFavorited={favorites.includes(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};