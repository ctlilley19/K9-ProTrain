import { NextRequest, NextResponse } from 'next/server';
import { verifyMfa, completeMfaSetup } from '@/services/admin/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, code, isSetup } = body;

    if (!adminId || !code) {
      return NextResponse.json(
        { error: 'Admin ID and verification code are required' },
        { status: 400 }
      );
    }

    // Get client info for audit logging
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Either complete MFA setup or verify existing MFA
    const result = isSetup
      ? await completeMfaSetup(adminId, code, ipAddress, userAgent)
      : await verifyMfa(adminId, code, ipAddress, userAgent);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: result.admin,
      sessionToken: result.sessionToken,
      requiresPasswordChange: result.requiresPasswordChange,
    });
  } catch (error) {
    console.error('Admin MFA API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
