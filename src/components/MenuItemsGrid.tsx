// src/components/MenuItemsGrid.tsx
'use client';

import React from 'react';
import { MenuItemCard } from './MenuItemCard';
import { MenuItem } from '@/types';

interface MenuItemsGridProps {
  items: MenuItem[];
  onAddToCart?: (item: MenuItem) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const MenuItemsGrid: React.FC<MenuItemsGridProps> = ({
  items,
  onAddToCart,
  isLoading = false,
  emptyMessage = 'No items found. Try a different search.'
}) => {
  if (isLoading) {
    return (
      <div className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-200 rounded-2xl h-96 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-600 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};