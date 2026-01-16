'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Award,
  RefreshCw,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Star,
  StarOff,
  Clock,
  MessageSquare,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Types
interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  color?: string;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  is_featured: boolean;
  created_by?: string;
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  change_request?: string;
}

// Status config
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending Review', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: <Clock size={12} /> },
  approved: { label: 'Approved', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: <CheckCircle2 size={12} /> },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: <XCircle size={12} /> },
  changes_requested: { label: 'Changes Requested', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: <MessageSquare size={12} /> },
};

export default function BadgeReviewPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [actionModal, setActionModal] = useState<{ type: string; badge: Badge } | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pageSize = 20;

  // Filter state
  const [filters, setFilters] = useState({
    status: 'pending',
    category: '',
    search: '',
  });

  // Stats
  const [stats, setStats] = useState({ pending: 0, featured: 0 });

  // Fetch badges
  const fetchBadges = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: (page * pageSize).toString(),
      });

      if (filters.status) params.set('status', filters.status);
      if (filters.category) params.set('category', filters.category);

      const response = await fetch(`/api/admin/badges?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
        setTotal(data.total || 0);
        if (data.stats) setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, [page, filters.status, filters.category]);

  // Handle badge action
  const handleAction = async (action: string, badge: Badge, reason?: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/badges', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          badgeId: badge.id,
          action,
          reason,
          changes: reason,
        }),
      });

      if (response.ok) {
        setActionModal(null);
        setActionReason('');
        fetchBadges();
      }
    } catch (error) {
      console.error('Error updating badge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter badges by search
  const filteredBadges = badges.filter((badge) => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      badge.name.toLowerCase().includes(searchLower) ||
      badge.description.toLowerCase().includes(searchLower) ||
      badge.category?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(total / pageSize);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Badge Review"
        description="Review and manage badge submissions"
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
            onClick={fetchBadges}
            disabled={isLoading}
          >
            Refresh
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-surface-400">Pending Review</p>
              <p className="text-xl font-bold text-white">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Star size={18} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-surface-400">Featured</p>
              <p className="text-xl font-bold text-white">{stats.featured}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-surface-400">Approved Today</p>
              <p className="text-xl font-bold text-white">-</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Award size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-surface-400">Total Badges</p>
              <p className="text-xl font-bold text-white">{total}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Badge List */}
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
                  placeholder="Search badges..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 pr-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none w-64"
                />
              </div>
            </div>
            <div className="text-sm text-surface-400">
              {filteredBadges.length} badges
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
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="changes_requested">Changes Requested</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="obedience">Obedience</option>
                  <option value="agility">Agility</option>
                  <option value="behavior">Behavior</option>
                  <option value="tricks">Tricks</option>
                  <option value="socialization">Socialization</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Badge Grid */}
        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8 text-surface-500">
              <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
              Loading badges...
            </div>
          ) : filteredBadges.length === 0 ? (
            <div className="text-center py-8 text-surface-500">
              <Award size={24} className="mx-auto mb-2 opacity-50" />
              No badges found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 bg-surface-800/50 rounded-lg border border-surface-700 hover:border-surface-600 transition-colors"
                >
                  {/* Badge Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: badge.color || '#6366f1' + '20' }}
                      >
                        {badge.icon || '🏆'}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{badge.name}</h3>
                        <p className="text-xs text-surface-500">{badge.category}</p>
                      </div>
                    </div>
                    {badge.is_featured && (
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-surface-400 mb-3 line-clamp-2">
                    {badge.description}
                  </p>

                  {/* Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded border ${statusConfig[badge.status]?.color || statusConfig.pending.color}`}>
                      {statusConfig[badge.status]?.icon}
                      {statusConfig[badge.status]?.label || badge.status}
                    </span>
                    <span className="text-xs text-surface-500">{formatDate(badge.created_at)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedBadge(badge)}
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    {badge.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction('approve', badge)}
                          className="text-green-400 border-green-500/30 hover:bg-green-500/10"
                        >
                          <CheckCircle2 size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActionModal({ type: 'reject', badge })}
                          className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                        >
                          <XCircle size={14} />
                        </Button>
                      </>
                    )}
                    {badge.status === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(badge.is_featured ? 'unfeature' : 'feature', badge)}
                        className={badge.is_featured ? 'text-surface-400' : 'text-yellow-400 border-yellow-500/30'}
                      >
                        {badge.is_featured ? <StarOff size={14} /> : <Star size={14} />}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <div className="p-4 border-b border-surface-800 flex items-center justify-between">
              <h3 className="font-medium text-white">Badge Details</h3>
              <button
                onClick={() => setSelectedBadge(null)}
                className="text-surface-500 hover:text-white"
              >
                &times;
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: selectedBadge.color || '#6366f1' + '20' }}
                >
                  {selectedBadge.icon || '🏆'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedBadge.name}</h2>
                  <p className="text-sm text-surface-400">{selectedBadge.category}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-surface-500">Description</label>
                <p className="text-sm text-white mt-1">{selectedBadge.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-surface-500">Status</label>
                  <p className={`text-sm mt-1 ${statusConfig[selectedBadge.status]?.color?.split(' ')[1]}`}>
                    {statusConfig[selectedBadge.status]?.label}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-surface-500">Created</label>
                  <p className="text-sm text-white mt-1">{formatDate(selectedBadge.created_at)}</p>
                </div>
              </div>

              {selectedBadge.rejection_reason && (
                <div>
                  <label className="text-xs text-surface-500">Rejection Reason</label>
                  <p className="text-sm text-red-400 mt-1">{selectedBadge.rejection_reason}</p>
                </div>
              )}

              {selectedBadge.change_request && (
                <div>
                  <label className="text-xs text-surface-500">Requested Changes</label>
                  <p className="text-sm text-purple-400 mt-1">{selectedBadge.change_request}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-surface-800">
                {selectedBadge.status === 'pending' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<CheckCircle2 size={14} />}
                      onClick={() => {
                        handleAction('approve', selectedBadge);
                        setSelectedBadge(null);
                      }}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<XCircle size={14} />}
                      onClick={() => {
                        setSelectedBadge(null);
                        setActionModal({ type: 'reject', badge: selectedBadge });
                      }}
                      className="text-red-400 border-red-500/30"
                    >
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<MessageSquare size={14} />}
                      onClick={() => {
                        setSelectedBadge(null);
                        setActionModal({ type: 'request_changes', badge: selectedBadge });
                      }}
                    >
                      Request Changes
                    </Button>
                  </>
                )}
                {selectedBadge.status === 'approved' && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={selectedBadge.is_featured ? <StarOff size={14} /> : <Star size={14} />}
                    onClick={() => {
                      handleAction(selectedBadge.is_featured ? 'unfeature' : 'feature', selectedBadge);
                      setSelectedBadge(null);
                    }}
                    className={selectedBadge.is_featured ? '' : 'text-yellow-400 border-yellow-500/30'}
                  >
                    {selectedBadge.is_featured ? 'Remove from Featured' : 'Feature Badge'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Action Modal (Reject / Request Changes) */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-4 border-b border-surface-800">
              <h3 className="font-medium text-white">
                {actionModal.type === 'reject' ? 'Reject Badge' : 'Request Changes'}
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-surface-400">
                {actionModal.type === 'reject'
                  ? 'Please provide a reason for rejecting this badge.'
                  : 'Please describe the changes needed.'}
              </p>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder={
                  actionModal.type === 'reject'
                    ? 'Reason for rejection...'
                    : 'Describe the changes needed...'
                }
                rows={4}
                className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActionModal(null);
                    setActionReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAction(actionModal.type, actionModal.badge, actionReason)}
                  disabled={!actionReason.trim() || isSubmitting}
                  className={actionModal.type === 'reject' ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  {isSubmitting ? 'Submitting...' : actionModal.type === 'reject' ? 'Reject' : 'Submit'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
