import { supabase } from '@/lib/supabase';

// Certificate templates
export const certificateTemplates = {
  basic_obedience: {
    name: 'Basic Obedience',
    title: 'Certificate of Completion',
    subtitle: 'Basic Obedience Training',
    description: 'has successfully completed the Basic Obedience Training Program',
    color: 'blue',
    icon: '🎓',
  },
  advanced_obedience: {
    name: 'Advanced Obedience',
    title: 'Certificate of Achievement',
    subtitle: 'Advanced Obedience Training',
    description: 'has demonstrated exceptional skill and completed the Advanced Obedience Training Program',
    color: 'gold',
    icon: '⭐',
  },
  board_and_train: {
    name: 'Board & Train',
    title: 'Certificate of Graduation',
    subtitle: 'Board & Train Program',
    description: 'has successfully graduated from our comprehensive Board & Train Program',
    color: 'purple',
    icon: '🏆',
  },
  puppy_foundation: {
    name: 'Puppy Foundation',
    title: 'Certificate of Completion',
    subtitle: 'Puppy Foundation Training',
    description: 'has completed the Puppy Foundation Training Program with flying colors',
    color: 'green',
    icon: '🐕',
  },
  behavior_modification: {
    name: 'Behavior Modification',
    title: 'Certificate of Progress',
    subtitle: 'Behavior Modification Program',
    description: 'has made significant progress in the Behavior Modification Program',
    color: 'teal',
    icon: '✨',
  },
  canine_good_citizen: {
    name: 'Canine Good Citizen',
    title: 'Canine Good Citizen Certificate',
    subtitle: 'AKC CGC Program',
    description: 'has passed the Canine Good Citizen evaluation and earned this prestigious certification',
    color: 'red',
    icon: '🏅',
  },
};

export type CertificateTemplate = keyof typeof certificateTemplates;

// Certificate interface
export interface Certificate {
  id: string;
  dog_id: string;
  facility_id: string;
  template: CertificateTemplate;
  custom_title?: string;
  custom_description?: string;
  issued_date: string;
  trainer_id: string;
  program_id?: string;
  skills_mastered?: string[];
  notes?: string;
  photo_url?: string;
  created_at: string;
}

// Certificates service
export const certificatesService = {
  // Get all certificates for a dog
  async getByDog(dogId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        trainer:profiles(first_name, last_name),
        program:programs(name)
      `)
      .eq('dog_id', dogId)
      .order('issued_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all certificates for a facility
  async getByFacility(facilityId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        dog:dogs(name, breed, photo_url),
        family:dogs(family:families(name)),
        trainer:profiles(first_name, last_name),
        program:programs(name)
      `)
      .eq('facility_id', facilityId)
      .order('issued_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single certificate
  async getById(id: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        dog:dogs(name, breed, photo_url, family:families(name)),
        trainer:profiles(first_name, last_name),
        program:programs(name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new certificate
  async create(certificate: Omit<Certificate, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('certificates')
      .insert(certificate)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a certificate
  async update(id: string, updates: Partial<Certificate>) {
    const { data, error } = await supabase
      .from('certificates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a certificate
  async delete(id: string) {
    const { error } = await supabase.from('certificates').delete().eq('id', id);

    if (error) throw error;
  },

  // Get recent certificates (for dashboard)
  async getRecent(facilityId: string, limit = 5) {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        dog:dogs(name, photo_url),
        trainer:profiles(first_name, last_name)
      `)
      .eq('facility_id', facilityId)
      .order('issued_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get certificate count by template
  async getCountByTemplate(facilityId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select('template')
      .eq('facility_id', facilityId);

    if (error) throw error;

    const counts: Record<string, number> = {};
    data?.forEach((cert) => {
      counts[cert.template] = (counts[cert.template] || 0) + 1;
    });

    return counts;
  },
};
