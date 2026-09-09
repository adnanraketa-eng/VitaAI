import {
  WLWeightRecord,
  WLMealEntry,
  WLWaterRecord,
  WLActivityRecord,
  WLGoal,
  WLCoachMessage,
  WLDailyNutritionSummary,
} from './WLTypes';
import { supabase } from '../../core/supabase';
import { getWLDemoMeal } from './WLDemoFood';

const STORAGE_KEYS = {
  WEIGHT: 'vita_wl_weight_records',
  MEALS: 'vita_wl_meal_entries',
  WATER: 'vita_wl_water_records',
  ACTIVITY: 'vita_wl_activity_records',
  GOALS: 'vita_wl_goals',
  COACH: 'vita_wl_coach_messages',
};

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

async function getAuthenticatedUser() {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      return null;
    }
    return authData.user;
  } catch {
    return null;
  }
}

function mapMealRow(row: any): WLMealEntry {
  return {
    id: String(row.id),
    type: (row.meal_type || 'snack') as WLMealEntry['type'],
    name: row.food_name || 'Meal',
    calories: Number(row.calories || 0),
    proteinG: Number(row.protein_g || 0),
    carbsG: Number(row.carbs_g || 0),
    fatG: Number(row.fat_g || 0),
    fiberG: row.fiber_g !== null && row.fiber_g !== undefined ? Number(row.fiber_g) : undefined,
    serving: row.serving || undefined,
    loggedAt: row.recorded_at || row.created_at || new Date().toISOString(),
    nutritionScore:
      row.nutrition_score !== null && row.nutrition_score !== undefined
        ? Number(row.nutrition_score)
        : undefined,
    nutritionScoreLabel: row.score_label || undefined,
    aiInsight: row.ai_insight || undefined,
    aiNote: row.ai_note || undefined,
    notes: row.ai_note || undefined,
    aiChoiceStatus: row.health_classification || undefined,
    recommendations: Array.isArray(row.ai_suggestions) ? row.ai_suggestions : undefined,
  };
}

function mapActivityRow(row: any): WLActivityRecord {
  const dateStr = row.activity_date
    ? new Date(`${row.activity_date}T12:00:00Z`).toISOString()
    : (row.created_at || new Date().toISOString());

  return {
    id: String(row.id),
    steps: Number(row.steps || 0),
    exerciseMin: Number(row.exercise_minutes || 0),
    caloriesBurned: 0,
    activityType: 'Daily Activity',
    source: 'Manual',
    loggedAt: dateStr,
  };
}

const DEFAULT_GOALS: WLGoal = {
  currentWeightLb: 159.6,
  goalWeightLb: 147.3,
  startWeightLb: 179.7,
  targetPace: '1 lb / week',
  dailyStepGoal: 8500,
  dailyWaterGoalL: 2.5,
  dailyCalorieGoalKcal: 1800,
  dailyProteinGoalG: 120,
  dailyCarbsGoalG: 200,
  dailyFatGoalG: 60,
  dailyFiberGoalG: 28,
  dietaryPreferences: ['Mediterranean'],
  healthyHabits: [
    { id: 'h_1', title: 'Drink a glass of water before breakfast', completed: true },
    { id: 'h_2', title: 'Aim for 30g protein at first meal', completed: false },
    { id: 'h_3', title: '15-min post-dinner walk', completed: false },
  ],
  updatedAt: new Date().toISOString(),
};

const DEFAULT_WEIGHT_RECORDS: WLWeightRecord[] = [
  { id: 'wr_1', weightLb: 159.6, recordedAt: new Date().toISOString(), note: 'Morning weigh-in' },
  { id: 'wr_2', weightLb: 160.2, recordedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'wr_3', weightLb: 161.0, recordedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'wr_4', weightLb: 162.4, recordedAt: new Date(Date.now() - 86400000 * 9).toISOString() },
  { id: 'wr_5', weightLb: 164.0, recordedAt: new Date(Date.now() - 86400000 * 14).toISOString() },
];

export class WLRepository {
  /* ================= WEIGHT RECORDS ================= */

  static getWeightRecords(): WLWeightRecord[] {
    return loadFromStorage<WLWeightRecord[]>(STORAGE_KEYS.WEIGHT, DEFAULT_WEIGHT_RECORDS);
  }

  static addWeightRecord(weightLb: number, note?: string): WLWeightRecord {
    const records = this.getWeightRecords();
    const recordedAt = new Date().toISOString();
    const newRecord: WLWeightRecord = {
      id: `wr_${Date.now()}`,
      weightLb,
      recordedAt,
      note,
    };

    const updated = [newRecord, ...records];
    saveToStorage(STORAGE_KEYS.WEIGHT, updated);

    // Asynchronously sync to Supabase if session exists
    (async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!user) return;
        const { data } = await supabase
          .from('weight_records')
          .insert({
            user_id: user.id,
            weight_lb: weightLb,
            recorded_at: recordedAt,
          })
          .select('id')
          .single();

        if (data?.id) {
          newRecord.id = String(data.id);
          saveToStorage(STORAGE_KEYS.WEIGHT, updated);
        }
      } catch (err) {
        console.warn('Supabase weight_records insert failed:', err);
      }
    })();

    return newRecord;
  }

  static deleteWeightRecord(id: string): void {
    const records = this.getWeightRecords();
    saveToStorage(STORAGE_KEYS.WEIGHT, records.filter((r) => r.id !== id));

    (async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!user) return;
        await supabase
          .from('weight_records')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      } catch (err) {
        console.warn('Supabase weight_records delete failed:', err);
      }
    })();
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
    return loadFromStorage<WLMealEntry[]>(STORAGE_KEYS.MEALS, [getWLDemoMeal()]);
  }

  static getTodayMeals(): WLMealEntry[] {
    return this.getMealsForDate(new Date());
  }

  static getMealsForDate(date: Date | string): WLMealEntry[] {
    const meals = this.getMealEntries();
    const d = new Date(date);
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();

    return meals.filter((m) => {
      const mealTime = new Date(m.loggedAt).getTime();
      return mealTime >= startOfDay && mealTime <= endOfDay;
    });
  }

  static addMealEntry(
    entry: Omit<WLMealEntry, 'id' | 'loggedAt'> & { loggedAt?: string }
  ): WLMealEntry {
    const meals = this.getMealEntries();
    const loggedAt = entry.loggedAt || new Date().toISOString();
    const newMeal: WLMealEntry = {
      ...entry,
      id: `meal_${Date.now()}`,
      loggedAt,
    };

    const updated = [newMeal, ...meals];
    saveToStorage(STORAGE_KEYS.MEALS, updated);

    // Asynchronously sync to Supabase if session exists
    (async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!user) return;
        const { data } = await supabase
          .from('meal_log_entries')
          .insert({
            user_id: user.id,
            food_name: entry.name,
            meal_type: entry.type,
            serving: entry.serving ?? null,
            input_source: 'manual',
            calories: Math.round(entry.calories || 0),
            protein_g: Math.round(entry.proteinG || 0),
            carbs_g: Math.round(entry.carbsG || 0),
            fat_g: Math.round(entry.fatG || 0),
            fiber_g: entry.fiberG !== undefined && entry.fiberG !== null ? Math.round(entry.fiberG) : null,
            nutrition_score: entry.nutritionScore ?? null,
            score_label: entry.nutritionScoreLabel ?? null,
            health_classification: entry.aiChoiceStatus ?? null,
            ai_insight: entry.aiInsight ?? null,
            ai_note: entry.aiNote || entry.notes || null,
            ai_suggestions: entry.recommendations ?? null,
            recorded_at: loggedAt,
          })
          .select('id')
          .single();

        if (data?.id) {
          newMeal.id = String(data.id);
          saveToStorage(STORAGE_KEYS.MEALS, updated);
        }
      } catch (err) {
        console.warn('Supabase meal_log_entries insert failed:', err);
      }
    })();

    return newMeal;
  }

  static deleteMealEntry(id: string): void {
    const meals = this.getMealEntries();
    saveToStorage(STORAGE_KEYS.MEALS, meals.filter((m) => m.id !== id));

    (async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!user) return;
        await supabase
          .from('meal_log_entries')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      } catch (err) {
        console.warn('Supabase meal_log_entries delete failed:', err);
      }
    })();
  }

  static getTodayNutritionSummary(targetKcal = 1800): WLDailyNutritionSummary {
    return this.getNutritionSummaryForDate(new Date(), targetKcal);
  }

  static getNutritionSummaryForDate(
    date: Date | string,
    targetKcal = 1800
  ): WLDailyNutritionSummary {
    const dateMeals = this.getMealsForDate(date);
    const waterL = this.getWaterForDate(date);

    const calories = dateMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
    const proteinG = dateMeals.reduce((acc, m) => acc + (m.proteinG || 0), 0);
    const carbsG = dateMeals.reduce((acc, m) => acc + (m.carbsG || 0), 0);
    const fatG = dateMeals.reduce((acc, m) => acc + (m.fatG || 0), 0);
    const fiberG = dateMeals.reduce((acc, m) => acc + (m.fiberG || 0), 0);
    const remainingCalories = Math.max(0, targetKcal - calories);
    const analysesCount = dateMeals.filter(
      (m) => m.aiStatus === 'AI complete' || m.nutritionScore !== undefined || !!m.aiInsight
    ).length;

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
    return loadFromStorage<WLWaterRecord[]>(STORAGE_KEYS.WATER, [
      { id: 'w_1', amountL: 0.5, loggedAt: new Date(new Date().setHours(9, 0, 0, 0)).toISOString() },
      { id: 'w_2', amountL: 0.75, loggedAt: new Date(new Date().setHours(13, 15, 0, 0)).toISOString() },
    ]);
  }

  static getTodayWaterL(): number {
    return this.getWaterForDate(new Date());
  }

  static getWaterForDate(date: Date | string): number {
    const records = this.getWaterRecords();
    const d = new Date(date);
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();

    const total = records
      .filter((r) => {
        const time = new Date(r.loggedAt).getTime();
        return time >= startOfDay && time <= endOfDay;
      })
      .reduce((acc, r) => acc + r.amountL, 0);

    return parseFloat(total.toFixed(2));
  }

  static addWater(amountL: number): WLWaterRecord {
    const records = this.getWaterRecords();
    const recordedAt = new Date().toISOString();
    const newRecord: WLWaterRecord = {
      id: `w_${Date.now()}`,
      amountL: parseFloat(amountL.toFixed(3)),
      loggedAt: recordedAt,
    };

    const updated = [newRecord, ...records];
    saveToStorage(STORAGE_KEYS.WATER, updated);

    (async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!user) return;
        const { data } = await supabase
          .from('water_records')
          .insert({
            user_id: user.id,
            amount_ml: Math.round(amountL * 1000),
            recorded_at: recordedAt,
          })
          .select('id')
          .single();

        if (data?.id) {
          newRecord.id = String(data.id);
          saveToStorage(STORAGE_KEYS.WATER, updated);
        }
      } catch (err) {
        console.warn('Supabase water_records insert failed:', err);
      }
    })();

    return newRecord;
  }

  static clearTodayWater(): void {
    const records = this.getWaterRecords();
    const d = new Date();
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();

    const remaining = records.filter((r) => {
      const time = new Date(r.loggedAt).getTime();
      return time < startOfDay || time > endOfDay;
    });
    saveToStorage(STORAGE_KEYS.WATER, remaining);

    (async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!user) return;
        const startIso = new Date(startOfDay).toISOString();
        const endIso = new Date(endOfDay).toISOString();
        await supabase
          .from('water_records')
          .delete()
          .eq('user_id', user.id)
          .gte('recorded_at', startIso)
          .lte('recorded_at', endIso);
      } catch (err) {
        console.warn('Supabase clear water failed:', err);
      }
    })();
  }

  /* ================= ACTIVITY RECORDS ================= */

  static getActivityRecords(): WLActivityRecord[] {
    return loadFromStorage<WLActivityRecord[]>(STORAGE_KEYS.ACTIVITY, [
      {
        id: 'act_1',
        steps: 6420,
        exerciseMin: 35,
        caloriesBurned: 320,
        activityType: 'Brisk Walking',
        source: 'Health Connect',
        loggedAt: new Date().toISOString(),
      },
    ]);
  }

  static getTodayActivity(): { steps: number; exerciseMin: number; caloriesBurned: number } {
    const records = this.getActivityRecords();
    const today = new Date().toISOString().split('T')[0];

    const todayRecords = records.filter((r) => r.loggedAt.split('T')[0] === today);
    const steps = todayRecords.reduce((acc, r) => acc + (r.steps || 0), 0);
    const exerciseMin = todayRecords.reduce((acc, r) => acc + (r.exerciseMin || 0), 0);
    const caloriesBurned = todayRecords.reduce((acc, r) => acc + (r.caloriesBurned || 0), 0);

    return { steps, exerciseMin, caloriesBurned };
  }

  static addActivityRecord(
    activity: Omit<WLActivityRecord, 'id' | 'loggedAt'> & { loggedAt?: string }
  ): WLActivityRecord {
    const records = this.getActivityRecords();
    const loggedAt = activity.loggedAt || new Date().toISOString();
    const newRecord: WLActivityRecord = {
      ...activity,
      id: `act_${Date.now()}`,
      loggedAt,
    };

    const updated = [newRecord, ...records];
    saveToStorage(STORAGE_KEYS.ACTIVITY, updated);

    (async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!user) return;
        const activityDate = loggedAt.split('T')[0];
        await supabase
          .from('activity_daily_records')
          .insert({
            user_id: user.id,
            activity_date: activityDate,
            steps: activity.steps || 0,
            exercise_minutes: activity.exerciseMin || 0,
          });
      } catch (err) {
        console.warn('Supabase activity_daily_records insert failed:', err);
      }
    })();

    return newRecord;
  }

  /* ================= GOALS & HABITS ================= */

  static getGoals(): WLGoal {
    return loadFromStorage<WLGoal>(STORAGE_KEYS.GOALS, DEFAULT_GOALS);
  }

  static updateGoals(goal: Partial<WLGoal>): WLGoal {
    const existing = this.getGoals();
    const updated: WLGoal = {
      ...existing,
      ...goal,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.GOALS, updated);

    (async () => {
      try {
        const user = await getAuthenticatedUser();
        if (!user) return;
        const profileUpdates: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };
        if (goal.currentWeightLb !== undefined) profileUpdates.current_weight_lb = goal.currentWeightLb;
        if (goal.goalWeightLb !== undefined) profileUpdates.goal_weight_lb = goal.goalWeightLb;
        if (goal.targetPace !== undefined) profileUpdates.target_pace = goal.targetPace;
        if (goal.dailyCalorieGoalKcal !== undefined)
          profileUpdates.daily_calorie_target = Math.round(goal.dailyCalorieGoalKcal);
        if (goal.dailyProteinGoalG !== undefined)
          profileUpdates.daily_protein_target_g = Math.round(goal.dailyProteinGoalG);
        if (goal.dailyCarbsGoalG !== undefined)
          profileUpdates.daily_carb_target_g = Math.round(goal.dailyCarbsGoalG);
        if (goal.dailyFatGoalG !== undefined)
          profileUpdates.daily_fat_target_g = Math.round(goal.dailyFatGoalG);
        if (goal.dailyFiberGoalG !== undefined)
          profileUpdates.daily_fiber_target_g = Math.round(goal.dailyFiberGoalG);
        if (goal.dailyWaterGoalL !== undefined)
          profileUpdates.daily_water_target_ml = Math.round(goal.dailyWaterGoalL * 1000);
        if (goal.dailyStepGoal !== undefined)
          profileUpdates.daily_step_target = Math.round(goal.dailyStepGoal);
        if (goal.dietaryPreferences !== undefined)
          profileUpdates.food_preferences = goal.dietaryPreferences;

        await supabase
          .from('weight_loss_profiles')
          .upsert({ user_id: user.id, ...profileUpdates });
      } catch (err) {
        console.warn('Supabase update goals failed:', err);
      }
    })();

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

  /* ================= BACKGROUND SYNC ================= */

  static async syncFromSupabase(): Promise<void> {
    try {
      const user = await getAuthenticatedUser();
      if (!user) return;

      const [weightRes, mealRes, waterRes, actRes, profileRes] = await Promise.all([
        supabase
          .from('weight_records')
          .select('id, weight_lb, recorded_at')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false }),
        supabase
          .from('meal_log_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false }),
        supabase
          .from('water_records')
          .select('id, amount_ml, recorded_at')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false }),
        supabase
          .from('activity_daily_records')
          .select('*')
          .eq('user_id', user.id)
          .order('activity_date', { ascending: false }),
        supabase
          .from('weight_loss_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      if (weightRes.data && weightRes.data.length > 0) {
        saveToStorage(
          STORAGE_KEYS.WEIGHT,
          weightRes.data.map((r) => ({
            id: String(r.id),
            weightLb: Number(r.weight_lb),
            recordedAt: r.recorded_at,
          }))
        );
      }

      if (mealRes.data && mealRes.data.length > 0) {
        saveToStorage(STORAGE_KEYS.MEALS, mealRes.data.map(mapMealRow));
      }

      if (waterRes.data && waterRes.data.length > 0) {
        saveToStorage(
          STORAGE_KEYS.WATER,
          waterRes.data.map((r) => ({
            id: String(r.id),
            amountL: parseFloat(((Number(r.amount_ml) || 0) / 1000).toFixed(3)),
            loggedAt: r.recorded_at,
          }))
        );
      }

      if (actRes.data && actRes.data.length > 0) {
        saveToStorage(STORAGE_KEYS.ACTIVITY, actRes.data.map(mapActivityRow));
      }

      if (profileRes.data) {
        const p = profileRes.data;
        const currentGoals = this.getGoals();
        const updatedGoals: WLGoal = {
          ...currentGoals,
          currentWeightLb: p.current_weight_lb !== null ? Number(p.current_weight_lb) : currentGoals.currentWeightLb,
          goalWeightLb: p.goal_weight_lb !== null ? Number(p.goal_weight_lb) : currentGoals.goalWeightLb,
          targetPace: p.target_pace || currentGoals.targetPace,
          dailyStepGoal: p.daily_step_target ? Number(p.daily_step_target) : currentGoals.dailyStepGoal,
          dailyWaterGoalL: p.daily_water_target_ml
            ? parseFloat((Number(p.daily_water_target_ml) / 1000).toFixed(2))
            : currentGoals.dailyWaterGoalL,
          dailyCalorieGoalKcal: p.daily_calorie_target
            ? Number(p.daily_calorie_target)
            : currentGoals.dailyCalorieGoalKcal,
          dailyProteinGoalG: p.daily_protein_target_g
            ? Number(p.daily_protein_target_g)
            : currentGoals.dailyProteinGoalG,
          updatedAt: p.updated_at || new Date().toISOString(),
        };
        saveToStorage(STORAGE_KEYS.GOALS, updatedGoals);
      }
    } catch (e) {
      console.warn('WLRepository background sync failed:', e);
    }
  }
}

// Kick off non-blocking background sync if session is active
WLRepository.syncFromSupabase().catch(() => {});
