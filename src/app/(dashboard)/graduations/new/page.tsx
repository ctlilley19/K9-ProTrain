'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { CertificatePreview } from '@/components/certificates/CertificatePreview';
import { cn, formatDate } from '@/lib/utils';
import {
  certificateTemplates,
  CertificateTemplate,
} from '@/services/supabase/certificates';
import { skillCategories, getAllSkills } from '@/services/supabase/skills';
import {
  GraduationCap,
  ArrowLeft,
  Save,
  Download,
  Send,
  Eye,
  CheckCircle,
  Dog,
  Calendar,
} from 'lucide-react';

// Mock dogs
const mockDogs = [
  {
    id: 'a',
    name: 'Max',
    breed: 'German Shepherd',
    photo_url: null,
    family: { id: 'f1', name: 'Anderson Family' },
    program: '4-Week Board & Train',
    skillsMastered: ['Sit', 'Down', 'Stay', 'Heel', 'Place', 'Recall'],
  },
  {
    id: 'b',
    name: 'Bella',
    breed: 'Golden Retriever',
    photo_url: null,
    family: { id: 'f1', name: 'Anderson Family' },
    program: 'Basic Obedience',
    skillsMastered: ['Sit', 'Down', 'Stay', 'Come'],
  },
  {
    id: 'c',
    name: 'Luna',
    breed: 'Border Collie',
    photo_url: null,
    family: { id: 'f2', name: 'Martinez Family' },
    program: 'Puppy Foundation',
    skillsMastered: ['Sit', 'Down', 'Name Recognition'],
  },
];

const templateColorMap: Record<string, string> = {
  blue: 'border-blue-500/50 bg-blue-500/10',
  gold: 'border-yellow-500/50 bg-yellow-500/10',
  purple: 'border-purple-500/50 bg-purple-500/10',
  green: 'border-green-500/50 bg-green-500/10',
  teal: 'border-teal-500/50 bg-teal-500/10',
  red: 'border-red-500/50 bg-red-500/10',
};

export default function NewGraduationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDog = searchParams.get('dog');
  const certificateRef = useRef<HTMLDivElement>(null);

  const [selectedDog, setSelectedDog] = useState(preselectedDog || '');
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate | ''>('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [issuedDate, setIssuedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dog = mockDogs.find((d) => d.id === selectedDog);
  const templateInfo = selectedTemplate ? certificateTemplates[selectedTemplate] : null;

  const handleDogSelect = (dogId: string) => {
    setSelectedDog(dogId);
    const selectedDogData = mockDogs.find((d) => d.id === dogId);
    if (selectedDogData) {
      setSelectedSkills(selectedDogData.skillsMastered);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      console.log('Creating certificate:', {
        dog: selectedDog,
        template: selectedTemplate,
        customTitle,
        customDescription,
        issuedDate,
        selectedSkills,
        notes,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/graduations');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    // In production, this would generate a PDF
    console.log('Downloading certificate...');
    alert('In production, this would download a PDF of the certificate.');
  };

  return (
    <div>
      <PageHeader
        title="Create Graduation Certificate"
        description="Generate a certificate for program completion"
        breadcrumbs={[
          { label: 'Graduations', href: '/graduations' },
          { label: 'New Certificate' },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Dog Selection */}
          <Card>
            <CardHeader title="Select Dog" />
            <CardContent>
              <div className="space-y-2">
                {mockDogs.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleDogSelect(d.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                      selectedDog === d.id
                        ? 'bg-brand-500/10 border-brand-500/50'
                        : 'bg-surface-800/50 border-surface-700 hover:border-surface-600'
                    )}
                  >
                    <Avatar name={d.name} size="md" />
                    <div className="flex-1">
                      <p className="font-medium text-white">{d.name}</p>
                      <p className="text-sm text-surface-500">{d.family.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-surface-500">{d.program}</p>
                      <p className="text-xs text-green-400">
                        {d.skillsMastered.length} skills
                      </p>
                    </div>
                    {selectedDog === d.id && (
                      <CheckCircle size={20} className="text-brand-400" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader title="Certificate Template" />
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(certificateTemplates).map(([id, template]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedTemplate(id as CertificateTemplate)}
                    className={cn(
                      'p-4 rounded-xl border transition-all text-left',
                      selectedTemplate === id
                        ? templateColorMap[template.color]
                        : 'bg-surface-800/50 border-surface-700 hover:border-surface-600'
                    )}
                  >
                    <div className="text-2xl mb-2">{template.icon}</div>
                    <p className="font-medium text-white">{template.name}</p>
                    <p className="text-xs text-surface-400 mt-1">{template.subtitle}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          {selectedTemplate && (
            <Card>
              <CardHeader title="Certificate Details" />
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Custom Title (optional)"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={templateInfo?.title}
                  />

                  <Textarea
                    label="Custom Description (optional)"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder={templateInfo?.description}
                    className="min-h-[80px]"
                  />

                  <Input
                    type="date"
                    label="Issue Date"
                    value={issuedDate}
                    onChange={(e) => setIssuedDate(e.target.value)}
                    leftIcon={<Calendar size={16} />}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills Mastered */}
          {dog && (
            <Card>
              <CardHeader title="Skills to Include" />
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dog.skillsMastered.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm border transition-all',
                        selectedSkills.includes(skill)
                          ? 'bg-brand-500/20 border-brand-500/50 text-brand-400'
                          : 'bg-surface-800/50 border-surface-700 text-surface-400 hover:border-surface-600'
                      )}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader title="Internal Notes" />
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any internal notes about this certificate..."
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Certificate Preview"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Eye size={14} />}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide' : 'Show'} Full Preview
                </Button>
              }
            />
            <CardContent>
              {selectedDog && selectedTemplate ? (
                <div
                  className={cn(
                    'transition-all overflow-hidden',
                    showPreview ? '' : 'max-h-[400px]'
                  )}
                >
                  <div className="transform scale-[0.5] origin-top-left w-[200%]">
                    <CertificatePreview
                      ref={certificateRef}
                      template={selectedTemplate}
                      dogName={dog?.name || ''}
                      ownerName={dog?.family.name || ''}
                      facilityName="K9 Training Academy"
                      trainerName="Sarah Johnson"
                      issuedDate={issuedDate}
                      customTitle={customTitle || undefined}
                      customDescription={customDescription || undefined}
                      skillsMastered={
                        selectedSkills.length > 0 ? selectedSkills : undefined
                      }
                      programName={dog?.program}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <GraduationCap size={48} className="text-surface-600 mb-4" />
                  <p className="text-surface-400">
                    Select a dog and template to preview the certificate
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {selectedDog && selectedTemplate && (
            <Card>
              <CardContent className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  isLoading={isSubmitting}
                  leftIcon={<Save size={16} />}
                  className="w-full"
                >
                  Save Certificate
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    leftIcon={<Download size={16} />}
                  >
                    Download PDF
                  </Button>
                  <Button variant="outline" leftIcon={<Send size={16} />}>
                    Send to Family
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
