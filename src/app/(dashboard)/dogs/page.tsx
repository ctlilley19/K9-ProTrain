'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import {
  Dog,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Calendar,
  Award,
} from 'lucide-react';

// Mock data for demo
const mockDogs = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Max',
    breed: 'German Shepherd',
    photo_url: null,
    family_name: 'Anderson Family',
    is_active: true,
    active_program: { type: 'board_train', status: 'active', name: '3-Week Board & Train' },
    badges_count: 3,
    age: '2 years',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Bella',
    breed: 'Golden Retriever',
    photo_url: null,
    family_name: 'Anderson Family',
    is_active: true,
    active_program: { type: 'day_train', status: 'active', name: 'Puppy Foundations' },
    badges_count: 1,
    age: '1 year',
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: 'Luna',
    breed: 'Border Collie',
    photo_url: null,
    family_name: 'Martinez Family',
    is_active: true,
    active_program: { type: 'board_train', status: 'active', name: '2-Week Intensive' },
    badges_count: 5,
    age: '3 years',
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    name: 'Rocky',
    breed: 'Rottweiler',
    photo_url: null,
    family_name: 'Martinez Family',
    is_active: true,
    active_program: { type: 'board_train', status: 'active', name: '3-Week Board & Train' },
    badges_count: 2,
    age: '4 years',
  },
  {
    id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    name: 'Charlie',
    breed: 'Labrador Retriever',
    photo_url: null,
    family_name: 'Thompson Family',
    is_active: true,
    active_program: null,
    badges_count: 0,
    age: '2 years',
  },
  {
    id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    name: 'Daisy',
    breed: 'Beagle',
    photo_url: null,
    family_name: 'Thompson Family',
    is_active: true,
    active_program: null,
    badges_count: 4,
    age: '1 year',
  },
];

type ViewMode = 'grid' | 'list';

function getProgramTypeColor(type: string): 'info' | 'success' | 'purple' | 'warning' {
  switch (type) {
    case 'board_train':
      return 'info';
    case 'day_train':
      return 'success';
    case 'private_lesson':
      return 'purple';
    default:
      return 'warning';
  }
}

function getProgramTypeLabel(type: string): string {
  switch (type) {
    case 'board_train':
      return 'Board & Train';
    case 'day_train':
      return 'Day Training';
    case 'private_lesson':
      return 'Private';
    case 'group_class':
      return 'Group';
    default:
      return type;
  }
}

export default function DogsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredDogs = mockDogs.filter((dog) => {
    const matchesSearch =
      dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.family_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && dog.active_program) ||
      (filterActive === 'inactive' && !dog.active_program);

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <PageHeader
        title="Dogs"
        description="Manage all dogs in your facility"
        action={
          <Link href="/dogs/new">
            <Button variant="primary" leftIcon={<Plus size={18} />}>
              Add Dog
            </Button>
          </Link>
        }
      />

      {/* Filters Bar */}
      <Card className="mb-6" padding="sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-xs">
            <Input
              placeholder="Search dogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-surface-800 rounded-lg">
              {(['all', 'active', 'inactive'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterActive(filter)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    filterActive === filter
                      ? 'bg-brand-500 text-white'
                      : 'text-surface-400 hover:text-white'
                  )}
                >
                  {filter === 'all' ? 'All' : filter === 'active' ? 'In Training' : 'Not Active'}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-surface-800 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-surface-700 text-white'
                    : 'text-surface-400 hover:text-white'
                )}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-surface-700 text-white'
                    : 'text-surface-400 hover:text-white'
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Dogs Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDogs.map((dog) => (
            <Link key={dog.id} href={`/dogs/${dog.id}`}>
              <Card
                className="h-full hover:border-brand-500/30 transition-all cursor-pointer group"
                variant="bordered"
              >
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    src={dog.photo_url}
                    name={dog.name}
                    size="xl"
                    className="mb-3"
                  />
                  <h3 className="font-semibold text-white text-lg group-hover:text-brand-400 transition-colors">
                    {dog.name}
                  </h3>
                  <p className="text-sm text-surface-400">{dog.breed}</p>
                  <p className="text-xs text-surface-500 mt-1">{dog.family_name}</p>

                  {/* Program Status */}
                  <div className="mt-4 w-full">
                    {dog.active_program ? (
                      <StatusBadge variant={getProgramTypeColor(dog.active_program.type)}>
                        {getProgramTypeLabel(dog.active_program.type)}
                      </StatusBadge>
                    ) : (
                      <StatusBadge variant="default">No Active Program</StatusBadge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-surface-700 w-full">
                    <div className="flex items-center gap-1 text-surface-400">
                      <Calendar size={14} />
                      <span className="text-xs">{dog.age}</span>
                    </div>
                    <div className="flex items-center gap-1 text-surface-400">
                      <Award size={14} />
                      <span className="text-xs">{dog.badges_count} badges</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-surface-700">
            {filteredDogs.map((dog) => (
              <Link
                key={dog.id}
                href={`/dogs/${dog.id}`}
                className="flex items-center justify-between p-4 hover:bg-surface-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar src={dog.photo_url} name={dog.name} size="md" />
                  <div>
                    <h3 className="font-medium text-white">{dog.name}</h3>
                    <p className="text-sm text-surface-400">
                      {dog.breed} • {dog.family_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {dog.active_program ? (
                    <div className="hidden sm:block text-right">
                      <p className="text-sm text-white">{dog.active_program.name}</p>
                      <StatusBadge
                        variant={getProgramTypeColor(dog.active_program.type)}
                        size="xs"
                      >
                        {getProgramTypeLabel(dog.active_program.type)}
                      </StatusBadge>
                    </div>
                  ) : (
                    <StatusBadge variant="default" size="xs">
                      No Program
                    </StatusBadge>
                  )}

                  <div className="flex items-center gap-1 text-surface-400">
                    <Award size={16} />
                    <span className="text-sm">{dog.badges_count}</span>
                  </div>

                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredDogs.length === 0 && (
        <Card className="text-center py-12">
          <Dog size={48} className="mx-auto text-surface-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No dogs found</h3>
          <p className="text-surface-400 mb-6">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Add your first dog to get started'}
          </p>
          <Link href="/dogs/new">
            <Button variant="primary" leftIcon={<Plus size={18} />}>
              Add Dog
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
