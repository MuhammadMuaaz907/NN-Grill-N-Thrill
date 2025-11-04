// src/app/api/promotions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promotionService } from '@/lib/database';

// GET - Fetch all active promotions (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const activeOnly = request.nextUrl.searchParams.get('active') === 'true';
    
    if (activeOnly) {
      // Return only active and currently valid promotions
      const promotions = await promotionService.getActivePromotions();
      return NextResponse.json({
        success: true,
        data: promotions
      });
    } else {
      // Return all promotions (for admin)
      const promotions = await promotionService.getAllPromotions();
      return NextResponse.json({
        success: true,
        data: promotions
      });
    }
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}

