'use client';

import Link from 'next/link';
import { useUser, useFacility, useDemoBusinessTier } from '@/stores/authStore';
import { useDashboardStats, useDogsWithPrograms, useTrainingBoard } from '@/hooks';
import { PageHeader } from '@/components/layout';
import { Card, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Dog,
  Users,
  Clock,
  Award,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Plus,
  Loader2,
  Crown,
  BarChart3,
  Lock,
} from 'lucide-react';

// Helper to get activity status label
function getActivityStatusLabel(activityType: string): string {
  const labels: Record<string, string> = {
    kennel: 'Kenneled',
    potty: 'Potty',
    training: 'Training',
    play: 'Playing',
    group_play: 'Group Play',
    feeding: 'Feeding',
    rest: 'Resting',
    walk: 'Walking',
    grooming: 'Grooming',
    medical: 'Medical',
  };
  return labels[activityType] || activityType;
}

function getActivityStatusColor(status: string): 'info' | 'success' | 'warning' | 'default' {
  switch (status) {
    case 'training':
      return 'info';
    case 'play':
    case 'group_play':
      return 'success';
    case 'kennel':
      return 'warning';
    default:
      return 'default';
  }
}

export default function DashboardPage() {
  const user = useUser();
  const facility = useFacility();
  const businessTier = useDemoBusinessTier();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: dogsWithPrograms, isLoading: dogsLoading } = useDogsWithPrograms();
  const { data: trainingBoard, isLoading: boardLoading } = useTrainingBoard();

  const isProOrBusiness = businessTier === 'professional' || businessTier === 'enterprise';
  const isBusiness = businessTier === 'enterprise';

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get dogs currently in training (from the training board)
  const dogsInFacility = trainingBoard
    ? Object.entries(trainingBoard).flatMap(([activityType, dogs]) =>
        dogs.map((dog) => ({
          ...dog,
          currentActivity: activityType,
        }))
      )
    : [];

  // Static schedule for now (could be from a bookings service later)
  const upcomingTasks = [
    { time: '10:00 AM', task: 'Group play session', dogs: 4 },
    { time: '11:30 AM', task: 'Training - Max (recall)', dogs: 1 },
    { time: '12:00 PM', task: 'Feeding time', dogs: stats?.totalDogs || 0 },
    { time: '2:00 PM', task: 'Parent video call', dogs: 1 },
  ];

  // Check for alerts (dogs kenneled too long)
  const kennelAlerts = dogsInFacility.filter((dog) => {
    if (dog.currentActivity !== 'kennel') return false;
    const elapsedMinutes = Math.floor((Date.now() - dog.startedAt.getTime()) / 60000);
    return elapsedMinutes >= 180; // 3 hours
  });

  const dashboardStats = [
    {
      title: 'Dogs in Training',
      value: stats?.totalDogs || 0,
      icon: <Dog size={24} />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Active Programs',
      value: stats?.activePrograms || 0,
      icon: <Calendar size={24} />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Badges Earned',
      value: stats?.badgesAwarded || 0,
      icon: <Award size={24} />,
      trend: { value: 25, isPositive: true },
    },
    {
      title: 'Pending Alerts',
      value: kennelAlerts.length,
      icon: <AlertTriangle size={24} />,
      trend: kennelAlerts.length > 0 ? { value: 100, isPositive: false } : undefined,
    },
  ];

  return (
    <div>
      <PageHeader
        title={`${greeting()}, ${user?.name?.split(' ')[0] || 'Trainer'}!`}
        description={`Here's what's happening at ${facility?.name || 'your facility'} today`}
        action={
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
              businessTier === 'enterprise'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : businessTier === 'professional'
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                : 'bg-surface-700 text-surface-300 border border-surface-600'
            }`}>
              {businessTier === 'enterprise' && <Crown size={12} />}
              <span className="capitalize">{businessTier === 'professional' ? 'Pro' : businessTier === 'enterprise' ? 'Business' : 'Starter'}</span>
            </div>
            <Link href="/training">
              <Button variant="primary" leftIcon={<Plus size={18} />}>
                Training Board
              </Button>
            </Link>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-20 bg-surface-700 rounded" />
            </Card>
          ))
        ) : (
          dashboardStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))
        )}
      </div>

      {/* Pro Analytics Section */}
      {isProOrBusiness ? (
        <Card className="mb-8 bg-gradient-to-br from-brand-500/10 to-purple-500/5 border-brand-500/20">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Business Analytics</h3>
              <span className="flex items-center gap-1 text-xs text-brand-400">
                {isBusiness && <Crown size={12} />}
                {isBusiness ? 'Business Feature' : 'Pro Feature'}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-surface-800/50">
                <p className="text-2xl font-bold text-white">92%</p>
                <p className="text-xs text-surface-500">Client Satisfaction</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-800/50">
                <p className="text-2xl font-bold text-white">$12.4k</p>
                <p className="text-xs text-surface-500">Monthly Revenue</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-800/50">
                <p className="text-2xl font-bold text-white">28</p>
                <p className="text-xs text-surface-500">Graduations This Month</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-800/50">
                <p className="text-2xl font-bold text-white">+18%</p>
                <p className="text-xs text-surface-500">Growth vs Last Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 bg-gradient-to-br from-surface-800 to-surface-900 border-surface-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Lock size={32} className="text-surface-600 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Business Analytics</h3>
            <p className="text-sm text-surface-400 mb-4 text-center px-4">
              Revenue tracking, client satisfaction, and growth metrics
            </p>
            <Button variant="primary">
              Upgrade to Pro - $149/mo
            </Button>
          </div>
          <CardContent className="py-12 opacity-30">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-surface-800/50 h-20" />
              <div className="p-4 rounded-xl bg-surface-800/50 h-20" />
              <div className="p-4 rounded-xl bg-surface-800/50 h-20" />
              <div className="p-4 rounded-xl bg-surface-800/50 h-20" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Dogs Overview */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Dogs in Facility</h3>
            <Link href="/dogs">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {boardLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          ) : dogsInFacility.length === 0 ? (
            <div className="text-center py-8 text-surface-400">
              <Dog size={40} className="mx-auto mb-2 opacity-50" />
              <p>No dogs currently in facility</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dogsInFacility.slice(0, 5).map((dog) => (
                <Link
                  key={dog.dogId}
                  href={`/dogs/${dog.dogId}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={dog.photoUrl} name={dog.dogName} size="sm" />
                    <div>
                      <p className="font-medium text-white">{dog.dogName}</p>
                      <p className="text-sm text-surface-400">{dog.dogBreed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-surface-400 hidden sm:block">
                      {dog.trainer}
                    </span>
                    <StatusBadge variant={getActivityStatusColor(dog.currentActivity)}>
                      {getActivityStatusLabel(dog.currentActivity)}
                    </StatusBadge>
                  </div>
                </Link>
              ))}
              {dogsInFacility.length > 5 && (
                <p className="text-center text-sm text-surface-500 pt-2">
                  +{dogsInFacility.length - 5} more dogs
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Today&apos;s Schedule</h3>
            <Button variant="ghost" size="sm">
              Full Calendar
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface-800/50"
              >
                <div className="flex-shrink-0 w-16">
                  <p className="text-sm font-medium text-brand-400">{task.time}</p>
                </div>
                <div>
                  <p className="text-sm text-white">{task.task}</p>
                  <p className="text-xs text-surface-500">
                    {task.dogs} {task.dogs === 1 ? 'dog' : 'dogs'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts Section */}
      {kennelAlerts.length > 0 && (
        <Card className="mt-6" variant="bordered">
          {kennelAlerts.map((dog) => {
            const elapsedMinutes = Math.floor((Date.now() - dog.startedAt.getTime()) / 60000);
            const hours = Math.floor(elapsedMinutes / 60);
            const minutes = elapsedMinutes % 60;

            return (
              <div key={dog.dogId} className="flex items-center gap-3 text-yellow-400">
                <AlertTriangle size={20} />
                <div className="flex-1">
                  <p className="font-medium">Kennel Time Alert</p>
                  <p className="text-sm text-surface-400">
                    {dog.dogName} has been kenneled for {hours}h {minutes}m. Consider scheduling a potty break.
                  </p>
                </div>
                <Link href="/training">
                  <Button variant="outline" size="sm">
                    Take Action
                  </Button>
                </Link>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
