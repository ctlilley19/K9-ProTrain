'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import {
  Edit,
  Phone,
  Mail,
  MapPin,
  Dog,
  Plus,
  Calendar,
  Award,
  Trash2,
  Users,
  AlertCircle,
  Stethoscope,
  FileText,
  ExternalLink,
} from 'lucide-react';

// Mock data
const mockFamily = {
  id: '55555555-5555-5555-5555-555555555555',
  name: 'Anderson Family',
  phone: '(301) 555-1001',
  email: 'anderson@email.com',
  address: '456 Oak Street',
  city: 'Waldorf',
  state: 'MD',
  zip: '20601',
  emergency_contact_name: 'Jane Anderson',
  emergency_contact_phone: '(301) 555-1002',
  vet_name: 'Waldorf Animal Hospital',
  vet_phone: '(301) 555-8001',
  vet_address: '789 Vet Blvd, Waldorf, MD 20601',
  notes: 'Preferred contact time is evenings after 6pm.',
  created_at: '2024-06-15',
  dogs: [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Max',
      breed: 'German Shepherd',
      photo_url: null,
      age: '2 years',
      active_program: { type: 'board_train', name: '3-Week Board & Train', status: 'active' },
      badges_count: 3,
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      name: 'Bella',
      breed: 'Golden Retriever',
      photo_url: null,
      age: '1 year',
      active_program: { type: 'day_train', name: 'Puppy Foundations', status: 'active' },
      badges_count: 1,
    },
  ],
  programs: [
    {
      id: '1',
      dog_name: 'Max',
      type: 'board_train',
      name: '3-Week Board & Train',
      start_date: '2025-01-06',
      status: 'active',
    },
    {
      id: '2',
      dog_name: 'Bella',
      type: 'day_train',
      name: 'Puppy Foundations',
      start_date: '2025-01-06',
      status: 'active',
    },
    {
      id: '3',
      dog_name: 'Max',
      type: 'private_lesson',
      name: 'Initial Evaluation',
      start_date: '2024-12-20',
      status: 'completed',
    },
  ],
};

function getProgramTypeLabel(type: string): string {
  switch (type) {
    case 'board_train':
      return 'Board & Train';
    case 'day_train':
      return 'Day Training';
    case 'private_lesson':
      return 'Private';
    default:
      return type;
  }
}

export default function FamilyDetailPage() {
  const params = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const family = mockFamily;

  return (
    <div>
      <PageHeader
        title={family.name}
        description={`Customer since ${formatDate(family.created_at, 'MMMM yyyy')}`}
        breadcrumbs={[
          { label: 'Families', href: '/families' },
          { label: family.name },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link href={`/dogs/new?family=${family.id}`}>
              <Button variant="outline" leftIcon={<Dog size={18} />}>
                Add Dog
              </Button>
            </Link>
            <Link href={`/families/${family.id}/edit`}>
              <Button variant="primary" leftIcon={<Edit size={18} />}>
                Edit
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Contact Info */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader title="Contact Information" />
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-surface-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-surface-400">Phone</p>
                    <a
                      href={`tel:${family.phone}`}
                      className="text-white hover:text-brand-400 transition-colors"
                    >
                      {family.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-surface-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-surface-400">Email</p>
                    <a
                      href={`mailto:${family.email}`}
                      className="text-white hover:text-brand-400 transition-colors"
                    >
                      {family.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-surface-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-surface-400">Address</p>
                    <p className="text-white">
                      {family.address}
                      <br />
                      {family.city}, {family.state} {family.zip}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader title="Emergency Contact" />
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400" />
                  <span className="text-white">{family.emergency_contact_name}</span>
                </div>
                <a
                  href={`tel:${family.emergency_contact_phone}`}
                  className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors"
                >
                  <Phone size={14} />
                  {family.emergency_contact_phone}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Veterinarian */}
          <Card>
            <CardHeader title="Veterinarian" />
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Stethoscope size={16} className="text-green-400" />
                  <span className="text-white">{family.vet_name}</span>
                </div>
                <a
                  href={`tel:${family.vet_phone}`}
                  className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors"
                >
                  <Phone size={14} />
                  {family.vet_phone}
                </a>
                <p className="text-sm text-surface-400">{family.vet_address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {family.notes && (
            <Card>
              <CardHeader title="Notes" />
              <CardContent>
                <p className="text-surface-300">{family.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Dogs & Programs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dogs */}
          <Card>
            <CardHeader
              title="Dogs"
              action={
                <Link href={`/dogs/new?family=${family.id}`}>
                  <Button variant="ghost" size="sm" leftIcon={<Plus size={16} />}>
                    Add Dog
                  </Button>
                </Link>
              }
            />
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {family.dogs.map((dog) => (
                  <Link
                    key={dog.id}
                    href={`/dogs/${dog.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/50 hover:bg-surface-800 transition-colors group"
                  >
                    <Avatar src={dog.photo_url} name={dog.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                        {dog.name}
                      </h3>
                      <p className="text-sm text-surface-400">{dog.breed}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {dog.active_program ? (
                          <StatusBadge variant="success" size="xs">
                            {getProgramTypeLabel(dog.active_program.type)}
                          </StatusBadge>
                        ) : (
                          <StatusBadge variant="default" size="xs">
                            No Program
                          </StatusBadge>
                        )}
                        <span className="flex items-center gap-1 text-xs text-surface-500">
                          <Award size={12} />
                          {dog.badges_count}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Program History */}
          <Card>
            <CardHeader
              title="Program History"
              action={
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              }
            />
            <CardContent>
              <div className="space-y-3">
                {family.programs.map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          program.status === 'active' ? 'bg-green-400' : 'bg-surface-500'
                        }`}
                      />
                      <div>
                        <p className="font-medium text-white">{program.name}</p>
                        <p className="text-sm text-surface-400">
                          {program.dog_name} • {formatDate(program.start_date)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge
                      variant={program.status === 'active' ? 'success' : 'default'}
                      size="xs"
                    >
                      {program.status}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start" leftIcon={<Phone size={16} />}>
                  Call Family
                </Button>
                <Button variant="outline" className="justify-start" leftIcon={<Mail size={16} />}>
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  leftIcon={<FileText size={16} />}
                >
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Family"
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
          Are you sure you want to delete the <strong>{family.name}</strong>? This will also
          remove all associated dogs and their data. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
