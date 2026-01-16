'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Dog,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Demo data
const userGrowthData = [
  { month: 'Jul', users: 850, active: 720 },
  { month: 'Aug', users: 920, active: 780 },
  { month: 'Sep', users: 1010, active: 850 },
  { month: 'Oct', users: 1150, active: 970 },
  { month: 'Nov', users: 1280, active: 1080 },
  { month: 'Dec', users: 1350, active: 1150 },
  { month: 'Jan', users: 1450, active: 1247 },
];

const revenueData = [
  { month: 'Jul', mrr: 12500, arr: 150000 },
  { month: 'Aug', mrr: 13200, arr: 158400 },
  { month: 'Sep', mrr: 14500, arr: 174000 },
  { month: 'Oct', mrr: 15800, arr: 189600 },
  { month: 'Nov', mrr: 17100, arr: 205200 },
  { month: 'Dec', mrr: 17900, arr: 214800 },
  { month: 'Jan', mrr: 18450, arr: 221400 },
];

const subscriptionData = [
  { name: 'Free', value: 680, color: '#6b7280' },
  { name: 'Basic', value: 420, color: '#3b82f6' },
  { name: 'Pro', value: 280, color: '#8b5cf6' },
  { name: 'Business', value: 70, color: '#f59e0b' },
];

const sessionData = [
  { day: 'Mon', sessions: 1850 },
  { day: 'Tue', sessions: 2100 },
  { day: 'Wed', sessions: 1950 },
  { day: 'Thu', sessions: 2200 },
  { day: 'Fri', sessions: 1750 },
  { day: 'Sat', sessions: 2450 },
  { day: 'Sun', sessions: 2150 },
];

const retentionData = [
  { week: 'Week 1', rate: 100 },
  { week: 'Week 2', rate: 82 },
  { week: 'Week 4', rate: 68 },
  { week: 'Week 8', rate: 54 },
  { week: 'Week 12', rate: 45 },
];

// Time range options
const timeRanges = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: 'YTD', value: 'ytd' },
];

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconColor,
  iconBg,
}: {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change >= 0 ? (
                <ArrowUpRight size={14} className="text-green-400" />
              ) : (
                <ArrowDownRight size={14} className="text-red-400" />
              )}
              <span className={change >= 0 ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && <span className="text-surface-500 text-sm">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Business intelligence and metrics overview"
        action={
          <div className="flex items-center gap-2">
            {/* Time Range Selector */}
            <div className="flex bg-surface-800 rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    timeRange === range.value
                      ? 'bg-brand-500 text-white'
                      : 'text-surface-400 hover:text-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />}
              onClick={refreshData}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Active Users"
          value="1,247"
          change={12}
          changeLabel="MTD"
          icon={<Users size={20} />}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Monthly Recurring Revenue"
          value="$18,450"
          change={8}
          changeLabel="MTD"
          icon={<DollarSign size={20} />}
          iconColor="text-green-400"
          iconBg="bg-green-500/10"
        />
        <StatCard
          title="Active Dogs"
          value="3,892"
          change={15}
          changeLabel="MTD"
          icon={<Dog size={20} />}
          iconColor="text-brand-400"
          iconBg="bg-brand-500/10"
        />
        <StatCard
          title="Avg Sessions/User"
          value="8.2"
          change={5}
          changeLabel="vs last month"
          icon={<Activity size={20} />}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <div className="p-4 border-b border-surface-800">
            <h3 className="font-medium text-white">User Growth</h3>
            <p className="text-sm text-surface-500">Total vs Active Users</p>
          </div>
          <div className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Total Users"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  name="Active Users"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorActive)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <div className="p-4 border-b border-surface-800">
            <h3 className="font-medium text-white">Revenue</h3>
            <p className="text-sm text-surface-500">MRR and ARR Trends</p>
          </div>
          <div className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis
                  yAxisId="left"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="mrr"
                  name="MRR"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="arr"
                  name="ARR"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Breakdown */}
        <Card>
          <div className="p-4 border-b border-surface-800">
            <h3 className="font-medium text-white">Subscription Breakdown</h3>
            <p className="text-sm text-surface-500">By plan type</p>
          </div>
          <div className="p-4 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {subscriptionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-surface-400">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Sessions by Day */}
        <Card>
          <div className="p-4 border-b border-surface-800">
            <h3 className="font-medium text-white">Sessions by Day</h3>
            <p className="text-sm text-surface-500">Training sessions this week</p>
          </div>
          <div className="p-4 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="sessions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* User Retention */}
        <Card>
          <div className="p-4 border-b border-surface-800">
            <h3 className="font-medium text-white">User Retention</h3>
            <p className="text-sm text-surface-500">Cohort retention rate</p>
          </div>
          <div className="p-4 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionData}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`${value}%`, 'Retention']}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorRetention)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-sm text-surface-400">Conversion Rate</span>
          </div>
          <p className="text-xl font-bold text-white">12.5%</p>
          <p className="text-xs text-green-400 mt-1">+2.3% vs last month</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-red-400" />
            <span className="text-sm text-surface-400">Churn Rate</span>
          </div>
          <p className="text-xl font-bold text-white">3.2%</p>
          <p className="text-xs text-green-400 mt-1">-0.8% vs last month</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-blue-400" />
            <span className="text-sm text-surface-400">Avg. Subscription Length</span>
          </div>
          <p className="text-xl font-bold text-white">8.4 months</p>
          <p className="text-xs text-surface-500 mt-1">Across all plans</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-green-400" />
            <span className="text-sm text-surface-400">LTV</span>
          </div>
          <p className="text-xl font-bold text-white">$142</p>
          <p className="text-xs text-green-400 mt-1">+$12 vs last quarter</p>
        </Card>
      </div>
    </div>
  );
}
