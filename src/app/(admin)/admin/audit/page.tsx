'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Activity,
  DollarSign,
  MessageSquare,
  Award,
  Settings,
  Eye,
} from 'lucide-react';

// Types
interface AuditLogEntry {
  id: string;
  admin_id: string;
  category: string;
  event_type: string;
  severity: string;
  target_type?: string;
  target_id?: string;
  description: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  admin_users?: {
    name: string;
    email: string;
  };
}

interface AuditStats {
  totalLogs: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  recentCritical: number;
}

// Severity badge colors
const severityColors: Record<string, string> = {
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
};

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  authentication: <Shield size={14} />,
  user_management: <User size={14} />,
  badge_moderation: <Award size={14} />,
  support: <MessageSquare size={14} />,
  billing: <DollarSign size={14} />,
  content_moderation: <Eye size={14} />,
  system: <Settings size={14} />,
  settings: <Settings size={14} />,
};

// Category colors
const categoryColors: Record<string, string> = {
  authentication: 'text-blue-400',
  user_management: 'text-purple-400',
  badge_moderation: 'text-amber-400',
  support: 'text-cyan-400',
  billing: 'text-green-400',
  content_moderation: 'text-red-400',
  system: 'text-surface-400',
  settings: 'text-surface-400',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const pageSize = 20;

  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    severity: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  // Fetch logs
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: (page * pageSize).toString(),
      });

      if (filters.category) params.set('category', filters.category);
      if (filters.severity) params.set('severity', filters.severity);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);

      const response = await fetch(`/api/admin/audit?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/audit?action=stats&days=7');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching audit stats:', error);
    }
  };

  // Export logs
  const handleExport = async () => {
    try {
      const params = new URLSearchParams({ action: 'export' });
      if (filters.category) params.set('category', filters.category);
      if (filters.severity) params.set('severity', filters.severity);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);

      const response = await fetch(`/api/admin/audit?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-log-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting audit logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [page, filters.category, filters.severity, filters.startDate, filters.endDate]);

  const totalPages = Math.ceil(total / pageSize);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Complete log of all administrative actions"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={16} />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
              onClick={() => {
                fetchLogs();
                fetchStats();
              }}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-surface-400">Total Events (7d)</p>
                <p className="text-xl font-bold text-white">{stats.totalLogs.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm text-surface-400">Critical Events</p>
                <p className="text-xl font-bold text-white">{stats.recentCritical}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Shield size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-surface-400">Auth Events</p>
                <p className="text-xl font-bold text-white">{stats.byCategory?.authentication || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Clock size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm text-surface-400">Low Severity</p>
                <p className="text-xl font-bold text-white">{stats.bySeverity?.low || 0}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="p-4 border-b border-surface-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Filter size={16} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 pr-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none w-64"
                />
              </div>
            </div>
            <div className="text-sm text-surface-400">
              Showing {logs.length} of {total.toLocaleString()} events
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-surface-800">
              <div>
                <label className="block text-xs text-surface-400 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="authentication">Authentication</option>
                  <option value="user_management">User Management</option>
                  <option value="badge_moderation">Badge Moderation</option>
                  <option value="support">Support</option>
                  <option value="billing">Billing</option>
                  <option value="content_moderation">Content Moderation</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-800/50">
              <tr>
                <th className="text-left text-xs font-medium text-surface-400 px-4 py-3">Time</th>
                <th className="text-left text-xs font-medium text-surface-400 px-4 py-3">Category</th>
                <th className="text-left text-xs font-medium text-surface-400 px-4 py-3">Event</th>
                <th className="text-left text-xs font-medium text-surface-400 px-4 py-3">Severity</th>
                <th className="text-left text-xs font-medium text-surface-400 px-4 py-3">Description</th>
                <th className="text-left text-xs font-medium text-surface-400 px-4 py-3">Target</th>
                <th className="text-left text-xs font-medium text-surface-400 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-surface-500">
                    <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-surface-500">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm text-white">{formatRelativeTime(log.created_at)}</div>
                      <div className="text-xs text-surface-500">{formatDate(log.created_at)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-2 ${categoryColors[log.category] || 'text-surface-400'}`}>
                        {categoryIcons[log.category] || <Activity size={14} />}
                        <span className="text-sm capitalize">{log.category.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-white font-mono">{log.event_type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded border ${severityColors[log.severity] || severityColors.low}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-surface-300 max-w-xs truncate block">
                        {log.description}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {log.target_type && log.target_id ? (
                        <span className="text-xs text-surface-500 font-mono">
                          {log.target_type}:{log.target_id.substring(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-xs text-surface-600">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-surface-500 hover:text-white transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-surface-800">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeft size={16} />}
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-surface-400">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight size={16} />}
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-surface-800 flex items-center justify-between">
              <h3 className="font-medium text-white">Audit Log Detail</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-surface-500 hover:text-white"
              >
                &times;
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-surface-500">Event Type</label>
                  <p className="text-sm text-white font-mono">{selectedLog.event_type}</p>
                </div>
                <div>
                  <label className="text-xs text-surface-500">Category</label>
                  <p className="text-sm text-white capitalize">{selectedLog.category.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-xs text-surface-500">Severity</label>
                  <p className={`text-sm ${severityColors[selectedLog.severity]?.split(' ')[1] || 'text-white'}`}>
                    {selectedLog.severity}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-surface-500">Timestamp</label>
                  <p className="text-sm text-white">{formatDate(selectedLog.created_at)}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-surface-500">Description</label>
                <p className="text-sm text-white">{selectedLog.description}</p>
              </div>

              {selectedLog.target_type && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-surface-500">Target Type</label>
                    <p className="text-sm text-white">{selectedLog.target_type}</p>
                  </div>
                  <div>
                    <label className="text-xs text-surface-500">Target ID</label>
                    <p className="text-sm text-white font-mono">{selectedLog.target_id}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-surface-500">IP Address</label>
                  <p className="text-sm text-white font-mono">{selectedLog.ip_address || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-xs text-surface-500">Admin ID</label>
                  <p className="text-sm text-white font-mono">{selectedLog.admin_id}</p>
                </div>
              </div>

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <label className="text-xs text-surface-500">Metadata</label>
                  <pre className="mt-1 p-3 bg-surface-800 rounded-lg text-xs text-surface-300 overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.user_agent && (
                <div>
                  <label className="text-xs text-surface-500">User Agent</label>
                  <p className="text-xs text-surface-400 break-all">{selectedLog.user_agent}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
