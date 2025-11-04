// src/app/api/admin/promotions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthService } from '@/lib/admin-auth';
import { promotionService } from '@/lib/database';

interface PromotionData {
  title: string;
  description: string;
  discount_percentage?: number;
  discount_amount?: number;
  valid_from: string;
  valid_until: string;
  active: boolean;
  image_url?: string;
  cloudinary_url?: string;
}

// GET - Fetch all promotions for admin
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

    const promotions = await promotionService.getAllPromotions();
    
    return NextResponse.json({
      success: true,
      data: promotions
    });

  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}

// POST - Create new promotion
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

    const promotionData: PromotionData = await request.json();

    // Validate required fields
    if (!promotionData.title?.trim() || !promotionData.description?.trim() || !promotionData.valid_from || !promotionData.valid_until) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, description, valid_from, valid_until' },
        { status: 400 }
      );
    }

    // Validate dates
    const validFrom = new Date(promotionData.valid_from);
    const validUntil = new Date(promotionData.valid_until);
    
    if (isNaN(validFrom.getTime()) || isNaN(validUntil.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (validFrom >= validUntil) {
      return NextResponse.json(
        { success: false, error: 'Valid until date must be after valid from date' },
        { status: 400 }
      );
    }

    // Validate discount - at least one should be provided (optional validation)
    // Note: Making this optional as some promotions might not have discounts

    // Create promotion
    const newPromotion = await promotionService.createPromotion(promotionData);

    return NextResponse.json({
      success: true,
      data: newPromotion
    });

  } catch (error: any) {
    console.error('❌ Error creating promotion:', error);
    
    // Provide detailed error message
    let errorMessage = 'Failed to create promotion';
    
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.code) {
      errorMessage = `Database error: ${error.code}`;
    }
    
    // Check for specific Supabase errors
    if (error?.code === 'PGRST116') {
      errorMessage = 'Promotions table does not exist. Please create the table in Supabase.';
    } else if (error?.code === '23502') {
      errorMessage = 'Missing required field in database';
    } else if (error?.code === '23505') {
      errorMessage = 'Promotion with this data already exists';
    } else if (error?.code === '42501') {
      errorMessage = 'Row Level Security (RLS) policy violation. Please run FIX_PROMOTIONS_RLS.sql in Supabase SQL Editor to fix this.';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

