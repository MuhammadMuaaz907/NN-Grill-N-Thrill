'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingBag, 
  Users, 
  Clock,
  Star,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  customers: {
    total: number;
    newThisWeek: number;
    growth: number;
  };
  popularItems: Array<{
    name: string;
    orders: number;
    revenue: number;
    growth: number;
  }>;
  hourlyStats: Array<{
    hour: number;
    orders: number;
    revenue: number;
  }>;
  categoryStats: Array<{
    category: string;
    orders: number;
    revenue: number;
    percentage: number;
  }>;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Simulate API call - in real implementation, this would fetch from your analytics API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockData: AnalyticsData = {
          revenue: {
            total: 125000,
            today: 8500,
            thisWeek: 45000,
            thisMonth: 125000,
            growth: 12.5
          },
          orders: {
            total: 1250,
            today: 85,
            thisWeek: 450,
            thisMonth: 1250,
            growth: 8.3
          },
          customers: {
            total: 850,
            newThisWeek: 45,
            growth: 15.2
          },
          popularItems: [
            { name: 'Spicy Honey Glazed Chicken on Waffle', orders: 125, revenue: 193625, growth: 15.2 },
            { name: 'Parmesan Chicken', orders: 98, revenue: 211288, growth: 8.7 },
            { name: 'Classic Belgian Waffles', orders: 87, revenue: 82650, growth: 12.1 },
            { name: 'Chocolate Chip Pancakes', orders: 76, revenue: 83600, growth: 5.4 },
            { name: 'Margherita Pizza', orders: 65, revenue: 117000, growth: 18.9 }
          ],
          hourlyStats: [
            { hour: 8, orders: 12, revenue: 15600 },
            { hour: 9, orders: 18, revenue: 23400 },
            { hour: 10, orders: 25, revenue: 32500 },
            { hour: 11, orders: 32, revenue: 41600 },
            { hour: 12, orders: 45, revenue: 58500 },
            { hour: 13, orders: 38, revenue: 49400 },
            { hour: 14, orders: 28, revenue: 36400 },
            { hour: 15, orders: 22, revenue: 28600 },
            { hour: 16, orders: 19, revenue: 24700 },
            { hour: 17, orders: 35, revenue: 45500 },
            { hour: 18, orders: 42, revenue: 54600 },
            { hour: 19, orders: 38, revenue: 49400 },
            { hour: 20, orders: 25, revenue: 32500 },
            { hour: 21, orders: 15, revenue: 19500 }
          ],
          categoryStats: [
            { category: 'Breakfast & Waffles', orders: 325, revenue: 385000, percentage: 35 },
            { category: 'Small Plates', orders: 280, revenue: 420000, percentage: 30 },
            { category: 'Pizza', orders: 195, revenue: 351000, percentage: 20 },
            { category: 'Salads', orders: 145, revenue: 174000, percentage: 10 },
            { category: 'Other', orders: 95, revenue: 114000, percentage: 5 }
          ]
        };
        
        setAnalytics(mockData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? (
      <TrendingUp size={16} className="text-green-600" />
    ) : (
      <TrendingDown size={16} className="text-red-600" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
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

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No analytics data available</h3>
          <p className="text-gray-600">Analytics data will appear here once you start receiving orders.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Business intelligence and performance insights</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === '7d' ? 'bg-pink-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === '30d' ? 'bg-pink-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === '90d' ? 'bg-pink-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                90D
              </button>
            </div>
            <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                <DollarSign size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1">
                {getGrowthIcon(analytics.revenue.growth)}
                <span className={`text-sm font-semibold ${getGrowthColor(analytics.revenue.growth)}`}>
                  +{analytics.revenue.growth}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {analytics.revenue.total.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1">
                {getGrowthIcon(analytics.orders.growth)}
                <span className={`text-sm font-semibold ${getGrowthColor(analytics.orders.growth)}`}>
                  +{analytics.orders.growth}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.orders.total.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1">
                {getGrowthIcon(analytics.customers.growth)}
                <span className={`text-sm font-semibold ${getGrowthColor(analytics.customers.growth)}`}>
                  +{analytics.customers.growth}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.customers.total.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">+{analytics.customers.newThisWeek} this week</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <Clock size={24} className="text-white" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-600">
                  Avg
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {Math.round(analytics.revenue.total / analytics.orders.total).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Per order</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <BarChart3 size={20} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.hourlyStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 w-12">{stat.hour}:00</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full"
                        style={{ width: `${(stat.revenue / Math.max(...analytics.hourlyStats.map(s => s.revenue))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                    Rs. {(stat.revenue / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
              <PieChart size={20} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: [
                          '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'
                        ][index % 5]
                      }}
                    ></div>
                    <span className="text-sm text-gray-900 font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{category.percentage}%</span>
                    <span className="text-sm font-semibold text-gray-900">
                      Rs. {(category.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Popular Items</h3>
            <Star size={20} className="text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {analytics.popularItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.orders}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                      Rs. {item.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {getGrowthIcon(item.growth)}
                        <span className={`text-sm font-semibold ${getGrowthColor(item.growth)}`}>
                          +{item.growth}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
