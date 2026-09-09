import { OnboardingData } from './OnboardingTypes';

const ONBOARDING_COMPLETED_KEY = 'vita_onboarding_completed';
const ONBOARDING_DRAFT_KEY = 'vita_onboarding_draft';

export const OnboardingRepository = {
  /**
   * Checks whether the user has completed the shared VitaAI onboarding.
   */
  isOnboardingCompleted(): boolean {
    try {
      return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
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
   * Completes onboarding, marks status as completed and cleans up draft.
   */
  completeOnboarding(data: OnboardingData): void {
    try {
      const finalized = { ...data, completedAt: new Date().toISOString() };
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      localStorage.setItem('vita_onboarding_final_data', JSON.stringify(finalized));
      localStorage.removeItem(ONBOARDING_DRAFT_KEY);
    } catch (e) {
      console.error('Error committing onboarding completion', e);
    }
  },

  /**
   * Resets onboarding state (e.g. for testing or reconfiguration).
   */
  resetOnboarding(): void {
    try {
      localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      localStorage.removeItem(ONBOARDING_DRAFT_KEY);
      localStorage.removeItem('vita_onboarding_final_data');
    } catch (e) {
      console.error('Error resetting onboarding', e);
    }
  },
};
