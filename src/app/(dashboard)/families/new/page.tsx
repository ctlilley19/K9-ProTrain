'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import {
  Users,
  Save,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';

const familySchema = z.object({
  name: z.string().min(1, 'Family name is required').max(255),
  phone: z.string().max(50).optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  zip: z.string().max(20).optional(),
  emergency_contact_name: z.string().max(255).optional(),
  emergency_contact_phone: z.string().max(50).optional(),
  vet_name: z.string().max(255).optional(),
  vet_phone: z.string().max(50).optional(),
  vet_address: z.string().max(255).optional(),
  notes: z.string().optional(),
});

type FamilyFormData = z.infer<typeof familySchema>;

export default function NewFamilyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
  });

  const onSubmit = async (data: FamilyFormData) => {
    setIsSubmitting(true);
    try {
      // In a real app, call familiesService.create(data)
      console.log('Creating family:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      router.push('/families');
    } catch (error) {
      console.error('Error creating family:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Family"
        description="Enter the family's contact information"
        breadcrumbs={[
          { label: 'Families', href: '/families' },
          { label: 'New Family' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader title="Contact Information" />
            <CardContent>
              <div className="space-y-4">
                <Input
                  {...register('name')}
                  label="Family Name"
                  placeholder="e.g., The Smith Family"
                  leftIcon={<Users size={16} />}
                  error={errors.name?.message}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    {...register('phone')}
                    label="Phone"
                    placeholder="(555) 123-4567"
                    leftIcon={<Phone size={16} />}
                    error={errors.phone?.message}
                  />

                  <Input
                    {...register('email')}
                    type="email"
                    label="Email"
                    placeholder="family@email.com"
                    leftIcon={<Mail size={16} />}
                    error={errors.email?.message}
                  />
                </div>

                <Input
                  {...register('address')}
                  label="Street Address"
                  placeholder="123 Main Street"
                  leftIcon={<MapPin size={16} />}
                  error={errors.address?.message}
                />

                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-3">
                    <Input
                      {...register('city')}
                      label="City"
                      placeholder="City"
                      error={errors.city?.message}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      {...register('state')}
                      label="State"
                      placeholder="MD"
                      error={errors.state?.message}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      {...register('zip')}
                      label="ZIP"
                      placeholder="20646"
                      error={errors.zip?.message}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader title="Emergency Contact" />
            <CardContent>
              <div className="space-y-4">
                <Input
                  {...register('emergency_contact_name')}
                  label="Emergency Contact Name"
                  placeholder="Name"
                  leftIcon={<AlertCircle size={16} />}
                  error={errors.emergency_contact_name?.message}
                />

                <Input
                  {...register('emergency_contact_phone')}
                  label="Emergency Contact Phone"
                  placeholder="(555) 987-6543"
                  leftIcon={<Phone size={16} />}
                  error={errors.emergency_contact_phone?.message}
                />
              </div>
            </CardContent>
          </Card>

          {/* Veterinarian */}
          <Card>
            <CardHeader title="Veterinarian Information" />
            <CardContent>
              <div className="space-y-4">
                <Input
                  {...register('vet_name')}
                  label="Veterinarian / Clinic Name"
                  placeholder="e.g., Main Street Animal Hospital"
                  leftIcon={<Stethoscope size={16} />}
                  error={errors.vet_name?.message}
                />

                <Input
                  {...register('vet_phone')}
                  label="Vet Phone"
                  placeholder="(555) 456-7890"
                  leftIcon={<Phone size={16} />}
                  error={errors.vet_phone?.message}
                />

                <Input
                  {...register('vet_address')}
                  label="Vet Address"
                  placeholder="456 Vet Lane, City, ST"
                  leftIcon={<MapPin size={16} />}
                  error={errors.vet_address?.message}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader title="Additional Notes" />
            <CardContent>
              <Textarea
                {...register('notes')}
                label="Notes"
                placeholder="Any additional information about this family..."
                error={errors.notes?.message}
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-6">
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
            Save Family
          </Button>
        </div>
      </form>
    </div>
  );
}
