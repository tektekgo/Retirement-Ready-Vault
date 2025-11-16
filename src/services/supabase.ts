import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if env vars are missing to allow app to start
// Users will need to configure Supabase to use auth features
const isConfigured = supabaseUrl && supabaseAnonKey && 
                     supabaseUrl !== 'your-supabase-project-url' && 
                     supabaseAnonKey !== 'your-supabase-anon-key' &&
                     supabaseUrl.startsWith('http');

if (!isConfigured) {
  console.warn('⚠️ Supabase environment variables not configured. Auth features will not work.');
  console.warn('Please create a .env.local file with:');
  console.warn('  VITE_SUPABASE_URL=your-project-url');
  console.warn('  VITE_SUPABASE_ANON_KEY=your-anon-key');
}

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

// Export flag to check if Supabase is configured
export const isSupabaseConfigured = isConfigured;
