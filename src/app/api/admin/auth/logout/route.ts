import { NextRequest, NextResponse } from 'next/server';
import { adminLogout } from '@/services/admin/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      );
    }

    // Get client info for audit logging
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await adminLogout(sessionToken, ipAddress, userAgent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin logout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
