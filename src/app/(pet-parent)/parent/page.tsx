'use client';

import Link from 'next/link';
import { Card, CardHeader, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { TierBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { usePetParentDashboard } from '@/hooks';
import { useDemoFamilyTier } from '@/stores/authStore';
import {
  Dog,
  Calendar,
  Award,
  FileText,
  Image,
  Clock,
  TrendingUp,
  ChevronRight,
  Star,
  Heart,
  Sparkles,
  Loader2,
  Crown,
  BarChart3,
  Lock,
} from 'lucide-react';

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'training':
      return <Star size={14} className="text-blue-400" />;
    case 'play':
      return <Heart size={14} className="text-green-400" />;
    case 'feeding':
      return <Sparkles size={14} className="text-purple-400" />;
    default:
      return <Clock size={14} className="text-surface-400" />;
  }
}

export default function PetParentDashboard() {
  const { data, isLoading } = usePetParentDashboard();
  const tier = useDemoFamilyTier();

  const isPro = tier === 'pro';
  const isPremiumOrPro = tier === 'premium' || tier === 'pro';

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          <p className="text-surface-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome back, {data.family.name}!
          </h1>
          <p className="text-surface-400">
            Here's how your pups are doing today.
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${
          tier === 'pro'
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : tier === 'premium'
            ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
            : 'bg-surface-700 text-surface-300 border border-surface-600'
        }`}>
          {tier === 'pro' && <Crown size={14} />}
          <span className="capitalize">{tier}</span>
        </div>
      </div>

      {/* Free Tier Upgrade Banner */}
      {tier === 'free' && data.dogs.length >= 1 && (
        <Card className="bg-gradient-to-r from-brand-500/10 to-purple-500/10 border-brand-500/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center">
                  <Dog size={20} className="text-brand-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Free Plan: 1 Pet Limit</p>
                  <p className="text-sm text-surface-400">
                    Upgrade to Premium for up to 5 pets, GPS tracking, and unlimited photos
                  </p>
                </div>
              </div>
              <Link href="/parent/settings">
                <Button variant="primary" size="sm">
                  Upgrade to Premium - $10/mo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dogs Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        {(tier === 'free' ? data.dogs.slice(0, 1) : data.dogs).map((dog) => (
          <Card key={dog.id} className="overflow-hidden">
            {/* Dog Header with Gradient */}
            <div className="bg-gradient-to-r from-brand-500/20 to-purple-500/20 p-6">
              <div className="flex items-start gap-4">
                <Avatar name={dog.name} size="xl" src={dog.photo_url} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">{dog.name}</h2>
                      <p className="text-sm text-surface-400">{dog.breed}</p>
                    </div>
                    <Link href={`/parent/dogs/${dog.id}`}>
                      <Button variant="ghost" size="sm">
                        View Profile
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                  </div>

                  {/* Program Progress */}
                  {dog.program && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-surface-300">{dog.program.name}</span>
                        <span className="text-brand-400">{dog.program.progress}%</span>
                      </div>
                      <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all"
                          style={{ width: `${dog.program.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-surface-500 mt-1">
                        {dog.program.days_remaining} days remaining
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <CardContent>
              {/* Today's Activities */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-surface-400 mb-3">Today's Activities</h3>
                <div className="space-y-2">
                  {dog.today_activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-lg bg-surface-800/50"
                    >
                      <ActivityIcon type={activity.type} />
                      <span className="text-sm text-white capitalize">{activity.type}</span>
                      <span className="text-xs text-surface-500">{activity.duration} min</span>
                      <span className="ml-auto text-xs text-surface-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 pt-4 border-t border-surface-800">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-yellow-400" />
                  <span className="text-sm text-white">{dog.stats.badges_earned} badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-sm text-white">{dog.stats.skills_learned} skills</span>
                </div>
                {dog.recent_badges && dog.recent_badges.length > 0 && (
                  <div className="ml-auto">
                    <TierBadge tier={dog.recent_badges[0].tier as 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'} size="sm">
                      {dog.recent_badges[0].name}
                    </TierBadge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Badges"
          value={data.dogs.reduce((sum, d) => sum + d.stats.badges_earned, 0)}
          icon={<Award size={20} />}
          trend={{ value: 2, isPositive: true, label: 'this week' }}
        />
        <StatCard
          title="Skills Learned"
          value={data.dogs.reduce((sum, d) => sum + d.stats.skills_learned, 0)}
          icon={<TrendingUp size={20} />}
          trend={{ value: 3, isPositive: true, label: 'this week' }}
        />
        <StatCard
          title="Photos"
          value={data.recent_photos.length}
          icon={<Image size={20} />}
          trend={{ value: 4, isPositive: true, label: 'new today' }}
        />
        <StatCard
          title="Reports"
          value={data.recent_reports.length}
          icon={<FileText size={20} />}
        />
      </div>

      {/* Pro Analytics Section */}
      {isPro ? (
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardHeader
            title="Pet Analytics"
            action={
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <Crown size={14} />
                Pro Feature
              </span>
            }
          />
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-surface-800/50">
                <p className="text-2xl font-bold text-white">87%</p>
                <p className="text-xs text-surface-500">Training Consistency</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-800/50">
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-xs text-surface-500">Sessions This Week</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-800/50">
                <p className="text-2xl font-bold text-white">4.5</p>
                <p className="text-xs text-surface-500">Avg Session Length</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-800/50">
                <p className="text-2xl font-bold text-white">+23%</p>
                <p className="text-xs text-surface-500">Progress vs Last Month</p>
              </div>
            </div>
            <div className="h-32 rounded-xl bg-surface-800/50 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={32} className="mx-auto text-amber-400 mb-2" />
                <p className="text-sm text-surface-400">Weekly training progress chart</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-surface-800 to-surface-900 border-surface-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Lock size={32} className="text-surface-600 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Pet Analytics</h3>
            <p className="text-sm text-surface-400 mb-4 text-center px-4">
              Track training progress, consistency scores, and detailed insights
            </p>
            <Link href="/parent/settings">
              <Button variant="primary" className="bg-amber-500 hover:bg-amber-400">
                <Crown size={16} className="mr-2" />
                Upgrade to Pro - $19/mo
              </Button>
            </Link>
          </div>
          <CardContent className="py-16 opacity-30">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-surface-800/50 h-20" />
              <div className="p-4 rounded-xl bg-surface-800/50 h-20" />
              <div className="p-4 rounded-xl bg-surface-800/50 h-20" />
              <div className="p-4 rounded-xl bg-surface-800/50 h-20" />
            </div>
            <div className="h-32 rounded-xl bg-surface-800/50 mt-4" />
          </CardContent>
        </Card>
      )}

      {/* Recent Reports & Photos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader
            title="Recent Reports"
            action={
              <Link href="/parent/reports">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </Link>
            }
          />
          <CardContent>
            <div className="space-y-3">
              {data.recent_reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/parent/reports/${report.id}`}
                  className="flex items-start gap-3 p-3 rounded-xl bg-surface-800/50 hover:bg-surface-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                    <FileText size={18} className="text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{report.dog.name}</span>
                      <span className="text-xs text-surface-500">
                        {formatDate(report.date)}
                      </span>
                    </div>
                    <p className="text-sm text-surface-400 truncate">{report.summary}</p>
                  </div>
                  <ChevronRight size={18} className="text-surface-600" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Photos */}
        <Card>
          <CardHeader
            title="Recent Photos"
            action={
              isPremiumOrPro ? (
                <Link href="/parent/gallery">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Link>
              ) : (
                <span className="text-xs text-surface-500">Free: 10 photos/month</span>
              )
            }
          />
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {(tier === 'free' ? data.recent_photos.slice(0, 4) : data.recent_photos).map((photo) => (
                <Link
                  key={photo.id}
                  href={`/parent/gallery?photo=${photo.id}`}
                  className="aspect-square rounded-xl bg-surface-800 overflow-hidden hover:ring-2 hover:ring-brand-500/50 transition-all"
                >
                  {photo.url ? (
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-700 to-surface-800">
                      <Dog size={24} className="text-surface-600" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
            {tier === 'free' && (
              <p className="text-xs text-surface-500 mt-3 text-center">
                Upgrade to Premium for unlimited photos
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader title="Upcoming" />
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {data.upcoming.map((event, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  event.type === 'graduation'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {event.type === 'graduation' ? (
                    <Award size={20} />
                  ) : (
                    <Calendar size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{event.title}</p>
                  <p className="text-xs text-surface-500">
                    {event.dog_name} • {formatDate(event.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
