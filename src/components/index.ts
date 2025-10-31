// src/components/index.ts (Updated)

// Navigation & Layout Components
export { Navbar } from './Navbar';
export { Footer } from './Footer';

// Hero & Carousel
export { Carousel } from './Carousel';
export type { CarouselItem } from './Carousel';
export { HeroSection } from './HeroSection';

// Category Components
export { CategoryMenu } from './CategoryMenu';
export type { Category } from './CategoryMenu';
export { CategoryHeroSection } from './CategoryHeroSection';
export { CategoryItemsSection } from './CategoryItemsSection';

// Menu Components
export { MenuSearch } from './MenuSearch';
export { PopularItemsHeader } from './PopularItemsHeader';
export { MenuItemCard } from './MenuItemCard';
export { MenuItemsGrid } from './MenuItemsGrid';
export { MenuPage } from './MenuPage';

// Utility Components
export { ErrorBoundary } from './ErrorBoundary';
export { LoadingSpinner, PageLoading, CardSkeleton, GridSkeleton } from './LoadingSpinner';

// Cart & Checkout
export { CartDrawer } from './CartDrawer';
export { ProductDetailModal } from './ProductDetailModal';
export { default as CheckoutForm } from './CheckoutForm';

// Admin Components
export { default as AdminLayout } from './AdminLayout';