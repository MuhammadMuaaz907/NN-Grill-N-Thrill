-- NN Restaurant Database Setup for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents (e.g., 1553 = Rs. 15.53)
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- In production, use bcrypt
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'staff')),
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  customer_info JSONB NOT NULL,
  order_items JSONB NOT NULL,
  totals JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered')),
  estimated_delivery TIMESTAMP WITH TIME ZONE NOT NULL,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Create Storage Bucket for Images
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true);

-- Row Level Security Policies

-- Orders: Allow all operations for authenticated users (admin)
CREATE POLICY "Allow all operations for authenticated users" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Menu Items: Allow read for all, write for authenticated users
CREATE POLICY "Allow read for all" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Allow write for authenticated users" ON menu_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Categories: Allow read for all, write for authenticated users
CREATE POLICY "Allow read for all" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow write for authenticated users" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Admin Users: Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert Sample Data

-- Sample Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Eggs', 'eggs', 'Freshly cooked egg dishes', 1),
('Breakfast & Waffles', 'breakfast-waffles', 'Golden crispy waffles and fluffy pancakes', 2),
('Breakfast Sharing', 'breakfast-sharing', 'Perfect for sharing with loved ones', 3),
('Small Plates', 'small-plates', 'Delicious appetizers and starters', 4),
('Salads', 'salad', 'Fresh and healthy salad options', 5),
('Tacos', 'tacos', 'Authentic Mexican flavors', 6),
('Pizza', 'pizza', 'Wood-fired pizzas with premium toppings', 7),
('Sandwiches', 'sandwiches', 'Gourmet sandwiches and burgers', 8);

-- Sample Menu Items
INSERT INTO menu_items (category_id, name, description, price, available) VALUES
((SELECT id FROM categories WHERE slug = 'breakfast-waffles'), 'Spicy Honey Glazed Chicken on Waffle', 'Crispy waffle topped with spiced honey glazed chicken, served with berry compote', 1553, true),
((SELECT id FROM categories WHERE slug = 'small-plates'), 'Parmesan Chicken', 'Golden crispy chicken breast coated with fresh parmesan and herbs', 2156, true),
((SELECT id FROM categories WHERE slug = 'eggs'), 'Scrambled Eggs with Toast', 'Fluffy scrambled eggs served with buttered toast', 850, true),
((SELECT id FROM categories WHERE slug = 'eggs'), 'Eggs Benedict', 'Poached eggs on English muffin with hollandaise sauce', 1200, true),
((SELECT id FROM categories WHERE slug = 'breakfast-waffles'), 'Classic Belgian Waffles', 'Fluffy Belgian waffles with maple syrup and whipped cream', 950, true),
((SELECT id FROM categories WHERE slug = 'breakfast-waffles'), 'Chocolate Chip Pancakes', 'Soft pancakes filled with chocolate chips, topped with berries', 1100, true),
((SELECT id FROM categories WHERE slug = 'pizza'), 'Margherita Pizza', 'Classic tomato, mozzarella, and basil pizza', 1800, true),
((SELECT id FROM categories WHERE slug = 'salad'), 'Caesar Salad', 'Fresh romaine lettuce with Caesar dressing and croutons', 1200, true);

-- Sample Admin User (password: admin123)
INSERT INTO admin_users (username, email, password_hash, role) VALUES
('admin', 'admin@nnrestaurant.com', 'admin123', 'admin');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
