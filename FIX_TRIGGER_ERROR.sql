-- Fix Trigger Already Exists Error
-- Run this SQL in your Supabase SQL Editor to fix the trigger error

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;

-- Create or replace the function (safe - will update if exists)
CREATE OR REPLACE FUNCTION update_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger (now safe since we dropped it first)
CREATE TRIGGER update_promotions_updated_at
BEFORE UPDATE ON promotions
FOR EACH ROW
EXECUTE FUNCTION update_promotions_updated_at();

-- Verify trigger was created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'promotions';

-- Success message
SELECT 'Trigger fixed successfully! ✅' as message;

