-- Professional Order Management Enhancement
-- Run this SQL in your Supabase SQL Editor

-- Add professional order tracking columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT true;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_seen BOOLEAN DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS last_notified_at TIMESTAMP WITH TIME ZONE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_is_new ON orders(is_new);
CREATE INDEX IF NOT EXISTS idx_orders_admin_seen ON orders(admin_seen);
CREATE INDEX IF NOT EXISTS idx_orders_priority ON orders(priority);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at);

-- Update existing orders to have proper flags
UPDATE orders SET 
  is_new = true,
  admin_seen = false,
  priority = CASE 
    WHEN (totals->>'grand_total')::integer > 5000 THEN 'high'
    WHEN (totals->>'grand_total')::integer > 2000 THEN 'normal'
    ELSE 'low'
  END
WHERE is_new IS NULL;

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  sound_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT false,
  sms_enabled BOOLEAN DEFAULT false,
  high_priority_only BOOLEAN DEFAULT false,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default notification preferences for admin
INSERT INTO notification_preferences (admin_id, sound_enabled, email_enabled, sms_enabled)
SELECT id, true, false, false 
FROM admin_users 
WHERE username = 'admin'
ON CONFLICT DO NOTHING;

-- Create function to automatically set order priority based on amount
CREATE OR REPLACE FUNCTION set_order_priority()
RETURNS TRIGGER AS $$
BEGIN
  -- Set priority based on order amount
  IF (NEW.totals->>'grand_total')::integer > 5000 THEN
    NEW.priority := 'high';
  ELSIF (NEW.totals->>'grand_total')::integer > 2000 THEN
    NEW.priority := 'normal';
  ELSE
    NEW.priority := 'low';
  END IF;
  
  -- Set as new order when created
  NEW.is_new := true;
  NEW.admin_seen := false;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set priority and new flags
DROP TRIGGER IF EXISTS trigger_set_order_priority ON orders;
CREATE TRIGGER trigger_set_order_priority
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_priority();

-- Create function to mark order as seen by admin
CREATE OR REPLACE FUNCTION mark_order_seen(order_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE orders 
  SET admin_seen = true, is_new = false
  WHERE id = order_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark all new orders as seen
CREATE OR REPLACE FUNCTION mark_all_new_orders_seen()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE orders 
  SET admin_seen = true, is_new = false
  WHERE is_new = true;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Create view for new orders dashboard
CREATE OR REPLACE VIEW new_orders_view AS
SELECT 
  o.*,
  EXTRACT(EPOCH FROM (NOW() - o.created_at)) / 60 as minutes_ago,
  CASE 
    WHEN EXTRACT(EPOCH FROM (NOW() - o.created_at)) / 60 < 5 THEN 'urgent'
    WHEN EXTRACT(EPOCH FROM (NOW() - o.created_at)) / 60 < 15 THEN 'high'
    ELSE o.priority
  END as effective_priority
FROM orders o
WHERE o.is_new = true
ORDER BY o.created_at DESC;

-- Grant permissions
GRANT SELECT ON new_orders_view TO authenticated;
GRANT EXECUTE ON FUNCTION mark_order_seen(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_new_orders_seen() TO authenticated;
