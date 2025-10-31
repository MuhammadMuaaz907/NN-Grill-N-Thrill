'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { ImageUpload } from '@/components/ImageUpload';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  Eye,
  EyeOff,
  Save,
  X,
  Tag,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  cloudinary_url?: string;
  discount_percentage?: number;
  discount_amount?: number;
  valid_from: string;
  valid_until: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    discount_amount: '',
    valid_from: '',
    valid_until: '',
    active: true,
    image_url: '',
    cloudinary_url: ''
  });

  // Fetch promotions
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        // In real implementation, fetch from API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockPromotions: Promotion[] = [
          {
            id: '1',
            title: 'Welcome Offer',
            description: 'Get 10% off on your first order',
            discount_percentage: 10,
            valid_from: new Date().toISOString(),
            valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Weekend Special',
            description: 'Flat Rs. 200 off on orders above Rs. 1000',
            discount_amount: 200,
            valid_from: new Date().toISOString(),
            valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Happy Hour',
            description: '20% off on all breakfast items',
            discount_percentage: 20,
            valid_from: new Date().toISOString(),
            valid_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            active: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        setPromotions(mockPromotions);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Filter promotions
  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && promotion.active) ||
                         (statusFilter === 'inactive' && !promotion.active) ||
                         (statusFilter === 'expired' && new Date(promotion.valid_until) < new Date());
    return matchesSearch && matchesStatus;
  });

  const handleAddPromotion = async () => {
    try {
      // In real implementation, call API
      const newPromotion: Promotion = {
        id: Date.now().toString(),
        ...formData,
        discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : undefined,
        discount_amount: formData.discount_amount ? parseInt(formData.discount_amount) : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setPromotions([...promotions, newPromotion]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding promotion:', error);
      alert('Error adding promotion');
    }
  };

  const handleUpdatePromotion = async () => {
    if (!editingPromotion) return;

    try {
      // In real implementation, call API
      const updatedPromotion: Promotion = {
        ...editingPromotion,
        ...formData,
        discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : undefined,
        discount_amount: formData.discount_amount ? parseInt(formData.discount_amount) : undefined,
        updated_at: new Date().toISOString()
      };
      
      setPromotions(promotions.map(p => 
        p.id === editingPromotion.id ? updatedPromotion : p
      ));
      setEditingPromotion(null);
      resetForm();
    } catch (error) {
      console.error('Error updating promotion:', error);
      alert('Error updating promotion');
    }
  };

  const handleDeletePromotion = async (promotionId: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      setPromotions(promotions.filter(p => p.id !== promotionId));
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('Error deleting promotion');
    }
  };

  const handleToggleStatus = async (promotion: Promotion) => {
    try {
      const updatedPromotion = { ...promotion, active: !promotion.active, updated_at: new Date().toISOString() };
      setPromotions(promotions.map(p => 
        p.id === promotion.id ? updatedPromotion : p
      ));
    } catch (error) {
      console.error('Error updating promotion status:', error);
      alert('Error updating promotion status');
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      discount_percentage: promotion.discount_percentage?.toString() || '',
      discount_amount: promotion.discount_amount?.toString() || '',
      valid_from: promotion.valid_from.split('T')[0],
      valid_until: promotion.valid_until.split('T')[0],
      active: promotion.active,
      image_url: promotion.image_url || '',
      cloudinary_url: promotion.cloudinary_url || ''
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount_percentage: '',
      discount_amount: '',
      valid_from: '',
      valid_until: '',
      active: true,
      image_url: '',
      cloudinary_url: ''
    });
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, cloudinary_url: url });
  };

  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date();
    const validFrom = new Date(promotion.valid_from);
    const validUntil = new Date(promotion.valid_until);
    
    if (!promotion.active) return { status: 'inactive', color: 'bg-gray-100 text-gray-800' };
    if (now < validFrom) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
    if (now > validUntil) return { status: 'expired', color: 'bg-red-100 text-red-800' };
    return { status: 'active', color: 'bg-green-100 text-green-800' };
  };

  const getDaysRemaining = (validUntil: string) => {
    const now = new Date();
    const until = new Date(validUntil);
    const diffTime = until.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Promotions Management</h1>
            <p className="text-gray-600 mt-1">Create and manage promotional campaigns and discounts</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Create Promotion
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                <Tag size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promotions.filter(p => getPromotionStatus(p).status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Promotions</p>
                <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <Clock size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promotions.filter(p => {
                    const days = getDaysRemaining(p.valid_until);
                    return days <= 7 && days > 0 && p.active;
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Discount</p>
                <p className="text-2xl font-bold text-gray-900">15%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  <option value="all">All Promotions</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promotion) => {
            const status = getPromotionStatus(promotion);
            const daysRemaining = getDaysRemaining(promotion.valid_until);
            
            return (
              <div key={promotion.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Promotion Image */}
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                  {promotion.cloudinary_url || promotion.image_url ? (
                    <img
                      src={promotion.cloudinary_url || promotion.image_url}
                      alt={promotion.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag size={48} className="text-pink-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                      {status.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Active Toggle */}
                  <button
                    onClick={() => handleToggleStatus(promotion)}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all ${
                      promotion.active 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                    title={promotion.active ? 'Deactivate' : 'Activate'}
                  >
                    {promotion.active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                {/* Promotion Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{promotion.title}</h3>
                    <div className="text-right">
                      {promotion.discount_percentage ? (
                        <span className="text-2xl font-bold text-pink-600">
                          {promotion.discount_percentage}%
                        </span>
                      ) : (
                        <span className="text-2xl font-bold text-pink-600">
                          Rs. {promotion.discount_amount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{promotion.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>Valid: {new Date(promotion.valid_from).toLocaleDateString()} - {new Date(promotion.valid_until).toLocaleDateString()}</span>
                    </div>
                    {status.status === 'active' && daysRemaining > 0 && (
                      <div className="flex items-center gap-2 text-xs text-orange-600">
                        <Clock size={12} />
                        <span>{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPromotion(promotion)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(promotion.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No promotions found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by creating your first promotion'}
            </p>
            {(!searchQuery && statusFilter === 'all') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl mx-auto"
              >
                <Plus size={20} />
                Create Promotion
              </button>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || editingPromotion) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingPromotion ? 'Edit Promotion' : 'Create Promotion'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingPromotion(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Promotion Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promotion Image
                  </label>
                  <ImageUpload
                    onUpload={handleImageUpload}
                    currentImage={formData.cloudinary_url}
                    folder="nn-restaurant/promotions"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                    placeholder="Enter promotion title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                    placeholder="Enter promotion description"
                    required
                  />
                </div>

                {/* Discount Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Percentage
                    </label>
                    <div className="relative">
                      <Percent size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={formData.discount_percentage}
                        onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Amount (PKR)
                    </label>
                    <div className="relative">
                      <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={formData.discount_amount}
                        onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid From *
                    </label>
                    <input
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid Until *
                    </label>
                    <input
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">
                    Active promotion
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPromotion(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingPromotion ? handleUpdatePromotion : handleAddPromotion}
                  className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Save size={20} />
                  {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
