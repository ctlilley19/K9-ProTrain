'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Dog,
  User,
  ChevronRight,
  Send,
  Clock,
  CheckCircle,
  Edit,
  Eye,
} from 'lucide-react';

// Mock reports data
const mockReports = [
  {
    id: '1',
    dog: { id: 'a', name: 'Max', breed: 'German Shepherd', photo_url: null },
    family: { id: 'f1', name: 'Anderson Family', email: 'anderson@email.com' },
    date: '2025-01-13',
    status: 'draft',
    trainer: 'Sarah Johnson',
    created_at: '2025-01-13T10:00:00Z',
    sent_at: null,
  },
  {
    id: '2',
    dog: { id: 'b', name: 'Bella', breed: 'Golden Retriever', photo_url: null },
    family: { id: 'f1', name: 'Anderson Family', email: 'anderson@email.com' },
    date: '2025-01-13',
    status: 'draft',
    trainer: 'John Smith',
    created_at: '2025-01-13T09:30:00Z',
    sent_at: null,
  },
  {
    id: '3',
    dog: { id: 'a', name: 'Max', breed: 'German Shepherd', photo_url: null },
    family: { id: 'f1', name: 'Anderson Family', email: 'anderson@email.com' },
    date: '2025-01-12',
    status: 'sent',
    trainer: 'Sarah Johnson',
    created_at: '2025-01-12T17:00:00Z',
    sent_at: '2025-01-12T17:30:00Z',
  },
  {
    id: '4',
    dog: { id: 'c', name: 'Luna', breed: 'Border Collie', photo_url: null },
    family: { id: 'f2', name: 'Martinez Family', email: 'martinez@email.com' },
    date: '2025-01-12',
    status: 'sent',
    trainer: 'Sarah Johnson',
    created_at: '2025-01-12T16:45:00Z',
    sent_at: '2025-01-12T17:00:00Z',
  },
  {
    id: '5',
    dog: { id: 'b', name: 'Bella', breed: 'Golden Retriever', photo_url: null },
    family: { id: 'f1', name: 'Anderson Family', email: 'anderson@email.com' },
    date: '2025-01-12',
    status: 'sent',
    trainer: 'John Smith',
    created_at: '2025-01-12T16:30:00Z',
    sent_at: '2025-01-12T17:15:00Z',
  },
];

// Dogs that need reports today
const dogsNeedingReports = [
  { id: 'c', name: 'Luna', breed: 'Border Collie', photo_url: null, family: 'Martinez Family' },
  { id: 'd', name: 'Rocky', breed: 'Rottweiler', photo_url: null, family: 'Martinez Family' },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent'>('all');
  const [dateFilter, setDateFilter] = useState('');

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.family.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesDate = !dateFilter || report.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const draftCount = mockReports.filter((r) => r.status === 'draft').length;
  const todayCount = mockReports.filter((r) => r.date === '2025-01-13').length;

  return (
    <div>
      <PageHeader
        title="Daily Reports"
        description={`${draftCount} drafts, ${dogsNeedingReports.length} dogs need reports today`}
        action={
          <Link href="/reports/new">
            <Button variant="primary" leftIcon={<Plus size={18} />}>
              Create Report
            </Button>
          </Link>
        }
      />

      {/* Dogs Needing Reports */}
      {dogsNeedingReports.length > 0 && (
        <Card className="mb-6 border-yellow-500/30 bg-yellow-500/5">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-yellow-400" />
                Dogs Needing Reports Today
              </span>
            }
          />
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {dogsNeedingReports.map((dog) => (
                <Link
                  key={dog.id}
                  href={`/reports/new?dog=${dog.id}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-700 hover:border-yellow-500/50 transition-all"
                >
                  <Avatar name={dog.name} size="sm" />
                  <div>
                    <p className="font-medium text-white">{dog.name}</p>
                    <p className="text-xs text-surface-500">{dog.family}</p>
                  </div>
                  <Plus size={16} className="text-yellow-400 ml-2" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6" padding="sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'sent')}
              className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="draft">Drafts</option>
              <option value="sent">Sent</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <Card
            key={report.id}
            className="hover:border-brand-500/30 transition-all"
            variant="bordered"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
              {/* Dog & Date */}
              <div className="flex items-center gap-4">
                <Avatar name={report.dog.name} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{report.dog.name}</h3>
                    <StatusBadge
                      variant={report.status === 'sent' ? 'success' : 'warning'}
                      size="xs"
                    >
                      {report.status === 'sent' ? 'Sent' : 'Draft'}
                    </StatusBadge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-surface-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(report.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {report.family.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trainer & Actions */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-surface-500">{report.trainer}</span>

                {report.status === 'draft' ? (
                  <div className="flex gap-2">
                    <Link href={`/reports/${report.id}/edit`}>
                      <Button variant="outline" size="sm" leftIcon={<Edit size={14} />}>
                        Edit
                      </Button>
                    </Link>
                    <Button variant="primary" size="sm" leftIcon={<Send size={14} />}>
                      Send
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-surface-500">
                      Sent {formatDate(report.sent_at!, 'h:mm a')}
                    </span>
                    <Link href={`/reports/${report.id}`}>
                      <Button variant="ghost" size="sm" leftIcon={<Eye size={14} />}>
                        View
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <Card className="text-center py-12">
          <FileText size={48} className="mx-auto text-surface-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No reports found</h3>
          <p className="text-surface-400 mb-6">
            {searchQuery || statusFilter !== 'all' || dateFilter
              ? 'Try adjusting your filters'
              : 'Create your first daily report'}
          </p>
          <Link href="/reports/new">
            <Button variant="primary" leftIcon={<Plus size={18} />}>
              Create Report
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
