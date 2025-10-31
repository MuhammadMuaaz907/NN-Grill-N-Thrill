// src/app/order-tracking/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Clock, MapPin, CheckCircle, Package, Truck, Home, Phone, User, ShoppingBag, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  order_id: string;
  customer_info: {
    full_name: string;
    mobile: string;
    address: string;
    area: string;
    email?: string;
  };
  order_items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totals: {
    subtotal: number;
    tax: number;
    delivery_fee: number;
    grand_total: number;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';
  created_at: string;
  updated_at: string;
  estimated_delivery: string;
}

interface StatusTimelineItem {
  status: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  time?: string;
}

function OrderTrackingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const [searchOrderId, setSearchOrderId] = useState(orderIdParam || '');
  const [currentOrderId, setCurrentOrderId] = useState<string>(orderIdParam || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to track if we're updating URL internally (to prevent loops)
  const isInternalUpdate = useRef(false);
  const initialized = useRef(false);

  // Initialize from URL param only once on mount
  useEffect(() => {
    if (!initialized.current && orderIdParam) {
      setCurrentOrderId(orderIdParam);
      setSearchOrderId(orderIdParam);
      initialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount to prevent loops

  // Sync URL param when it changes externally (e.g., browser back/forward)
  useEffect(() => {
    if (initialized.current && orderIdParam && !isInternalUpdate.current) {
      if (orderIdParam !== currentOrderId) {
        setCurrentOrderId(orderIdParam);
        setSearchOrderId(orderIdParam);
      }
    }
    // Reset internal update flag after processing
    isInternalUpdate.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderIdParam]); // Only watch orderIdParam to prevent infinite loops

  // Fetch order from API
  const fetchOrder = useCallback(async (orderId: string) => {
    if (!orderId.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        // Try to parse JSON even if status is not ok (for error messages)
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }
      
      // Check response success and status
      if (result.success && result.data) {
        setOrder(result.data);
        setError(null);
      } else {
        // Handle API error response (including 404)
        const errorMessage = result.error || 'Order not found. Please check your Order ID.';
        setError(errorMessage);
        setOrder(null);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      
      // Provide user-friendly error messages
      if (err instanceof Error) {
        if (err.message.includes('404') || err.message.includes('not found')) {
          setError('Order not found. Please check your Order ID and try again.');
        } else if (err.message.includes('Network') || err.message.includes('fetch')) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError('Unable to fetch order. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch order when orderId changes (only once, no auto-refresh)
  useEffect(() => {
    if (currentOrderId) {
      fetchOrder(currentOrderId);
    }
  }, [currentOrderId, fetchOrder]);

  const handleSearch = () => {
    if (searchOrderId.trim()) {
      const trimmedId = searchOrderId.trim();
      // Only update if different to prevent unnecessary re-renders
      if (trimmedId !== currentOrderId) {
        // Mark as internal update to prevent loop
        isInternalUpdate.current = true;
        setCurrentOrderId(trimmedId);
        // Update URL without causing page reload - use replace instead of push
        router.replace(`/order-tracking?orderId=${encodeURIComponent(trimmedId)}`, { scroll: false });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Create status timeline
  const getStatusTimeline = (): StatusTimelineItem[] => {
    if (!order) return [];

    const allStatuses: Array<{ status: string; label: string; icon: React.ReactNode }> = [
      { status: 'confirmed', label: 'Order Confirmed', icon: <CheckCircle size={24} /> },
      { status: 'preparing', label: 'Preparing', icon: <Package size={24} /> },
      { status: 'ready', label: 'Ready', icon: <Clock size={24} /> },
      { status: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck size={24} /> },
      { status: 'delivered', label: 'Delivered', icon: <Home size={24} /> },
    ];

    const currentStatusIndex = allStatuses.findIndex(s => s.status === order.status);
    const statusOrder = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    
    return allStatuses.map((statusItem) => {
      const isCompleted = statusOrder.indexOf(statusItem.status) <= currentStatusIndex;
      const isActive = statusItem.status === order.status;
      
      return {
        ...statusItem,
        isActive,
        isCompleted,
        time: isActive || isCompleted ? order.updated_at : undefined
      };
    });
  };

  const statusTimeline = getStatusTimeline();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateEstimatedTime = () => {
    if (!order) return 'N/A';
    const estimated = new Date(order.estimated_delivery);
    const now = new Date();
    const diffInMinutes = Math.max(0, Math.ceil((estimated.getTime() - now.getTime()) / (1000 * 60)));
    
    if (diffInMinutes <= 0) return 'Arriving soon';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes`;
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Your order has been confirmed and received';
      case 'preparing':
        return 'Our kitchen is preparing your delicious meal';
      case 'ready':
        return 'Your order is ready and being packaged';
      case 'out_for_delivery':
        return 'Your order is on the way to you';
      case 'delivered':
        return 'Your order has been delivered. Enjoy your meal!';
      default:
        return 'Order is being processed';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Track Your Order</h1>
            
            {/* Search Form */}
            <div className="flex gap-3">
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Order ID (e.g., ORDER-123456)"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={handleSearch}
                disabled={!searchOrderId.trim()}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Search size={20} />
                <span className="hidden sm:inline">Track</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && currentOrderId && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          )}

          {/* Error State */}
          {error && currentOrderId && !loading && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertCircle size={24} />
                <p className="font-semibold">{error}</p>
              </div>
              <button
                onClick={() => fetchOrder(currentOrderId)}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          )}

          {/* Order Details */}
          {order && !loading && (
            <>
              {/* Order Header Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order #{order.order_id}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {formatDate(order.created_at)} at {formatTime(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-lg">
                    <MapPin size={20} className="text-pink-600" />
                    <div>
                      <p className="text-xs text-gray-600">Estimated Delivery</p>
                      <p className="text-sm font-semibold text-pink-600">{calculateEstimatedTime()}</p>
                    </div>
                  </div>
                </div>

                {/* Current Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <p className="text-sm text-gray-600">{getStatusMessage(order.status)}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h3>
                
                <div className="space-y-6">
                  {statusTimeline.map((item, index) => (
                    <div key={item.status} className="flex items-start gap-4 relative">
                      {/* Timeline Line */}
                      {index < statusTimeline.length - 1 && (
                        <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                          item.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}></div>
                      )}
                      
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        item.isActive 
                          ? 'bg-pink-500 text-white animate-pulse' 
                          : item.isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {item.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-semibold ${
                            item.isActive ? 'text-pink-600' : item.isCompleted ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {item.label}
                          </h4>
                          {item.time && (
                            <span className="text-xs text-gray-500">
                              {formatTime(item.time)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{getStatusMessage(item.status)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag size={20} className="text-pink-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                </div>
                
                <div className="space-y-3">
                  {order.order_items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">Rs. {(order.totals?.subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">Rs. {(order.totals?.tax || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900">Rs. {(order.totals?.delivery_fee || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-pink-600">
                      Rs. {(order.totals?.grand_total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <User size={20} className="text-pink-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="font-medium text-gray-900">{order.customer_info?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{order.customer_info?.mobile || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium text-gray-900">
                      {order.customer_info?.address || 'N/A'}
                      {order.customer_info?.area && `, ${order.customer_info.area}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Manual Refresh Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} className="text-blue-600" />
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Note:</span> Refresh this page to see the latest order status updates.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!currentOrderId && !loading && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Search size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Your Order</h3>
              <p className="text-gray-600 mb-6">Enter your Order ID above to track your order status in real-time</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <Phone size={24} className="mx-auto text-pink-600 mb-2" />
                <p className="font-semibold">Call Us</p>
                <p className="text-sm text-gray-600">0325 3652040</p>
              </div>
              <div className="text-center">
                <Clock size={24} className="mx-auto text-pink-600 mb-2" />
                <p className="font-semibold">Business Hours</p>
                <p className="text-sm text-gray-600">8:00 AM - 11:00 PM</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                ← Back to Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderTracking() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
