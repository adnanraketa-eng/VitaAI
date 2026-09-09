import { UserSharedProfile, WeightLossSettings } from '../types';

export interface CancerAwarenessSettings {
  screeningReminders: string; // e.g. "Every 6 months"
  screeningHistory: string; // e.g. "Not specified"
  familyHistory: string; // e.g. "Not specified"
  riskFactors: string; // e.g. "Not specified"
  lifestyleGoal: string; // e.g. "Maintain a healthy weight"
  reminderFrequency: string; // e.g. "Every 6 months"
}

export interface CancerGoalProgressItem {
  id: string;
  name: string;
  targetStr: string;
  currentVal: number;
  targetVal: number;
  unit: string;
  statusText: 'Good' | 'Building' | 'Limit' | 'Tracked';
  statusCategory: 'good' | 'building' | 'limit' | 'info';
  percentage: number;
  barColor: string;
}

export interface CancerNutritionReport {
  id: string;
  dateStr: string;
  titleDate: string;
  score: number;
  statusBadge: string;
  summaryNote: string;
  aiQuote: string;
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  fiber: { current: number; target: number };
  water: { current: number; target: number };
  activityMin: { current: number; target: number };
  mealPerformance: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
    bestMeal: { name: string; score: number };
    couldImprove: { name: string; score: number };
  };
  todayWins: string[];
  areasToImprove: { title: string; note: string }[];
  tomorrowFocus: string[];
}

export interface CancerHistoryDay {
  id: string;
  dateStr: string;
  relativeDate: string;
  score: number;
  fiberCurrent: number;
  fiberGoal: number;
  fruitsCurrent: number;
  fruitsGoal: number;
  grainsCurrent: number;
  grainsGoal: number;
  meatCurrent: number;
  meatLimit: number;
  aiSummary: string;
}
