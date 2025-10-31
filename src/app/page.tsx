// src/app/page.tsx
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CategoryMenu } from '@/components/CategoryMenu';
import { PopularItemsHeader } from '@/components/PopularItemsHeader';
import { CategoryHeroSection } from '@/components/CategoryHeroSection';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { MenuItemCard } from '@/components/MenuItemCard';
import { useCart } from '@/context/CartContext';
import { RESTAURANT_INFO, CAROUSEL_ITEMS } from '@/lib/data';
import { Category, MenuItem } from '@/types';
import { MenuSearch } from '@/components/MenuSearch'; // Import MenuSearch

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    items,
    isOpen,
    openCart,
    closeCart,
    removeFromCart,
    updateQuantity,
    setItems,
    setIsOpen,
  } = useCart();

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State to track search input
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
          setCategories(result.data.categories);
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

  // Handle location click
  const handleLocationClick = () => {
    console.log('Change location clicked');
  };

  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    setHoveredCategory(category.id);
    setTimeout(() => {
      const categorySection = document.getElementById(`category-${category.id}`);
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle favorite toggle
  const handleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Handle product click to open modal
  const handleProductClick = (product: MenuItem) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // Category descriptions
  const categoryDescriptions: Record<string, string> = {
    eggs: 'Freshly cooked egg dishes',
    'breakfast-waffles': 'Golden crispy waffles and fluffy pancakes',
    'breakfast-sharing': 'Perfect for sharing with loved ones',
    'small-plates': 'Delicious appetizers and starters',
    salad: 'Fresh and healthy salad options',
    tacos: 'Authentic Mexican flavors',
    pizza: 'Wood-fired pizzas with premium toppings',
    sandwiches: 'Gourmet sandwiches and burgers',
  };

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query); // Update search query state
    // Optional: Filter items based on query (case-insensitive)
    const filteredItems = menuItems.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    console.log('Filtered items:', filteredItems); // For debugging
    // You can update the UI to show filtered items (e.g., replace menuItems with filteredItems)
  };

  // Handle clear search
  const handleClear = () => {
    setSearchQuery('');
    // Reset to original items if needed
  };

  // Get recommended items
  const recommendedItems = popularItems.filter(
    (item) => !items.find((cartItem) => cartItem.id === item.id)
  ).slice(0, 3);

  // Save cart state before navigation
  const saveCartState = useCallback(() => {
    sessionStorage.setItem('cartState', JSON.stringify({ items, isOpen }));
  }, [items, isOpen]);

  // Handle go back action
  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      saveCartState();
      window.history.back();
    } else {
      router.push('/');
    }
  }, [saveCartState, router]);

  // Restore state on navigation (back button or query params)
  useEffect(() => {
    const handlePopState = () => {
      const savedState = sessionStorage.getItem('cartState');
      if (savedState) {
        try {
          const { items: savedItems, isOpen: savedIsOpen } = JSON.parse(savedState);
          setItems(savedItems);
          setIsOpen(savedIsOpen);
        } catch (error) {
          console.error('Failed to parse cart state:', error);
          setItems([]);
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    const open = searchParams.get('open');
    const itemsParam = searchParams.get('items');
    if (open === 'true' && itemsParam) {
      try {
        const parsedItems = JSON.parse(decodeURIComponent(itemsParam)) as CartItem[];
        setItems(parsedItems);
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to parse items from query:', error);
      }
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [searchParams, setItems, setIsOpen]);

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
    <div className="min-h-screen bg-white">
      <Navbar
        onLocationClick={handleLocationClick}
        location={RESTAURANT_INFO.location}
        phoneNumber={RESTAURANT_INFO.phoneNumber}
      />
      <main className="pt-20">
        <HeroSection items={CAROUSEL_ITEMS} />
        <CategoryMenu
          categories={categories}
          onCategorySelect={handleCategorySelect}
          activeCategory={hoveredCategory}
        />

        {/* Add MenuSearch component here */}
        <MenuSearch
          placeholder="Search for spicy honey glaze"
          onSearch={handleSearch}
          onClear={handleClear}
        />
        
        <section className="bg-gradient-to-b from-white to-gray-50 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <PopularItemsHeader title="Popular Items" subtitle="Most ordered right now" showEmoji={true} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onFavorite={handleFavorite}
                  isFavorited={favorites.includes(item.id)}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          </div>
        </section>
        {categories.map((category) => (
          <div key={category.id} id={`category-${category.id}`}>
            <CategoryHeroSection category={category} categoryDescription={categoryDescriptions} />
            <div className="px-6 py-8">
              <div className="max-w-7xl mx-auto">
                <p className="text-gray-600 text-sm mb-8">
                  Showing{' '}
                  <span className="font-bold text-pink-600">
                    {menuItems.filter((item) => item.categoryId === category.id).length}
                  </span>{' '}
                  items in{' '}
                  <span className="font-bold text-pink-600">{category.name}</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.filter((item) => item.categoryId === category.id).map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onFavorite={handleFavorite}
                      isFavorited={favorites.includes(item.id)}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        isFavorited={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onFavorite={handleFavorite}
      />
      <CartDrawer
        isOpen={isOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        recommendedItems={recommendedItems}
      />
      <button
        onClick={handleGoBack}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
      >
        ← Back
      </button>
    </div>
  );
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}