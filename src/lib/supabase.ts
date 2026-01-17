import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const demoModeEnv = process.env.NEXT_PUBLIC_DEMO_MODE;

// Check if we're in demo mode (explicit flag or no Supabase credentials)
export function isDemoMode(): boolean {
  // Explicit demo mode flag takes precedence
  if (demoModeEnv === 'true') return true;
  if (demoModeEnv === 'false') return false;

  // Auto-detect: no credentials means demo mode
  return !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === '';
}

// Create the Supabase client (using any to bypass strict type checking until proper types are generated)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: SupabaseClient<any, 'public', any> = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Helper to get a typed Supabase client
export function getSupabase() {
  if (isDemoMode()) {
    console.warn('Running in demo mode - Supabase operations will be simulated');
  }
  return supabase;
}
