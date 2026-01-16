'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAdmin } from '@/stores/adminStore';
import {
  Users,
  DollarSign,
  HeadphonesIcon,
  Award,
  Dog,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Clock,
  TrendingUp,
} from 'lucide-react';

// Metric card component
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  href?: string;
  alert?: boolean;
  alertCount?: number;
}

function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconColor,
  iconBg,
  href,
  alert,
  alertCount,
}: MetricCardProps) {
  const content = (
    <Card className="relative overflow-hidden group">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-surface-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {change > 0 ? (
                  <ArrowUpRight size={14} className="text-green-400" />
                ) : change < 0 ? (
                  <ArrowDownRight size={14} className="text-red-400" />
                ) : (
                  <Minus size={14} className="text-surface-500" />
                )}
                <span
                  className={
                    change > 0
                      ? 'text-green-400 text-sm'
                      : change < 0
                      ? 'text-red-400 text-sm'
                      : 'text-surface-500 text-sm'
                  }
                >
                  {change > 0 ? '+' : ''}
                  {change}%
                </span>
                {changeLabel && <span className="text-surface-500 text-sm">{changeLabel}</span>}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <span className={iconColor}>{icon}</span>
          </div>
        </div>

        {/* Alert badge */}
        {alert && alertCount && alertCount > 0 && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 rounded-full text-xs font-medium text-white">
            {alertCount} urgent
          </div>
        )}
      </div>

      {/* Hover effect for links */}
      {href && (
        <div className="absolute inset-0 bg-gradient-to-t from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// Demo data for the dashboard
const demoMetrics = {
  activeUsers: 1247,
  activeUsersChange: 12,
  mrr: 18450,
  mrrChange: 8,
  openTickets: 7,
  urgentTickets: 3,
  badgeQueue: 12,
  featuredBadges: 2,
  dogsActive: 3892,
  dogsNew: 340,
  sessionsToday: 12450,
  avgSessions: 8.2,
  systemHealth: 99.8,
  flaggedContent: 2,
};

export default function AdminDashboardPage() {
  const admin = useAdmin();
  const [metrics, setMetrics] = useState(demoMetrics);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // In production, this would fetch real metrics
  const refreshMetrics = async () => {
    setIsLoading(true);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Dashboard"
        description={`Welcome back, ${admin?.name || 'Admin'}`}
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
            onClick={refreshMetrics}
            disabled={isLoading}
          >
            Refresh
          </Button>
        }
      />

      {/* Last updated */}
      <div className="flex items-center gap-2 text-sm text-surface-500">
        <Clock size={14} />
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers.toLocaleString()}
          change={metrics.activeUsersChange}
          changeLabel="MTD"
          icon={<Users size={20} />}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <MetricCard
          title="MRR"
          value={`$${metrics.mrr.toLocaleString()}`}
          change={metrics.mrrChange}
          changeLabel="MTD"
          icon={<DollarSign size={20} />}
          iconColor="text-green-400"
          iconBg="bg-green-500/10"
          href="/admin/billing"
        />
        <MetricCard
          title="Open Tickets"
          value={metrics.openTickets}
          icon={<HeadphonesIcon size={20} />}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          href="/admin/support"
          alert={true}
          alertCount={metrics.urgentTickets}
        />
        <MetricCard
          title="Badge Queue"
          value={metrics.badgeQueue}
          icon={<Award size={20} />}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
          href="/admin/badges"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Dogs Active"
          value={metrics.dogsActive.toLocaleString()}
          icon={<Dog size={20} />}
          iconColor="text-brand-400"
          iconBg="bg-brand-500/10"
        />
        <MetricCard
          title="Sessions Today"
          value={metrics.sessionsToday.toLocaleString()}
          icon={<Activity size={20} />}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
        />
        <MetricCard
          title="System Health"
          value={`${metrics.systemHealth}%`}
          icon={<CheckCircle2 size={20} />}
          iconColor="text-green-400"
          iconBg="bg-green-500/10"
          href="/admin/system"
        />
        <MetricCard
          title="Flagged Content"
          value={metrics.flaggedContent}
          icon={<AlertTriangle size={20} />}
          iconColor="text-red-400"
          iconBg="bg-red-500/10"
          href="/admin/moderate"
          alert={metrics.flaggedContent > 0}
          alertCount={metrics.flaggedContent}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <div className="p-4 border-b border-surface-800">
            <h3 className="font-medium text-white">Recent Activity</h3>
          </div>
          <div className="divide-y divide-surface-800">
            {[
              { action: 'New support ticket', detail: 'User: jane@example.com', time: '2m ago', type: 'ticket' },
              { action: 'Badge approved', detail: '"Advanced Recall Master"', time: '15m ago', type: 'badge' },
              { action: 'Failed payment', detail: 'Business Plan - $249', time: '1h ago', type: 'billing' },
              { action: 'User flagged', detail: 'Reported for spam', time: '2h ago', type: 'moderation' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-surface-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white">{item.action}</p>
                  <p className="text-xs text-surface-500">{item.detail}</p>
                </div>
                <span className="text-xs text-surface-500">{item.time}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-surface-800">
            <Link href="/admin/audit" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all activity
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </Card>

        {/* Quick Links */}
        <Card>
          <div className="p-4 border-b border-surface-800">
            <h3 className="font-medium text-white">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-3">
            <Link
              href="/admin/support"
              className="flex items-center justify-between p-3 bg-surface-800 hover:bg-surface-700 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <HeadphonesIcon size={18} className="text-amber-400" />
                <span className="text-sm text-white">View Support Tickets</span>
              </div>
              {metrics.urgentTickets > 0 && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                  {metrics.urgentTickets} urgent
                </span>
              )}
            </Link>
            <Link
              href="/admin/badges"
              className="flex items-center justify-between p-3 bg-surface-800 hover:bg-surface-700 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Award size={18} className="text-purple-400" />
                <span className="text-sm text-white">Review Badges</span>
              </div>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                {metrics.badgeQueue} pending
              </span>
            </Link>
            <Link
              href="/admin/billing"
              className="flex items-center justify-between p-3 bg-surface-800 hover:bg-surface-700 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <DollarSign size={18} className="text-green-400" />
                <span className="text-sm text-white">Billing Overview</span>
              </div>
              <span className="flex items-center gap-1 text-green-400 text-xs">
                <TrendingUp size={12} />
                +{metrics.mrrChange}%
              </span>
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center justify-between p-3 bg-surface-800 hover:bg-surface-700 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-cyan-400" />
                <span className="text-sm text-white">Analytics Dashboard</span>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
