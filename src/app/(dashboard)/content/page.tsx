'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Award,
  BookOpen,
  Video,
  FileText,
  Calendar,
  ArrowRight,
} from 'lucide-react';

const contentSections = [
  {
    title: 'Badges',
    description: 'Award and manage training badges for dogs',
    href: '/badges',
    icon: Award,
    color: 'amber',
    stats: '156 awarded',
  },
  {
    title: 'Homework',
    description: 'Create and assign homework to pet parents',
    href: '/homework',
    icon: BookOpen,
    color: 'blue',
    stats: '24 active',
  },
  {
    title: 'Videos',
    description: 'Training video library for clients',
    href: '/videos',
    icon: Video,
    color: 'purple',
    stats: '32 videos',
  },
  {
    title: 'Reports',
    description: 'Daily reports and progress summaries',
    href: '/reports',
    icon: FileText,
    color: 'green',
    stats: '89 this week',
  },
  {
    title: 'Programs',
    description: 'Training programs and curricula',
    href: '/programs',
    icon: Calendar,
    color: 'cyan',
    stats: '5 programs',
  },
];

const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
  amber: {
    bg: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    icon: 'text-amber-400',
  },
  blue: {
    bg: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    icon: 'text-blue-400',
  },
  purple: {
    bg: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    icon: 'text-purple-400',
  },
  green: {
    bg: 'from-green-500/20 to-green-500/5',
    border: 'border-green-500/20 hover:border-green-500/40',
    icon: 'text-green-400',
  },
  cyan: {
    bg: 'from-cyan-500/20 to-cyan-500/5',
    border: 'border-cyan-500/20 hover:border-cyan-500/40',
    icon: 'text-cyan-400',
  },
};

export default function ContentPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Content"
        description="Manage badges, homework, videos, reports, and programs"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentSections.map((section) => {
          const Icon = section.icon;
          const colors = colorClasses[section.color];

          return (
            <Link key={section.href} href={section.href}>
              <Card
                className={`bg-gradient-to-br ${colors.bg} ${colors.border} transition-all hover:scale-[1.02] cursor-pointer h-full`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-surface-800/50 ${colors.icon}`}>
                      <Icon size={24} />
                    </div>
                    <ArrowRight size={20} className="text-surface-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-surface-400 mb-4">
                    {section.description}
                  </p>
                  <p className="text-xs text-surface-500">{section.stats}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
