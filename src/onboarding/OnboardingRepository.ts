import { OnboardingData } from './OnboardingTypes';
import { supabase } from '../core/supabase';
import { ProfileRepository, formatSupabaseError } from '../core/profile';

const ONBOARDING_DRAFT_KEY = 'vita_onboarding_draft';

export const OnboardingRepository = {
  /**
   * Checks whether the current authenticated user has an existing profile in Supabase,
   * falling back to local completion state if unauthenticated.
   */
  async checkOnboardingCompleted(): Promise<boolean> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        return this.isOnboardingCompleted();
      }
      const profile = await ProfileRepository.getProfile();
      return profile !== null && Boolean(profile.id);
    } catch {
      return this.isOnboardingCompleted();
    }
  },

  /**
   * Checks whether onboarding was completed locally or remotely.
   */
  isOnboardingCompleted(): boolean {
    try {
      return localStorage.getItem('vita_onboarding_completed') === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Loads any in-progress draft saved during onboarding.
   */
  getOnboardingDraft(): Partial<OnboardingData> | null {
    try {
      const raw = localStorage.getItem(ONBOARDING_DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Saves intermediate progress during onboarding.
   */
  saveDraft(data: Partial<OnboardingData>): void {
    try {
      localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Unable to save onboarding draft to local storage', e);
    }
  },

  /**
   * Completes onboarding:
   * 1. If an authenticated Supabase user session exists:
   *    - Saves shared identity information to `profiles` via ProfileRepository.
   *    - Saves Weight Loss settings to `weight_loss_profiles` using existing columns.
   *    - Saves the starting weight as a real `weight_records` row.
   * 2. Persists completion flag so the user can enter and reload the application.
   * 3. Cleans up any in-progress draft in localStorage.
   */
  async completeOnboarding(data: OnboardingData): Promise<void> {
    let user = null;
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!authError && authData?.user) {
        user = authData.user;
      }
    } catch {
      // Unauthenticated session will proceed to local completion below
    }

    if (user) {
      // 1. Save shared identity information to `profiles` table via ProfileRepository
      await ProfileRepository.upsertProfile({
        fullName: data.fullName,
        email: data.email || user.email,
        dateOfBirth: data.dob,
        gender: data.gender,
        heightCm: data.heightCm,
      });

      // 2. Save Weight Loss-specific settings to existing `weight_loss_profiles` table
      const weightLossPayload = {
        user_id: user.id,
        current_weight_lb:
          data.currentWeightLb !== undefined && data.currentWeightLb !== null
            ? Number(data.currentWeightLb)
            : null,
        goal_weight_lb:
          data.goalWeightLb !== undefined && data.goalWeightLb !== null
            ? Number(data.goalWeightLb)
            : null,
        activity_level: data.activityLevel ?? null,
        target_pace: data.targetPace ?? null,
        daily_calorie_target:
          data.dailyCalorieGoalKcal !== undefined && data.dailyCalorieGoalKcal !== null
            ? Math.round(Number(data.dailyCalorieGoalKcal))
            : null,
        daily_protein_target_g:
          data.dailyProteinGoalG !== undefined && data.dailyProteinGoalG !== null
            ? Math.round(Number(data.dailyProteinGoalG))
            : null,
        food_preferences: data.dietaryPreference ? [data.dietaryPreference] : [],
        dietary_restrictions: Array.isArray(data.dietaryRestrictions)
          ? data.dietaryRestrictions
          : [],
        updated_at: new Date().toISOString(),
      };

      const { data: existingWlp, error: checkWlpError } = await supabase
        .from('weight_loss_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkWlpError) {
        throw formatSupabaseError(checkWlpError, 'Failed to check existing weight loss profile');
      }

      if (existingWlp) {
        const { error: updateWlpError } = await supabase
          .from('weight_loss_profiles')
          .update(weightLossPayload)
          .eq('user_id', user.id);

        if (updateWlpError) {
          throw formatSupabaseError(updateWlpError, 'Failed to update weight loss profile');
        }
      } else {
        const { error: insertWlpError } = await supabase
          .from('weight_loss_profiles')
          .insert(weightLossPayload);

        if (insertWlpError) {
          throw formatSupabaseError(insertWlpError, 'Failed to save weight loss profile');
        }
      }

      // 3. Save starting weight as a real `weight_records` row
      if (
        data.currentWeightLb !== undefined &&
        data.currentWeightLb !== null &&
        !isNaN(Number(data.currentWeightLb))
      ) {
        const { error: wrError } = await supabase
          .from('weight_records')
          .insert({
            user_id: user.id,
            weight_lb: Number(data.currentWeightLb),
            recorded_at: new Date().toISOString(),
          });

        if (wrError) {
          throw formatSupabaseError(wrError, 'Failed to record initial starting weight');
        }
      }
    }

    // Mark completion flag and clean up draft state
    try {
      localStorage.setItem('vita_onboarding_completed', 'true');
      localStorage.removeItem(ONBOARDING_DRAFT_KEY);
    } catch {
      // Non-critical cleanup
    }
  },

  /**
   * Resets draft and completion state.
   */
  resetOnboarding(): void {
    try {
      localStorage.removeItem(ONBOARDING_DRAFT_KEY);
      localStorage.removeItem('vita_onboarding_completed');
    } catch (e) {
      console.error('Error resetting onboarding draft', e);
    }
  },
};

