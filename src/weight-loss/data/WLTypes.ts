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
