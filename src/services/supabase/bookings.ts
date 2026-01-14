import { supabase } from '@/lib/supabase';

// Booking types
export interface Booking {
  id: string;
  facility_id: string;
  family_id?: string;
  program_id?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'consultation' | 'evaluation' | 'training' | 'board_train' | 'day_train';
  date: string;
  start_time: string;
  end_time: string;
  // Contact info (for new clients)
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  // Dog info
  dog_name: string;
  dog_breed?: string;
  dog_age?: string;
  // Additional info
  notes?: string;
  goals?: string;
  source?: 'website' | 'phone' | 'referral' | 'walk_in';
  created_at: string;
}

export interface TimeSlot {
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
  booking_id?: string;
}

export interface AvailabilitySettings {
  facility_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  slot_duration: number; // minutes
  max_bookings_per_slot: number;
  enabled: boolean;
}

// Booking types configuration
export const bookingTypes = {
  consultation: {
    name: 'Free Consultation',
    duration: 30,
    description: 'Meet with a trainer to discuss your goals and our programs',
    price: 0,
  },
  evaluation: {
    name: 'Dog Evaluation',
    duration: 60,
    description: 'Comprehensive evaluation of your dog\'s behavior and training needs',
    price: 75,
  },
  training: {
    name: 'Private Training Session',
    duration: 60,
    description: 'One-on-one training session with a professional trainer',
    price: 95,
  },
  board_train: {
    name: 'Board & Train Intake',
    duration: 90,
    description: 'Drop-off appointment for board and train program',
    price: 0,
  },
  day_train: {
    name: 'Day Training Drop-off',
    duration: 15,
    description: 'Quick drop-off for day training program',
    price: 0,
  },
};

// Bookings service
export const bookingsService = {
  // Get all bookings for a facility
  async getBookings(facilityId: string, filters?: {
    status?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
  }) {
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('facility_id', facilityId)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.date) {
      query = query.eq('date', filters.date);
    }
    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get a single booking
  async getBooking(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new booking
  async createBooking(booking: Omit<Booking, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a booking
  async updateBooking(id: string, updates: Partial<Booking>) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Cancel a booking
  async cancelBooking(id: string) {
    return this.updateBooking(id, { status: 'cancelled' });
  },

  // Confirm a booking
  async confirmBooking(id: string) {
    return this.updateBooking(id, { status: 'confirmed' });
  },

  // Get available time slots for a date
  async getAvailableSlots(facilityId: string, date: string, bookingType: keyof typeof bookingTypes) {
    // Get facility availability settings
    const dayOfWeek = new Date(date).getDay();

    const { data: settings } = await supabase
      .from('availability_settings')
      .select('*')
      .eq('facility_id', facilityId)
      .eq('day_of_week', dayOfWeek)
      .eq('enabled', true)
      .single();

    if (!settings) return [];

    // Get existing bookings for the date
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .eq('facility_id', facilityId)
      .eq('date', date)
      .neq('status', 'cancelled');

    // Generate available slots
    const slots: TimeSlot[] = [];
    const duration = bookingTypes[bookingType].duration;
    const startHour = parseInt(settings.start_time.split(':')[0]);
    const endHour = parseInt(settings.end_time.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += settings.slot_duration) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinutes = minute + duration;
        const endHourCalc = hour + Math.floor(endMinutes / 60);
        const endMinuteCalc = endMinutes % 60;
        const endTime = `${endHourCalc.toString().padStart(2, '0')}:${endMinuteCalc.toString().padStart(2, '0')}`;

        // Check if slot overlaps with existing bookings
        const isBooked = existingBookings?.some((booking) => {
          return (
            (startTime >= booking.start_time && startTime < booking.end_time) ||
            (endTime > booking.start_time && endTime <= booking.end_time)
          );
        });

        // Check if slot extends past working hours
        if (endHourCalc > endHour || (endHourCalc === endHour && endMinuteCalc > 0)) {
          continue;
        }

        slots.push({
          date,
          start_time: startTime,
          end_time: endTime,
          available: !isBooked,
        });
      }
    }

    return slots;
  },

  // Get upcoming bookings count
  async getUpcomingCount(facilityId: string) {
    const today = new Date().toISOString().split('T')[0];

    const { count, error } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('facility_id', facilityId)
      .eq('status', 'confirmed')
      .gte('date', today);

    if (error) throw error;
    return count || 0;
  },

  // Get pending bookings count
  async getPendingCount(facilityId: string) {
    const { count, error } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('facility_id', facilityId)
      .eq('status', 'pending');

    if (error) throw error;
    return count || 0;
  },
};

// Intake form questions
export const intakeQuestions = [
  {
    id: 'dog_age',
    question: 'How old is your dog?',
    type: 'select',
    options: ['Puppy (under 6 months)', '6 months - 1 year', '1-3 years', '3-7 years', '7+ years'],
  },
  {
    id: 'previous_training',
    question: 'Has your dog had any previous training?',
    type: 'select',
    options: ['No previous training', 'Some basic training', 'Professional training', 'Multiple training programs'],
  },
  {
    id: 'goals',
    question: 'What are your main training goals?',
    type: 'multiselect',
    options: [
      'Basic obedience (sit, stay, come)',
      'Leash walking',
      'House training',
      'Socialization',
      'Aggression/reactivity',
      'Separation anxiety',
      'Off-leash reliability',
      'Specific tricks or tasks',
    ],
  },
  {
    id: 'concerns',
    question: 'Are there any behavioral concerns?',
    type: 'multiselect',
    options: [
      'Jumping on people',
      'Pulling on leash',
      'Barking/whining',
      'Chewing/destructive behavior',
      'Food aggression',
      'Fear/anxiety',
      'Aggression toward dogs',
      'Aggression toward people',
    ],
  },
  {
    id: 'heard_about',
    question: 'How did you hear about us?',
    type: 'select',
    options: ['Google search', 'Social media', 'Friend/family referral', 'Vet referral', 'Local advertisement', 'Other'],
  },
];
