import { supabase } from '@/lib/supabase';
import type { Dog, DogWithFamily, DogWithProgram } from '@/types/database';

export interface CreateDogData {
  family_id: string;
  name: string;
  breed?: string;
  date_of_birth?: string;
  weight?: number;
  gender?: 'male' | 'female';
  color?: string;
  medical_notes?: string;
  behavior_notes?: string;
  feeding_instructions?: string;
  medications?: string;
}

export interface UpdateDogData extends Partial<CreateDogData> {
  photo_url?: string;
  is_active?: boolean;
}

export interface DogFilters {
  familyId?: string;
  isActive?: boolean;
  search?: string;
  hasActiveProgram?: boolean;
}

export const dogsService = {
  /**
   * Get all dogs for a facility
   */
  async getAll(facilityId: string, filters?: DogFilters): Promise<DogWithFamily[]> {
    let query = supabase
      .from('dogs')
      .select(`
        *,
        family:families!inner(*)
      `)
      .eq('family.facility_id', facilityId)
      .order('name');

    if (filters?.familyId) {
      query = query.eq('family_id', filters.familyId);
    }

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,breed.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as DogWithFamily[];
  },

  /**
   * Get dogs with active programs (for training board)
   */
  async getActiveInTraining(facilityId: string): Promise<DogWithProgram[]> {
    const { data, error } = await supabase
      .from('dogs')
      .select(`
        *,
        family:families!inner(*),
        active_program:programs!inner(
          *,
          trainer:users(id, name, avatar_url)
        )
      `)
      .eq('family.facility_id', facilityId)
      .eq('programs.status', 'active')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data as DogWithProgram[];
  },

  /**
   * Get a single dog by ID
   */
  async getById(id: string): Promise<DogWithFamily | null> {
    const { data, error } = await supabase
      .from('dogs')
      .select(`
        *,
        family:families(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as DogWithFamily;
  },

  /**
   * Get dog with full details including programs, badges, skills
   */
  async getWithDetails(id: string): Promise<DogWithProgram & {
    badges: unknown[];
    skills: unknown[];
    programs: unknown[];
  } | null> {
    const { data, error } = await supabase
      .from('dogs')
      .select(`
        *,
        family:families(*),
        badges(*),
        skills(*),
        programs(
          *,
          trainer:users(id, name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  },

  /**
   * Create a new dog
   */
  async create(data: CreateDogData): Promise<Dog> {
    const { data: dog, error } = await supabase
      .from('dogs')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return dog;
  },

  /**
   * Update a dog
   */
  async update(id: string, data: UpdateDogData): Promise<Dog> {
    const { data: dog, error } = await supabase
      .from('dogs')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return dog;
  },

  /**
   * Soft delete a dog (mark as inactive)
   */
  async deactivate(id: string): Promise<void> {
    const { error } = await supabase
      .from('dogs')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Hard delete a dog
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Upload dog photo
   */
  async uploadPhoto(dogId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${dogId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(`dogs/${fileName}`, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(`dogs/${fileName}`);

    // Update dog record with new photo URL
    await supabase
      .from('dogs')
      .update({ photo_url: urlData.publicUrl })
      .eq('id', dogId);

    return urlData.publicUrl;
  },
};
