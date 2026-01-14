'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { PhotoUpload } from '@/components/ui/PhotoUpload';
import { Dog, Save, ArrowLeft, Upload, Calendar, Scale, Palette, Trash2 } from 'lucide-react';

const dogSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  breed: z.string().max(100).optional(),
  date_of_birth: z.string().optional(),
  weight: z.coerce.number().positive().optional().or(z.literal('')),
  gender: z.enum(['male', 'female']).optional().or(z.literal('')),
  color: z.string().max(100).optional(),
  microchip_id: z.string().max(100).optional(),
  medical_notes: z.string().optional(),
  behavior_notes: z.string().optional(),
  feeding_instructions: z.string().optional(),
  medications: z.string().optional(),
});

type DogFormData = z.infer<typeof dogSchema>;

// Mock dog data
const mockDog = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  name: 'Max',
  breed: 'German Shepherd',
  date_of_birth: '2023-01-15',
  weight: 75,
  gender: 'male' as const,
  color: 'Black and Tan',
  microchip_id: 'ABC123456789',
  photo_url: null,
  family: { id: 'f1', name: 'Anderson Family' },
  medical_notes: 'Up to date on all vaccinations. No known allergies.',
  behavior_notes: 'Friendly but can be reactive to other dogs on leash. Good with people.',
  feeding_instructions: '2 cups morning, 2 cups evening - Purina Pro Plan',
  medications: 'None',
};

export default function EditDogPage() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(mockDog.photo_url);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<DogFormData>({
    resolver: zodResolver(dogSchema),
    defaultValues: {
      name: mockDog.name,
      breed: mockDog.breed,
      date_of_birth: mockDog.date_of_birth,
      weight: mockDog.weight,
      gender: mockDog.gender,
      color: mockDog.color,
      microchip_id: mockDog.microchip_id,
      medical_notes: mockDog.medical_notes,
      behavior_notes: mockDog.behavior_notes,
      feeding_instructions: mockDog.feeding_instructions,
      medications: mockDog.medications,
    },
  });

  const onSubmit = async (data: DogFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Updating dog:', { ...data, photo_url: photoUrl });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/dogs/${params.id}`);
    } catch (error) {
      console.error('Error updating dog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (file: File): Promise<string> => {
    // In real app, upload to Supabase storage
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return URL.createObjectURL(file);
  };

  return (
    <div>
      <PageHeader
        title={`Edit ${mockDog.name}`}
        description={`${mockDog.breed} • ${mockDog.family.name}`}
        breadcrumbs={[
          { label: 'Dogs', href: '/dogs' },
          { label: mockDog.name, href: `/dogs/${params.id}` },
          { label: 'Edit' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Photo */}
          <div className="space-y-6">
            <Card>
              <CardHeader title="Photo" />
              <CardContent>
                <div className="flex flex-col items-center">
                  <PhotoUpload
                    value={photoUrl}
                    onChange={setPhotoUrl}
                    onUpload={handlePhotoUpload}
                    shape="circle"
                    size="xl"
                    placeholder={
                      <div className="flex flex-col items-center">
                        <Dog size={48} className="text-surface-500" />
                        <span className="text-xs text-surface-500 mt-2">Upload photo</span>
                      </div>
                    }
                  />
                  <p className="text-xs text-surface-500 mt-4">JPG, PNG up to 5MB</p>
                </div>
              </CardContent>
            </Card>

            {/* Family Info (Read Only) */}
            <Card>
              <CardHeader title="Family" />
              <CardContent>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-800/50">
                  <Avatar name={mockDog.family.name} size="md" />
                  <div>
                    <p className="font-medium text-white">{mockDog.family.name}</p>
                    <a
                      href={`/families/${mockDog.family.id}`}
                      className="text-sm text-brand-400 hover:text-brand-300"
                    >
                      View family profile →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader title="Basic Information" />
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    {...register('name')}
                    label="Name"
                    placeholder="Dog's name"
                    leftIcon={<Dog size={16} />}
                    error={errors.name?.message}
                  />

                  <Input
                    {...register('breed')}
                    label="Breed"
                    placeholder="e.g., German Shepherd"
                    error={errors.breed?.message}
                  />

                  <Input
                    {...register('date_of_birth')}
                    type="date"
                    label="Date of Birth"
                    leftIcon={<Calendar size={16} />}
                    error={errors.date_of_birth?.message}
                  />

                  <Input
                    {...register('weight')}
                    type="number"
                    step="0.1"
                    label="Weight (lbs)"
                    placeholder="e.g., 65"
                    leftIcon={<Scale size={16} />}
                    error={errors.weight?.message}
                  />

                  <Select
                    {...register('gender')}
                    label="Gender"
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                    ]}
                    placeholder="Select gender"
                    error={errors.gender?.message}
                  />

                  <Input
                    {...register('color')}
                    label="Color"
                    placeholder="e.g., Black and Tan"
                    leftIcon={<Palette size={16} />}
                    error={errors.color?.message}
                  />

                  <Input
                    {...register('microchip_id')}
                    label="Microchip ID"
                    placeholder="Optional"
                    className="sm:col-span-2"
                    error={errors.microchip_id?.message}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Care Information */}
            <Card>
              <CardHeader title="Care Information" />
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    {...register('feeding_instructions')}
                    label="Feeding Instructions"
                    placeholder="e.g., 2 cups morning, 2 cups evening - Purina Pro Plan"
                    error={errors.feeding_instructions?.message}
                  />

                  <Textarea
                    {...register('medications')}
                    label="Medications"
                    placeholder="List any medications and dosages"
                    error={errors.medications?.message}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader title="Notes" />
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    {...register('medical_notes')}
                    label="Medical Notes"
                    placeholder="Allergies, health conditions, vaccination status, etc."
                    error={errors.medical_notes?.message}
                  />

                  <Textarea
                    {...register('behavior_notes')}
                    label="Behavior Notes"
                    placeholder="Temperament, triggers, special handling instructions, etc."
                    error={errors.behavior_notes?.message}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                leftIcon={<ArrowLeft size={16} />}
              >
                Cancel
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="danger"
                  leftIcon={<Trash2 size={16} />}
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this dog?')) {
                      // Handle delete
                    }
                  }}
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  leftIcon={<Save size={16} />}
                  disabled={!isDirty && photoUrl === mockDog.photo_url}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
