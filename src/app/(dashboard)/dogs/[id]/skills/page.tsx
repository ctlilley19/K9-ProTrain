'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import {
  skillCategories,
  skillLevels,
  getAllSkills,
} from '@/services/supabase/skills';
import {
  Target,
  ArrowLeft,
  Save,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';

// Mock dog data
const mockDog = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  name: 'Max',
  breed: 'German Shepherd',
  photo_url: null,
  family: { id: 'f1', name: 'Anderson Family' },
};

// Mock current skill levels
const mockSkillLevels: Record<string, number> = {
  sit: 5,
  down: 5,
  stay: 4,
  come: 4,
  heel: 3,
  place: 4,
  wait: 3,
  leave_it: 3,
  loose_leash: 3,
  auto_sit: 4,
  greet_people: 4,
  door_manners: 4,
  food_manners: 5,
  crate_calm: 5,
};

const levelColors: Record<string, string> = {
  surface: 'bg-surface-700 text-surface-400',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function DogSkillsPage() {
  const router = useRouter();
  const params = useParams();
  const [skills, setSkills] = useState<Record<string, number>>(mockSkillLevels);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(skillCategories))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const setSkillLevel = (skillId: string, level: number) => {
    setSkills((prev) => ({ ...prev, [skillId]: level }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      console.log('Saving skill assessments:', skills);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setHasChanges(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate summary stats
  const allSkills = getAllSkills();
  const totalSkills = allSkills.length;
  const masteredSkills = Object.values(skills).filter((l) => l === 5).length;
  const inProgressSkills = Object.values(skills).filter((l) => l > 0 && l < 5).length;
  const notStartedSkills = totalSkills - masteredSkills - inProgressSkills;
  const averageLevel =
    Object.values(skills).reduce((sum, l) => sum + l, 0) / Object.keys(skills).length || 0;

  return (
    <div>
      <PageHeader
        title={`${mockDog.name}'s Skills`}
        description="Track training progress and skill development"
        breadcrumbs={[
          { label: 'Dogs', href: '/dogs' },
          { label: mockDog.name, href: `/dogs/${params.id}` },
          { label: 'Skills' },
        ]}
        action={
          <Button
            variant="primary"
            leftIcon={<Save size={18} />}
            onClick={handleSave}
            isLoading={isSubmitting}
            disabled={!hasChanges}
          >
            Save Changes
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-green-400">{masteredSkills}</div>
          <div className="text-sm text-surface-400">Mastered</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-blue-400">{inProgressSkills}</div>
          <div className="text-sm text-surface-400">In Progress</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-surface-400">{notStartedSkills}</div>
          <div className="text-sm text-surface-400">Not Started</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-brand-400">
            {averageLevel.toFixed(1)}
          </div>
          <div className="text-sm text-surface-400">Avg Level</div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Overall Progress</span>
            <span className="text-sm text-surface-400">
              {masteredSkills}/{totalSkills} skills mastered
            </span>
          </div>
          <div className="h-3 bg-surface-700 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${(masteredSkills / totalSkills) * 100}%` }}
            />
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(inProgressSkills / totalSkills) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-surface-400">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Mastered
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              In Progress
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-surface-600" />
              Not Started
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Skill Categories */}
      <div className="space-y-4">
        {Object.entries(skillCategories).map(([categoryId, category]) => {
          const isExpanded = expandedCategories.has(categoryId);
          const categorySkills = category.skills;
          const categoryMastered = categorySkills.filter(
            (s) => skills[s.id] === 5
          ).length;
          const categoryProgress =
            categorySkills.reduce((sum, s) => sum + (skills[s.id] || 0), 0) /
            (categorySkills.length * 5);

          return (
            <Card key={categoryId}>
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(categoryId)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown size={20} className="text-surface-400" />
                  ) : (
                    <ChevronRight size={20} className="text-surface-400" />
                  )}
                  <div className="text-left">
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-surface-400">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {categoryMastered}/{categorySkills.length} mastered
                    </div>
                    <div className="w-24 h-2 bg-surface-700 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-brand-500 transition-all"
                        style={{ width: `${categoryProgress * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>

              {/* Skills List */}
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="border-t border-surface-700 pt-4 space-y-3">
                    {categorySkills.map((skill) => {
                      const currentLevel = skills[skill.id] || 0;
                      const levelInfo = skillLevels[currentLevel];

                      return (
                        <div
                          key={skill.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface-800/50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-white">{skill.name}</h4>
                              {currentLevel === 5 && (
                                <CheckCircle size={16} className="text-green-400" />
                              )}
                            </div>
                            <p className="text-sm text-surface-400">{skill.description}</p>
                          </div>

                          {/* Level Selector */}
                          <div className="flex items-center gap-1">
                            {skillLevels.map((level) => (
                              <button
                                key={level.value}
                                type="button"
                                onClick={() => setSkillLevel(skill.id, level.value)}
                                className={cn(
                                  'w-8 h-8 rounded-lg text-xs font-medium transition-all border',
                                  currentLevel === level.value
                                    ? levelColors[level.color]
                                    : 'bg-surface-700/50 text-surface-500 border-transparent hover:border-surface-600'
                                )}
                                title={level.label}
                              >
                                {level.value}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <Card className="mt-6">
        <CardHeader title="Skill Level Guide" />
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {skillLevels.map((level) => (
              <div
                key={level.value}
                className={cn(
                  'p-3 rounded-xl border text-center',
                  levelColors[level.color]
                )}
              >
                <div className="text-2xl font-bold mb-1">{level.value}</div>
                <div className="text-xs">{level.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="mt-6">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => router.back()}
        >
          Back to Dog Profile
        </Button>
      </div>
    </div>
  );
}
