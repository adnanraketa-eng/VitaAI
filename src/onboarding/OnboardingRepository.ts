import { OnboardingData } from './OnboardingTypes';
import { supabase } from '../core/supabase';
import { ProfileRepository, formatSupabaseError } from '../core/profile';

const ONBOARDING_DRAFT_KEY = 'vita_onboarding_draft';

export const OnboardingRepository = {
  /**
   * Checks whether the current authenticated user has an active session and
   * complete onboarding data in Supabase. Fails closed to false if unauthenticated
   * or if required onboarding fields are missing.
   */
  async checkOnboardingCompleted(): Promise<boolean> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        return false;
      }
      const user = authData.user;

      const profile = await ProfileRepository.getProfile();
      if (!profile) {
        return false;
      }

      // 1. Shared profile must have required onboarding fields populated (not just the basic auto-created row)
      const hasValidSharedProfile = Boolean(
        profile.full_name &&
        profile.full_name.trim().length > 0 &&
        profile.date_of_birth &&
        profile.date_of_birth.trim().length > 0 &&
        profile.gender &&
        profile.gender.trim().length > 0 &&
        profile.height_cm !== null &&
        profile.height_cm !== undefined &&
        !isNaN(Number(profile.height_cm)) &&
        Number(profile.height_cm) > 0
      );

      if (!hasValidSharedProfile) {
        return false;
      }

      // 2. Weight Loss profile must exist and have current_weight_lb and goal_weight_lb populated
      const { data: wlpData, error: wlpError } = await supabase
        .from('weight_loss_profiles')
        .select('current_weight_lb, goal_weight_lb')
        .eq('user_id', user.id)
        .maybeSingle();

      if (wlpError || !wlpData) {
        return false;
      }

      const hasValidWeightLossProfile = Boolean(
        wlpData.current_weight_lb !== null &&
        wlpData.current_weight_lb !== undefined &&
        !isNaN(Number(wlpData.current_weight_lb)) &&
        Number(wlpData.current_weight_lb) > 0 &&
        wlpData.goal_weight_lb !== null &&
        wlpData.goal_weight_lb !== undefined &&
        !isNaN(Number(wlpData.goal_weight_lb)) &&
        Number(wlpData.goal_weight_lb) > 0
      );

      return hasValidWeightLossProfile;
    } catch {
      return false;
    }
  },

  /**
   * Checks whether onboarding was completed. Fails closed to false
   * so unauthenticated sessions cannot bypass onboarding through local storage.
   */
  isOnboardingCompleted(): boolean {
    return false;
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
   * 1. Requires an active authenticated Supabase user session (throws controlled error if missing).
   * 2. Saves shared identity information to `profiles` via ProfileRepository.
   * 3. Saves Weight Loss settings to `weight_loss_profiles` using existing columns.
   * 4. Saves the starting weight as a real `weight_records` row.
   * 5. Cleans up in-progress draft in localStorage.
   */
  async completeOnboarding(data: OnboardingData): Promise<void> {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      throw formatSupabaseError(authError, 'Failed to authenticate user session');
    }
    const user = authData?.user;
    if (!user) {
      throw new Error('No authenticated user session found. Operation requires an active login.');
    }

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

    // Clean up draft state and any legacy local completion keys
    try {
      localStorage.removeItem(ONBOARDING_DRAFT_KEY);
      localStorage.removeItem('vita_onboarding_completed');
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

