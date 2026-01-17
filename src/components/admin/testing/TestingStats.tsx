'use client';

import { CheckCircle2, XCircle, Clock, AlertTriangle, CircleDashed, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { TestStatusCounts } from '@/services/test-notes';

interface TestingStatsProps {
  counts: TestStatusCounts;
}

export function TestingStats({ counts }: TestingStatsProps) {
  const passRate = counts.total > 0 ? Math.round((counts.passed / counts.total) * 100) : 0;
  const testedCount = counts.total - counts.not_tested;
  const testedRate = counts.total > 0 ? Math.round((testedCount / counts.total) * 100) : 0;

  const stats = [
    {
      label: 'Total Features',
      value: counts.total,
      icon: <BarChart3 size={20} />,
      color: 'text-surface-300',
      bgColor: 'bg-surface-500/15',
    },
    {
      label: 'Passed',
      value: counts.passed,
      icon: <CheckCircle2 size={20} />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/15',
    },
    {
      label: 'Failed',
      value: counts.failed,
      icon: <XCircle size={20} />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/15',
    },
    {
      label: 'Blocked',
      value: counts.blocked,
      icon: <AlertTriangle size={20} />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/15',
    },
    {
      label: 'Testing',
      value: counts.testing,
      icon: <Clock size={20} />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/15',
    },
    {
      label: 'Not Tested',
      value: counts.not_tested,
      icon: <CircleDashed size={20} />,
      color: 'text-surface-400',
      bgColor: 'bg-surface-500/10',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Progress Bars */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Overall Testing Progress */}
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-surface-300 font-medium">Testing Progress</span>
              <span className="text-white font-semibold">{testedRate}%</span>
            </div>
            <div className="h-3 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
                style={{ width: `${testedRate}%` }}
              />
            </div>
            <p className="text-xs text-surface-500 mt-1">
              {testedCount} of {counts.total} features tested
            </p>
          </div>

          {/* Pass Rate */}
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-surface-300 font-medium">Pass Rate</span>
              <span className="text-white font-semibold">{passRate}%</span>
            </div>
            <div className="h-3 bg-surface-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  passRate >= 80
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : passRate >= 50
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                      : 'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ width: `${passRate}%` }}
              />
            </div>
            <p className="text-xs text-surface-500 mt-1">
              {counts.passed} passed out of {counts.total} total features
            </p>
          </div>

          {/* Status Breakdown Bar */}
          <div>
            <p className="text-sm text-surface-300 font-medium mb-1.5">Status Breakdown</p>
            <div className="h-6 bg-surface-700 rounded-full overflow-hidden flex">
              {counts.passed > 0 && (
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${(counts.passed / counts.total) * 100}%` }}
                  title={`Passed: ${counts.passed}`}
                />
              )}
              {counts.testing > 0 && (
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(counts.testing / counts.total) * 100}%` }}
                  title={`Testing: ${counts.testing}`}
                />
              )}
              {counts.failed > 0 && (
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${(counts.failed / counts.total) * 100}%` }}
                  title={`Failed: ${counts.failed}`}
                />
              )}
              {counts.blocked > 0 && (
                <div
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{ width: `${(counts.blocked / counts.total) * 100}%` }}
                  title={`Blocked: ${counts.blocked}`}
                />
              )}
              {counts.not_tested > 0 && (
                <div
                  className="h-full bg-surface-600 transition-all duration-500"
                  style={{ width: `${(counts.not_tested / counts.total) * 100}%` }}
                  title={`Not Tested: ${counts.not_tested}`}
                />
              )}
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-surface-400">Passed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-surface-400">Testing</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-surface-400">Failed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-surface-400">Blocked</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-surface-600" />
                <span className="text-surface-400">Not Tested</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(stat => (
          <Card key={stat.label} className="p-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-surface-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
