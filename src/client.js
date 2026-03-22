import { createClient } from '@supabase/supabase-js';

export function getSupabaseClientState() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return {
      client: null,
      error:
        'Creatorverse is missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before using the app.',
    };
  }

  return {
    client: createClient(url, anonKey),
    error: null,
  };
}
