// src/components/ProductDetailModal.tsx (Improved)
"use client";

import React, { useState, useEffect } from "react";
import { X, Share2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MenuItem } from "@/types";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MenuItem | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
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
      {/* Backdrop - Transparent */}
      <div
        className={`fixed inset-0 bg-white/60 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
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
          className="bg-white rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col md:flex-row shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Top Right of Modal */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 p-2.5 rounded-full shadow-lg transition-all hover:scale-110 z-20 border border-gray-200"
            aria-label="Close modal"
            title="Close"
          >
            <X size={20} />
          </button>

          {/* Left Side - Image */}
          <div className="w-full md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
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

          {/* Right Side - Content */}
          <div className="w-full md:w-1/2 flex flex-col p-6 md:p-8">
            {/* Product Name and Price */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-xl md:text-2xl font-bold text-pink-600">
                Rs. {product.price}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Special Instructions */}
            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Special Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) =>
                  setSpecialInstructions(e.target.value.slice(0, 500))
                }
                placeholder="Please enter instructions about this item"
                className="w-full h-24 p-3 border-2 border-gray-200 rounded-lg focus:border-pink-600 focus:outline-none resize-none placeholder-gray-400 text-gray-700 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                {specialInstructions.length}/500 characters
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mt-auto space-y-4">
              {/* Quantity Controls */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 bg-white border-2 border-gray-300 rounded-lg px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-600 hover:text-pink-600 transition p-1"
                    aria-label="Decrease quantity"
                    title="Decrease"
                  >
                    <Minus size={18} />
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
                    <Plus size={18} />
                  </button>
                </div>

                {/* Price Display */}
                <div className="flex-1 text-right">
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    Rs. {totalPrice}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
                  aria-label="Share product"
                  title="Share"
                >
                  <Share2 size={18} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  <Plus size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
