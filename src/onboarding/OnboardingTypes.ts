export type PrimaryGoalType = 
  | 'weight_loss' 
  | 'weight_management' 
  | 'diabetes_awareness' 
  | 'cancer_awareness';

export type ActivityLevelType = 
  | 'Sedentary' 
  | 'Lightly Active' 
  | 'Moderately Active' 
  | 'Very Active';

export interface OnboardingData {
  // Shared Profile Data (ONE shared profile)
  fullName: string;
  email: string;
  dob: string;
  age: number;
  gender: string;
  heightCm: number;
  units: 'imperial' | 'metric';

  // Basic Health Profile (Weight Loss specific storage)
  currentWeightLb: number;
  goalWeightLb: number;
  targetPace: string;

  // Primary Goal
  primaryGoal: PrimaryGoalType;

  // Lifestyle & Activity
  activityLevel: ActivityLevelType;
  preferredActivities: string[];

  // Food & Nutrition Preferences
  dietaryPreference: string;
  dietaryRestrictions: string[];

  // Daily Habit Targets
  dailyStepGoal: number;
  dailyWaterGoalL: number;
  dailyCalorieGoalKcal: number;
  dailyProteinGoalG: number;

  // Notification Preferences
  notifications: {
    dailyReminders: boolean;
    hydrationAlerts: boolean;
    weeklyProgress: boolean;
    aiCoachCheckin: boolean;
  };

  completedAt?: string;
}
