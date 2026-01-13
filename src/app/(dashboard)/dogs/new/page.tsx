'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Dog, Save, ArrowLeft, Upload, User, Calendar, Scale, Palette } from 'lucide-react';

const dogSchema = z.object({
  family_id: z.string().min(1, 'Please select a family'),
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

// Mock families for demo
const mockFamilies = [
  { value: '55555555-5555-5555-5555-555555555555', label: 'Anderson Family' },
  { value: '66666666-6666-6666-6666-666666666666', label: 'Martinez Family' },
  { value: '77777777-7777-7777-7777-777777777777', label: 'Thompson Family' },
];

export default function NewDogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DogFormData>({
    resolver: zodResolver(dogSchema),
    defaultValues: {
      gender: '',
      weight: '',
    },
  });

  const onSubmit = async (data: DogFormData) => {
    setIsSubmitting(true);
    try {
      // In a real app, call dogsService.create(data)
      console.log('Creating dog:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      router.push('/dogs');
    } catch (error) {
      console.error('Error creating dog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Dog"
        description="Enter the dog's information to add them to your facility"
        breadcrumbs={[
          { label: 'Dogs', href: '/dogs' },
          { label: 'New Dog' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Photo & Basic Info */}
          <div className="space-y-6">
            {/* Photo Upload */}
            <Card>
              <CardHeader title="Photo" />
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-surface-700 flex items-center justify-center mb-4">
                    <Dog size={48} className="text-surface-500" />
                  </div>
                  <Button variant="outline" size="sm" leftIcon={<Upload size={16} />}>
                    Upload Photo
                  </Button>
                  <p className="text-xs text-surface-500 mt-2">JPG, PNG up to 5MB</p>
                </div>
              </CardContent>
            </Card>

            {/* Family Selection */}
            <Card>
              <CardHeader title="Owner Family" />
              <CardContent>
                <Select
                  {...register('family_id')}
                  label="Select Family"
                  options={mockFamilies}
                  placeholder="Choose a family..."
                  error={errors.family_id?.message}
                />
                <p className="text-xs text-surface-500 mt-2">
                  Need to add a new family?{' '}
                  <a href="/families/new" className="text-brand-400 hover:underline">
                    Create one here
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Middle & Right Columns - Details */}
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
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                leftIcon={<ArrowLeft size={16} />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                leftIcon={<Save size={16} />}
              >
                Save Dog
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
