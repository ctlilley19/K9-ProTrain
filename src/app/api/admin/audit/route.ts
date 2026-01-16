import { NextRequest, NextResponse } from 'next/server';
import { validateAdminSession } from '@/services/admin/auth';
import { queryAuditLogs, getAuditStats, exportAuditLogs } from '@/services/admin/audit';

// GET /api/admin/audit - Query audit logs
export async function GET(request: NextRequest) {
  try {
    // Validate session
    const sessionToken = request.cookies.get('admin_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateAdminSession(sessionToken);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Only super_admin and analytics can view all audit logs
    if (session.admin.role !== 'super_admin' && session.admin.role !== 'analytics') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Handle stats request
    if (action === 'stats') {
      const days = parseInt(searchParams.get('days') || '7', 10);
      const stats = await getAuditStats(days);
      return NextResponse.json(stats);
    }

    // Handle export request
    if (action === 'export') {
      const query = {
        adminId: searchParams.get('adminId') || undefined,
        category: searchParams.get('category') as any || undefined,
        eventType: searchParams.get('eventType') as any || undefined,
        severity: searchParams.get('severity') as any || undefined,
        targetType: searchParams.get('targetType') || undefined,
        targetId: searchParams.get('targetId') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
      };

      const exportData = await exportAuditLogs(query);

      return new NextResponse(exportData, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="audit-log-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    // Default: query logs with filters
    const query = {
      adminId: searchParams.get('adminId') || undefined,
      category: searchParams.get('category') as any || undefined,
      eventType: searchParams.get('eventType') as any || undefined,
      severity: searchParams.get('severity') as any || undefined,
      targetType: searchParams.get('targetType') || undefined,
      targetId: searchParams.get('targetId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      limit: parseInt(searchParams.get('limit') || '50', 10),
      offset: parseInt(searchParams.get('offset') || '0', 10),
    };

    const result = await queryAuditLogs(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Audit log API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
