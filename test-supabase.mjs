// Test Supabase Connection
// Run this with: node test-supabase.js

import { createClient } from '@supabase/supabase-js';

// You need to replace these with your actual values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ahzbeyyofzzvtaqbnpuu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoemJleXlvZnp6dnRhcWJucHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTY0OTAsImV4cCI6MjA3NjM3MjQ5MH0.4VUgNUqnPoHKkcgG9tFqRUhKBEXY126hOuUKjuXLJMY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('❌ Please update your .env.local file with actual Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Check if categories table exists and has data
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);

    if (categoriesError) {
      console.log('❌ Categories table error:', categoriesError.message);
      return;
    }

    console.log('✅ Categories table working:', categories.length, 'categories found');

    // Test 2: Check if menu_items table exists and has data
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('*')
      .limit(5);

    if (menuError) {
      console.log('❌ Menu items table error:', menuError.message);
      return;
    }

    console.log('✅ Menu items table working:', menuItems.length, 'items found');

    // Test 3: Check if admin_users table exists and has data
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(5);

    if (adminError) {
      console.log('❌ Admin users table error:', adminError.message);
      return;
    }

    console.log('✅ Admin users table working:', adminUsers.length, 'admins found');

    console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.');
    console.log('\n📋 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Visit: http://localhost:3001/admin/login');
    console.log('3. Login with: admin / admin123');

  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env.local file has correct credentials');
    console.log('2. Make sure you ran the database-setup.sql script');
    console.log('3. Verify your Supabase project is active');
  }
}

testConnection();
