// src/components/CheckoutForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

interface CheckoutFormData {
  title: string;
  fullName: string;
  mobile: string;
  alternateMobile?: string;
  address: string;
  landmark: string;
  email: string;
  area: string;
  instructions?: string;
  changeRequest?: number;
}

const areas = ['Clifton', 'DHA', 'Gulshan', 'Defence'];

function CheckoutFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subtotal = parseInt(searchParams.get('subtotal') || '0');
  const tax = parseInt(searchParams.get('tax') || '0');
  const deliveryFee = parseInt(searchParams.get('deliveryFee') || '160');
  const grandTotal = parseInt(searchParams.get('grandTotal') || '0');
  const itemsParam = searchParams.get('items');
  const items = itemsParam ? JSON.parse(decodeURIComponent(itemsParam)) : [];

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: { title: 'Mr', area: 'Clifton', changeRequest: 500 },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const orderData = {
        customerInfo: data,
        orderItems: items,
        totals: { subtotal, tax, deliveryFee, grandTotal }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        // Clear cart and redirect with order ID
        sessionStorage.removeItem('cartState');
        router.push(`/order-confirmation?orderId=${result.data.orderId}`);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleContinueToCart = () => {
    sessionStorage.setItem('cartState', JSON.stringify({ items, isOpen: true }));
    const itemsParam = encodeURIComponent(JSON.stringify(items));
    router.push(`/cart?items=${itemsParam}&open=true`);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      sessionStorage.setItem('cartState', JSON.stringify({ items, isOpen: true }));
      window.history.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600 mb-2 sm:mb-4">This is a delivery order 🚚</p>
              <p className="text-xs sm:text-sm text-gray-500">Just a last step, please enter your details.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <select {...register('title')} className="border rounded-lg p-2 text-sm sm:text-base">
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Ms</option>
                </select>
                <input
                  {...register('fullName', { required: 'Full name is required' })}
                  placeholder="Full Name"
                  className="border rounded-lg p-2 text-sm sm:text-base"
                />
                {errors.fullName && <p className="text-red-500 text-xs sm:text-sm col-span-2">{errors.fullName.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  {...register('mobile', { required: 'Mobile number is required' })}
                  placeholder="03xx-xxxxxxx"
                  className="border rounded-lg p-2 text-sm sm:text-base"
                />
                <input
                  {...register('alternateMobile')}
                  placeholder="Alternate Mobile Number"
                  className="border rounded-lg p-2 text-sm sm:text-base"
                />
                {errors.mobile && <p className="text-red-500 text-xs sm:text-sm sm:col-span-2">{errors.mobile.message}</p>}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Delivery Address <span className="text-red-500">*</span></h2>
              <textarea
                {...register('address', { required: 'Address is required' })}
                placeholder="Enter your complete address"
                className="w-full border rounded-lg p-2 h-20 mb-3 sm:mb-4 text-sm sm:text-base"
              />
              {errors.address && <p className="text-red-500 text-xs sm:text-sm">{errors.address.message}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <input {...register('landmark')} placeholder="Nearest Landmark" className="border rounded-lg p-2 text-sm sm:text-base" />
                <input {...register('email')} placeholder="Email Address" className="border rounded-lg p-2 text-sm sm:text-base" />
              </div>
              <select {...register('area')} className="w-full border rounded-lg p-2 mb-3 sm:mb-4 text-sm sm:text-base">
                {areas.map((area) => <option key={area}>{area}</option>)}
              </select>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Delivery Instructions</h2>
              <textarea
                {...register('instructions')}
                placeholder="Delivery Instructions"
                className="w-full border rounded-lg p-2 h-20 text-sm sm:text-base"
              />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Payment Information</h2>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="text-green-500 text-lg sm:text-xl">✅</span>
                <span className="font-medium text-sm sm:text-base">Cash on Delivery</span>
              </div>
              <input
                {...register('changeRequest')}
                type="number"
                placeholder="Change Request"
                className="w-full border rounded-lg p-2 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-20">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Your Order</h2>
              <div className="max-h-64 sm:max-h-none overflow-y-auto">
                {items.map((item: { name: string; quantity: number; price: number }, i: number) => (
                  <div key={i} className="flex justify-between mb-2 text-sm sm:text-base">
                    <span className="flex-1">{item.quantity}x {item.name}</span>
                    <span className="text-pink-600 font-semibold ml-2">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="space-y-2 mb-4 sm:mb-6 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax 15%</span>
                  <span>Rs. {tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee}</span>
                </div>
              </div>
              <div className="border-t pt-3 sm:pt-4">
                <div className="flex justify-between text-base sm:text-lg font-bold mb-4 sm:mb-6">
                  <span>Grand Total</span>
                  <span className="text-pink-600">Rs. {grandTotal}</span>
                </div>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 sm:py-3 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base"
                >
                  Place Order
                </button>
                <button
                  onClick={handleGoBack}
                  className="w-full text-blue-600 font-semibold py-2 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base"
                >
                  ← continue to add more items
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>}>
      <CheckoutFormContent />
    </Suspense>
  );
}