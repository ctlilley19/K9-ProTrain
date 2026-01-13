import { supabase } from '@/lib/supabase';
import type { Family, Dog } from '@/types/database';

export interface CreateFamilyData {
  facility_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  vet_name?: string;
  vet_phone?: string;
  vet_address?: string;
  notes?: string;
}

export interface UpdateFamilyData extends Partial<Omit<CreateFamilyData, 'facility_id'>> {
  primary_contact_id?: string;
}

export interface FamilyWithDogs extends Family {
  dogs: Dog[];
}

export interface FamilyFilters {
  search?: string;
  hasActiveDogs?: boolean;
}

export const familiesService = {
  /**
   * Get all families for a facility
   */
  async getAll(facilityId: string, filters?: FamilyFilters): Promise<Family[]> {
    let query = supabase
      .from('families')
      .select('*')
      .eq('facility_id', facilityId)
      .order('name');

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  /**
   * Get all families with their dogs
   */
  async getAllWithDogs(facilityId: string): Promise<FamilyWithDogs[]> {
    const { data, error } = await supabase
      .from('families')
      .select(`
        *,
        dogs(*)
      `)
      .eq('facility_id', facilityId)
      .order('name');

    if (error) throw error;
    return data as FamilyWithDogs[];
  },

  /**
   * Get a single family by ID
   */
  async getById(id: string): Promise<Family | null> {
    const { data, error } = await supabase
      .from('families')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  },

  /**
   * Get family with dogs
   */
  async getWithDogs(id: string): Promise<FamilyWithDogs | null> {
    const { data, error } = await supabase
      .from('families')
      .select(`
        *,
        dogs(*),
        primary_contact:users(id, name, email, phone)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as FamilyWithDogs;
  },

  /**
   * Create a new family
   */
  async create(data: CreateFamilyData): Promise<Family> {
    const { data: family, error } = await supabase
      .from('families')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return family;
  },

  /**
   * Update a family
   */
  async update(id: string, data: UpdateFamilyData): Promise<Family> {
    const { data: family, error } = await supabase
      .from('families')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return family;
  },

  /**
   * Delete a family
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('families')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Create pet parent user account for family
   */
  async createPetParentAccount(familyId: string, email: string, name: string): Promise<void> {
    // This would typically involve:
    // 1. Creating a Supabase Auth user
    // 2. Creating a user record with role='pet_parent'
    // 3. Linking to the family via primary_contact_id
    // For now, this is a placeholder for the full implementation
    throw new Error('Pet parent account creation not yet implemented');
  },
};
