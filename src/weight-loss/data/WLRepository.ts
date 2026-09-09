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

async function requireAuthUser() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    throw new Error('Authentication required: You must be signed in with an active account to access Weight Loss data.');
  }
  return authData.user;
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
    caloriesBurned: Math.round((Number(row.steps || 0) * 0.04) + (Number(row.exercise_minutes || 0) * 6)),
    activityType: 'Daily Activity',
    source: 'Manual',
    loggedAt: dateStr,
  };
}

let coachMessagesStore: WLCoachMessage[] = [];

export class WLRepository {
  /* ================= WEIGHT RECORDS ================= */

  static async getWeightRecords(): Promise<WLWeightRecord[]> {
    const user = await requireAuthUser();
    const { data, error } = await supabase
      .from('weight_records')
      .select('id, weight_lb, recorded_at, note')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => ({
      id: String(row.id),
      weightLb: Number(row.weight_lb),
      recordedAt: row.recorded_at,
      note: row.note || undefined,
    }));
  }

  static async addWeightRecord(weightLb: number, note?: string): Promise<WLWeightRecord> {
    const user = await requireAuthUser();
    const recordedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from('weight_records')
      .insert({
        user_id: user.id,
        weight_lb: weightLb,
        recorded_at: recordedAt,
        note: note || null,
      })
      .select('id, weight_lb, recorded_at, note')
      .single();

    if (error) throw error;
    return {
      id: String(data.id),
      weightLb: Number(data.weight_lb),
      recordedAt: data.recorded_at,
      note: data.note || undefined,
    };
  }

  static async deleteWeightRecord(id: string): Promise<void> {
    const user = await requireAuthUser();
    const { error } = await supabase
      .from('weight_records')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  static async getLatestWeight(): Promise<WLWeightRecord | null> {
    const records = await this.getWeightRecords();
    return records.length > 0 ? records[0] : null;
  }

  static async get7DayWeightAverage(): Promise<number | null> {
    const records = await this.getWeightRecords();
    if (records.length < 2) return null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = records.filter((r) => new Date(r.recordedAt) >= sevenDaysAgo);
    if (recent.length === 0) return null;
    const sum = recent.reduce((acc, r) => acc + r.weightLb, 0);
    return parseFloat((sum / recent.length).toFixed(1));
  }

  /* ================= MEAL ENTRIES ================= */

  static async getMealEntries(): Promise<WLMealEntry[]> {
    const user = await requireAuthUser();
    const { data, error } = await supabase
      .from('meal_log_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapMealRow);
  }

  static async getTodayMeals(): Promise<WLMealEntry[]> {
    return this.getMealsForDate(new Date());
  }

  static async getMealsForDate(date: Date | string): Promise<WLMealEntry[]> {
    const d = new Date(date);
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString();
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString();

    const user = await requireAuthUser();
    const { data, error } = await supabase
      .from('meal_log_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('recorded_at', startOfDay)
      .lte('recorded_at', endOfDay)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapMealRow);
  }

  static async addMealEntry(
    entry: Omit<WLMealEntry, 'id' | 'loggedAt'> & { loggedAt?: string }
  ): Promise<WLMealEntry> {
    const user = await requireAuthUser();
    const loggedAt = entry.loggedAt || new Date().toISOString();
    const { data, error } = await supabase
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
      .select('*')
      .single();

    if (error) throw error;
    return mapMealRow(data);
  }

  static async deleteMealEntry(id: string): Promise<void> {
    const user = await requireAuthUser();
    const { error } = await supabase
      .from('meal_log_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  static async getTodayNutritionSummary(targetKcal = 1800): Promise<WLDailyNutritionSummary> {
    return this.getNutritionSummaryForDate(new Date(), targetKcal);
  }

  static async getNutritionSummaryForDate(
    date: Date | string,
    targetKcal = 1800
  ): Promise<WLDailyNutritionSummary> {
    const [dateMeals, waterL] = await Promise.all([
      this.getMealsForDate(date),
      this.getWaterForDate(date),
    ]);

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

  static async getWaterRecords(): Promise<WLWaterRecord[]> {
    const user = await requireAuthUser();
    const { data, error } = await supabase
      .from('water_records')
      .select('id, amount_ml, recorded_at')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((r) => ({
      id: String(r.id),
      amountL: parseFloat(((Number(r.amount_ml) || 0) / 1000).toFixed(3)),
      loggedAt: r.recorded_at,
    }));
  }

  static async getTodayWaterL(): Promise<number> {
    return this.getWaterForDate(new Date());
  }

  static async getWaterForDate(date: Date | string): Promise<number> {
    const d = new Date(date);
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString();
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString();

    const user = await requireAuthUser();
    const { data, error } = await supabase
      .from('water_records')
      .select('amount_ml')
      .eq('user_id', user.id)
      .gte('recorded_at', startOfDay)
      .lte('recorded_at', endOfDay);

    if (error) throw error;
    const totalMl = (data || []).reduce((acc, r) => acc + Number(r.amount_ml || 0), 0);
    return parseFloat((totalMl / 1000).toFixed(2));
  }

  static async addWater(amountL: number): Promise<WLWaterRecord> {
    const user = await requireAuthUser();
    const recordedAt = new Date().toISOString();
    const amountMl = Math.round(amountL * 1000);
    const { data, error } = await supabase
      .from('water_records')
      .insert({
        user_id: user.id,
        amount_ml: amountMl,
        recorded_at: recordedAt,
      })
      .select('id, amount_ml, recorded_at')
      .single();

    if (error) throw error;
    return {
      id: String(data.id),
      amountL: parseFloat(((Number(data.amount_ml) || 0) / 1000).toFixed(3)),
      loggedAt: data.recorded_at,
    };
  }

  static async clearTodayWater(): Promise<void> {
    const d = new Date();
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString();
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString();

    const user = await requireAuthUser();
    const { error } = await supabase
      .from('water_records')
      .delete()
      .eq('user_id', user.id)
      .gte('recorded_at', startOfDay)
      .lte('recorded_at', endOfDay);

    if (error) throw error;
  }

  /* ================= ACTIVITY RECORDS ================= */

  static async getActivityRecords(): Promise<WLActivityRecord[]> {
    const user = await requireAuthUser();
    const { data, error } = await supabase
      .from('activity_daily_records')
      .select('*')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapActivityRow);
  }

  static async getTodayActivity(): Promise<{ steps: number; exerciseMin: number; caloriesBurned: number }> {
    const today = new Date().toISOString().split('T')[0];
    const user = await requireAuthUser();
    const { data, error } = await supabase
      .from('activity_daily_records')
      .select('steps, exercise_minutes')
      .eq('user_id', user.id)
      .eq('activity_date', today);

    if (error) throw error;
    const steps = (data || []).reduce((acc, r) => acc + (Number(r.steps) || 0), 0);
    const exerciseMin = (data || []).reduce((acc, r) => acc + (Number(r.exercise_minutes) || 0), 0);
    const caloriesBurned = Math.round(steps * 0.04 + exerciseMin * 6);
    return { steps, exerciseMin, caloriesBurned };
  }

  static async addActivityRecord(
    activity: Omit<WLActivityRecord, 'id' | 'loggedAt'> & { loggedAt?: string }
  ): Promise<WLActivityRecord> {
    const user = await requireAuthUser();
    const loggedAt = activity.loggedAt || new Date().toISOString();
    const activityDate = loggedAt.split('T')[0];

    const { data, error } = await supabase
      .from('activity_daily_records')
      .insert({
        user_id: user.id,
        activity_date: activityDate,
        steps: activity.steps || 0,
        exercise_minutes: activity.exerciseMin || 0,
      })
      .select('*')
      .single();

    if (error) throw error;
    return mapActivityRow(data);
  }

  /* ================= GOALS & HABITS ================= */

  static async getGoals(): Promise<WLGoal> {
    const user = await requireAuthUser();
    const { data, error } = await supabase
      .from('weight_loss_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return {
        currentWeightLb: 0,
        goalWeightLb: 0,
        startWeightLb: 0,
        targetPace: '1 lb / week',
        dailyStepGoal: 8500,
        dailyWaterGoalL: 2.5,
        dailyCalorieGoalKcal: 1800,
        dailyProteinGoalG: 120,
        dailyCarbsGoalG: 200,
        dailyFatGoalG: 60,
        dailyFiberGoalG: 28,
        dietaryPreferences: [],
        healthyHabits: [
          { id: 'h_1', title: 'Drink a glass of water before breakfast', completed: false },
          { id: 'h_2', title: 'Aim for 30g protein at first meal', completed: false },
          { id: 'h_3', title: '15-min post-dinner walk', completed: false },
        ],
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      currentWeightLb: data.current_weight_lb !== null && data.current_weight_lb !== undefined ? Number(data.current_weight_lb) : 0,
      goalWeightLb: data.goal_weight_lb !== null && data.goal_weight_lb !== undefined ? Number(data.goal_weight_lb) : 0,
      startWeightLb: data.start_weight_lb !== null && data.start_weight_lb !== undefined ? Number(data.start_weight_lb) : (Number(data.current_weight_lb) || 0),
      targetPace: data.target_pace || '1 lb / week',
      dailyStepGoal: data.daily_step_target ? Number(data.daily_step_target) : 8500,
      dailyWaterGoalL: data.daily_water_target_ml ? parseFloat((Number(data.daily_water_target_ml) / 1000).toFixed(2)) : 2.5,
      dailyCalorieGoalKcal: data.daily_calorie_target ? Number(data.daily_calorie_target) : 1800,
      dailyProteinGoalG: data.daily_protein_target_g ? Number(data.daily_protein_target_g) : 120,
      dailyCarbsGoalG: data.daily_carb_target_g ? Number(data.daily_carb_target_g) : 200,
      dailyFatGoalG: data.daily_fat_target_g ? Number(data.daily_fat_target_g) : 60,
      dailyFiberGoalG: data.daily_fiber_target_g ? Number(data.daily_fiber_target_g) : 28,
      dietaryPreferences: Array.isArray(data.food_preferences) ? data.food_preferences : [],
      healthyHabits: Array.isArray(data.healthy_habits) ? data.healthy_habits : [
        { id: 'h_1', title: 'Drink a glass of water before breakfast', completed: false },
        { id: 'h_2', title: 'Aim for 30g protein at first meal', completed: false },
        { id: 'h_3', title: '15-min post-dinner walk', completed: false },
      ],
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  }

  static async updateGoals(goal: Partial<WLGoal>): Promise<WLGoal> {
    const user = await requireAuthUser();
    const profileUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (goal.currentWeightLb !== undefined) profileUpdates.current_weight_lb = goal.currentWeightLb;
    if (goal.goalWeightLb !== undefined) profileUpdates.goal_weight_lb = goal.goalWeightLb;
    if (goal.startWeightLb !== undefined) profileUpdates.start_weight_lb = goal.startWeightLb;
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
    if (goal.healthyHabits !== undefined)
      profileUpdates.healthy_habits = goal.healthyHabits;

    const { error } = await supabase
      .from('weight_loss_profiles')
      .upsert({ user_id: user.id, ...profileUpdates });

    if (error) throw error;
    return this.getGoals();
  }

  /* ================= COACH MESSAGES ================= */

  static async getCoachMessages(): Promise<WLCoachMessage[]> {
    return [...coachMessagesStore];
  }

  static async addCoachMessage(sender: 'ai' | 'user', text: string): Promise<WLCoachMessage> {
    const newMsg: WLCoachMessage = {
      id: `wl_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    coachMessagesStore.push(newMsg);
    return newMsg;
  }

  static async clearCoachMessages(): Promise<void> {
    coachMessagesStore = [];
  }
}
