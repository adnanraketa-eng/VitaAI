export interface WLWeightRecord {
  id: string;
  weightLb: number;
  recordedAt: string; // ISO date-time string
  note?: string;
}

export interface WLMealEntry {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  serving?: string;
  inputSource?: 'scan' | 'manual' | 'search' | 'quick' | 'SCAN' | 'GALLERY' | 'SEARCH' | 'MANUAL';
  loggedAt: string; // ISO date-time string
  notes?: string;
  photoUrl?: string;
  aiStatus?: 'AI complete' | 'Analyzing' | 'Analysis unavailable' | 'Not analyzed';
  nutritionScore?: number;
  nutritionScoreLabel?: string;
  aiChoiceStatus?: string;
  aiInsight?: string;
  recommendations?: string[];
  detectedIngredients?: string[];
  aiNote?: string;
  scannedAt?: string;
  micronutrientAvailable?: boolean;
}

export interface WLWaterRecord {
  id: string;
  amountL: number;
  loggedAt: string; // ISO date-time string
}

export interface WLActivityRecord {
  id: string;
  steps: number;
  exerciseMin: number;
  exerciseSessions?: number;
  activityDate?: string;
  caloriesBurned: number;
  activityType: string;
  source: 'Health Connect' | 'Manual' | 'Device';
  loggedAt: string; // ISO date-time string
}

export interface WLGoal {
  currentWeightLb: number;
  goalWeightLb: number;
  startWeightLb: number;
  targetPace: string;
  dailyStepGoal: number;
  dailyWaterGoalL: number;
  dailyCalorieGoalKcal: number;
  dailyProteinGoalG: number;
  dailyCarbsGoalG?: number;
  dailyFatGoalG?: number;
  dailyFiberGoalG?: number;
  dietaryPreferences: string[];
  healthyHabits: { id: string; title: string; completed: boolean }[];
  updatedAt: string;
}

export interface WLCoachMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  userId?: string;
  conversationId?: string;
  createdAt?: string;
}

export interface WLDailyNutritionSummary {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  waterL?: number;
  analysesCount?: number;
  remainingCalories: number;
}

export interface WLDashboardData {
  latestWeightRecord: WLWeightRecord | null;
  todayMeals: WLMealEntry[];
  todayWater: number;
  todayActivity: { steps: number; exerciseMin: number; caloriesBurned: number };
  nutritionSummary: WLDailyNutritionSummary;
  isInitialLoaded: boolean;
}

export type WLProgressPeriod = 'week' | '30d' | '90d';

export interface WLPeriodDateRange {
  period: WLProgressPeriod;
  startDate: Date;
  endDate: Date;
  startDateStr: string; // YYYY-MM-DD local
  endDateStr: string;   // YYYY-MM-DD local
  dayCount: number;
}

export interface WLPeriodHabitMetrics {
  avgCalories: number;
  avgProtein: number;
  avgWater: number;
  avgSteps: number;
  totalCalories: number;
  totalProtein: number;
  totalWaterL: number;
  totalSteps: number;
  mealCount: number;
  waterCount: number;
  activityCount: number;
  range: WLPeriodDateRange;
}
