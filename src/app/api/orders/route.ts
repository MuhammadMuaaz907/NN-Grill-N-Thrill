// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/lib/database';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  customerInfo: {
    title: string;
    fullName: string;
    mobile: string;
    alternateMobile?: string;
    address: string;
    landmark: string;
    email: string;
    area: string;
    instructions?: string;
    changeRequest?: number;
  };
  orderItems: OrderItem[];
  totals: {
    subtotal: number;
    tax: number;
    deliveryFee: number;
    grandTotal: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json();
    
    // Validate required fields
    const { customerInfo, orderItems, totals } = orderData;
    
    if (!customerInfo.fullName || !customerInfo.mobile || !customerInfo.address) {
      return NextResponse.json(
        { success: false, error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in order' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Transform customerInfo from camelCase to snake_case for database consistency
    const transformedCustomerInfo = {
      title: customerInfo.title,
      full_name: customerInfo.fullName, // Transform fullName -> full_name
      mobile: customerInfo.mobile,
      alternate_mobile: customerInfo.alternateMobile,
      address: customerInfo.address,
      landmark: customerInfo.landmark,
      email: customerInfo.email,
      area: customerInfo.area,
      instructions: customerInfo.instructions,
      change_request: customerInfo.changeRequest
    };
    
    // Prepare order data for database
    const orderInsertData = {
      order_id: orderId,
      customer_info: transformedCustomerInfo, // Use transformed customer info
      order_items: orderItems,
      totals: {
        subtotal: totals.subtotal,
        tax: totals.tax,
        delivery_fee: totals.deliveryFee,
        grand_total: totals.grandTotal
      },
      status: 'confirmed' as const,
      estimated_delivery: new Date(Date.now() + 45 * 60 * 1000).toISOString()
    };

    // Save to database
    const savedOrder = await orderService.createOrder(orderInsertData);
    
    console.log('New order saved to database:', savedOrder);

    // Simulate sending SMS/Email notification
    console.log(`SMS sent to ${customerInfo.mobile}: Order ${orderId} confirmed!`);

    return NextResponse.json({
      success: true,
      data: {
        orderId: savedOrder.order_id,
        status: savedOrder.status,
        estimatedDelivery: savedOrder.estimated_delivery
      }
    });

  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process order' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all orders (for admin) or single order by orderId
export async function GET(request: NextRequest) {
  try {
    // Get orderId from query parameters
    const orderId = request.nextUrl.searchParams.get('orderId');
    
    // Get afterTimestamp if provided (to fetch only new orders)
    const afterTimestamp = request.nextUrl.searchParams.get('after');
    
    // If orderId provided, return single order
    if (orderId) {
      try {
        // Trim whitespace and normalize orderId
        const normalizedOrderId = orderId.trim();
        
        console.log('Searching for order with ID:', normalizedOrderId);
        
        const allOrders = await orderService.getAllOrders();
        console.log(`Total orders in database: ${allOrders.length}`);
        
        // Search for order - check both order_id and id fields
        const foundOrder = allOrders.find((o) => {
          const dbOrderId = String(o.order_id || '').trim();
          const dbId = String(o.id || '').trim();
          const searchId = normalizedOrderId;
          
          return dbOrderId === searchId || dbId === searchId;
        });
        
        if (foundOrder) {
          console.log('Order found:', foundOrder.order_id);
          return NextResponse.json({
            success: true,
            data: foundOrder
          });
        } else {
          console.log('Order not found. Searched ID:', normalizedOrderId);
          // Log some sample order IDs for debugging
          if (allOrders.length > 0) {
            console.log('Sample order IDs in database:', 
              allOrders.slice(0, 3).map(o => ({ id: o.id, order_id: o.order_id }))
            );
          }
          return NextResponse.json(
            { success: false, error: `Order "${normalizedOrderId}" not found. Please check your Order ID and try again.` },
            { status: 404 }
          );
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { success: false, error: 'Database error occurred. Please try again later.' },
          { status: 500 }
        );
      }
    }
    
    // If afterTimestamp provided, return only new orders created after that time
    if (afterTimestamp) {
      try {
        const orders = await orderService.getOrdersAfter(afterTimestamp);
        console.log(`📥 Returning ${orders.length} new orders after ${afterTimestamp}`);
        
        return NextResponse.json({
          success: true,
          data: orders || []
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { success: false, error: 'Database error occurred' },
          { status: 500 }
        );
      }
    }
    
    // Otherwise return all orders (for admin)
    try {
      const orders = await orderService.getAllOrders();
      
      return NextResponse.json({
        success: true,
        data: orders || []
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database error occurred' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
