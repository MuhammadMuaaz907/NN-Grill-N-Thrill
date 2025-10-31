// src/components/MenuSearch.tsx
'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface MenuSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
}

export const MenuSearch: React.FC<MenuSearchProps> = ({
  placeholder = 'Search for spicy honey glaz',
  onSearch,
  onClear
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear?.();
  };

  return (
    <form onSubmit={handleSubmit} className="my-6 md:my-8 px-4 sm:px-6">
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full border-2 border-pink-400 focus:border-pink-600 focus:outline-none text-gray-900 placeholder-pink-400 transition-colors text-sm sm:text-base"
          aria-label="Search menu items"
        />
        <button
          type="submit"
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-pink-600 hover:bg-pink-700 text-white p-2 sm:p-3 rounded-full transition duration-200"
          aria-label="Search"
        >
          <Search size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </form>
  );
};