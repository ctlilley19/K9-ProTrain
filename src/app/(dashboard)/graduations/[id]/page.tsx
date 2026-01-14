'use client';

import { useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { CertificatePreview } from '@/components/certificates/CertificatePreview';
import { formatDate } from '@/lib/utils';
import { certificateTemplates } from '@/services/supabase/certificates';
import {
  ArrowLeft,
  Download,
  Send,
  Edit,
  Trash2,
  Calendar,
  User,
  Award,
  Dog,
} from 'lucide-react';

// Mock certificate data
const mockCertificate = {
  id: '1',
  template: 'board_and_train' as const,
  dog: {
    id: 'a',
    name: 'Max',
    breed: 'German Shepherd',
    photo_url: null,
    family: { id: 'f1', name: 'Anderson Family', email: 'anderson@email.com' },
  },
  trainer: { id: 't1', first_name: 'Sarah', last_name: 'Johnson' },
  program: { id: 'p1', name: '4-Week Board & Train' },
  issued_date: '2025-01-10',
  created_at: '2025-01-10T15:00:00Z',
  skills_mastered: ['Sit', 'Down', 'Stay', 'Heel', 'Place', 'Recall', 'Leave It', 'Off'],
  notes: 'Max completed the program with exceptional progress. Great temperament throughout training.',
};

export default function CertificateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const certificateRef = useRef<HTMLDivElement>(null);
  const templateInfo = certificateTemplates[mockCertificate.template];

  const handleDownload = () => {
    console.log('Downloading certificate...');
    alert('In production, this would download a PDF of the certificate.');
  };

  const handleSendToFamily = () => {
    console.log('Sending to family...');
    alert('Certificate sent to ' + mockCertificate.dog.family.email);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      router.push('/graduations');
    }
  };

  return (
    <div>
      <PageHeader
        title="Certificate Details"
        description={`${mockCertificate.dog.name} - ${templateInfo.name}`}
        breadcrumbs={[
          { label: 'Graduations', href: '/graduations' },
          { label: mockCertificate.dog.name },
        ]}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Download size={16} />}
              onClick={handleDownload}
            >
              Download
            </Button>
            <Button
              variant="primary"
              leftIcon={<Send size={16} />}
              onClick={handleSendToFamily}
            >
              Send to Family
            </Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="space-y-6">
          {/* Dog Info */}
          <Card>
            <CardHeader title="Dog Information" />
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar name={mockCertificate.dog.name} size="xl" />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {mockCertificate.dog.name}
                  </h3>
                  <p className="text-surface-400">{mockCertificate.dog.breed}</p>
                  <Link
                    href={`/dogs/${mockCertificate.dog.id}`}
                    className="text-sm text-brand-400 hover:text-brand-300"
                  >
                    View dog profile →
                  </Link>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-surface-400">
                  <User size={16} />
                  <span>{mockCertificate.dog.family.name}</span>
                </div>
                <div className="flex items-center gap-2 text-surface-400">
                  <Award size={16} />
                  <span>{mockCertificate.program.name}</span>
                </div>
                <div className="flex items-center gap-2 text-surface-400">
                  <Calendar size={16} />
                  <span>Issued {formatDate(mockCertificate.issued_date, 'MMMM d, yyyy')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Info */}
          <Card>
            <CardHeader title="Certificate Information" />
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-surface-500 mb-1">Template</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{templateInfo.icon}</span>
                    <span className="font-medium text-white">{templateInfo.name}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-surface-500 mb-1">Issued By</p>
                  <p className="text-white">
                    {mockCertificate.trainer.first_name} {mockCertificate.trainer.last_name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-surface-500 mb-1">Created</p>
                  <p className="text-white">
                    {formatDate(mockCertificate.created_at, 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Mastered */}
          <Card>
            <CardHeader title="Skills Included" />
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockCertificate.skills_mastered.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-sm bg-brand-500/10 text-brand-400 border border-brand-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {mockCertificate.notes && (
            <Card>
              <CardHeader title="Notes" />
              <CardContent>
                <p className="text-surface-300">{mockCertificate.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  leftIcon={<Edit size={16} />}
                  onClick={() => router.push(`/graduations/${params.id}/edit`)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  leftIcon={<Trash2 size={16} />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Certificate Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Certificate Preview" />
            <CardContent>
              <div className="overflow-auto">
                <div className="min-w-[800px]">
                  <CertificatePreview
                    ref={certificateRef}
                    template={mockCertificate.template}
                    dogName={mockCertificate.dog.name}
                    ownerName={mockCertificate.dog.family.name}
                    facilityName="K9 Training Academy"
                    trainerName={`${mockCertificate.trainer.first_name} ${mockCertificate.trainer.last_name}`}
                    issuedDate={mockCertificate.issued_date}
                    skillsMastered={mockCertificate.skills_mastered}
                    programName={mockCertificate.program.name}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => router.back()}
        >
          Back to Certificates
        </Button>
      </div>
    </div>
  );
}
