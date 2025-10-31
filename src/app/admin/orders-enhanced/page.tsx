'use client';

import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import useOrderRealtime from '@/hooks/useOrderRealtime';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  Search,
  Filter,
  Bell,
  BellOff,
  RefreshCw,
  Eye,
  MapPin,
  Phone,
  CheckCircle2,
  X
} from 'lucide-react';

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
  admin_notes?: string;
  is_new?: boolean;
  admin_seen?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export default function AdminOrdersEnhanced() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousOrderCountRef = useRef<number>(0);
  const previousOrderIdsRef = useRef<Set<string>>(new Set());
  const lastFetchTimestampRef = useRef<string>(new Date().toISOString());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastFetchWasIncrementalRef = useRef<boolean>(false);
  const notifiedThisFetchRef = useRef<boolean>(false);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // Play notification sound
  const playNotificationSound = async () => {
    try {
      if (!soundEnabled) return;
      // Use Web Audio API with fallback for Safari
      const AudioContextClass = window.AudioContext || (window as unknown as Record<string, unknown>)['webkitAudioContext'];
      if (AudioContextClass) {
        // Reuse a single AudioContext where possible to avoid browser limits
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContextClass() as AudioContext;
        }
        const audioContext = audioContextRef.current;
        // Some browsers suspend context until user interaction
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        return;
      }
      // Fallback: HTML5 Audio with embedded data URI beep (440Hz tone)
      const beepSrc = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAABAAACAGZkYXRhAAAAAA==';
      const audio = new Audio(beepSrc);
      audio.play().catch(() => {});
    } catch {
      try {
        const beepSrc = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAABAAACAGZkYXRhAAAAAA==';
        const audio = new Audio(beepSrc);
        audio.play().catch(() => {});
      } catch {}
    }
  };

  // Unlock audio on first user interaction to avoid autoplay blocking
  useEffect(() => {
    const handler = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as Record<string, unknown>)['webkitAudioContext'];
        if (!AudioContextClass) return;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContextClass() as AudioContext;
        }
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
      } catch {}
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
      window.removeEventListener('touchstart', handler);
    };
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    window.addEventListener('touchstart', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, []);

  // Realtime subscribe to new orders
  useOrderRealtime((order) => {
    try {
      const orderIdStr = String(order.id);
      // Avoid duplicate notifications if we've already seen this ID
      if (previousOrderIdsRef.current.has(orderIdStr)) {
        return;
      }

      // Update baseline immediately
      previousOrderIdsRef.current.add(orderIdStr);

      // Add to top of orders list
      setOrders((prev) => {
        const next = [{ ...(order as unknown as Order) }, ...prev];
        return next;
      });

      // Mark as new for UI
      setNewOrderIds((prev) => {
        const updated = new Set(prev);
        updated.add(orderIdStr);
        return updated;
      });
      setNewOrdersCount((prev) => prev + 1);

      // Toast + sound
      const total = order?.totals?.grand_total || 0;
      const customer = order?.customer_info?.full_name || 'Unknown Customer';
      showToast(`🎉 New order from ${customer} — Rs. ${Number(total).toLocaleString()}`);
      if (soundEnabled) {
        void playNotificationSound();
      }

      setLastUpdated(new Date());
    } catch {
      // no-op
    }
  });

  // Fetch orders from database
  const fetchOrders = async () => {
    try {
      // Fetch start
      notifiedThisFetchRef.current = false;
      
      // Always fetch full list to avoid clock-skew edge cases with incremental fetch
      const apiUrl = '/api/orders';
      lastFetchWasIncrementalRef.current = false;
      // URL being fetched (debug)
      // console.log(`🌐 Fetching URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      const result = await response.json();
      
      // High-signal: response size
      console.log(`📦 Orders fetched: ${result.data?.length || 0}`);
      
      if (result.success && result.data) {
        const currentOrders: Order[] = Array.isArray(result.data) ? result.data : [];
        // const currentOrderIds = new Set<string>(currentOrders.map((o: Order) => String(o.id)));
        
        // Notifications are triggered only from the diff-detection path below
        
        // Minimal state snapshot
        // console.log(`State -> current:${currentOrders.length} prev:${previousOrderIdsRef.current.size} initial:${isInitialLoad}`);
        
        // Handle initial load - set baseline (NO NOTIFICATIONS ON FIRST LOAD)
        if (isInitialLoad) {
          // Initial load baseline (no notifications)
          
          // IMPORTANT: Set ALL current orders as baseline to track what we've seen
          // This prevents showing notifications for orders already in database
          const baselineIds = new Set<string>(currentOrders.map((o: Order) => String(o.id)));
          
          previousOrderIdsRef.current = baselineIds;
          console.log(`✅ Baseline set: ${baselineIds.size}`);
          
          // Find ONLY orders marked as new in database (is_new=true AND admin_seen=false)
          const newOrdersInDB = currentOrders.filter(order => 
            order.is_new === true && order.admin_seen === false
          );
          
          if (newOrdersInDB.length > 0) {
            const newOrderIdsFromDB = newOrdersInDB.map(o => String(o.id));
            
            // Only mark as new for UI display, but NO toast/sound on initial load
            setNewOrderIds(new Set(newOrderIdsFromDB));
            setNewOrdersCount(newOrdersInDB.length);
            console.log(`📊 New (DB flags) count: ${newOrdersInDB.length}`);
            // NO TOAST OR SOUND on initial load - these are existing orders
          } else {
            setNewOrderIds(new Set());
            setNewOrdersCount(0);
            // No new flagged orders on initial load
          }
          
          setOrders(currentOrders);
          setIsInitialLoad(false);
          
          // Update timestamp to the max created_at from current orders to avoid clock skew
          if (currentOrders.length > 0) {
            const maxCreatedAt = currentOrders
              .map(o => new Date(o.created_at).getTime())
              .reduce((a, b) => Math.max(a, b), 0);
            // Advance cursor by 1ms to avoid re-fetching the same row due to precision
            lastFetchTimestampRef.current = new Date(maxCreatedAt + 1).toISOString();
          } else {
            lastFetchTimestampRef.current = new Date().toISOString();
          }
          console.log(`⏰ Cursor set: ${lastFetchTimestampRef.current}`);
          
          setLastUpdated(new Date());
          // Initial load complete
          return; // Exit early - no notifications on initial load
        }
        
        // After initial load - ONLY detect TRULY NEW orders (not in previous set)
        const previousIds = previousOrderIdsRef.current;
        const newlyFoundOrderIds: string[] = [];
        
        // ONLY detect orders that are NOT in previous set (truly new orders)
        currentOrders.forEach((order) => {
          const orderId = String(order.id);
          // ONLY check if order ID is NOT in previous set (meaning it's a new entry)
          if (!previousIds.has(orderId)) {
            newlyFoundOrderIds.push(orderId);
            // console.log(`New ID: ${orderId}`);
          }
        });
        
        // If TRULY NEW orders found (not in previous set), trigger notifications
        if (newlyFoundOrderIds.length > 0) {
          console.log(`🎉 New orders detected: ${newlyFoundOrderIds.length}`);
          
          const newOrders = currentOrders.filter((o: Order) => 
            newlyFoundOrderIds.includes(String(o.id))
          );
          
          const totalAmount = newOrders.reduce((sum: number, o: Order) => {
            return sum + (o.totals?.grand_total || 0);
          }, 0);
          
          // console.log(`Total amount: Rs. ${totalAmount.toLocaleString()}`);
          
          // Show toast notification ONLY for truly new orders
          const toastMessage = `🎉 ${newOrders.length} new order${newOrders.length > 1 ? 's' : ''} received! Total: Rs. ${totalAmount.toLocaleString()}`;
          console.log('📢 Toast fired');
          if (!notifiedThisFetchRef.current) {
          showToast(toastMessage);
            notifiedThisFetchRef.current = true;
          }
          
          // Play sound ONLY for truly new orders
          console.log('🔊 Sound fired');
          if (soundEnabled) {
          playNotificationSound();
          }
          
          // Update state with new orders
          setNewOrderIds(prev => {
            const updated = new Set<string>(prev);
            newlyFoundOrderIds.forEach(id => updated.add(id));
            return updated;
          });
          
          setNewOrdersCount(prev => prev + newlyFoundOrderIds.length);
          
          // IMPORTANT: Add new orders to previous IDs IMMEDIATELY so they won't be detected again
          newlyFoundOrderIds.forEach(id => {
            previousIds.add(id);
          });
          // Baseline updated
        } else {
          // No new IDs this poll
        }
        
        // Update orders list (always)
        setOrders(currentOrders);
        
        // IMPORTANT: Only add NEW orders to previous set, don't reset it
        // This ensures existing orders stay in the set and won't trigger notifications again
        // previousOrderIdsRef.current is already updated above for new orders
        // For orders that disappeared, we don't remove them (they stay in set)
        previousOrderCountRef.current = currentOrders.length;
        
        // Keep cursor logic no-op since we fetch full list now
        
        setLastUpdated(new Date());
        
      } else {
        console.error('❌ API error');
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchOrders, 3000); // Refresh every 3 seconds for faster detection
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]);

  useEffect(() => {
    // Filter orders based on search and status
    let filtered = orders;

        if (searchTerm) {
          filtered = filtered.filter(order =>
            order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.customer_info?.full_name && order.customer_info.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            order.customer_info?.mobile?.includes(searchTerm)
          );
        }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort by creation time (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status'], adminNotes?: string) => {
    try {
      console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, admin_notes: adminNotes })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log(`📦 API Response:`, result);
      
      if (result.success) {
        // Update order in state
        setOrders(prevOrders => prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus, admin_notes: adminNotes } : order
        ));
        
        // Remove "NEW" label when status changes (any status change removes new label)
        setNewOrderIds(prev => {
          const orderIdStr = String(orderId);
          const hasNewLabel = prev.has(orderIdStr);
          console.log(`🏷️ Order ${orderIdStr} has NEW label: ${hasNewLabel}`);
          
          if (hasNewLabel) {
            const updated = new Set(prev);
            updated.delete(orderIdStr);
            console.log(`🗑️ Removed NEW label from order ${orderIdStr}. Remaining: ${updated.size}`);
            setNewOrdersCount(prevCount => {
              const newCount = Math.max(0, prevCount - 1);
              console.log(`📊 Updated count after removal: ${newCount}`);
              return newCount;
            });
            return updated;
          }
          return prev;
        });
        
        // Show success notification
        showToast(`Order status updated to ${newStatus.replace('_', ' ')}`);
        console.log(`✅ Order status updated successfully`);
      } else {
        const errorMsg = result.error || 'Unknown error';
        console.error('❌ Status update failed:', errorMsg);
        console.error('❌ Full result:', result);
        alert(`Error updating order status: ${errorMsg}`);
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error updating order status: ${errorMsg}`);
    }
  };

  const clearNewOrdersCount = () => {
    setNewOrdersCount(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'preparing':
        return <Package size={16} />;
      case 'ready':
        return <CheckCircle2 size={16} />;
      case 'out_for_delivery':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle2 size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow.slice(currentIndex + 1);
  };

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

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/**
         * QA Checklist (manual):
         * 1) Initial load -> no toast/beep; baseline set.
         * 2) Place 1 order -> one toast + one beep; highlight + NEW badge; no duplicate on next poll.
         * 3) Place 2 orders quickly -> single toast summarizing both + one beep; both highlighted.
         * 4) Update status of a NEW order -> badge/highlight removed; new count decremented.
         * 5) Refresh page -> no notifications for existing; only future orders notify.
         */}
        {/* Toast Notifications */}
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-white border border-green-200 rounded-lg shadow-xl p-4 max-w-sm animate-slide-in flex items-center gap-3"
            >
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900">{toast.message}</span>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Real-time Orders</h1>
            <p className="text-gray-600 mt-1">Live order tracking and management</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {autoRefresh ? <Bell size={16} /> : <BellOff size={16} />}
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </button>
            
            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                soundEnabled 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
              title={soundEnabled ? 'Sound enabled' : 'Sound disabled'}
            >
              {soundEnabled ? <Bell size={16} /> : <BellOff size={16} />}
              {soundEnabled ? 'Sound ON' : 'Sound OFF'}
            </button>
            
            {/* Manual refresh */}
            <button
              onClick={fetchOrders}
              className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            
            {/* Last updated */}
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery'].map((status) => {
            const count = orders.filter(order => order.status === status).length;
            return (
              <div key={status} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {status.replace('_', ' ')}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${getStatusColor(status).replace('text-', 'bg-').replace('-800', '-100')}`}>
                    {getStatusIcon(status)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Orders</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                </p>
              </div>
              {newOrdersCount > 0 && (
                <button
                  onClick={clearNewOrdersCount}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse transition-colors cursor-pointer"
                  title="Click to clear notification"
                >
                  {newOrdersCount} new
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => {
              // Convert to string for consistent comparison
              const orderIdStr = String(order.id);
              const isNewOrder = newOrderIds.has(orderIdStr);
              
              if (isNewOrder) {
                console.log(`🎨 Rendering NEW order: ${orderIdStr} with badge and highlight`);
              }
              
              return (
              <div 
                key={order.id} 
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  isNewOrder ? 'bg-green-50 border-l-4 border-green-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.order_id.substring(0, 12)}...
                          </h3>
                          {/* NEW Badge - shows when order is new */}
                          {isNewOrder && (
                            <span 
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse"
                              title="New Order"
                            >
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)} at {formatTime(order.created_at)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {getTimeAgo(order.created_at)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600">
                            {order.customer_info?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer_info?.full_name || 'Unknown Customer'}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone size={12} />
                            {order.customer_info?.mobile || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                        <p className="text-sm text-gray-900 flex items-center gap-1">
                          <MapPin size={12} />
                          {order.customer_info?.address || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">{order.customer_info?.area || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Order Details</p>
                        <p className="text-sm text-gray-900">{order.order_items?.length || 0} item{(order.order_items?.length || 0) > 1 ? 's' : ''}</p>
                        <p className="text-sm font-semibold text-gray-900">Rs. {(order.totals?.grand_total || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusOptions(order.status).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status as Order['status'])}
                          className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                        >
                          Mark as {status.replace('_', ' ')}
                        </button>
                      ))}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder.order_id}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><strong>Name:</strong> {selectedOrder.customer_info?.full_name || 'Unknown Customer'}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customer_info?.mobile || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer_info?.email || 'N/A'}</p>
                    <p><strong>Address:</strong> {selectedOrder.customer_info?.address || 'N/A'}</p>
                    <p><strong>Area:</strong> {selectedOrder.customer_info?.area || 'N/A'}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {(selectedOrder.order_items || []).map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div>
                          <p className="font-medium text-gray-900">{item?.name || 'Unknown Item'}</p>
                          <p className="text-sm text-gray-600">Quantity: {item?.quantity || 0}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          Rs. {((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>Rs. {(selectedOrder.totals?.subtotal || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>Rs. {(selectedOrder.totals?.tax || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>Rs. {(selectedOrder.totals?.delivery_fee || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
                      <span>Total:</span>
                      <span>Rs. {(selectedOrder.totals?.grand_total || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Status</h3>
                  <div className="flex gap-2 flex-wrap">
                    {getStatusOptions(selectedOrder.status).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, status as Order['status']);
                          setSelectedOrder(null);
                        }}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Mark as {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
}
