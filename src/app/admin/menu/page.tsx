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
  Eye,
  EyeOff,
  Upload,
  Save,
  X,
  ChevronDown,
  DollarSign
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  cloudinary_url?: string;
  available: boolean;
  category_id: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    available: true,
    image_url: '',
    cloudinary_url: ''
  });
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  // Fetch menu items and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch menu items
        const menuResponse = await fetch('/api/menu');
        const menuResult = await menuResponse.json();
        
        if (menuResult.success) {
          setMenuItems(menuResult.data.menuItems || []);
          setCategories(menuResult.data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = async () => {
    try {
      const response = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setMenuItems([...menuItems, result.data]);
        setShowAddModal(false);
        resetForm();
      } else {
        alert('Error adding menu item: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Error adding menu item');
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/admin/menu/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setMenuItems(menuItems.map(item => 
          item.id === editingItem.id ? result.data : item
        ));
        setEditingItem(null);
        resetForm();
      } else {
        alert('Error updating menu item: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('Error updating menu item');
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`/api/admin/menu/${deleteTarget.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        setMenuItems(prev => prev.filter(item => item.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        alert('Error deleting menu item: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Error deleting menu item');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const response = await fetch(`/api/admin/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !item.available })
      });

      const result = await response.json();
      
      if (result.success) {
        setMenuItems(menuItems.map(menuItem => 
          menuItem.id === item.id ? { ...menuItem, available: !menuItem.available } : menuItem
        ));
      } else {
        alert('Error updating availability: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Error updating availability');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category_id: item.category_id,
      available: item.available,
      image_url: item.image_url || '',
      cloudinary_url: item.cloudinary_url || ''
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      available: true,
      image_url: '',
      cloudinary_url: ''
    });
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, cloudinary_url: url });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600 mt-1">Manage your restaurant menu items and categories</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Add Menu Item
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Item Image */}
              <div className="relative h-48 bg-gray-100">
                {item.cloudinary_url || item.image_url ? (
                  <img
                    src={item.cloudinary_url || item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Upload size={48} />
                  </div>
                )}
                
                {/* Availability Toggle */}
                <button
                  onClick={() => handleToggleAvailability(item)}
                  className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all ${
                    item.available 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  title={item.available ? 'Mark as unavailable' : 'Mark as available'}
                >
                  {item.available ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              {/* Item Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                  <span className="text-lg font-bold text-pink-600">
                    Rs. {item.price.toLocaleString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {getCategoryName(item.category_id)}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No menu items found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by adding your first menu item'}
            </p>
            {(!searchQuery && selectedCategory === 'all') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl mx-auto"
              >
                <Plus size={20} />
                Add Menu Item
              </button>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || editingItem) && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 max-h-[60vh] overflow-y-auto pr-1">
                  {/* Item Image Upload */}
                  <div className="lg:w-1/2 flex-shrink-0">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Image
                    </label>
                    <div className="rounded-xl border border-dashed border-gray-200 p-4 h-full flex items-center justify-center bg-gray-50">
                      <ImageUpload
                        onUpload={handleImageUpload}
                        currentImage={formData.cloudinary_url}
                        folder="nn-restaurant/menu"
                      />
                    </div>
                  </div>

                  <div className="flex-1 space-y-5">
                    {/* Item Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                        placeholder="Enter item name"
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
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                        placeholder="Enter item description"
                        required
                      />
                    </div>

                    {/* Price and Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (PKR) *
                        </label>
                        <div className="relative">
                          <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          value={formData.category_id}
                          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="available"
                        checked={formData.available}
                        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                        className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <label htmlFor="available" className="text-sm font-medium text-gray-700">
                        Available for order
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Save size={20} />
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        )}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Menu Item</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-900">
                      {deleteTarget.name}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteItem}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
