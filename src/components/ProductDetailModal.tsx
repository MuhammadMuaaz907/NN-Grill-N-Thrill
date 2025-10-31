// src/components/ProductDetailModal.tsx (Improved)
"use client";

import React, { useState, useEffect } from "react";
import { X, Share2, Heart, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MenuItem } from "@/types";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MenuItem | null;
  isFavorited?: boolean;
  onFavorite?: (itemId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  isFavorited = false,
  onFavorite,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSpecialInstructions("");
    }
  }, [isOpen]);

  // Handle keyboard escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Add item to cart multiple times based on quantity
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Close modal after adding
    onClose();
  };

  // Share product
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
        .catch(() => {
          // User cancelled share
        });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${product.name} - Rs. ${product.price}\n${product.description}`
      );
      alert("Product details copied to clipboard!");
    }
  };

  // Total price calculation
  const totalPrice = product.price * quantity;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Image */}
          <div className="relative">
            {/* Product Image */}
            <div className="w-full h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-7xl">🍽️</span>
                  <div className="text-center">
                    <p className="text-pink-600 font-script text-2xl italic">
                      florentine
                    </p>
                    <p className="text-gray-500 text-xs">café & eat</p>
                  </div>
                </div>
              )}
            </div>

            {/* Top Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-3">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full shadow-md transition-all hover:scale-110"
                aria-label="Share product"
                title="Share"
              >
                <Share2 size={20} />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full shadow-md transition-all hover:scale-110"
                aria-label="Close modal"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Product Name and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-pink-600">
                Rs. {product.price}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Special Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) =>
                  setSpecialInstructions(e.target.value.slice(0, 500))
                }
                placeholder="Please enter instructions about this item"
                className="w-full h-28 p-4 border-2 border-gray-200 rounded-lg focus:border-pink-600 focus:outline-none resize-none placeholder-gray-400 text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-2">
                {specialInstructions.length}/500 characters
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              {/* Quantity Controls */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 bg-white border-2 border-gray-300 rounded-lg px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-600 hover:text-pink-600 transition p-1"
                    aria-label="Decrease quantity"
                    title="Decrease"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-lg font-bold text-gray-900 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-pink-600 hover:text-pink-700 transition p-1"
                    aria-label="Increase quantity"
                    title="Increase"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Price Display */}
                <div className="flex-1 text-right">
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rs. {totalPrice}
                  </p>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                Rs. {totalPrice}
                <span className="text-2xl">Add to Cart</span>
                <X size={24} className="rotate-45" />
              </button>
            </div>

            {/* Favorite Button */}
            {onFavorite && (
              <button
                onClick={() => onFavorite(product.id)}
                className={`w-full font-semibold text-lg py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  isFavorited
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart
                  size={20}
                  className={isFavorited ? "fill-current" : ""}
                />
                {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
