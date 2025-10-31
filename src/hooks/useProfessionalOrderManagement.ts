'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import useOrderRealtime from '@/hooks/useOrderRealtime';

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

interface Notification {
  id: string;
  type: 'new_order' | 'status_update' | 'urgent' | 'info';
  title: string;
  message: string;
  orderId?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timestamp: Date;
  read: boolean;
}

interface UseProfessionalOrderManagementReturn {
  orders: Order[];
  filteredOrders: Order[];
  notifications: Notification[];
  newOrdersCount: number;
  loading: boolean;
  error: string | null;
  autoRefresh: boolean;
  soundEnabled: boolean;
  lastUpdated: Date;
  
  // Actions
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status'], adminNotes?: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  toggleAutoRefresh: () => void;
  toggleSound: () => void;
  searchOrders: (query: string) => void;
  filterByStatus: (status: string) => void;
}

export const useProfessionalOrderManagement = (): UseProfessionalOrderManagementReturn => {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  // Realtime: push new orders immediately
  useOrderRealtime((order) => {
    try {
      const orderIdStr = String(order.id);
      if (previousOrderIdsRef.current.has(orderIdStr)) return;

      // Mark as seen in our in-memory baseline to avoid duplicates
      previousOrderIdsRef.current.add(orderIdStr);

      // Update orders immediately
      setOrders(prev => [{ ...(order as unknown as Order) }, ...prev]);
      setLastUpdated(new Date());

      // Create notification entry
      const notification: Notification = {
        id: order.id,
        type: 'new_order',
        title: 'New Order Received',
        message: `Order from ${order?.customer_info?.full_name || 'Unknown Customer'} - Rs. ${(order?.totals?.grand_total || 0).toLocaleString()}`,
        orderId: order.order_id,
        priority: (order.priority as Notification['priority']) || 'normal',
        timestamp: new Date(order.created_at),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
      setNewOrdersCount(prev => prev + 1);
    } catch {
      // ignore
    }
  });

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/orders', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      const result = await response.json();
      
      if (result.success) {
        const currentOrders = result.data || [];
        
        // Initial load - set baseline, NO notifications
        if (isInitialLoadRef.current) {
          console.log('🔄 INITIAL LOAD - Setting baseline (NO NOTIFICATIONS)');
          
          // Set ALL current orders as baseline
          previousOrderIdsRef.current = new Set(currentOrders.map((o: Order) => String(o.id)));
          isInitialLoadRef.current = false;
          
          setOrders(currentOrders);
          setLastUpdated(new Date());
          setLoading(false);
          
          // Only mark orders with is_new=true in database for UI display
          const newOrdersInDB = currentOrders.filter((order: Order) => 
            order.is_new === true && order.admin_seen === false
          );
          
          if (newOrdersInDB.length > 0) {
            console.log(`🆕 Found ${newOrdersInDB.length} orders marked as NEW in database (for display only)`);
            setNewOrdersCount(newOrdersInDB.length);
            
            // Add to notifications for display only (no sound/toast on initial load)
            const dbNotifications: Notification[] = newOrdersInDB.map((order: Order) => ({
              id: order.id,
              type: 'new_order',
              title: 'New Order Received',
              message: `Order from ${order.customer_info?.full_name || 'Unknown Customer'} - Rs. ${order.totals?.grand_total || 0}`,
              orderId: order.order_id,
              priority: order.priority || 'normal',
              timestamp: new Date(order.created_at),
              read: order.admin_seen || false
            }));
            
            setNotifications(dbNotifications);
          }
          
          return; // Exit - no notifications on initial load
        }
        
        // After initial load - ONLY detect TRULY NEW orders
        const newlyFoundOrderIds: string[] = [];
        
        currentOrders.forEach((order: Order) => {
          const orderId = String(order.id);
          if (!previousOrderIdsRef.current.has(orderId)) {
            newlyFoundOrderIds.push(orderId);
            console.log(`🆕 TRULY NEW ORDER DETECTED: ${orderId}`);
          }
        });
        
        // If TRULY NEW orders found, trigger notifications
        if (newlyFoundOrderIds.length > 0) {
          console.log(`🎉 ${newlyFoundOrderIds.length} TRULY NEW ORDER(S) DETECTED!`);
          
          const newOrders = currentOrders.filter((o: Order) => 
            newlyFoundOrderIds.includes(String(o.id))
          );
          
          const newNotifications: Notification[] = newOrders.map((order: Order) => ({
            id: order.id,
            type: 'new_order',
            title: 'New Order Received',
            message: `Order from ${order.customer_info?.full_name || 'Unknown Customer'} - Rs. ${order.totals?.grand_total || 0}`,
            orderId: order.order_id,
            priority: order.priority || 'normal',
            timestamp: new Date(order.created_at),
            read: order.admin_seen || false
          }));
          
          setNotifications(prev => [...newNotifications, ...prev]);
          setNewOrdersCount(prev => prev + newlyFoundOrderIds.length);
          
          // IMPORTANT: Add new orders to previous IDs IMMEDIATELY
          newlyFoundOrderIds.forEach(id => {
            previousOrderIdsRef.current.add(id);
          });
          console.log(`✅ Added ${newlyFoundOrderIds.length} new orders to previous IDs set`);
        }
        
        setOrders(currentOrders);
        setLastUpdated(new Date());
      } else {
        setError(result.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/orders/notifications');
      const result = await response.json();
      
      if (result.success) {
        setNotifications(result.data.notifications || []);
        setNewOrdersCount(result.data.newOrdersCount || 0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status'], adminNotes?: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: adminNotes })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status, admin_notes: adminNotes } : order
        ));
        
        // Add status update notification
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder) {
          const statusNotification: Notification = {
            id: `status-${orderId}-${Date.now()}`,
            type: 'status_update',
            title: 'Order Status Updated',
            message: `Order ${updatedOrder.order_id} updated to ${status.replace('_', ' ')}`,
            orderId: updatedOrder.order_id,
            priority: 'normal',
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [statusNotification, ...prev]);
        }
        
        // Remove "NEW" label when status changes (any status change removes new label)
        const orderIdStr = String(orderId);
        const hasNewNotification = notifications.find(n => n.id === orderIdStr && !n.read);
        
        if (hasNewNotification) {
          // Mark notification as read
          setNotifications(prev => prev.map(n => 
            n.id === orderIdStr ? { ...n, read: true } : n
          ));
          
          // Update new orders count
          setNewOrdersCount(prev => Math.max(0, prev - 1));
          console.log(`✅ Removed NEW label from order ${orderIdStr}`);
        }
      } else {
        setError(result.error || 'Failed to update order status');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error updating order status:', err);
    }
  }, [orders, notifications]);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await fetch('/api/admin/orders/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', orderId: notificationId })
      });
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setNewOrdersCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await fetch('/api/admin/orders/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' })
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setNewOrdersCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  // Toggle auto refresh
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Search orders
  const searchOrders = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Filter by status
  const filterByStatus = useCallback((status: string) => {
    setStatusFilter(status);
  }, []);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customer_info?.full_name && order.customer_info.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.customer_info?.mobile?.includes(searchQuery)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort by creation time (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  // Auto refresh effect
  useEffect(() => {
    fetchOrders();
    
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchOrders();
        fetchNotifications();
      }, 10000); // Refresh every 10 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, fetchOrders, fetchNotifications]);

  return {
    orders,
    filteredOrders,
    notifications,
    newOrdersCount,
    loading,
    error,
    autoRefresh,
    soundEnabled,
    lastUpdated,
    
    // Actions
    fetchOrders,
    updateOrderStatus,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleAutoRefresh,
    toggleSound,
    searchOrders,
    filterByStatus
  };
};

export default useProfessionalOrderManagement;
