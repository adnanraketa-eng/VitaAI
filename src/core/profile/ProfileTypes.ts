/**
 * Database row representation matching the Supabase `profiles` table schema.
 * Relationship: `profiles.id` references `auth.users.id`.
 */
export interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: string | null;
  height_cm: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Shared profile model used across VitaAI Web modules
 * (Weight Loss, Diabetes Awareness, Cancer Awareness).
 * Provides dual camelCase and snake_case properties matching existing profiles columns.
 */
export interface SharedProfile extends ProfileRow {
  fullName: string | null;
  dateOfBirth: string | null;
  heightCm: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input payload for creating or upserting a shared profile.
 * Only maps to the 5 supported profile columns: full_name, email, date_of_birth, gender, height_cm.
 * The ownership ID is always derived from the authenticated Supabase session.
 */
export interface SharedProfileInput {
  fullName?: string | null;
  full_name?: string | null;
  email?: string | null;
  dateOfBirth?: string | null;
  date_of_birth?: string | null;
  dob?: string | null;
  gender?: string | null;
  heightCm?: number | null;
  height_cm?: number | null;
}

/**
 * Input payload for updating an existing shared profile.
 */
export type SharedProfileUpdateInput = SharedProfileInput;
