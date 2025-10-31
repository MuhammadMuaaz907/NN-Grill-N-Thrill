// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          order_id: string
          customer_info: {
            title: string
            full_name: string
            mobile: string
            alternate_mobile?: string
            address: string
            landmark: string
            email: string
            area: string
            instructions?: string
            change_request?: number
          }
          order_items: {
            name: string
            quantity: number
            price: number
          }[]
          totals: {
            subtotal: number
            tax: number
            delivery_fee: number
            grand_total: number
          }
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered'
          created_at: string
          updated_at: string
          estimated_delivery: string
          admin_notes?: string
          is_new?: boolean
          admin_seen?: boolean
          priority?: 'low' | 'normal' | 'high' | 'urgent'
        }
        Insert: {
          id?: string
          order_id: string
          customer_info: any
          order_items: any[]
          totals: any
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered'
          created_at?: string
          updated_at?: string
          estimated_delivery: string
          admin_notes?: string
          is_new?: boolean
          admin_seen?: boolean
          priority?: 'low' | 'normal' | 'high' | 'urgent'
        }
        Update: {
          id?: string
          order_id?: string
          customer_info?: any
          order_items?: any[]
          totals?: any
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered'
          created_at?: string
          updated_at?: string
          estimated_delivery?: string
          admin_notes?: string
          is_new?: boolean
          admin_seen?: boolean
          priority?: 'low' | 'normal' | 'high' | 'urgent'
        }
      }
      menu_items: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string
          price: number
          image_url?: string
          cloudinary_url?: string
          image_optimized?: boolean
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description: string
          price: number
          image_url?: string
          cloudinary_url?: string
          image_optimized?: boolean
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          cloudinary_url?: string
          image_optimized?: boolean
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description?: string
          image_url?: string
          cloudinary_url?: string
          sort_order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          image_url?: string
          cloudinary_url?: string
          sort_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          image_url?: string
          cloudinary_url?: string
          sort_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          role: 'admin' | 'manager' | 'staff'
          active: boolean
          last_login?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          role?: 'admin' | 'manager' | 'staff'
          active?: boolean
          last_login?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          role?: 'admin' | 'manager' | 'staff'
          active?: boolean
          last_login?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
