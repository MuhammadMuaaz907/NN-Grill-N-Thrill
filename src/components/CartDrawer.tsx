// src/components/CartDrawer.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Add this import
import { X, Trash2, Plus, Minus, Package } from 'lucide-react';
import { MenuItem } from '@/types';

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onAddItem: (item: MenuItem) => void;
  recommendedItems?: MenuItem[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onAddItem,
  recommendedItems = []
}) => {
  const router = useRouter(); // Add this
  const [showRecommended, setShowRecommended] = useState(true);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.15); // 15% tax
  const deliveryFee = 160;
  const grandTotal = subtotal + tax + deliveryFee;

  // Estimated delivery time
  const deliveryTime = new Date();
  deliveryTime.setMinutes(deliveryTime.getMinutes() + 45);

  const handleCheckout = () => {
    // Encode items as JSON for URL param
    const itemsParam = encodeURIComponent(JSON.stringify(items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image // Include image if available
    }))));
    router.push(`/guestcheckout?subtotal=${subtotal}&tax=${tax}&deliveryFee=${deliveryFee}&grandTotal=${grandTotal}&items=${itemsParam}`);
  };

  const handleTrackOrder = () => {
    onClose(); // Close the cart drawer first
    router.push('/order-tracking'); // Navigate to order tracking page
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[2px] z-40 transition-opacity transition-backdrop-filter"
          onClick={onClose}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full md:w-96 lg:w-[420px] bg-white shadow-xl z-50 transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {items.length === 0 ? (
            // Empty State
            <div className="text-center py-8 md:py-12">
              <div className="text-5xl md:text-6xl mb-3 md:mb-4">🛍️</div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Your Cart is Empty
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 px-4">
                Looks like you haven&apos;t added anything to your cart yet. Start exploring and shop your
                favorite items!
              </p>
              <div className="flex flex-col gap-2 md:gap-3">
                <button
                  onClick={onClose}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition text-sm md:text-base"
                >
                  Browse Products
                </button>
                <button
                  onClick={handleTrackOrder}
                  className="bg-white border-2 border-pink-600 text-pink-600 hover:bg-pink-50 font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Package size={18} />
                  Track Your Order
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-3 md:p-4 flex gap-3 md:gap-4"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-2xl md:text-3xl">🍽️</span>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 line-clamp-1 text-sm md:text-base">
                        {item.name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600">Rs. {item.price}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="text-pink-600 hover:bg-pink-100 p-1 rounded transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} className="md:w-4 md:h-4" />
                        </button>
                        <span className="w-6 text-center font-semibold text-gray-900 text-sm md:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="text-pink-600 hover:bg-pink-100 p-1 rounded transition"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} className="md:w-4 md:h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-600 hover:bg-red-100 p-1 rounded transition ml-auto"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} className="md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Items Button */}
              <button
                onClick={onClose}
                className="w-full text-pink-600 font-semibold py-2 mb-4 md:mb-6 flex items-center justify-center gap-2 hover:bg-pink-50 rounded-lg transition text-sm md:text-base"
              >
                <Plus size={16} className="md:w-[18px] md:h-[18px]" />
                Add more items
              </button>

              {/* Recommended Items */}
              {recommendedItems.length > 0 && showRecommended && (
                <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      Popular with your order
                    </h3>
                    <div className="flex gap-1 md:gap-2">
                      <button className="text-gray-400 hover:text-gray-600 transition text-xs md:text-base">
                        &lt;
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 transition text-xs md:text-base">
                        &gt;
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {recommendedItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex-shrink-0 w-20 md:w-24 text-center"
                      >
                        <div className="bg-gray-100 h-20 md:h-24 rounded-lg mb-2 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-xl md:text-2xl">🍽️</span>
                          )}
                        </div>
                        <p className="text-[10px] md:text-xs text-gray-900 font-semibold line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-600 mt-1">Rs. {item.price}</p>
                        <button
                          onClick={() => onAddItem(item)}
                          className="mt-1 md:mt-2 text-pink-600 hover:bg-pink-100 w-full p-1 rounded transition"
                        >
                          <Plus size={12} className="mx-auto md:w-[14px] md:h-[14px]" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 text-sm md:text-base">
                <div className="flex justify-between text-gray-700">
                  <span>Total</span>
                  <span className="font-semibold">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax 15%</span>
                  <span className="font-semibold">Rs. {tax}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">Rs. {deliveryFee}</span>
                </div>
              </div>

              {/* Grand Total & Checkout Button */}
              <div className="border-t border-gray-200 pt-3 md:pt-4 mb-4 md:mb-6">
                <div className="flex justify-between mb-4 md:mb-6">
                  <span className="font-semibold text-gray-900 text-sm md:text-base">Grand Total</span>
                  <span className="font-bold text-base md:text-lg text-gray-900">
                    Rs. {grandTotal}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 md:py-3 rounded-lg flex items-center justify-center gap-2 transition mb-3 md:mb-4 text-sm md:text-base"
                >
                  Checkout
                  <X size={16} className="md:w-[18px] md:h-[18px] rotate-45" />
                </button>

                {/* Delivery Info */}
                <div className="bg-blue-50 rounded-lg p-3 md:p-4 text-center">
                  <p className="text-[10px] md:text-xs text-gray-600 mb-1">
                    Your order will be delivered approximately in
                  </p>
                  <p className="text-xs md:text-sm font-semibold text-blue-600">
                    45 minutes on{' '}
                    <span>
                      {deliveryTime.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {' '}at{' '}
                    <span>
                      {deliveryTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};