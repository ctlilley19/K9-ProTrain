'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ChevronRight,
  User,
  Calendar,
} from 'lucide-react';

// Types
interface Ticket {
  id: string;
  user_id?: string;
  user_email?: string;
  subject: string;
  description: string;
  status: 'new' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category?: string;
  assigned_to?: string;
  first_response_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

// Status config
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  new: { label: 'New', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: <Circle size={12} /> },
  in_progress: { label: 'In Progress', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: <Clock size={12} /> },
  waiting_on_user: { label: 'Waiting', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: <Clock size={12} /> },
  resolved: { label: 'Resolved', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: <CheckCircle2 size={12} /> },
  closed: { label: 'Closed', color: 'bg-surface-500/10 text-surface-400 border-surface-500/20', icon: <CheckCircle2 size={12} /> },
};

// Priority config
const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-surface-400' },
  normal: { label: 'Normal', color: 'text-white' },
  high: { label: 'High', color: 'text-amber-400' },
  urgent: { label: 'Urgent', color: 'text-red-400' },
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    urgent: 0,
  });

  // Fetch tickets
  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.priority) params.set('priority', filters.priority);

      const response = await fetch(`/api/admin/tickets?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
        setTotal(data.total || 0);

        // Calculate stats
        const allTickets = data.tickets || [];
        setStats({
          total: data.total || 0,
          new: allTickets.filter((t: Ticket) => t.status === 'new').length,
          inProgress: allTickets.filter((t: Ticket) => t.status === 'in_progress').length,
          urgent: allTickets.filter((t: Ticket) => t.priority === 'urgent').length,
        });
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters.status, filters.priority]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  // Filter tickets by search
  const filteredTickets = tickets.filter((ticket) => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      ticket.subject.toLowerCase().includes(searchLower) ||
      ticket.user_email?.toLowerCase().includes(searchLower) ||
      ticket.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Tickets"
        description="Manage customer support requests"
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
            onClick={fetchTickets}
            disabled={isLoading}
          >
            Refresh
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-surface-800 rounded-lg">
              <MessageSquare size={18} className="text-surface-400" />
            </div>
            <div>
              <p className="text-sm text-surface-400">Total Tickets</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Circle size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-surface-400">New</p>
              <p className="text-xl font-bold text-white">{stats.new}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-surface-400">In Progress</p>
              <p className="text-xl font-bold text-white">{stats.inProgress}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm text-surface-400">Urgent</p>
              <p className="text-xl font-bold text-white">{stats.urgent}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Ticket List */}
      <Card>
        <div className="p-4 border-b border-surface-800">
          <div className="flex items-center justify-between gap-4">
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
                  placeholder="Search tickets..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 pr-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none w-64"
                />
              </div>
            </div>
            <div className="text-sm text-surface-400">
              {filteredTickets.length} tickets
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="flex gap-4 mt-4 pt-4 border-t border-surface-800">
              <div>
                <label className="block text-xs text-surface-400 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_on_user">Waiting on User</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Ticket List */}
        <div className="divide-y divide-surface-800">
          {isLoading ? (
            <div className="p-8 text-center text-surface-500">
              <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
              Loading tickets...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-surface-500">
              <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
              No tickets found
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/support/${ticket.id}`}
                className="block hover:bg-surface-800/50 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Priority indicator */}
                        {ticket.priority === 'urgent' && (
                          <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                        )}
                        {ticket.priority === 'high' && (
                          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
                        )}

                        {/* Subject */}
                        <h3 className={`font-medium truncate ${priorityConfig[ticket.priority]?.color || 'text-white'}`}>
                          {ticket.subject}
                        </h3>
                      </div>

                      {/* User & Preview */}
                      <div className="flex items-center gap-2 text-sm text-surface-500 mb-2">
                        <User size={12} />
                        <span>{ticket.user_email || 'Unknown user'}</span>
                        <span className="text-surface-700">•</span>
                        <span className="truncate">{ticket.description.substring(0, 100)}...</span>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3">
                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${statusConfig[ticket.status]?.color || statusConfig.new.color}`}>
                          {statusConfig[ticket.status]?.icon}
                          {statusConfig[ticket.status]?.label || ticket.status}
                        </span>

                        {/* Category */}
                        {ticket.category && (
                          <span className="text-xs text-surface-500">
                            {ticket.category}
                          </span>
                        )}

                        {/* Created date */}
                        <span className="flex items-center gap-1 text-xs text-surface-500">
                          <Calendar size={12} />
                          {formatRelativeTime(ticket.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={16} className="text-surface-600 flex-shrink-0 mt-1" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
