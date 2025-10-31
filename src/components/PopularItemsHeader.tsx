// src/components/PopularItemsHeader.tsx
'use client';

import React from 'react';

interface PopularItemsHeaderProps {
  title?: string;
  subtitle?: string;
  showEmoji?: boolean;
}

export const PopularItemsHeader: React.FC<PopularItemsHeaderProps> = ({
  title = 'Popular Items',
  subtitle = 'Most ordered right now',
  showEmoji = true
}) => {
  return (
    <div className="px-6 mb-8">
      <div className="flex items-center gap-3">
        {showEmoji && <span className="text-3xl">🔥</span>}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      <p className="text-gray-600 mt-2 font-serif">{subtitle}</p>
    </div>
  );
};