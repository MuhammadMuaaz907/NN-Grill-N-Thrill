import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/lib/database';
import { AdminAuthService } from '@/lib/admin-auth';

// GET - Get new orders and notification count
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await AdminAuthService.verifySession(
      request.cookies.get('adminToken')?.value || ''
    );

    if (!authResult.valid) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get new orders count
    const newOrdersCount = await orderService.getNewOrdersCount();
    
    // Get new orders for notifications
    const newOrders = await orderService.getNewOrders();

    // Format notifications
    const notifications = newOrders.map(order => ({
      id: order.id,
      type: 'new_order',
      title: 'New Order Received',
      message: `Order from ${order.customer_info?.full_name || 'Unknown Customer'} - Rs. ${order.totals?.grand_total || 0}`,
      orderId: order.order_id,
      priority: order.priority || 'normal',
      timestamp: order.created_at,
      read: order.admin_seen || false
    }));

    return NextResponse.json({
      success: true,
      data: {
        newOrdersCount,
        notifications,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Mark notification as read
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await AdminAuthService.verifySession(
      request.cookies.get('adminToken')?.value || ''
    );

    if (!authResult.valid) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { action, orderId } = await request.json();

    if (action === 'mark_read' && orderId) {
      await orderService.markOrderSeen(orderId);
      return NextResponse.json({ success: true, message: 'Order marked as read' });
    }

    if (action === 'mark_all_read') {
      const updatedCount = await orderService.markAllNewOrdersSeen();
      return NextResponse.json({ 
        success: true, 
        message: `Marked ${updatedCount} orders as read` 
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
