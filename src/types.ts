export type BottomTab = 'home' | 'history' | 'progress' | 'coach' | 'profile';
export type ActiveModule = 'weight_loss' | 'cancer_awareness' | 'diabetes_awareness';

export interface UserSharedProfile {
  fullName: string;
  email: string;
  avatarUrl: string;
  dob: string;
  age: number;
  gender: string;
  heightCm: number;
  memberSince: string;
  streakDays: number;
  units: 'imperial' | 'metric';
}

export interface WeightLossSettings {
  currentWeightLb: number;
  goalWeightLb: number;
  startWeightLb: number;
  targetPace: string;
  activityLevel: string;
  dailyStepGoal: number;
  dailyWaterGoalL: number;
  dailyCalorieGoalKcal: number;
  dailyProteinGoalG: number;
  dailyCarbsGoalG?: number;
  dailyFatGoalG?: number;
  dailyFiberGoalG?: number;
  dietaryPreferences: string[];
}

export interface MealItem {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  title: string;
  desc: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  logged: boolean;
}

export interface DailyHistoryRecord {
  id: string;
  dateStr: string;
  dayOfWeek: string;
  status: 'Complete' | 'On target' | 'Almost There';
  calories: number;
  proteinG: number;
  waterL: number;
  exerciseMin: number;
  weightLb: number;
  weightChangeLb: number;
  weeklyTrendLb: number;
  mealsCount: number;
  meals: {
    name: string;
    details: string;
    calories: number;
  }[];
  aiRecommendation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}
