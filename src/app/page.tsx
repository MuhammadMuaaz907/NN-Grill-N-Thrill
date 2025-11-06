// src/app/page.tsx
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { NavbarWrapper } from '@/components/NavbarWrapper';
import { HeroSection } from '@/components/HeroSection';
import { CategoryMenu } from '@/components/CategoryMenu';
import { PopularItemsHeader } from '@/components/PopularItemsHeader';
import { CategoryHeroSection } from '@/components/CategoryHeroSection';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { MenuItemCard } from '@/components/MenuItemCard';
import { PromotionPopup } from '@/components/PromotionPopup';
import { useCart } from '@/context/CartContext';
import { RESTAURANT_INFO, CAROUSEL_ITEMS } from '@/lib/data';
import { Category, MenuItem } from '@/types';
import { MenuSearch } from '@/components/MenuSearch';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    setItems,
    setIsOpen,
  } = useCart();

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promotions, setPromotions] = useState<Array<{
    id: string;
    title: string;
    description: string;
    discount_percentage?: number;
    discount_amount?: number;
    valid_until: string;
  }>>([]);
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu');
        const result = await response.json();
        
        if (result.success) {
          const { menuItems = [], categories = [], popularItems = [] } = result.data;
          
          console.log('✅ Menu data fetched:', {
            menuItems: menuItems.length,
            categories: categories.length,
            popularItems: popularItems.length
          });
          
          setMenuItems(menuItems);
          setCategories(categories);
          setPopularItems(popularItems);
        } else {
          console.error('❌ API Error:', result.error, result.details);
          // Set empty arrays to show no items message
          setMenuItems([]);
          setCategories([]);
          setPopularItems([]);
        }
      } catch (error) {
        console.error('❌ Error fetching menu data:', error);
        // Set empty arrays on error
        setMenuItems([]);
        setCategories([]);
        setPopularItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Fetch active promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions?active=true');
        const result = await response.json();
        
        console.log('📊 Promotions API Response:', result);
        
        if (result.success && result.data && result.data.length > 0) {
          setPromotions(result.data);
          
          // Check if user has dismissed popup today (simplified logic)
          const today = new Date().toDateString();
          const lastDismissDate = localStorage.getItem('lastPromotionDismissDate');
          
          // Show popup if user hasn't dismissed today
          if (lastDismissDate !== today) {
            console.log('✅ Showing promotion popup - not dismissed today');
            // Delay popup by 1.5 seconds for better UX
            setTimeout(() => {
              setShowPromotionPopup(true);
              console.log('🎉 Popup state set to true');
            }, 1500);
          } else {
            console.log('⏭️ Popup already dismissed today');
          }
        } else {
          console.log('⚠️ No active promotions found');
        }
      } catch (error) {
        console.error('❌ Error fetching promotions:', error);
      }
    };

    fetchPromotions();
  }, []);

  const handleClosePromotionPopup = () => {
    console.log('🔒 Closing promotion popup');
    setShowPromotionPopup(false);
    // Save dismiss date to localStorage (user can see again tomorrow)
    localStorage.setItem('lastPromotionDismissDate', new Date().toDateString());
    console.log('✅ Popup dismissed for today');
  };

  const handleShopNow = () => {
    // Scroll to menu or open cart
    const categorySection = document.getElementById('category-menu');
    if (categorySection) {
      categorySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle location click
  const handleLocationClick = () => {
    console.log('Change location clicked');
  };

  // Handle category selection
  // Note: Actual scrolling is handled in CategoryMenu component with proper offset
  const handleCategorySelect = (category: Category) => {
    setHoveredCategory(category.id);
    // Scroll logic is handled in CategoryMenu.handleCategoryClick to account for fixed navbar
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
    // Optional: Filter items based on query (case-insensitive)
    const filteredItems = menuItems.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    console.log('Filtered items:', filteredItems); // For debugging
    // Future: Implement search filtering UI
  };

  // Handle clear search
  const handleClear = () => {
    // Future: Reset search state
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

  // Show message if no menu items or categories
  if (!isLoading && (menuItems.length === 0 || categories.length === 0)) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar
          onLocationClick={handleLocationClick}
          location={RESTAURANT_INFO.location}
          phoneNumber={RESTAURANT_INFO.phoneNumber}
        />
        <main className="pt-16 sm:pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center px-4">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Menu Items Available</h2>
            <p className="text-gray-600 mb-4">
              {categories.length === 0 
                ? 'No categories found. Please add categories in admin panel.'
                : 'No menu items found. Please add menu items in admin panel.'}
            </p>
            <a
              href="/admin/menu"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Go to Admin Panel
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <NavbarWrapper
        hasBanner={false}
        onLocationClick={handleLocationClick}
        location={RESTAURANT_INFO.location}
        phoneNumber={RESTAURANT_INFO.phoneNumber}
      />
      <main className="pt-20 sm:pt-24">
        <HeroSection items={CAROUSEL_ITEMS} />
        <CategoryMenu
          categories={categories}
          onCategorySelect={handleCategorySelect}
          activeCategory={hoveredCategory}
        />

        {/* MenuSearch component */}
        <div id="category-menu" className="px-4 sm:px-6 py-4 sm:py-6">
          <MenuSearch
            placeholder="Search for spicy honey glaze"
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>
        
        {popularItems.length > 0 && (
          <section className="bg-gradient-to-b from-white to-gray-50 py-8 md:py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <PopularItemsHeader title="Popular Items" subtitle="Most ordered right now" showEmoji={true} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {popularItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        {categories.map((category) => {
          const categoryItems = menuItems.filter((item) => item.categoryId === category.id && item.available);
          
          return (
            <div key={category.id} id={`category-${category.id}`}>
              <CategoryHeroSection category={category} categoryDescription={categoryDescriptions} />
              <div className="px-4 sm:px-6 py-6 sm:py-8">
                <div className="max-w-6xl mx-auto">
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-8">
                    Showing{' '}
                    <span className="font-bold text-pink-600">
                      {categoryItems.length}
                    </span>{' '}
                    items in{' '}
                    <span className="font-bold text-pink-600">{category.name}</span>
                  </p>
                  
                  {categoryItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {categoryItems.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          onProductClick={handleProductClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 text-sm">No items available in this category</p>
                      <p className="text-gray-400 text-xs mt-2">Add items from admin panel</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </main>
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
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

      {/* Promotion Popup */}
      {showPromotionPopup && promotions.length > 0 && (
        <PromotionPopup
          promotions={promotions}
          onClose={handleClosePromotionPopup}
          onShopNow={handleShopNow}
        />
      )}
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