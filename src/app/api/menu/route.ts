// src/app/api/menu/route.ts
import { NextResponse } from 'next/server';
import { menuService, categoryService } from '@/lib/database';

export async function GET() {
  try {
    // Fetch menu items and categories separately
    const menuItems = await menuService.getAllMenuItems();
    const categories = await categoryService.getAllCategories();

    return NextResponse.json({
      success: true,
      data: {
        menuItems,
        categories,
        popularItems: menuItems.slice(0, 6) // First 6 items as popular
      }
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}