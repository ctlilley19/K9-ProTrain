'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, TierBadge, ActivityBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { cn, formatDate, formatDuration } from '@/lib/utils';
import {
  ArrowLeft,
  Edit,
  Camera,
  Calendar,
  Award,
  Activity,
  FileText,
  Clock,
  Star,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Heart,
  Stethoscope,
  Utensils,
  Pill,
  Dog,
  Play,
  GraduationCap,
} from 'lucide-react';

// Mock data for a single dog
const mockDog = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  name: 'Max',
  breed: 'German Shepherd',
  photo_url: null,
  date_of_birth: '2022-03-15',
  weight: 85.5,
  gender: 'male',
  color: 'Black and Tan',
  microchip_id: '985121033567890',
  medical_notes: 'No known allergies. Vaccinations current.',
  behavior_notes: 'High energy, loves to play fetch. Responds well to positive reinforcement.',
  feeding_instructions: '2 cups morning, 2 cups evening - Purina Pro Plan',
  medications: null,
  family: {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Anderson Family',
    phone: '(301) 555-1001',
    email: 'anderson@email.com',
    address: '456 Oak Street, Waldorf, MD 20601',
    vet_name: 'Waldorf Animal Hospital',
    vet_phone: '(301) 555-8001',
  },
  active_program: {
    id: '11111111-aaaa-aaaa-aaaa-111111111111',
    type: 'board_train',
    name: '3-Week Board & Train',
    start_date: '2025-01-06',
    end_date: '2025-01-27',
    trainer: { name: 'Sarah Johnson', avatar_url: null },
    goals: ['Reliable recall', 'Loose leash walking', 'Place command'],
    progress: 45,
  },
  badges: [
    { id: '1', badge_type: 'skill_tier', tier: 'bronze', earned_at: '2025-01-10' },
    { id: '2', badge_type: 'day_one', tier: null, earned_at: '2025-01-06' },
    { id: '3', badge_type: 'week_one', tier: null, earned_at: '2025-01-13' },
  ],
  skills: [
    { name: 'Sit', proficiency: 'mastered', practice_count: 50 },
    { name: 'Down', proficiency: 'mastered', practice_count: 45 },
    { name: 'Place', proficiency: 'practicing', practice_count: 30 },
    { name: 'Recall', proficiency: 'practicing', practice_count: 35 },
    { name: 'Loose Leash Walking', proficiency: 'learning', practice_count: 20 },
  ],
  recent_activities: [
    { type: 'training', started_at: '2025-01-13T09:00:00', duration: 45, notes: 'Worked on recall' },
    { type: 'play', started_at: '2025-01-13T10:00:00', duration: 30, notes: 'Fetch session' },
    { type: 'potty', started_at: '2025-01-13T10:45:00', duration: 5, notes: null },
    { type: 'kennel', started_at: '2025-01-13T11:00:00', duration: 120, notes: 'Rest time' },
  ],
};

function getSkillColor(proficiency: string): string {
  switch (proficiency) {
    case 'mastered':
      return 'text-green-400';
    case 'practicing':
      return 'text-yellow-400';
    default:
      return 'text-blue-400';
  }
}

function getSkillBg(proficiency: string): string {
  switch (proficiency) {
    case 'mastered':
      return 'bg-green-500/10';
    case 'practicing':
      return 'bg-yellow-500/10';
    default:
      return 'bg-blue-500/10';
  }
}

function getBadgeIcon(type: string) {
  switch (type) {
    case 'skill_tier':
      return <Star size={16} />;
    case 'day_one':
      return <Calendar size={16} />;
    case 'week_one':
      return <Clock size={16} />;
    default:
      return <Award size={16} />;
  }
}

function getBadgeName(type: string): string {
  switch (type) {
    case 'skill_tier':
      return 'Skill Tier';
    case 'day_one':
      return 'Day 1';
    case 'week_one':
      return 'Week 1';
    default:
      return type;
  }
}

export default function DogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // In a real app, fetch dog data based on params.id
  const dog = mockDog;

  const age = dog.date_of_birth
    ? Math.floor(
        (new Date().getTime() - new Date(dog.date_of_birth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  return (
    <div>
      <PageHeader
        title={dog.name}
        description={`${dog.breed} • ${dog.family.name}`}
        breadcrumbs={[
          { label: 'Dogs', href: '/dogs' },
          { label: dog.name },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" leftIcon={<Camera size={18} />}>
              Add Photo
            </Button>
            <Link href={`/dogs/${dog.id}/edit`}>
              <Button variant="primary" leftIcon={<Edit size={18} />}>
                Edit
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <div className="flex flex-col items-center text-center">
              <Avatar src={dog.photo_url} name={dog.name} size="xl" className="mb-4" />
              <h2 className="text-2xl font-bold text-white">{dog.name}</h2>
              <p className="text-surface-400">{dog.breed}</p>

              <div className="flex items-center gap-4 mt-4">
                {age !== null && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{age}</p>
                    <p className="text-xs text-surface-500">years old</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{dog.weight}</p>
                  <p className="text-xs text-surface-500">lbs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{dog.badges.length}</p>
                  <p className="text-xs text-surface-500">badges</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-surface-700 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Dog size={16} className="text-surface-500" />
                <span className="text-surface-400">Gender:</span>
                <span className="text-white capitalize">{dog.gender}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Heart size={16} className="text-surface-500" />
                <span className="text-surface-400">Color:</span>
                <span className="text-white">{dog.color}</span>
              </div>
              {dog.microchip_id && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-surface-500 text-xs">ID</span>
                  <span className="text-surface-400">Microchip:</span>
                  <span className="text-white font-mono text-xs">{dog.microchip_id}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Family Info */}
          <Card>
            <CardHeader title="Family" />
            <CardContent>
              <div className="space-y-3">
                <p className="font-medium text-white">{dog.family.name}</p>
                <div className="flex items-center gap-2 text-sm text-surface-400">
                  <Phone size={14} />
                  <a href={`tel:${dog.family.phone}`} className="hover:text-white">
                    {dog.family.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-400">
                  <Mail size={14} />
                  <a href={`mailto:${dog.family.email}`} className="hover:text-white">
                    {dog.family.email}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-sm text-surface-400">
                  <MapPin size={14} className="mt-0.5" />
                  <span>{dog.family.address}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-surface-700">
                <p className="text-sm text-surface-400 mb-2">Veterinarian</p>
                <p className="font-medium text-white">{dog.family.vet_name}</p>
                <div className="flex items-center gap-2 text-sm text-surface-400 mt-1">
                  <Phone size={14} />
                  <a href={`tel:${dog.family.vet_phone}`} className="hover:text-white">
                    {dog.family.vet_phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical & Care */}
          <Card>
            <CardHeader title="Care Information" />
            <CardContent>
              <div className="space-y-4">
                {dog.feeding_instructions && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-surface-400 mb-1">
                      <Utensils size={14} />
                      <span>Feeding</span>
                    </div>
                    <p className="text-sm text-white">{dog.feeding_instructions}</p>
                  </div>
                )}
                {dog.medical_notes && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-surface-400 mb-1">
                      <Stethoscope size={14} />
                      <span>Medical Notes</span>
                    </div>
                    <p className="text-sm text-white">{dog.medical_notes}</p>
                  </div>
                )}
                {dog.behavior_notes && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-surface-400 mb-1">
                      <Dog size={14} />
                      <span>Behavior Notes</span>
                    </div>
                    <p className="text-sm text-white">{dog.behavior_notes}</p>
                  </div>
                )}
                {dog.medications && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-surface-400 mb-1">
                      <Pill size={14} />
                      <span>Medications</span>
                    </div>
                    <p className="text-sm text-white">{dog.medications}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Program & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Program */}
          {dog.active_program && (
            <Card variant="bordered" className="border-brand-500/30">
              <CardHeader
                title="Active Program"
                action={
                  <Link href={`/programs/${dog.active_program.id}`}>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </Link>
                }
              />
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {dog.active_program.name}
                    </h3>
                    <p className="text-sm text-surface-400">
                      {formatDate(dog.active_program.start_date)} -{' '}
                      {formatDate(dog.active_program.end_date)}
                    </p>
                    <p className="text-sm text-surface-400 mt-1">
                      Trainer: {dog.active_program.trainer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-brand-400">
                      {dog.active_program.progress}%
                    </div>
                    <p className="text-xs text-surface-500">Progress</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-surface-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${dog.active_program.progress}%` }}
                  />
                </div>

                {/* Goals */}
                <div className="mt-4">
                  <p className="text-sm text-surface-400 mb-2">Training Goals</p>
                  <div className="flex flex-wrap gap-2">
                    {dog.active_program.goals.map((goal, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-surface-700 text-surface-300 rounded-full"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills Grid */}
          <Card>
            <CardHeader
              title="Skills"
              action={
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              }
            />
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {dog.skills.map((skill, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-3 rounded-lg border border-surface-700',
                      getSkillBg(skill.proficiency)
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{skill.name}</span>
                      <StatusBadge
                        variant={
                          skill.proficiency === 'mastered'
                            ? 'success'
                            : skill.proficiency === 'practicing'
                            ? 'warning'
                            : 'info'
                        }
                        size="xs"
                      >
                        {skill.proficiency}
                      </StatusBadge>
                    </div>
                    <p className="text-xs text-surface-500">
                      Practiced {skill.practice_count} times
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader title="Badges Earned" />
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {dog.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-3 rounded-lg bg-surface-800/50"
                  >
                    {badge.tier ? (
                      <TierBadge tier={badge.tier as any} size="md" showLabel>
                        {getBadgeIcon(badge.badge_type)}
                      </TierBadge>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 mb-1">
                        {getBadgeIcon(badge.badge_type)}
                      </div>
                    )}
                    <span className="text-xs text-surface-400 mt-2">
                      {getBadgeName(badge.badge_type)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader
              title="Recent Activity"
              action={
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              }
            />
            <CardContent>
              <div className="space-y-3">
                {dog.recent_activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50"
                  >
                    <ActivityBadge activity={activity.type as any} size="sm">
                      {activity.type === 'training' ? (
                        <GraduationCap size={16} />
                      ) : activity.type === 'play' ? (
                        <Play size={16} />
                      ) : (
                        <Activity size={16} />
                      )}
                    </ActivityBadge>
                    <div className="flex-1">
                      <p className="text-sm text-white capitalize">{activity.type}</p>
                      {activity.notes && (
                        <p className="text-xs text-surface-400">{activity.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-surface-300">
                        {formatDuration(activity.duration)}
                      </p>
                      <p className="text-xs text-surface-500">
                        {new Date(activity.started_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Dog"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" leftIcon={<Trash2 size={16} />}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-surface-300">
          Are you sure you want to delete <strong>{dog.name}</strong>? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
