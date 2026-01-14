'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { cn, formatDate, formatDuration } from '@/lib/utils';
import {
  Save,
  Send,
  ArrowLeft,
  Dog,
  Clock,
  Star,
  TrendingUp,
  Heart,
  Utensils,
  Moon,
  Home,
  Target,
  Droplets,
  Camera,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// Mock dogs with today's activities
const mockDogsWithActivities = [
  {
    id: 'a',
    name: 'Max',
    breed: 'German Shepherd',
    family: 'Anderson Family',
    photo_url: null,
    activities: [
      { type: 'kennel', time: '7:00 AM', duration: 60 },
      { type: 'potty', time: '8:00 AM', duration: 10, notes: 'Normal' },
      { type: 'feeding', time: '8:15 AM', duration: 15, notes: 'Ate all food' },
      { type: 'training', time: '9:00 AM', duration: 45, notes: 'Heel and recall practice' },
      { type: 'rest', time: '10:00 AM', duration: 60 },
      { type: 'play', time: '11:00 AM', duration: 30, notes: 'Yard play' },
      { type: 'feeding', time: '12:00 PM', duration: 15 },
    ],
    training_minutes: 45,
    skills_practiced: ['Heel', 'Recall', 'Stay'],
  },
  {
    id: 'b',
    name: 'Bella',
    breed: 'Golden Retriever',
    family: 'Anderson Family',
    photo_url: null,
    activities: [
      { type: 'kennel', time: '7:00 AM', duration: 60 },
      { type: 'potty', time: '8:00 AM', duration: 10 },
      { type: 'feeding', time: '8:15 AM', duration: 15 },
      { type: 'training', time: '10:00 AM', duration: 30 },
      { type: 'play', time: '11:30 AM', duration: 45 },
    ],
    training_minutes: 30,
    skills_practiced: ['Sit', 'Stay'],
  },
];

const moodOptions = [
  { value: 'excellent', label: 'Excellent - Happy & Engaged' },
  { value: 'good', label: 'Good - Normal behavior' },
  { value: 'fair', label: 'Fair - Slightly off' },
  { value: 'poor', label: 'Poor - Needs attention' },
];

const appetiteOptions = [
  { value: 'excellent', label: 'Excellent - Ate everything' },
  { value: 'good', label: 'Good - Ate most food' },
  { value: 'fair', label: 'Fair - Ate some food' },
  { value: 'poor', label: 'Poor - Barely ate' },
];

const pottyOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'soft', label: 'Soft stool' },
  { value: 'diarrhea', label: 'Diarrhea' },
  { value: 'accident', label: 'Had accident' },
];

const activityIcons: Record<string, React.ReactNode> = {
  kennel: <Home size={14} />,
  potty: <Droplets size={14} />,
  feeding: <Utensils size={14} />,
  training: <Target size={14} />,
  play: <Heart size={14} />,
  rest: <Moon size={14} />,
};

export default function NewReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDog = searchParams.get('dog');

  const [selectedDog, setSelectedDog] = useState(preselectedDog || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    summary: '',
    mood: 'good',
    energy_level: 'normal',
    appetite: 'good',
    potty: 'normal',
    highlights: [''],
    areas_to_improve: [''],
    tomorrow_focus: '',
    private_notes: '',
  });

  const dog = mockDogsWithActivities.find((d) => d.id === selectedDog);

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ''],
    }));
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => (i === index ? value : h)),
    }));
  };

  const addAreaToImprove = () => {
    setFormData((prev) => ({
      ...prev,
      areas_to_improve: [...prev.areas_to_improve, ''],
    }));
  };

  const removeAreaToImprove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      areas_to_improve: prev.areas_to_improve.filter((_, i) => i !== index),
    }));
  };

  const updateAreaToImprove = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      areas_to_improve: prev.areas_to_improve.map((a, i) => (i === index ? value : a)),
    }));
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      console.log('Saving draft:', { dog: selectedDog, ...formData });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/reports');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReport = async () => {
    setIsSending(true);
    try {
      console.log('Sending report:', { dog: selectedDog, ...formData });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/reports');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Daily Report"
        description={formatDate(new Date().toISOString(), 'EEEE, MMMM d, yyyy')}
        breadcrumbs={[
          { label: 'Reports', href: '/reports' },
          { label: 'New Report' },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Dog Selection & Activity Summary */}
        <div className="space-y-6">
          {/* Dog Selection */}
          <Card>
            <CardHeader title="Select Dog" />
            <CardContent>
              <div className="space-y-2">
                {mockDogsWithActivities.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDog(d.id)}
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
                      <p className="text-sm text-surface-500">{d.family}</p>
                    </div>
                    {selectedDog === d.id && (
                      <CheckCircle size={20} className="text-brand-400" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          {dog && (
            <Card>
              <CardHeader title="Today's Activities" />
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {dog.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-lg bg-surface-800/50"
                    >
                      <div className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center text-surface-400">
                        {activityIcons[activity.type]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white capitalize">
                          {activity.type}
                        </p>
                        {activity.notes && (
                          <p className="text-xs text-surface-500">{activity.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-surface-400">{activity.time}</p>
                        <p className="text-xs text-surface-500">{activity.duration}m</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Training Stats */}
                <div className="mt-4 pt-4 border-t border-surface-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-400">Training Time</span>
                    <span className="text-white font-medium">
                      {dog.training_minutes} minutes
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dog.skills_practiced.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded bg-brand-500/10 text-brand-400 text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Report Form */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedDog ? (
            <Card className="text-center py-12">
              <Dog size={48} className="mx-auto text-surface-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Select a Dog</h3>
              <p className="text-surface-400">
                Choose a dog from the left to create their daily report
              </p>
            </Card>
          ) : (
            <>
              {/* Summary */}
              <Card>
                <CardHeader title="Report Summary" />
                <CardContent>
                  <Textarea
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, summary: e.target.value }))
                    }
                    label="Daily Summary"
                    placeholder="How did the training session go today? What did you work on?"
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>

              {/* Status & Health */}
              <Card>
                <CardHeader title="Status & Health" />
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select
                      value={formData.mood}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, mood: e.target.value }))
                      }
                      label="Mood"
                      options={moodOptions}
                    />
                    <Select
                      value={formData.appetite}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, appetite: e.target.value }))
                      }
                      label="Appetite"
                      options={appetiteOptions}
                    />
                    <Select
                      value={formData.potty}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, potty: e.target.value }))
                      }
                      label="Potty"
                      options={pottyOptions}
                    />
                    <Select
                      value={formData.energy_level}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, energy_level: e.target.value }))
                      }
                      label="Energy Level"
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'normal', label: 'Normal' },
                        { value: 'high', label: 'High' },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Highlights */}
              <Card>
                <CardHeader
                  title="Today's Highlights"
                  action={
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Plus size={14} />}
                      onClick={addHighlight}
                    >
                      Add
                    </Button>
                  }
                />
                <CardContent>
                  <div className="space-y-3">
                    {formData.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className="flex-shrink-0 mt-2">
                          <Star size={16} className="text-yellow-400" />
                        </div>
                        <Input
                          value={highlight}
                          onChange={(e) => updateHighlight(idx, e.target.value)}
                          placeholder="What went well today?"
                          className="flex-1"
                        />
                        {formData.highlights.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeHighlight(idx)}
                          >
                            <X size={14} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Areas to Improve */}
              <Card>
                <CardHeader
                  title="Areas to Continue Working On"
                  action={
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Plus size={14} />}
                      onClick={addAreaToImprove}
                    >
                      Add
                    </Button>
                  }
                />
                <CardContent>
                  <div className="space-y-3">
                    {formData.areas_to_improve.map((area, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className="flex-shrink-0 mt-2">
                          <TrendingUp size={16} className="text-blue-400" />
                        </div>
                        <Input
                          value={area}
                          onChange={(e) => updateAreaToImprove(idx, e.target.value)}
                          placeholder="What needs more work?"
                          className="flex-1"
                        />
                        {formData.areas_to_improve.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeAreaToImprove(idx)}
                          >
                            <X size={14} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tomorrow's Focus */}
              <Card>
                <CardHeader title="Tomorrow's Focus" />
                <CardContent>
                  <Textarea
                    value={formData.tomorrow_focus}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tomorrow_focus: e.target.value }))
                    }
                    placeholder="What will you focus on in tomorrow's training?"
                    className="min-h-[80px]"
                  />
                </CardContent>
              </Card>

              {/* Private Notes */}
              <Card>
                <CardHeader
                  title="Private Notes"
                  action={
                    <span className="text-xs text-surface-500">Not shared with pet parent</span>
                  }
                />
                <CardContent>
                  <Textarea
                    value={formData.private_notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, private_notes: e.target.value }))
                    }
                    placeholder="Internal notes for staff only..."
                    className="min-h-[80px]"
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  leftIcon={<ArrowLeft size={16} />}
                >
                  Cancel
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    isLoading={isSubmitting}
                    leftIcon={<Save size={16} />}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSendReport}
                    isLoading={isSending}
                    leftIcon={<Send size={16} />}
                  >
                    Send to Family
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
