// src/app/api/menu/route.ts
import { NextResponse } from 'next/server';
import { menuService, categoryService } from '@/lib/database';
import { MenuItem, Category } from '@/types';

export async function GET() {
  try {
    // Fetch menu items and categories separately
    const dbMenuItems = await menuService.getAllMenuItems();
    const dbCategories = await categoryService.getAllCategories();

    // Transform database format to frontend format
    // Database uses: category_id, image_url, cloudinary_url
    // Frontend expects: categoryId, image
    const transformedMenuItems: MenuItem[] = dbMenuItems.map((item) => ({
      id: item.id,
      categoryId: item.category_id, // Transform snake_case to camelCase
      name: item.name,
      description: item.description,
      price: Number(item.price), // Ensure it's a number
      image: item.cloudinary_url || item.image_url || undefined, // Use cloudinary_url first, fallback to image_url
      available: Boolean(item.available)
    }));

    // Transform categories to frontend format
    const transformedCategories: Category[] = dbCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug || cat.id
    }));

    // Get popular items (first 6 available items)
    const popularItems = transformedMenuItems
      .filter(item => item.available)
      .slice(0, 6);

    console.log(`✅ Menu API: Fetched ${transformedMenuItems.length} menu items, ${transformedCategories.length} categories`);

    return NextResponse.json({
      success: true,
      data: {
        menuItems: transformedMenuItems,
        categories: transformedCategories,
        popularItems: popularItems
      }
    });
  } catch (error) {
    console.error('❌ Error fetching menu:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch menu items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}