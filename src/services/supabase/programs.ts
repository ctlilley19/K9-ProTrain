import { supabase } from '@/lib/supabase';
import type { Program, ProgramWithDog, ProgramType, ProgramStatus } from '@/types/database';

export interface CreateProgramData {
  dog_id: string;
  facility_id: string;
  type: ProgramType;
  name: string;
  start_date: string;
  end_date?: string;
  assigned_trainer_id?: string;
  goals?: string[];
  notes?: string;
  price?: number;
}

export interface UpdateProgramData extends Partial<Omit<CreateProgramData, 'dog_id' | 'facility_id'>> {
  status?: ProgramStatus;
  before_photo_url?: string;
  after_photo_url?: string;
}

export interface ProgramFilters {
  dogId?: string;
  trainerId?: string;
  status?: ProgramStatus;
  type?: ProgramType;
  startDateFrom?: string;
  startDateTo?: string;
}

export const programsService = {
  /**
   * Get all programs for a facility
   */
  async getAll(facilityId: string, filters?: ProgramFilters): Promise<ProgramWithDog[]> {
    let query = supabase
      .from('programs')
      .select(`
        *,
        dog:dogs(*, family:families(*)),
        trainer:users(id, name, avatar_url)
      `)
      .eq('facility_id', facilityId)
      .order('start_date', { ascending: false });

    if (filters?.dogId) {
      query = query.eq('dog_id', filters.dogId);
    }

    if (filters?.trainerId) {
      query = query.eq('assigned_trainer_id', filters.trainerId);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.startDateFrom) {
      query = query.gte('start_date', filters.startDateFrom);
    }

    if (filters?.startDateTo) {
      query = query.lte('start_date', filters.startDateTo);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as ProgramWithDog[];
  },

  /**
   * Get active programs for a facility
   */
  async getActive(facilityId: string): Promise<ProgramWithDog[]> {
    return this.getAll(facilityId, { status: 'active' });
  },

  /**
   * Get a single program by ID
   */
  async getById(id: string): Promise<ProgramWithDog | null> {
    const { data, error } = await supabase
      .from('programs')
      .select(`
        *,
        dog:dogs(*, family:families(*)),
        trainer:users(id, name, avatar_url, email, phone)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as ProgramWithDog;
  },

  /**
   * Get program with full details (activities, reports, etc.)
   */
  async getWithDetails(id: string): Promise<ProgramWithDog & {
    activities: unknown[];
    daily_reports: unknown[];
    badges: unknown[];
  } | null> {
    const { data, error } = await supabase
      .from('programs')
      .select(`
        *,
        dog:dogs(*, family:families(*)),
        trainer:users(id, name, avatar_url),
        activities(*, trainer:users(id, name)),
        daily_reports(*),
        badges:badges(*)
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
   * Create a new program
   */
  async create(data: CreateProgramData): Promise<Program> {
    const { data: program, error } = await supabase
      .from('programs')
      .insert({
        ...data,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) throw error;
    return program;
  },

  /**
   * Update a program
   */
  async update(id: string, data: UpdateProgramData): Promise<Program> {
    const { data: program, error } = await supabase
      .from('programs')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return program;
  },

  /**
   * Start a program (change status to active)
   */
  async start(id: string): Promise<Program> {
    return this.update(id, { status: 'active' });
  },

  /**
   * Complete a program
   */
  async complete(id: string): Promise<Program> {
    return this.update(id, { status: 'completed' });
  },

  /**
   * Cancel a program
   */
  async cancel(id: string): Promise<Program> {
    return this.update(id, { status: 'cancelled' });
  },

  /**
   * Delete a program
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Get program statistics
   */
  async getStats(id: string): Promise<{
    totalActivities: number;
    trainingMinutes: number;
    playMinutes: number;
    badgesEarned: number;
    daysCompleted: number;
  }> {
    const { data, error } = await supabase
      .rpc('get_program_stats', { p_program_id: id });

    if (error) throw error;
    return data;
  },
};
