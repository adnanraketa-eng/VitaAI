import { WLMealEntry } from './WLTypes';

/**
 * TEMPORARY FRONTEND DEMO FOOD DATA
 * For Weight Loss UI visualization and testing only.
 * Exactly ONE demo food entry: Grilled Chicken Salad (Lunch).
 * NOT stored in Supabase, PostgreSQL, localStorage, sessionStorage, or IndexedDB.
 * Easily removable when connecting to real Supabase repository.
 */
export const WL_DEMO_MEAL: WLMealEntry = {
  id: 'wl_demo_meal_grilled_chicken_salad',
  type: 'lunch',
  name: 'Grilled Chicken Salad',
  calories: 420,
  proteinG: 38,
  carbsG: 18,
  fatG: 20,
  fiberG: 4,
  serving: '1 bowl',
  loggedAt: new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
  notes: 'Light vinaigrette dressing',
  aiStatus: 'AI complete',
  nutritionScore: 92,
  nutritionScoreLabel: 'High protein & balanced',
  aiChoiceStatus: 'Healthy choice',
  aiInsight: 'Lean chicken breast paired with leafy greens delivers solid protein and micronutrients with low glycemic load.',
  recommendations: [
    'Great balance of protein and healthy fats to support satiety during a calorie deficit.',
  ],
  detectedIngredients: [
    'Grilled chicken breast',
    'Mixed salad greens',
    'Cherry tomatoes',
    'Cucumber',
    'Olive oil vinaigrette',
  ],
};

/**
 * Helper to get the centralized demo meal with today's date timestamp.
 * Does not write to any persistent storage or backend.
 */
export function getWLDemoMeal(): WLMealEntry {
  const todayAtLunch = new Date();
  todayAtLunch.setHours(12, 30, 0, 0);
  return {
    ...WL_DEMO_MEAL,
    loggedAt: todayAtLunch.toISOString(),
  };
}
