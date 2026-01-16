import { NextRequest, NextResponse } from 'next/server';
import { adminLogin, setupMfa } from '@/services/admin/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get client info for audit logging
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await adminLogin(email, password, ipAddress, userAgent);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    // If MFA setup is required, generate the secret and QR code
    let mfaSetupData = null;
    if (result.requiresMfaSetup && result.admin) {
      const mfaResult = await setupMfa(result.admin.id);
      if (mfaResult.success) {
        mfaSetupData = {
          secret: mfaResult.secret,
          qrCodeUrl: mfaResult.qrCodeUrl,
        };
      }
    }

    return NextResponse.json({
      success: true,
      requiresMfa: result.requiresMfa,
      requiresMfaSetup: result.requiresMfaSetup,
      requiresPasswordChange: result.requiresPasswordChange,
      admin: result.admin,
      sessionToken: result.sessionToken,
      mfaSetupData,
    });
  } catch (error) {
    console.error('Admin login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
