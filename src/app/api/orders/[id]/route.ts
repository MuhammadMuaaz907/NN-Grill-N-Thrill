// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/lib/database';

interface OrderUpdate {
  status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';
  admin_notes?: string;
}

// PUT - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData: OrderUpdate = await request.json();

    // Validate required fields
    if (!updateData.status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await orderService.updateOrderStatus(
      id,
      updateData.status,
      updateData.admin_notes
    );

    return NextResponse.json({
      success: true,
      data: updatedOrder
    });

  } catch (error) {
    console.error('❌ Error updating order:', error);
    
    // Better error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to update order';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// GET - Get order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get order by ID
    const order = await orderService.getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete order
    await orderService.deleteOrder(id);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
