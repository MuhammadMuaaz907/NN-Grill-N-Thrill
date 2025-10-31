// src/app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthService } from '@/lib/admin-auth';

interface LoginRequest {
  username: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password }: LoginRequest = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate admin user with secure system
    const authResult = await AdminAuthService.authenticate(username, password);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: authResult.user,
        token: authResult.token
      }
    });

  } catch (error) {
    console.error('Admin authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Verify admin session endpoint
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                 request.cookies.get('adminToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token' },
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

    return NextResponse.json({
      success: true,
      data: {
        user: session.user
      }
    });

  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Session verification failed' },
      { status: 500 }
    );
  }
}
