// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { MenuItem } from '@/types';

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  cartCount: number;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setItems: (items: CartItem[]) => void;
  setIsOpen: (isOpen: boolean) => void;
  getSubtotal: () => number;
  getTax: () => number;
  getGrandTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Calculate cart count
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Add item to cart
  const addToCart = useCallback((item: MenuItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  }, []);

  // Update quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  // Calculate subtotal
  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  // Calculate tax (15%)
  const getTax = useCallback(() => {
    return Math.round(getSubtotal() * 0.15);
  }, [getSubtotal]);

  // Calculate grand total
  const getGrandTotal = useCallback(() => {
    const deliveryFee = 160;
    return getSubtotal() + getTax() + deliveryFee;
  }, [getSubtotal, getTax]);

  // Open/Close cart
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        setItems,
        setIsOpen,
        getSubtotal,
        getTax,
        getGrandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}