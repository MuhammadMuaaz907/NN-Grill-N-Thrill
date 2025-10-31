-- Enhanced Database Schema for NN Restaurant
-- Run this SQL in your Supabase SQL Editor after the initial setup

-- Add Cloudinary support to existing tables
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS cloudinary_url TEXT;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS image_optimized BOOLEAN DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS cloudinary_url TEXT;

-- Create user profiles table for Supabase Auth integration
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  area TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer orders table (linked to authenticated users)
CREATE TABLE IF NOT EXISTS customer_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
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

-- Create restaurant settings table
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promotional content table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  cloudinary_url TEXT,
  discount_percentage INTEGER,
  discount_amount INTEGER,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carousel items table (for dynamic hero section)
CREATE TABLE IF NOT EXISTS carousel_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  cloudinary_url TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table for business intelligence
CREATE TABLE IF NOT EXISTS daily_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  total_orders INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0,
  popular_items JSONB DEFAULT '[]',
  customer_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_customer_orders_user_id ON customer_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_status ON customer_orders(status);
CREATE INDEX IF NOT EXISTS idx_customer_orders_created_at ON customer_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);
CREATE INDEX IF NOT EXISTS idx_carousel_items_active ON carousel_items(active);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- User profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Customer orders: Users can only access their own orders
CREATE POLICY "Users can view own orders" ON customer_orders
  FOR SELECT USING (auth.uid() = user_id);

-- Public read access for promotional content
CREATE POLICY "Public can view active promotions" ON promotions
  FOR SELECT USING (active = true);

CREATE POLICY "Public can view active carousel items" ON carousel_items
  FOR SELECT USING (active = true);

-- Admin access for all tables
CREATE POLICY "Admins can manage all data" ON user_profiles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all data" ON customer_orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all data" ON restaurant_settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all data" ON promotions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all data" ON carousel_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all data" ON daily_analytics
  FOR ALL USING (auth.role() = 'authenticated');

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_orders_updated_at BEFORE UPDATE ON customer_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_settings_updated_at BEFORE UPDATE ON restaurant_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carousel_items_updated_at BEFORE UPDATE ON carousel_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default restaurant settings
INSERT INTO restaurant_settings (setting_key, setting_value, description) VALUES
('restaurant_name', '"NN Restaurant"', 'Restaurant name'),
('restaurant_phone', '"0325 3652040"', 'Restaurant phone number'),
('restaurant_address', '"Gadap Town, Karachi"', 'Restaurant address'),
('delivery_fee', '160', 'Default delivery fee in PKR'),
('tax_rate', '15', 'Tax rate percentage'),
('business_hours', '{"open": "08:00", "close": "23:00"}', 'Business hours'),
('delivery_areas', '["Clifton", "DHA", "Gulshan", "Defence"]', 'Delivery areas');

-- Insert sample carousel items
INSERT INTO carousel_items (title, description, image_url, sort_order, active) VALUES
('Where Flavor', 'Meets Happiness', '/hero-image.jpg', 1, true),
('Premium Breakfast', 'Start Your Day Right', '/hero-image.jpg', 2, true),
('Fresh Salads', 'Healthy & Delicious', '/hero-image.jpg', 3, true);

-- Insert sample promotion
INSERT INTO promotions (title, description, discount_percentage, valid_from, valid_until, active) VALUES
('Welcome Offer', 'Get 10% off on your first order', 10, NOW(), NOW() + INTERVAL '30 days', true);
