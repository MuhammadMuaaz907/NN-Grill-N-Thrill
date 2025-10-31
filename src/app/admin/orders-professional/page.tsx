'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProfessionalNotificationSystem from '@/components/ProfessionalNotificationSystem';
import useProfessionalOrderManagement from '@/hooks/useProfessionalOrderManagement';
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
  Calendar,
  Timer,
  AlertCircle,
  CheckCircle2,
  X,
  Star,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function ProfessionalOrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    orders,
    filteredOrders,
    notifications,
    newOrdersCount,
    loading,
    error,
    autoRefresh,
    soundEnabled,
    lastUpdated,
    fetchOrders,
    updateOrderStatus,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleAutoRefresh,
    toggleSound,
    searchOrders,
    filterByStatus
  } = useProfessionalOrderManagement();

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    searchOrders(query);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterByStatus(status);
  };

  // Get status color
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

  // Get status icon
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
        return <AlertCircle size={16} />;
    }
  };

  // Get priority indicator
  const getPriorityIndicator = (order: any) => {
    if (!order.is_new) return null;
    
    const minutesAgo = Math.floor((Date.now() - new Date(order.created_at).getTime()) / (1000 * 60));
    
    if (minutesAgo < 5) {
      return (
        <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
          <Zap size={12} />
          URGENT
        </div>
      );
    } else if (minutesAgo < 15) {
      return (
        <div className="flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          <Star size={12} />
          NEW
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
        <TrendingUp size={12} />
        NEW
      </div>
    );
  };

  // Get status options for workflow
  const getStatusOptions = (currentStatus: string) => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow.slice(currentIndex + 1);
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get time ago
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Professional Notifications */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Professional Order Management</h1>
            <p className="text-gray-600 mt-1">Real-time order tracking with professional notifications</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Professional Notification System */}
            <ProfessionalNotificationSystem
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
              soundEnabled={soundEnabled}
              onToggleSound={toggleSound}
            />
            
            {/* Auto-refresh toggle */}
            <button
              onClick={toggleAutoRefresh}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {autoRefresh ? <Bell size={16} /> : <BellOff size={16} />}
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
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

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Error:</span>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

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
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
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
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  {newOrdersCount} new order{newOrdersCount > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.order_id.substring(0, 12)}...
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)} at {formatTime(order.created_at)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px- comenzó py-1 rounded-full">
                        {getTimeAgo(order.created_at)}
                      </span>
                      {getPriorityIndicator(order)}
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
                          onClick={() => updateOrderStatus(order.id, status as any)}
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
            ))}
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
                    {(selectedOrder.order_items || []).map((item: any, index: number) => (
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
                          updateOrderStatus(selectedOrder.id, status as any);
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
    </AdminLayout>
  );
}
