// src/app/api/admin/promotions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthService } from '@/lib/admin-auth';
import { promotionService } from '@/lib/database';

// PUT - Update promotion
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const promotionData = await request.json();
    const updatedPromotion = await promotionService.updatePromotion(id, promotionData);

    return NextResponse.json({
      success: true,
      data: updatedPromotion
    });

  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update promotion' },
      { status: 500 }
    );
  }
}

// DELETE - Delete promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    await promotionService.deletePromotion(id);

    return NextResponse.json({
      success: true,
      message: 'Promotion deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete promotion' },
      { status: 500 }
    );
  }
}

