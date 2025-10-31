// src/app/order-confirmation/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Clock, MapPin } from 'lucide-react';
import { Suspense } from 'react';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORDER-' + Date.now();

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleViewOrders = () => {
    // Navigate to order tracking page with order ID
    router.push(`/order-tracking?orderId=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We&apos;ve received your request and will start preparing your delicious meal.
            </p>
            
            {/* Order Info */}
            <div className="bg-pink-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock size={20} className="text-pink-600" />
                <span className="font-semibold text-pink-600">Estimated Delivery Time</span>
              </div>
              <p className="text-lg font-bold text-gray-900">45 minutes</p>
              
              {/* Order ID Display */}
              <div className="mt-3 pt-3 border-t border-pink-200">
                <p className="text-sm text-gray-600">
                  Order ID: <span className="font-mono font-semibold text-gray-900">{orderId}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin size={20} className="text-pink-600" />
              <span className="text-gray-600">Delivering to your address</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleContinueShopping}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Continue Shopping
              </button>
              <button 
                onClick={handleViewOrders}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Track Order
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Call us at <span className="font-semibold">0325 3652040</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order confirmation...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}