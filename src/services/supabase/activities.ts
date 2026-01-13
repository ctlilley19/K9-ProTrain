import { supabase } from '@/lib/supabase';
import type { Activity, ActivityWithDetails, ActivityType } from '@/types/database';

export interface CreateActivityData {
  program_id: string;
  dog_id: string;
  type: ActivityType;
  trainer_id: string;
  notes?: string;
  buddy_dog_id?: string;
  location?: string;
}

export interface UpdateActivityData {
  notes?: string;
  buddy_dog_id?: string;
  location?: string;
  ended_at?: string;
}

export interface ActivityFilters {
  dogId?: string;
  programId?: string;
  trainerId?: string;
  type?: ActivityType;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  isActive?: boolean;
}

export const activitiesService = {
  /**
   * Get activities with filters
   */
  async getAll(facilityId: string, filters?: ActivityFilters): Promise<ActivityWithDetails[]> {
    let query = supabase
      .from('activities')
      .select(`
        *,
        dog:dogs(id, name, photo_url),
        trainer:users(id, name, avatar_url),
        buddy_dog:dogs(id, name, photo_url),
        media(*)
      `)
      .eq('program.facility_id', facilityId)
      .order('started_at', { ascending: false });

    if (filters?.dogId) {
      query = query.eq('dog_id', filters.dogId);
    }

    if (filters?.programId) {
      query = query.eq('program_id', filters.programId);
    }

    if (filters?.trainerId) {
      query = query.eq('trainer_id', filters.trainerId);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.date) {
      query = query
        .gte('started_at', `${filters.date}T00:00:00`)
        .lt('started_at', `${filters.date}T23:59:59`);
    }

    if (filters?.dateFrom) {
      query = query.gte('started_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('started_at', filters.dateTo);
    }

    if (filters?.isActive === true) {
      query = query.is('ended_at', null);
    } else if (filters?.isActive === false) {
      query = query.not('ended_at', 'is', null);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as ActivityWithDetails[];
  },

  /**
   * Get current (active) activity for a dog
   */
  async getCurrentForDog(dogId: string): Promise<ActivityWithDetails | null> {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        dog:dogs(id, name, photo_url),
        trainer:users(id, name, avatar_url),
        buddy_dog:dogs(id, name, photo_url)
      `)
      .eq('dog_id', dogId)
      .is('ended_at', null)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as ActivityWithDetails;
  },

  /**
   * Get all current activities for a facility (for training board)
   */
  async getCurrentActivities(facilityId: string): Promise<ActivityWithDetails[]> {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        dog:dogs(id, name, breed, photo_url, family:families(id, name)),
        trainer:users(id, name, avatar_url),
        buddy_dog:dogs(id, name),
        program:programs!inner(id, facility_id, type, name)
      `)
      .eq('program.facility_id', facilityId)
      .eq('program.status', 'active')
      .is('ended_at', null);

    if (error) throw error;
    return data as ActivityWithDetails[];
  },

  /**
   * Get a single activity by ID
   */
  async getById(id: string): Promise<ActivityWithDetails | null> {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        dog:dogs(*, family:families(*)),
        trainer:users(id, name, avatar_url),
        buddy_dog:dogs(id, name, photo_url),
        media(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data as ActivityWithDetails;
  },

  /**
   * Start a new activity (ends current activity automatically)
   */
  async start(data: CreateActivityData): Promise<Activity> {
    // End any current activity for this dog first
    await this.endCurrentForDog(data.dog_id);

    // Create new activity
    const { data: activity, error } = await supabase
      .from('activities')
      .insert({
        ...data,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return activity;
  },

  /**
   * End an activity
   */
  async end(id: string, notes?: string): Promise<Activity> {
    const updateData: UpdateActivityData = {
      ended_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    const { data: activity, error } = await supabase
      .from('activities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return activity;
  },

  /**
   * End current activity for a dog
   */
  async endCurrentForDog(dogId: string): Promise<Activity | null> {
    const { data, error } = await supabase
      .from('activities')
      .update({ ended_at: new Date().toISOString() })
      .eq('dog_id', dogId)
      .is('ended_at', null)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No active activity
      throw error;
    }

    return data;
  },

  /**
   * Update activity notes
   */
  async updateNotes(id: string, notes: string): Promise<Activity> {
    const { data: activity, error } = await supabase
      .from('activities')
      .update({ notes })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return activity;
  },

  /**
   * Get daily summary for a dog
   */
  async getDailySummary(dogId: string, date: string): Promise<{
    type: ActivityType;
    count: number;
    totalMinutes: number;
  }[]> {
    const { data, error } = await supabase.rpc('get_dog_daily_summary', {
      p_dog_id: dogId,
      p_date: date,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Get activities for a date (for daily report)
   */
  async getForDate(dogId: string, date: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('dog_id', dogId)
      .gte('started_at', `${date}T00:00:00`)
      .lt('started_at', `${date}T23:59:59`)
      .order('started_at');

    if (error) throw error;
    return data;
  },

  /**
   * Quick activity log (for one-tap logging)
   */
  async quickLog(
    dogId: string,
    programId: string,
    type: ActivityType,
    trainerId: string,
    durationMinutes: number,
    notes?: string
  ): Promise<Activity> {
    const endedAt = new Date();
    const startedAt = new Date(endedAt.getTime() - durationMinutes * 60 * 1000);

    const { data: activity, error } = await supabase
      .from('activities')
      .insert({
        dog_id: dogId,
        program_id: programId,
        type,
        trainer_id: trainerId,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        duration_minutes: durationMinutes,
        notes,
      })
      .select()
      .single();

    if (error) throw error;
    return activity;
  },
};
