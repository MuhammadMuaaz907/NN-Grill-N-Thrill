// src/app/menu/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MenuPage } from '@/components/MenuPage';
import { MenuItem } from '@/types';

export default function MenuPageComponent() {
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu');
        const result = await response.json();
        
        if (result.success) {
          setMenuItems(result.data.menuItems);
          setPopularItems(result.data.popularItems);
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => [...prev, item]);
    
    // Show toast notification (optional)
    console.log(`${item.name} added to cart`);
    
    // You can also show a toast notification here
    // toast.success(`${item.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <MenuPage
      items={menuItems}
      popularItems={popularItems}
      onAddToCart={handleAddToCart}
    />
  );
}