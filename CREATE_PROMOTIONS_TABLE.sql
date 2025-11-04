-- Create Promotions Table for NN Restaurant
-- Run this SQL in your Supabase SQL Editor

-- Create promotional content table if it doesn't exist
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);
CREATE INDEX IF NOT EXISTS idx_promotions_valid_dates ON promotions(valid_from, valid_until);

-- Enable Row Level Security (optional - adjust based on your needs)
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for active promotions)
CREATE POLICY "Allow public read access to active promotions" 
ON promotions FOR SELECT 
USING (active = true AND valid_from <= NOW() AND valid_until >= NOW());

-- Allow public read access to all promotions (for admin panel)
CREATE POLICY "Allow public read all promotions" 
ON promotions FOR SELECT 
USING (true);

-- Allow INSERT operations (admin operations are handled via API authentication)
CREATE POLICY "Allow insert promotions" 
ON promotions FOR INSERT 
WITH CHECK (true);

-- Allow UPDATE operations (admin operations are handled via API authentication)
CREATE POLICY "Allow update promotions" 
ON promotions FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow DELETE operations (admin operations are handled via API authentication)
CREATE POLICY "Allow delete promotions" 
ON promotions FOR DELETE 
USING (true);

-- Create trigger function for updated_at (will replace if exists)
CREATE OR REPLACE FUNCTION update_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists, then create it
DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;
CREATE TRIGGER update_promotions_updated_at
BEFORE UPDATE ON promotions
FOR EACH ROW
EXECUTE FUNCTION update_promotions_updated_at();

-- Insert sample promotion (optional - for testing)
-- INSERT INTO promotions (title, description, discount_percentage, valid_from, valid_until, active) 
-- VALUES (
--   'Welcome Offer',
--   'Get 10% off on your first order',
--   10,
--   NOW(),
--   NOW() + INTERVAL '30 days',
--   true
-- );

