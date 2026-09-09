import {
  WLWeightRecord,
  WLMealEntry,
  WLWaterRecord,
  WLActivityRecord,
  WLGoal,
  WLCoachMessage,
  WLDailyNutritionSummary,
} from './WLTypes';
import { getWLDemoMeal } from './WLDemoFood';

const STORAGE_KEYS = {
  WEIGHT: 'vita_wl_weight_records',
  MEALS: 'vita_wl_meal_entries',
  WATER: 'vita_wl_water_records',
  ACTIVITY: 'vita_wl_activity_records',
  GOALS: 'vita_wl_goals',
  COACH: 'vita_wl_coach_messages',
};

// Safe storage access helpers
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save ${key} to storage:`, e);
  }
}

export class WLRepository {
  /* ================= WEIGHT RECORDS ================= */
  static getWeightRecords(): WLWeightRecord[] {
    const records = loadFromStorage<WLWeightRecord[]>(STORAGE_KEYS.WEIGHT, []);
    return records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  }

  static addWeightRecord(weightLb: number, note?: string): WLWeightRecord {
    const records = this.getWeightRecords();
    const newRecord: WLWeightRecord = {
      id: `wl_wt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      weightLb,
      recordedAt: new Date().toISOString(),
      note,
    };
    const updated = [newRecord, ...records];
    saveToStorage(STORAGE_KEYS.WEIGHT, updated);
    return newRecord;
  }

  static deleteWeightRecord(id: string): void {
    const records = this.getWeightRecords().filter((r) => r.id !== id);
    saveToStorage(STORAGE_KEYS.WEIGHT, records);
  }

  static getLatestWeight(): WLWeightRecord | null {
    const records = this.getWeightRecords();
    return records.length > 0 ? records[0] : null;
  }

  static get7DayWeightAverage(): number | null {
    const records = this.getWeightRecords();
    if (records.length < 2) return null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = records.filter((r) => new Date(r.recordedAt) >= sevenDaysAgo);
    if (recent.length === 0) return null;
    const sum = recent.reduce((acc, r) => acc + r.weightLb, 0);
    return parseFloat((sum / recent.length).toFixed(1));
  }

  /* ================= MEAL ENTRIES ================= */
  static getMealEntries(): WLMealEntry[] {
    const meals = loadFromStorage<WLMealEntry[]>(STORAGE_KEYS.MEALS, []);
    if (meals.length === 0) {
      return [getWLDemoMeal()];
    }
    return meals.sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
  }

  static getTodayMeals(): WLMealEntry[] {
    const today = new Date().toDateString();
    return this.getMealEntries().filter((m) => new Date(m.loggedAt).toDateString() === today);
  }

  static getMealsForDate(date: Date | string): WLMealEntry[] {
    const dateStr = new Date(date).toDateString();
    return this.getMealEntries().filter((m) => new Date(m.loggedAt).toDateString() === dateStr);
  }

  static addMealEntry(entry: Omit<WLMealEntry, 'id' | 'loggedAt'> & { loggedAt?: string }): WLMealEntry {
    const meals = loadFromStorage<WLMealEntry[]>(STORAGE_KEYS.MEALS, []);
    const newMeal: WLMealEntry = {
      id: `wl_meal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      loggedAt: entry.loggedAt || new Date().toISOString(),
      ...entry,
    };
    saveToStorage(STORAGE_KEYS.MEALS, [newMeal, ...meals]);
    return newMeal;
  }

  static deleteMealEntry(id: string): void {
    const meals = loadFromStorage<WLMealEntry[]>(STORAGE_KEYS.MEALS, []);
    const remaining = meals.filter((m) => m.id !== id);
    saveToStorage(STORAGE_KEYS.MEALS, remaining);
  }

  static getTodayNutritionSummary(targetKcal = 1800): WLDailyNutritionSummary {
    return this.getNutritionSummaryForDate(new Date(), targetKcal);
  }

  static getNutritionSummaryForDate(date: Date | string, targetKcal = 1800): WLDailyNutritionSummary {
    const dateMeals = this.getMealsForDate(date);
    const calories = dateMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
    const proteinG = dateMeals.reduce((acc, m) => acc + (m.proteinG || 0), 0);
    const carbsG = dateMeals.reduce((acc, m) => acc + (m.carbsG || 0), 0);
    const fatG = dateMeals.reduce((acc, m) => acc + (m.fatG || 0), 0);
    const fiberG = dateMeals.reduce((acc, m) => acc + (m.fiberG || 0), 0);
    const remainingCalories = Math.max(0, targetKcal - calories);
    const waterL = this.getWaterForDate(date);
    const analysesCount = dateMeals.filter((m) => m.aiStatus === 'AI complete' || m.nutritionScore !== undefined || !!m.aiInsight).length;

    return {
      calories,
      proteinG,
      carbsG,
      fatG,
      fiberG,
      waterL,
      analysesCount,
      remainingCalories,
    };
  }

  /* ================= WATER RECORDS ================= */
  static getWaterRecords(): WLWaterRecord[] {
    const records = loadFromStorage<WLWaterRecord[]>(STORAGE_KEYS.WATER, []);
    return records.sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
  }

  static getTodayWaterL(): number {
    return this.getWaterForDate(new Date());
  }

  static getWaterForDate(date: Date | string): number {
    const targetDateStr = new Date(date).toDateString();
    const records = this.getWaterRecords().filter((r) => new Date(r.loggedAt).toDateString() === targetDateStr);
    const sum = records.reduce((acc, r) => acc + r.amountL, 0);
    return parseFloat(sum.toFixed(2));
  }

  static addWater(amountL: number): WLWaterRecord {
    const records = this.getWaterRecords();
    const newRecord: WLWaterRecord = {
      id: `wl_wtr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amountL,
      loggedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.WATER, [newRecord, ...records]);
    return newRecord;
  }

  static clearTodayWater(): void {
    const today = new Date().toDateString();
    const records = this.getWaterRecords().filter((r) => new Date(r.loggedAt).toDateString() !== today);
    saveToStorage(STORAGE_KEYS.WATER, records);
  }

  /* ================= ACTIVITY RECORDS ================= */
  static getActivityRecords(): WLActivityRecord[] {
    const records = loadFromStorage<WLActivityRecord[]>(STORAGE_KEYS.ACTIVITY, []);
    return records.sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
  }

  static getTodayActivity(): { steps: number; exerciseMin: number; caloriesBurned: number } {
    const today = new Date().toDateString();
    const todayRecords = this.getActivityRecords().filter((r) => new Date(r.loggedAt).toDateString() === today);
    const steps = todayRecords.reduce((acc, r) => acc + r.steps, 0);
    const exerciseMin = todayRecords.reduce((acc, r) => acc + r.exerciseMin, 0);
    const caloriesBurned = todayRecords.reduce((acc, r) => acc + r.caloriesBurned, 0);
    return { steps, exerciseMin, caloriesBurned };
  }

  static addActivityRecord(activity: Omit<WLActivityRecord, 'id' | 'loggedAt'>): WLActivityRecord {
    const records = this.getActivityRecords();
    const newRecord: WLActivityRecord = {
      id: `wl_act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      loggedAt: new Date().toISOString(),
      ...activity,
    };
    saveToStorage(STORAGE_KEYS.ACTIVITY, [newRecord, ...records]);
    return newRecord;
  }

  /* ================= GOALS & HABITS ================= */
  static getGoals(): WLGoal {
    return loadFromStorage<WLGoal>(STORAGE_KEYS.GOALS, {
      currentWeightLb: 164.2,
      goalWeightLb: 145,
      startWeightLb: 172.5,
      targetPace: '1 lb / week',
      dailyStepGoal: 8500,
      dailyWaterGoalL: 2.5,
      dailyCalorieGoalKcal: 1800,
      dailyProteinGoalG: 120,
      dailyCarbsGoalG: 200,
      dailyFatGoalG: 65,
      dailyFiberGoalG: 30,
      dietaryPreferences: ['High-protein', 'Balanced whole foods'],
      healthyHabits: [
        { id: 'h1', title: 'Drink 2.5L water daily', completed: false },
        { id: 'h2', title: 'Log every meal and snack', completed: false },
        { id: 'h3', title: 'Reach daily protein target', completed: false },
        { id: 'h4', title: 'Post-dinner 15-minute walk', completed: false },
      ],
      updatedAt: new Date().toISOString(),
    });
  }

  static updateGoals(goal: Partial<WLGoal>): WLGoal {
    const current = this.getGoals();
    const updated: WLGoal = {
      ...current,
      ...goal,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.GOALS, updated);
    return updated;
  }

  /* ================= COACH MESSAGES ================= */
  static getCoachMessages(): WLCoachMessage[] {
    return loadFromStorage<WLCoachMessage[]>(STORAGE_KEYS.COACH, []);
  }

  static addCoachMessage(sender: 'ai' | 'user', text: string): WLCoachMessage {
    const messages = this.getCoachMessages();
    const newMsg: WLCoachMessage = {
      id: `wl_msg_${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    saveToStorage(STORAGE_KEYS.COACH, [...messages, newMsg]);
    return newMsg;
  }

  static clearCoachMessages(): void {
    saveToStorage(STORAGE_KEYS.COACH, []);
  }
}
