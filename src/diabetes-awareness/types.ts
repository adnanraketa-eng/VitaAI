import { UserSharedProfile, WeightLossSettings } from '../types';

export interface DiabetesAwarenessSettings {
  glucoseTargetRange: string; // e.g. "70–180 mg/dL"
  glucoseLoggingReminder: string; // e.g. "Daily"
  mealLoggingReminder: string; // e.g. "Daily"
  dailyWaterGoalL: number; // e.g. 2.4
  dailyActivityGoalMin: number; // e.g. 30
  preferredGlucoseUnits: 'mg/dL' | 'mmol/L'; // e.g. "mg/dL"
}

export interface DiabetesMealEntry {
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  kcal: number;
  gi: number;
}

export interface DiabetesGlucoseReading {
  timeOfDay: 'Morning' | 'Before lunch' | 'Evening' | 'After dinner';
  value: number;
  status: 'In range' | 'High' | 'Low';
}

export interface DiabetesHistoryDay {
  id: string;
  dateStr: string; // "22 August 2026"
  dayOfWeek: string; // "Saturday"
  mealsLoggedCount: number;
  status: 'Complete' | 'On target' | 'Needs attention';
  glucoseAvg: number;
  waterL: number;
  activityMin: number;
  footerType: 'average_glucose' | 'time_in_range';
  footerValue: string;
  timeInRangePct: number;
  dailyGoalPct: number;
  meals: DiabetesMealEntry[];
  glucoseReadings: DiabetesGlucoseReading[];
  aiRecommendation: string;
}

export interface DiabetesProgressSummary {
  period: '7 Days' | '30 Days' | '3 Months' | '6 Months';
  avgGlucose: number;
  timeInRangePct: number;
  changeVsPrevious: string;
  targetRangeText: string;
  timeInRangeBreakdown: {
    inRange: number;
    below: number;
    above: number;
  };
  glucoseStats: {
    average: number;
    lowest: number;
    highest: number;
    consistencyPct: number;
  };
  nutritionProgress: {
    mealsLogged: number;
    avgGI: number;
    lowGIPct: number;
  };
  comparisonVsPrevious: {
    avgGlucose: { current: number; previous: number; text: string };
    timeInRange: { current: number; previous: number; text: string };
    mealsLogged: { current: number; previous: number; text: string };
    avgGI: { current: number; previous: number; text: string };
  };
  dailyConsistency: {
    dayLabel: string;
    completed: boolean;
  }[];
  goalsProgress: {
    name: string;
    completedDays: number;
    totalDays: number;
  }[];
  aiProgressInsight: string;
  trackingStreakDays: number;
}
