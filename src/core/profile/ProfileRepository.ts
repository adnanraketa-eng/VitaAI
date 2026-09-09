import { supabase } from '../supabase';
import {
  ProfileRow,
  SharedProfile,
  SharedProfileInput,
  SharedProfileUpdateInput,
} from './ProfileTypes';

/**
 * Maps a raw Supabase `profiles` row to the shared profile model.
 * Does not invent demo/fake data; strictly preserves database column values.
 */
function mapRowToSharedProfile(row: ProfileRow): SharedProfile {
  const numericHeight =
    row.height_cm !== null && row.height_cm !== undefined ? Number(row.height_cm) : null;

  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    date_of_birth: row.date_of_birth,
    gender: row.gender,
    height_cm: numericHeight,
    created_at: row.created_at,
    updated_at: row.updated_at,
    // Convenient camelCase aliases for Web modules
    fullName: row.full_name,
    dateOfBirth: row.date_of_birth,
    heightCm: numericHeight,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Formats Supabase PostgREST errors into clean, descriptive errors
 * without exposing internal secrets or raw connection strings.
 */
function formatSupabaseError(error: unknown, context: string): Error {
  if (error && typeof error === 'object' && 'message' in error) {
    const pgError = error as { message: string; details?: string; hint?: string; code?: string };
    const detail = pgError.details || pgError.hint;
    return new Error(`${context}: ${pgError.message}${detail ? ` (${detail})` : ''}`);
  }
  return new Error(`${context}: An unexpected error occurred while communicating with Supabase.`);
}

/**
 * Shared Profile Repository for VitaAI Web.
 * Connects directly to the central Supabase client and enforces authenticated session ownership.
 * Supported operations:
 * - getProfile(): Get the authenticated user's profile
 * - upsertProfile(): Create or upsert the authenticated user's shared profile
 * - updateProfile(): Update the authenticated user's shared profile
 */
export const ProfileRepository = {
  /**
   * Fetches the profile of the currently authenticated Supabase user.
   * Returns null if no profile row exists for the user yet (does not fabricate fake data).
   */
  async getProfile(): Promise<SharedProfile | null> {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      throw formatSupabaseError(authError, 'Failed to authenticate user session');
    }
    const user = authData?.user;
    if (!user) {
      throw new Error('No authenticated user session found. Operation requires an active login.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, date_of_birth, gender, height_cm, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      throw formatSupabaseError(error, 'Failed to fetch user profile');
    }

    if (!data) {
      return null;
    }

    return mapRowToSharedProfile(data as ProfileRow);
  },

  /**
   * Creates or upserts the shared profile for the currently authenticated user.
   * Strictly uses the authenticated user ID as the ownership authority (never UI-supplied IDs).
   * Only maps the allowed profiles columns: full_name, email, date_of_birth, gender, height_cm.
   */
  async upsertProfile(input: SharedProfileInput): Promise<SharedProfile> {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      throw formatSupabaseError(authError, 'Failed to authenticate user session');
    }
    const user = authData?.user;
    if (!user) {
      throw new Error('No authenticated user session found. Operation requires an active login.');
    }

    const fullName = input.fullName ?? input.full_name ?? null;
    const email = input.email ?? user.email ?? null;
    const dateOfBirth = input.dateOfBirth ?? input.date_of_birth ?? input.dob ?? null;
    const gender = input.gender ?? null;
    const rawHeight = input.heightCm ?? input.height_cm ?? null;
    const heightCm = rawHeight !== null && rawHeight !== undefined ? Number(rawHeight) : null;

    const row: Record<string, unknown> = {
      id: user.id, // Strictly derived from the authenticated session
      full_name: fullName,
      email: email,
      date_of_birth: dateOfBirth,
      gender: gender,
      height_cm: heightCm,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(row, { onConflict: 'id' })
      .select('id, full_name, email, date_of_birth, gender, height_cm, created_at, updated_at')
      .single();

    if (error) {
      throw formatSupabaseError(error, 'Failed to create or upsert user profile');
    }

    return mapRowToSharedProfile(data as ProfileRow);
  },

  /**
   * Updates an existing shared profile for the currently authenticated user.
   * Enforces RLS by targeting only the authenticated user's ID.
   * Only maps the allowed profiles columns: full_name, email, date_of_birth, gender, height_cm.
   */
  async updateProfile(input: SharedProfileUpdateInput): Promise<SharedProfile> {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      throw formatSupabaseError(authError, 'Failed to authenticate user session');
    }
    const user = authData?.user;
    if (!user) {
      throw new Error('No authenticated user session found. Operation requires an active login.');
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.fullName !== undefined) {
      updates.full_name = input.fullName;
    } else if (input.full_name !== undefined) {
      updates.full_name = input.full_name;
    }

    if (input.email !== undefined) {
      updates.email = input.email;
    }

    if (input.dateOfBirth !== undefined) {
      updates.date_of_birth = input.dateOfBirth;
    } else if (input.date_of_birth !== undefined) {
      updates.date_of_birth = input.date_of_birth;
    } else if (input.dob !== undefined) {
      updates.date_of_birth = input.dob;
    }

    if (input.gender !== undefined) {
      updates.gender = input.gender;
    }

    if (input.heightCm !== undefined) {
      updates.height_cm = input.heightCm !== null ? Number(input.heightCm) : null;
    } else if (input.height_cm !== undefined) {
      updates.height_cm = input.height_cm !== null ? Number(input.height_cm) : null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id) // Enforce authenticated ownership authority
      .select('id, full_name, email, date_of_birth, gender, height_cm, created_at, updated_at')
      .single();

    if (error) {
      throw formatSupabaseError(error, 'Failed to update user profile');
    }

    return mapRowToSharedProfile(data as ProfileRow);
  },
};
