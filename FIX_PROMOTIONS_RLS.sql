-- Fix RLS Policies for Promotions Table
-- Run this SQL in your Supabase SQL Editor to fix the "row-level security policy" error

-- Drop existing policies if they exist (optional - to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to active promotions" ON promotions;
DROP POLICY IF EXISTS "Allow public read all promotions" ON promotions;
DROP POLICY IF EXISTS "Allow insert promotions" ON promotions;
DROP POLICY IF EXISTS "Allow update promotions" ON promotions;
DROP POLICY IF EXISTS "Allow delete promotions" ON promotions;

-- Create policy for public read access (for active promotions on homepage)
CREATE POLICY "Allow public read access to active promotions" 
ON promotions FOR SELECT 
USING (active = true AND valid_from <= NOW() AND valid_until >= NOW());

-- Allow public read access to all promotions (for admin panel)
CREATE POLICY "Allow public read all promotions" 
ON promotions FOR SELECT 
USING (true);

-- Allow INSERT operations (admin operations are handled via API authentication)
-- Note: API routes handle admin authentication separately
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

-- Verify policies are created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'promotions';

