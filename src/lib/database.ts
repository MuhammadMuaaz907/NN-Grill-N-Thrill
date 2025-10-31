// src/lib/database.ts
import { supabase } from './supabase'
import { Database } from './supabase'

// Type definitions
type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']

type MenuItem = Database['public']['Tables']['menu_items']['Row']
type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert']
type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update']

type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

type AdminUser = Database['public']['Tables']['admin_users']['Row']
type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert']
type AdminUserUpdate = Database['public']['Tables']['admin_users']['Update']

// Order Operations
export const orderService = {
  // Create new order
  async createOrder(orderData: OrderInsert): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        is_new: true,
        admin_seen: false,
        priority: this.calculateOrderPriority(orderData.totals?.grand_total || 0)
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Calculate order priority based on amount
  calculateOrderPriority(amount: number): 'low' | 'normal' | 'high' | 'urgent' {
    if (amount > 5000) return 'high'
    if (amount > 2000) return 'normal'
    return 'low'
  },

  // Get new orders (unseen by admin)
  async getNewOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('is_new', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Mark order as seen by admin
  async markOrderSeen(orderId: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ 
        admin_seen: true, 
        is_new: false 
      })
      .eq('id', orderId)

    if (error) throw error
  },

  // Mark all new orders as seen
  async markAllNewOrdersSeen(): Promise<number> {
    const { data, error } = await supabase
      .rpc('mark_all_new_orders_seen')

    if (error) throw error
    return data || 0
  },

  // Get orders by priority
  async getOrdersByPriority(priority: 'low' | 'normal' | 'high' | 'urgent'): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('priority', priority)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get new orders count
  async getNewOrdersCount(): Promise<number> {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('is_new', true)

    if (error) throw error
    return count || 0
  },

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get orders created after a specific timestamp
  async getOrdersAfter(timestamp: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .gt('created_at', timestamp)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get order by ID
  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Update order status
  async updateOrderStatus(id: string, status: OrderUpdate['status'], adminNotes?: string): Promise<Order> {
    try {
      // When admin updates status, mark order as seen and remove new flag
      const updateData: OrderUpdate = {
        status,
        updated_at: new Date().toISOString(),
        is_new: false,  // Mark as not new anymore
        admin_seen: true,  // Mark as seen by admin
        ...(adminNotes && { admin_notes: adminNotes })
      }

      console.log(`🔄 Updating order ${id}: is_new=false, admin_seen=true`);
      console.log(`📝 Update Data:`, JSON.stringify(updateData, null, 2));

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase Error:', error);
        throw new Error(error.message || 'Database update failed')
      }
      
      if (!data) {
        throw new Error('No data returned from database update')
      }
      
      console.log(`✅ Order ${id} updated successfully`);
      return data
    } catch (error) {
      console.error('❌ Error in updateOrderStatus:', error);
      throw error
    }
  },

  // Get orders by status
  async getOrdersByStatus(status: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Search orders
  async searchOrders(query: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`order_id.ilike.%${query}%,customer_info->>full_name.ilike.%${query}%,customer_info->>mobile.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Delete order
  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Menu Item Operations
export const menuService = {
  // Get all menu items
  async getAllMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get menu items by category
  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .eq('available', true)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Create menu item
  async createMenuItem(itemData: MenuItemInsert): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(itemData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update menu item
  async updateMenuItem(id: string, itemData: MenuItemUpdate): Promise<MenuItem> {
    const updateData = {
      ...itemData,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete menu item
  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get menu item by ID
  async getMenuItemById(id: string): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }
}

// Category Operations
export const categoryService = {
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Create category
  async createCategory(categoryData: CategoryInsert): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update category
  async updateCategory(id: string, categoryData: CategoryUpdate): Promise<Category> {
    const updateData = {
      ...categoryData,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Admin User Operations
export const adminService = {
  // Authenticate admin user
  async authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('active', true)
      .single()

    if (error || !data) return null

    // In production, use proper password hashing (bcrypt)
    // For now, we'll use simple comparison (NOT SECURE FOR PRODUCTION)
    if (data.password_hash === password) {
      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id)

      return data
    }

    return null
  },

  // Create admin user
  async createAdminUser(userData: AdminUserInsert): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .insert(userData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get admin user by ID
  async getAdminUserById(id: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  },

  // Get admin user by username
  async getAdminUserByUsername(username: string): Promise<{ data: AdminUser | null; error: any }> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('active', true)
      .single()

    return { data, error }
  },

  // Update admin last login
  async updateAdminLastLogin(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', id)

    if (error) console.error('Error updating last login:', error)
  },

  // Update admin password
  async updateAdminPassword(id: string, passwordHash: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .update({ 
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  }
}

// File Upload Operations
export const fileService = {
  // Upload image to Supabase Storage
  async uploadImage(file: File, bucket: string = 'menu-images'): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `menu/${fileName}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (error) throw error

    // Get public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  // Delete image from Supabase Storage
  async deleteImage(filePath: string, bucket: string = 'menu-images'): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) throw error
  }
}
