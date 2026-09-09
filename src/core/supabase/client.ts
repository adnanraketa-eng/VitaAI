import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function getSupabaseCredentials(): { url: string; anonKey: string } {
  const missing: string[] = [];
  if (!supabaseUrl || typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
    missing.push('VITE_SUPABASE_URL');
  }
  if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '') {
    missing.push('VITE_SUPABASE_ANON_KEY');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required Supabase environment variable(s): ${missing.join(', ')}. ` +
      `Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.`
    );
  }

  const sanitizedUrl = supabaseUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  return { url: sanitizedUrl, anonKey: supabaseAnonKey.trim() };
}

let clientInstance: SupabaseClient | null = null;

/**
 * Returns the singleton Supabase client instance.
 * Fails clearly if required environment variables are not configured.
 */
export function getSupabase(): SupabaseClient {
  if (!clientInstance) {
    const { url, anonKey } = getSupabaseCredentials();
    clientInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return clientInstance;
}

/**
 * Reusable Supabase client proxy for VitaAI Web application.
 * Evaluates credentials lazily upon access and fails clearly if configuration is missing.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const instance = getSupabase();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
