import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthService } from '@/lib/admin-auth';
import { menuService } from '@/lib/database';

interface MenuItemData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  available?: boolean;
  image_url?: string;
  cloudinary_url?: string;
}

// GET - Fetch all menu items for admin
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.cookies.get('adminToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = await AdminAuthService.verifySession(token);
    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Fetch all menu items
    const menuItems = await menuService.getAllMenuItems();
    
    return NextResponse.json({
      success: true,
      data: menuItems
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST - Create new menu item
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.cookies.get('adminToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = await AdminAuthService.verifySession(token);
    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const menuData: MenuItemData = await request.json();

    // Validate required fields
    if (!menuData.name || !menuData.description || !menuData.price || !menuData.category_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, description, price, category_id' },
        { status: 400 }
      );
    }

    // Validate price is positive
    if (menuData.price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Create menu item
    const newMenuItem = await menuService.createMenuItem({
      name: menuData.name,
      description: menuData.description,
      price: menuData.price,
      category_id: menuData.category_id,
      available: menuData.available ?? true,
      image_url: menuData.image_url,
      cloudinary_url: menuData.cloudinary_url
    });

    return NextResponse.json({
      success: true,
      data: newMenuItem
    });

  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
