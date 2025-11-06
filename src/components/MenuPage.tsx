// src/components/MenuPage.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { MenuSearch } from './MenuSearch';
import { PopularItemsHeader } from './PopularItemsHeader';
import { MenuItemsGrid } from './MenuItemsGrid';
import { MenuItem } from '@/types';

interface MenuPageProps {
  items: MenuItem[];
  popularItems?: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  items,
  popularItems,
  onAddToCart
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <section className="min-h-screen bg-white py-8">
      {/* Search Section */}
      <MenuSearch
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {/* Popular Items - Show when no search active */}
      {!searchQuery && popularItems && popularItems.length > 0 && (
        <>
          <PopularItemsHeader />
          <MenuItemsGrid
            items={popularItems}
          />
        </>
      )}

      {/* Filtered Items */}
      {searchQuery && (
        <div className="px-6 mb-6">
          <p className="text-gray-600">
            Found{' '}
            <span className="font-bold text-pink-600">
              {filteredItems.length}
            </span>{' '}
            results for &quot;<span className="font-bold">{searchQuery}</span>&quot;
          </p>
        </div>
      )}

      <MenuItemsGrid
        items={filteredItems}
        emptyMessage={
          searchQuery
            ? 'No items match your search. Try different keywords.'
            : 'No items available in this category.'
        }
      />
    </section>
  );
};