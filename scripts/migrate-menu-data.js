// Migration script to move static menu data to Supabase database
// Run this with: node scripts/migrate-menu-data.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ahzbeyyofzzvtaqbnpuu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoemJleXlvZnp6dnRhcWJucHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTY0OTAsImV4cCI6MjA3NjM3MjQ5MH0.4VUgNUqnPoHKkcgG9tFqRUhKBEXY126hOuUKjuXLJMY';

const supabase = createClient(supabaseUrl, supabaseKey);

// Read static data files
const menuDataPath = path.join(__dirname, '../src/lib/menuData.ts');
const dataPath = path.join(__dirname, '../src/lib/data.ts');

async function migrateMenuData() {
  console.log('🚀 Starting menu data migration...');
  
  try {
    // Step 1: Clear existing data
    console.log('🗑️ Clearing existing menu data...');
    
    const { error: deleteItemsError } = await supabase
      .from('menu_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all items
    
    const { error: deleteCategoriesError } = await supabase
      .from('categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all categories
    
    if (deleteItemsError) console.log('⚠️ Error clearing menu items:', deleteItemsError.message);
    if (deleteCategoriesError) console.log('⚠️ Error clearing categories:', deleteCategoriesError.message);
    
    console.log('✅ Existing data cleared');
    
    // Step 2: Insert categories
    console.log('📁 Inserting categories...');
    
    const categories = [
      { name: 'Eggs', slug: 'eggs', description: 'Freshly cooked egg dishes', sort_order: 1 },
      { name: 'Breakfast & Waffles', slug: 'breakfast-waffles', description: 'Golden crispy waffles and fluffy pancakes', sort_order: 2 },
      { name: 'Breakfast Sharing', slug: 'breakfast-sharing', description: 'Perfect for sharing with loved ones', sort_order: 3 },
      { name: 'Small Plates', slug: 'small-plates', description: 'Delicious appetizers and starters', sort_order: 4 },
      { name: 'Salads', slug: 'salad', description: 'Fresh and healthy salad options', sort_order: 5 },
      { name: 'Tacos', slug: 'tacos', description: 'Authentic Mexican flavors', sort_order: 6 },
      { name: 'Pizza', slug: 'pizza', description: 'Wood-fired pizzas with premium toppings', sort_order: 7 },
      { name: 'Sandwiches', slug: 'sandwiches', description: 'Gourmet sandwiches and burgers', sort_order: 8 }
    ];
    
    const { data: insertedCategories, error: categoriesError } = await supabase
      .from('categories')
      .insert(categories)
      .select();
    
    if (categoriesError) {
      console.error('❌ Error inserting categories:', categoriesError);
      return;
    }
    
    console.log(`✅ Inserted ${insertedCategories.length} categories`);
    
    // Step 3: Insert menu items
    console.log('🍽️ Inserting menu items...');
    
    const menuItems = [
      // Eggs
      { category_id: insertedCategories[0].id, name: 'Scrambled Eggs with Toast', description: 'Fluffy scrambled eggs served with buttered toast', price: 850, available: true },
      { category_id: insertedCategories[0].id, name: 'Eggs Benedict', description: 'Poached eggs on English muffin with hollandaise sauce', price: 1200, available: true },
      { category_id: insertedCategories[0].id, name: 'Fried Eggs with Bacon', description: 'Two perfectly fried eggs served with crispy bacon', price: 950, available: true },
      
      // Breakfast & Waffles
      { category_id: insertedCategories[1].id, name: 'Spicy Honey Glazed Chicken on Waffle', description: 'Crispy waffle topped with spiced honey glazed chicken, served with berry compote', price: 1553, available: true },
      { category_id: insertedCategories[1].id, name: 'Classic Belgian Waffles', description: 'Fluffy Belgian waffles with maple syrup and whipped cream', price: 950, available: true },
      { category_id: insertedCategories[1].id, name: 'Chocolate Chip Pancakes', description: 'Soft pancakes filled with chocolate chips, topped with berries', price: 1100, available: true },
      { category_id: insertedCategories[1].id, name: 'Blueberry Pancakes', description: 'Fluffy pancakes loaded with fresh blueberries and maple syrup', price: 1050, available: true },
      
      // Breakfast Sharing
      { category_id: insertedCategories[2].id, name: 'Breakfast Platter for Two', description: 'Assorted breakfast items perfect for sharing', price: 2500, available: true },
      { category_id: insertedCategories[2].id, name: 'Family Pancake Stack', description: 'Large stack of pancakes for the whole family', price: 1800, available: true },
      
      // Small Plates
      { category_id: insertedCategories[3].id, name: 'Parmesan Chicken', description: 'Golden crispy chicken breast coated with fresh parmesan and herbs', price: 2156, available: true },
      { category_id: insertedCategories[3].id, name: 'Buffalo Wings', description: 'Spicy buffalo wings served with ranch dip', price: 1200, available: true },
      { category_id: insertedCategories[3].id, name: 'Loaded Nachos', description: 'Crispy nachos topped with cheese, jalapeños, and sour cream', price: 950, available: true },
      
      // Salads
      { category_id: insertedCategories[4].id, name: 'Caesar Salad', description: 'Fresh romaine lettuce with Caesar dressing and croutons', price: 1200, available: true },
      { category_id: insertedCategories[4].id, name: 'Greek Salad', description: 'Fresh vegetables with feta cheese and olive oil dressing', price: 1100, available: true },
      { category_id: insertedCategories[4].id, name: 'Chicken Caesar Salad', description: 'Caesar salad topped with grilled chicken breast', price: 1450, available: true },
      
      // Tacos
      { category_id: insertedCategories[5].id, name: 'Chicken Tacos', description: 'Soft tacos filled with seasoned chicken and fresh vegetables', price: 850, available: true },
      { category_id: insertedCategories[5].id, name: 'Beef Tacos', description: 'Traditional beef tacos with authentic Mexican flavors', price: 950, available: true },
      { category_id: insertedCategories[5].id, name: 'Fish Tacos', description: 'Fresh fish tacos with cabbage slaw and lime crema', price: 1100, available: true },
      
      // Pizza
      { category_id: insertedCategories[6].id, name: 'Margherita Pizza', description: 'Classic tomato, mozzarella, and basil pizza', price: 1800, available: true },
      { category_id: insertedCategories[6].id, name: 'Pepperoni Pizza', description: 'Traditional pizza topped with pepperoni and cheese', price: 2000, available: true },
      { category_id: insertedCategories[6].id, name: 'BBQ Chicken Pizza', description: 'Pizza with BBQ sauce, chicken, and red onions', price: 2200, available: true },
      
      // Sandwiches
      { category_id: insertedCategories[7].id, name: 'Classic Burger', description: 'Juicy beef patty with lettuce, tomato, and special sauce', price: 1500, available: true },
      { category_id: insertedCategories[7].id, name: 'Chicken Sandwich', description: 'Grilled chicken breast with avocado and aioli', price: 1350, available: true },
      { category_id: insertedCategories[7].id, name: 'Turkey Club', description: 'Triple-decker sandwich with turkey, bacon, and avocado', price: 1650, available: true }
    ];
    
    const { data: insertedItems, error: itemsError } = await supabase
      .from('menu_items')
      .insert(menuItems)
      .select();
    
    if (itemsError) {
      console.error('❌ Error inserting menu items:', itemsError);
      return;
    }
    
    console.log(`✅ Inserted ${insertedItems.length} menu items`);
    
    // Step 4: Update carousel items
    console.log('🎠 Updating carousel items...');
    
    const { error: carouselError } = await supabase
      .from('carousel_items')
      .upsert([
        { title: 'Where Flavor', description: 'Meets Happiness', image_url: '/hero-image.jpg', sort_order: 1, active: true },
        { title: 'Premium Breakfast', description: 'Start Your Day Right', image_url: '/hero-image.jpg', sort_order: 2, active: true },
        { title: 'Fresh Salads', description: 'Healthy & Delicious', image_url: '/hero-image.jpg', sort_order: 3, active: true }
      ]);
    
    if (carouselError) {
      console.log('⚠️ Error updating carousel items:', carouselError.message);
    } else {
      console.log('✅ Updated carousel items');
    }
    
    // Step 5: Verify migration
    console.log('🔍 Verifying migration...');
    
    const { data: finalCategories } = await supabase.from('categories').select('*');
    const { data: finalItems } = await supabase.from('menu_items').select('*');
    
    console.log(`📊 Migration Summary:`);
    console.log(`   Categories: ${finalCategories?.length || 0}`);
    console.log(`   Menu Items: ${finalItems?.length || 0}`);
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update API routes to fetch from database');
    console.log('2. Test dynamic content loading');
    console.log('3. Update frontend components');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration
migrateMenuData();
