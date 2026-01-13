'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Dog,
  MoreVertical,
  ChevronRight,
} from 'lucide-react';

// Mock data for demo
const mockFamilies = [
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Anderson Family',
    phone: '(301) 555-1001',
    email: 'anderson@email.com',
    address: '456 Oak Street',
    city: 'Waldorf',
    state: 'MD',
    dogs: [
      { id: 'a', name: 'Max', breed: 'German Shepherd' },
      { id: 'b', name: 'Bella', breed: 'Golden Retriever' },
    ],
    active_programs: 2,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Martinez Family',
    phone: '(301) 555-2001',
    email: 'martinez@email.com',
    address: '789 Pine Ave',
    city: 'La Plata',
    state: 'MD',
    dogs: [
      { id: 'c', name: 'Luna', breed: 'Border Collie' },
      { id: 'd', name: 'Rocky', breed: 'Rottweiler' },
    ],
    active_programs: 2,
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    name: 'Thompson Family',
    phone: '(301) 555-3001',
    email: 'thompson@email.com',
    address: '321 Maple Dr',
    city: 'Brandywine',
    state: 'MD',
    dogs: [
      { id: 'e', name: 'Charlie', breed: 'Labrador Retriever' },
      { id: 'f', name: 'Daisy', breed: 'Beagle' },
    ],
    active_programs: 0,
  },
];

export default function FamiliesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFamilies = mockFamilies.filter(
    (family) =>
      family.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      family.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      family.phone.includes(searchQuery)
  );

  return (
    <div>
      <PageHeader
        title="Families"
        description="Manage pet parent families and their dogs"
        action={
          <Link href="/families/new">
            <Button variant="primary" leftIcon={<Plus size={18} />}>
              Add Family
            </Button>
          </Link>
        }
      />

      {/* Search Bar */}
      <Card className="mb-6" padding="sm">
        <div className="max-w-md">
          <Input
            placeholder="Search families..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
      </Card>

      {/* Families List */}
      <div className="space-y-4">
        {filteredFamilies.map((family) => (
          <Card
            key={family.id}
            className="hover:border-brand-500/30 transition-all"
            variant="bordered"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Family Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                  <Users size={24} />
                </div>
                <div>
                  <Link
                    href={`/families/${family.id}`}
                    className="text-lg font-semibold text-white hover:text-brand-400 transition-colors"
                  >
                    {family.name}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-surface-400">
                    <a
                      href={`tel:${family.phone}`}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <Phone size={14} />
                      {family.phone}
                    </a>
                    <a
                      href={`mailto:${family.email}`}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <Mail size={14} />
                      {family.email}
                    </a>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {family.city}, {family.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dogs & Actions */}
              <div className="flex items-center gap-6 pl-16 lg:pl-0">
                {/* Dogs */}
                <div className="flex -space-x-2">
                  {family.dogs.slice(0, 3).map((dog) => (
                    <Avatar key={dog.id} name={dog.name} size="sm" showBorder />
                  ))}
                  {family.dogs.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-surface-600 flex items-center justify-center text-xs text-surface-300 ring-2 ring-surface-800">
                      +{family.dogs.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-surface-400">
                  <Dog size={16} />
                  <span className="text-sm">{family.dogs.length} dogs</span>
                </div>

                {family.active_programs > 0 && (
                  <div className="hidden sm:block px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                    {family.active_programs} active
                  </div>
                )}

                <Link href={`/families/${family.id}`}>
                  <Button variant="ghost" size="icon-sm">
                    <ChevronRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Dogs List Preview */}
            <div className="mt-4 pt-4 border-t border-surface-700">
              <div className="flex flex-wrap gap-2">
                {family.dogs.map((dog) => (
                  <Link
                    key={dog.id}
                    href={`/dogs/${dog.id}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 transition-colors"
                  >
                    <Avatar name={dog.name} size="xs" />
                    <span className="text-sm text-white">{dog.name}</span>
                    <span className="text-xs text-surface-500">{dog.breed}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredFamilies.length === 0 && (
        <Card className="text-center py-12">
          <Users size={48} className="mx-auto text-surface-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No families found</h3>
          <p className="text-surface-400 mb-6">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Add your first family to get started'}
          </p>
          <Link href="/families/new">
            <Button variant="primary" leftIcon={<Plus size={18} />}>
              Add Family
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
