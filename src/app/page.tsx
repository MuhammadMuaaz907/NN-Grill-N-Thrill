// src/app/page.tsx
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ArrowUp } from 'lucide-react';
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
    addToCart,
    setItems,
    setIsOpen,
  } = useCart();

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [showUpArrowButton, setShowUpArrowButton] = useState(false);
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
          
          // Always show popup on page load/refresh with slight delay
          console.log('✅ Showing promotion popup');
          setTimeout(() => {
            setShowPromotionPopup(true);
            console.log('🎉 Popup state set to true');
          }, 1500);
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

  // Check if search bar and hero section are scrolled past
  useEffect(() => {
    const handleScroll = () => {
      // Check search bar
      const searchBarElement = document.getElementById('category-menu');
      if (searchBarElement) {
        const rect = searchBarElement.getBoundingClientRect();
        // Show button if search bar bottom is above viewport (scrolled past)
        setShowSearchButton(rect.bottom < 50);
      }

      // Check hero section - find hero section by checking scroll position
      const heroSection = document.querySelector('section[class*="pt-16"]');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        // Show button if hero section bottom is above viewport (scrolled past)
        setShowUpArrowButton(rect.bottom < 100);
      } else {
        // Fallback: if hero section not found, show button when scrolled past 300px
        setShowUpArrowButton(window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to search bar
  const handleScrollToSearch = () => {
    const searchBarElement = document.getElementById('category-menu');
    if (searchBarElement) {
      // Get navbar height for offset
      const navbarWrapper = document.querySelector('div[class*="fixed"][class*="z-50"]') as HTMLElement;
      const navbarHeight = navbarWrapper ? navbarWrapper.getBoundingClientRect().height : 80;
      
      const elementRect = searchBarElement.getBoundingClientRect();
      const elementTop = elementRect.top + window.pageYOffset;
      const scrollPosition = elementTop - navbarHeight - 20; // 20px padding
      
      window.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  };

  // Scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
            placeholder="Search for"
            onSearch={handleSearch}
            onClear={handleClear}
            categories={categories}
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
        onAddItem={addToCart}
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

      {/* Floating Search Button - Shows when scrolled past search bar */}
      {showSearchButton && (
        <button
          onClick={handleScrollToSearch}
          className="fixed left-4 sm:left-5 bottom-12 sm:bottom-14 bg-pink-600 hover:bg-pink-700 text-white p-3 sm:p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 z-40 hover:scale-110 active:scale-95 flex items-center justify-center"
          style={{
            opacity: 0,
            animation: 'fadeIn 1s ease-in-out 0.3s forwards'
          }}
          aria-label="Scroll to search"
          title="Scroll to search"
        >
          <Search size={20} strokeWidth={3} className="sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Floating Up Arrow Button - Shows when scrolled past hero section */}
      {showUpArrowButton && (
        <button
          onClick={handleScrollToTop}
          className="fixed right-4 sm:right-5 bottom-12 sm:bottom-14 bg-pink-600 hover:bg-pink-700 text-white p-2 sm:p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 hover:scale-110 active:scale-95 flex items-center justify-center"
          style={{
            opacity: 0,
            animation: 'fadeIn 1s ease-in-out 0.3s forwards'
          }}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp size={18} strokeWidth={3.5} className="sm:w-5 sm:h-5" />
        </button>
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