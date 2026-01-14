'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, cn } from '@/lib/utils';
import { certificateTemplates } from '@/services/supabase/certificates';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Dog,
  Award,
  Clock,
} from 'lucide-react';

// Mock certificates data
const mockCertificates = [
  {
    id: '1',
    template: 'board_and_train' as const,
    dog: { id: 'a', name: 'Max', breed: 'German Shepherd', photo_url: null },
    family: { name: 'Anderson Family' },
    trainer: { first_name: 'Sarah', last_name: 'Johnson' },
    program: { name: '4-Week Board & Train' },
    issued_date: '2025-01-10',
    created_at: '2025-01-10T15:00:00Z',
  },
  {
    id: '2',
    template: 'basic_obedience' as const,
    dog: { id: 'b', name: 'Bella', breed: 'Golden Retriever', photo_url: null },
    family: { name: 'Anderson Family' },
    trainer: { first_name: 'John', last_name: 'Smith' },
    program: { name: 'Basic Obedience Package' },
    issued_date: '2025-01-08',
    created_at: '2025-01-08T16:30:00Z',
  },
  {
    id: '3',
    template: 'puppy_foundation' as const,
    dog: { id: 'c', name: 'Luna', breed: 'Border Collie', photo_url: null },
    family: { name: 'Martinez Family' },
    trainer: { first_name: 'Sarah', last_name: 'Johnson' },
    program: { name: 'Puppy Starter Package' },
    issued_date: '2025-01-05',
    created_at: '2025-01-05T14:00:00Z',
  },
];

// Mock dogs ready for graduation
const dogsReadyForGraduation = [
  {
    id: 'd',
    name: 'Rocky',
    breed: 'Rottweiler',
    photo_url: null,
    family: 'Martinez Family',
    program: '2-Week Board & Train',
    completionDate: '2025-01-15',
    skillsMastered: 12,
    totalSkills: 15,
  },
  {
    id: 'e',
    name: 'Cooper',
    breed: 'Labrador',
    photo_url: null,
    family: 'Johnson Family',
    program: 'Basic Obedience',
    completionDate: '2025-01-14',
    skillsMastered: 8,
    totalSkills: 10,
  },
];

const templateColorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  gold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  green: 'bg-green-500/10 text-green-400 border-green-500/30',
  teal: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  red: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export default function GraduationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [templateFilter, setTemplateFilter] = useState<string>('all');

  const filteredCertificates = mockCertificates.filter((cert) => {
    const matchesSearch =
      cert.dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.family.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTemplate = templateFilter === 'all' || cert.template === templateFilter;
    return matchesSearch && matchesTemplate;
  });

  return (
    <div>
      <PageHeader
        title="Graduations & Certificates"
        description="Create and manage graduation certificates"
        action={
          <Link href="/graduations/new">
            <Button variant="primary" leftIcon={<Plus size={18} />}>
              Create Certificate
            </Button>
          </Link>
        }
      />

      {/* Dogs Ready for Graduation */}
      {dogsReadyForGraduation.length > 0 && (
        <Card className="mb-6 border-green-500/30 bg-green-500/5">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <GraduationCap size={18} className="text-green-400" />
                Ready for Graduation
              </span>
            }
          />
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {dogsReadyForGraduation.map((dog) => (
                <Link
                  key={dog.id}
                  href={`/graduations/new?dog=${dog.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-700 hover:border-green-500/50 transition-all"
                >
                  <Avatar name={dog.name} size="lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{dog.name}</h3>
                    <p className="text-sm text-surface-400">{dog.family}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-surface-500">{dog.program}</span>
                      <span className="text-xs text-green-400">
                        {dog.skillsMastered}/{dog.totalSkills} skills
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-surface-500">Completes</p>
                    <p className="text-sm text-white">
                      {formatDate(dog.completionDate)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-brand-400">
            {mockCertificates.length}
          </div>
          <div className="text-sm text-surface-400">Total Certificates</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-green-400">
            {mockCertificates.filter((c) => c.template === 'board_and_train').length}
          </div>
          <div className="text-sm text-surface-400">Board & Train</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-blue-400">
            {mockCertificates.filter((c) => c.template === 'basic_obedience').length}
          </div>
          <div className="text-sm text-surface-400">Obedience</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-3xl font-bold text-yellow-400">
            {dogsReadyForGraduation.length}
          </div>
          <div className="text-sm text-surface-400">Pending Graduation</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6" padding="sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Templates</option>
            {Object.entries(certificateTemplates).map(([id, template]) => (
              <option key={id} value={id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Certificates List */}
      <div className="space-y-3">
        {filteredCertificates.map((cert) => {
          const templateInfo = certificateTemplates[cert.template];

          return (
            <Card
              key={cert.id}
              className="hover:border-brand-500/30 transition-all"
              variant="bordered"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
                {/* Dog & Certificate Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar name={cert.dog.name} size="lg" />
                    <div
                      className={cn(
                        'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs border',
                        templateColorMap[templateInfo.color]
                      )}
                    >
                      {templateInfo.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{cert.dog.name}</h3>
                      <StatusBadge
                        variant="info"
                        size="xs"
                        className={templateColorMap[templateInfo.color]}
                      >
                        {templateInfo.name}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-surface-400">{cert.family.name}</p>
                    <div className="flex items-center gap-3 text-sm text-surface-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(cert.issued_date)}
                      </span>
                      {cert.program && (
                        <span className="flex items-center gap-1">
                          <Award size={14} />
                          {cert.program.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-surface-500 mr-2">
                    {cert.trainer.first_name} {cert.trainer.last_name}
                  </span>
                  <Link href={`/graduations/${cert.id}`}>
                    <Button variant="outline" size="sm" leftIcon={<Eye size={14} />}>
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Download size={14} />}
                    onClick={() => console.log('Download certificate', cert.id)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCertificates.length === 0 && (
        <Card className="text-center py-12">
          <GraduationCap size={48} className="mx-auto text-surface-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No certificates found</h3>
          <p className="text-surface-400 mb-6">
            {searchQuery || templateFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first graduation certificate'}
          </p>
          <Link href="/graduations/new">
            <Button variant="primary" leftIcon={<Plus size={18} />}>
              Create Certificate
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
