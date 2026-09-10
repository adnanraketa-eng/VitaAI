import { useState, useEffect } from 'react';
import { 
  Flame, Dumbbell, Droplets, Footprints, Camera, Plus, Check, 
  Sparkles, RotateCw, MoreVertical, Bell, User as UserIcon,
  FileText, TrendingUp, Bot, Settings, X, Scale, Utensils
} from 'lucide-react';
import { BottomTab, ActiveModule, UserSharedProfile, WeightLossSettings } from '../../types';
import { WLRepository } from '../data/WLRepository';
import { WLWeightRecord, WLMealEntry, WLDailyNutritionSummary } from '../data/WLTypes';
import { WLWeight } from '../weight/WLWeight';
import { WLFood } from '../food/WLFood';
import { WLWater } from '../water/WLWater';
import { WLActivity } from '../activity/WLActivity';
import { WLGoals } from '../goals/WLGoals';
import { WLDailyAnalysisHistory } from '../daily-analysis/WLDailyAnalysisHistory';
import { WLAddWaterBottomSheet } from '../water/WLAddWaterBottomSheet';
import { WLMealEntryOptions } from '../food/WLMealEntryOptions';

interface Props {
  profile: UserSharedProfile;
  settings: WeightLossSettings;
  onNavigate: (tab: BottomTab) => void;
  onSwitchGoal?: (goal: ActiveModule) => void;
  onUpdateSettings?: (settings: WeightLossSettings) => void;
}

export function WLHome({
  profile,
  settings,
  onNavigate,
  onSwitchGoal,
  onUpdateSettings,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showDailyAnalysis, setShowDailyAnalysis] = useState(false);
  
  // Modals for Weight Loss features
  const [activeModal, setActiveModal] = useState<'weight' | 'food' | 'water' | 'activity' | 'goals' | null>(null);
  const [foodModalType, setFoodModalType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [foodModalMode, setFoodModalMode] = useState<'log' | 'scan' | 'search' | 'gallery' | 'manual'>('log');
  const [foodModalImage, setFoodModalImage] = useState<string | null>(null);
  const [showMealEntryOptions, setShowMealEntryOptions] = useState(false);
  const [showWaterBottomSheet, setShowWaterBottomSheet] = useState(false);

  // Real data from WLRepository
  const [latestWeightRecord, setLatestWeightRecord] = useState<WLWeightRecord | null>(null);
  const [todayMeals, setTodayMeals] = useState<WLMealEntry[]>([]);
  const [todayWater, setTodayWater] = useState<number>(0);
  const [todayActivity, setTodayActivity] = useState<{ steps: number; exerciseMin: number; caloriesBurned: number }>({
    steps: 0,
    exerciseMin: 0,
    caloriesBurned: 0,
  });
  const [nutritionSummary, setNutritionSummary] = useState<WLDailyNutritionSummary>({
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    fiberG: 0,
    waterL: 0,
    analysesCount: 0,
    remainingCalories: settings.dailyCalorieGoalKcal,
  });

  const refreshData = async () => {
    try {
      const [weight, meals, water, activity, summary] = await Promise.all([
        WLRepository.getLatestWeight(),
        WLRepository.getTodayMeals(),
        WLRepository.getTodayWaterL(),
        WLRepository.getTodayActivity(),
        WLRepository.getTodayNutritionSummary(settings.dailyCalorieGoalKcal),
      ]);
      setLatestWeightRecord(weight);
      setTodayMeals(meals);
      setTodayWater(water);
      setTodayActivity(activity);
      setNutritionSummary(summary);
    } catch (err) {
      console.warn('WLHome refreshData error:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [settings.dailyCalorieGoalKcal]);

  const currentWeight = latestWeightRecord ? latestWeightRecord.weightLb : settings.currentWeightLb;
  const startWeight = settings.startWeightLb || currentWeight;
  const goalWeight = settings.goalWeightLb;

  // Weight Journey Calculation
  const totalToLose = Math.max(0, startWeight - goalWeight);
  const lostSoFar = Math.max(0, startWeight - currentWeight);
  const progressPercent = totalToLose > 0 ? Math.min(100, Math.round((lostSoFar / totalToLose) * 100)) : 0;
  const toGo = Math.max(0, currentWeight - goalWeight);

  // Nutrition calculations from today's real meals
  const calPercent = Math.min(100, Math.round((nutritionSummary.calories / settings.dailyCalorieGoalKcal) * 100));
  const proteinPercent = Math.min(100, Math.round((nutritionSummary.proteinG / settings.dailyProteinGoalG) * 100));
  const waterPercent = Math.min(100, Math.round((todayWater / settings.dailyWaterGoalL) * 100));
  const stepPercent = Math.min(100, Math.round((todayActivity.steps / settings.dailyStepGoal) * 100));

  // Meals by category
  const breakfastMeals = todayMeals.filter((m) => m.type === 'breakfast');
  const lunchMeals = todayMeals.filter((m) => m.type === 'lunch');
  const dinnerMeals = todayMeals.filter((m) => m.type === 'dinner');
  const snackMeals = todayMeals.filter((m) => m.type === 'snack');

  const firstName = profile.fullName.trim().split(' ')[0] || 'Friend';

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] pb-28 font-sans relative selection:bg-[#1F7A5C] selection:text-white">
      {/* Top Bar */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6FAF7]/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="p-1.5 -ml-1 text-[#1B2B24] hover:bg-black/5 rounded-full transition-colors"
            title="Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          <span className="font-semibold text-lg text-[#1B2B24] truncate max-w-[200px]">
            Good morning, {firstName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="relative p-2 bg-white rounded-full border border-[#E7EEE9] shadow-xs hover:bg-[#EFF6F1]"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#4C5F55]" />
            <span className="absolute -top-1 -right-1 bg-[#FF8B5E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              1
            </span>
          </button>
          <button 
            onClick={() => onNavigate('profile')} 
            className="w-9 h-9 bg-[#DCE9E1] text-[#1F7A5C] rounded-full flex items-center justify-center border border-[#1F7A5C]/20 hover:opacity-90 font-bold text-xs"
            title="Profile"
          >
            {firstName[0] || 'V'}
          </button>
        </div>
      </header>

      {/* 3-Dot Dropdown Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setShowMenu(false)}>
          <div className="absolute top-14 left-4 w-64 bg-white rounded-2xl shadow-xl border border-[#DCE6E0] p-2 py-3 space-y-1 animate-in fade-in zoom-in-95">
            <div className="px-3 py-1.5 text-xs font-semibold text-[#8A9A92] uppercase tracking-wider">
              Weight Loss Module
            </div>
            <button
              onClick={() => { setShowMenu(false); setActiveModal('goals'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#1B2B24] hover:bg-[#EFF6F1] rounded-xl text-left"
            >
              <Sparkles className="w-4 h-4 text-[#1F7A5C]" />
              Manage Goals & Habits
            </button>
            <button
              onClick={() => { setShowMenu(false); setShowDailyAnalysis(true); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#1B2B24] hover:bg-[#EFF6F1] rounded-xl text-left"
            >
              <Utensils className="w-4 h-4 text-[#1F7A5C]" />
              Daily Analyses Food
            </button>
            <button
              onClick={() => { setShowMenu(false); onNavigate('history'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#1B2B24] hover:bg-[#EFF6F1] rounded-xl text-left"
            >
              <FileText className="w-4 h-4 text-[#1F7A5C]" />
              Weight Loss History
            </button>
            <button
              onClick={() => { setShowMenu(false); onNavigate('progress'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#1B2B24] hover:bg-[#EFF6F1] rounded-xl text-left"
            >
              <TrendingUp className="w-4 h-4 text-[#1F7A5C]" />
              Progress & Analytics
            </button>
            <button
              onClick={() => { setShowMenu(false); onNavigate('coach'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#1B2B24] hover:bg-[#EFF6F1] rounded-xl text-left"
            >
              <Bot className="w-4 h-4 text-[#2E8B8B]" />
              AI Nutrition Coach
            </button>
            <div className="border-t border-[#E7EEE9] my-1 pt-1" />
            <button
              onClick={() => { setShowMenu(false); onNavigate('profile'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#1B2B24] hover:bg-[#EFF6F1] rounded-xl text-left"
            >
              <Settings className="w-4 h-4 text-[#4C5F55]" />
              Profile & Personal Settings
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="px-4 space-y-5 mt-2">
        {/* Weight Journey Hero Card */}
        <div className="bg-[#1F7A5C] text-white rounded-3xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold tracking-tight">Weight journey</h2>
            <button 
              onClick={() => setShowGoalModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white text-[#1F7A5C] text-xs font-semibold rounded-full shadow-xs hover:bg-[#EFF6F1] transition-all"
            >
              <RotateCw className="w-3 h-3" />
              Switch Goal
            </button>
          </div>
          <p className="text-white/80 text-xs mb-4">
            A steady path, one healthy choice at a time.
          </p>

          <div 
            onClick={() => setActiveModal('weight')}
            className="flex justify-between items-baseline mb-4 cursor-pointer hover:opacity-95 transition-opacity"
            title="Click to log or view weight"
          >
            <div>
              <span className="text-[11px] text-white/70 block uppercase tracking-wider">Current weight</span>
              <div className="text-3xl font-extrabold tracking-tight flex items-baseline gap-1.5">
                {currentWeight} <span className="text-lg font-normal text-white/80">lb</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">Tap to log</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-white/70 block uppercase tracking-wider">Goal weight</span>
              <div className="text-xl font-bold text-white/90">
                {goalWeight} <span className="text-sm font-normal text-white/70">lb</span>
              </div>
            </div>
          </div>

          {/* Progress Bar & Sub-stats */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-white/90">
              <span>{lostSoFar.toFixed(1)} lb lost</span>
              <span>{progressPercent}% of your journey</span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] text-white/70 pt-0.5">
              <span>Started at {startWeight} lb</span>
              <span>{toGo.toFixed(1)} lb to go</span>
            </div>
          </div>
        </div>

        {/* Today's Focus */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1B2B24]">Today's Focus</h3>
            <button 
              onClick={() => setActiveModal('goals')}
              className="text-sm font-semibold text-[#1F7A5C] hover:underline"
            >
              See plan
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Calories */}
            <div 
              onClick={() => {
                setFoodModalMode('log');
                setActiveModal('food');
              }}
              className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs cursor-pointer hover:border-[#1F7A5C] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#1F7A5C]">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#4C5F55]">{calPercent}%</span>
              </div>
              <div className="text-sm font-bold text-[#1B2B24]">Calories</div>
              <div className="text-xs text-[#8A9A92] mb-2 font-medium">
                {nutritionSummary.calories} / {settings.dailyCalorieGoalKcal} kcal
              </div>
              <div className="w-full h-1.5 bg-[#DCE9E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#1F7A5C] rounded-full" style={{ width: `${calPercent}%` }} />
              </div>
            </div>

            {/* Protein */}
            <div 
              onClick={() => {
                setFoodModalMode('log');
                setActiveModal('food');
              }}
              className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs cursor-pointer hover:border-[#2E8B8B] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#2E8B8B]">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#4C5F55]">{proteinPercent}%</span>
              </div>
              <div className="text-sm font-bold text-[#1B2B24]">Protein</div>
              <div className="text-xs text-[#8A9A92] mb-2 font-medium">
                {nutritionSummary.proteinG} / {settings.dailyProteinGoalG} g
              </div>
              <div className="w-full h-1.5 bg-[#DCE9E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#2E8B8B] rounded-full" style={{ width: `${proteinPercent}%` }} />
              </div>
            </div>

            {/* Water */}
            <div 
              onClick={() => setActiveModal('water')}
              className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs cursor-pointer hover:border-[#3E8FB0] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#3E8FB0]">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#4C5F55]">{waterPercent}%</span>
              </div>
              <div className="text-sm font-bold text-[#1B2B24]">Water</div>
              <div className="text-xs text-[#8A9A92] mb-2 font-medium">
                {todayWater.toFixed(1)} / {settings.dailyWaterGoalL} L
              </div>
              <div className="w-full h-1.5 bg-[#DCE9E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#3E8FB0] rounded-full" style={{ width: `${waterPercent}%` }} />
              </div>
            </div>

            {/* Steps */}
            <div 
              onClick={() => setActiveModal('activity')}
              className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs cursor-pointer hover:border-[#1F7A5C] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#1F7A5C]">
                  <Footprints className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#4C5F55]">{stepPercent}%</span>
              </div>
              <div className="text-sm font-bold text-[#1B2B24]">Steps</div>
              <div className="text-xs text-[#8A9A92] mb-2 font-medium">
                {todayActivity.steps.toLocaleString()} / {settings.dailyStepGoal.toLocaleString()}
              </div>
              <div className="w-full h-1.5 bg-[#DCE9E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#1F7A5C] rounded-full" style={{ width: `${stepPercent}%` }} />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setShowWaterBottomSheet(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1F7A5C] text-white rounded-2xl font-semibold text-sm shadow-xs hover:bg-[#14503C] active:scale-[0.99] transition-all"
          >
            <Plus className="w-4 h-4" />
            Water Intake
          </button>
          <button 
            onClick={() => {
              setShowMealEntryOptions(true);
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white text-[#1B2B24] border border-[#DCE6E0] rounded-2xl font-semibold text-sm shadow-xs hover:bg-[#EFF6F1] active:scale-[0.99] transition-all"
          >
            <Camera className="w-4 h-4 text-[#FF8B5E]" />
            Scan Food
          </button>
        </div>

        {/* Today's Nutrition Breakdown */}
        <section className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1B2B24]">Today's Nutrition</h3>
            <span className="text-xs font-semibold text-[#1F7A5C] bg-[#EFF6F1] px-2.5 py-1 rounded-full">
              {nutritionSummary.remainingCalories} kcal remaining
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Donut Progress Visualization */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#DCE9E1]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#1F7A5C]"
                  strokeDasharray={`${calPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-[#1B2B24]">
                  {nutritionSummary.calories}
                </span>
                <span className="text-[10px] text-[#8A9A92] -mt-1 font-medium">kcal</span>
              </div>
            </div>

            {/* Macro Bars */}
            <div className="flex-1 space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#1B2B24] mb-1">
                  <span>Protein</span>
                  <span>{nutritionSummary.proteinG}g / {settings.dailyProteinGoalG}g</span>
                </div>
                <div className="h-2 bg-[#DCE9E1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1F7A5C] rounded-full" style={{ width: `${proteinPercent}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#1B2B24] mb-1">
                  <span>Carbs</span>
                  <span>{nutritionSummary.carbsG}g</span>
                </div>
                <div className="h-2 bg-[#DCE9E1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2E8B8B] rounded-full" style={{ width: `${Math.min(100, Math.round((nutritionSummary.carbsG / 200) * 100))}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#1B2B24] mb-1">
                  <span>Fat</span>
                  <span>{nutritionSummary.fatG}g</span>
                </div>
                <div className="h-2 bg-[#DCE9E1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF8B5E] rounded-full" style={{ width: `${Math.min(100, Math.round((nutritionSummary.fatG / 65) * 100))}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Today's Meals */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1B2B24]">Today's Meals</h3>
            <button 
              onClick={() => {
                setFoodModalMode('log');
                setActiveModal('food');
              }} 
              className="text-sm font-semibold text-[#1F7A5C] hover:underline"
            >
              + Log Meal
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#DCE6E0] p-2 divide-y divide-[#E7EEE9] shadow-xs">
            {/* Breakfast */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6F1] flex items-center justify-center text-xl">
                  🥣
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1B2B24]">Breakfast</div>
                  <div className="text-xs text-[#8A9A92]">
                    {breakfastMeals.length > 0 
                      ? `${breakfastMeals[0].name} · ${breakfastMeals[0].calories} kcal` 
                      : 'Nothing logged yet'}
                  </div>
                </div>
              </div>
              {breakfastMeals.length > 0 ? (
                <div className="w-7 h-7 rounded-full bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setFoodModalType('breakfast');
                    setShowMealEntryOptions(true);
                  }}
                  className="w-7 h-7 rounded-full bg-[#F6FAF7] text-[#4C5F55] border border-[#DCE6E0] flex items-center justify-center hover:bg-[#EFF6F1]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Lunch */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6F1] flex items-center justify-center text-xl">
                  🥗
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1B2B24]">Lunch</div>
                  <div className="text-xs text-[#8A9A92]">
                    {lunchMeals.length > 0 
                      ? `${lunchMeals[0].name} · ${lunchMeals[0].calories} kcal` 
                      : 'Nothing logged yet'}
                  </div>
                </div>
              </div>
              {lunchMeals.length > 0 ? (
                <div className="w-7 h-7 rounded-full bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setFoodModalType('lunch');
                    setShowMealEntryOptions(true);
                  }}
                  className="w-7 h-7 rounded-full bg-[#F6FAF7] text-[#4C5F55] border border-[#DCE6E0] flex items-center justify-center hover:bg-[#EFF6F1]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dinner */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6F1] flex items-center justify-center text-xl opacity-80">
                  🍽️
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1B2B24]">Dinner</div>
                  <div className="text-xs text-[#8A9A92]">
                    {dinnerMeals.length > 0 
                      ? `${dinnerMeals[0].name} · ${dinnerMeals[0].calories} kcal` 
                      : 'Plan your protein-rich dinner'}
                  </div>
                </div>
              </div>
              {dinnerMeals.length > 0 ? (
                <div className="w-7 h-7 rounded-full bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setFoodModalType('dinner');
                    setShowMealEntryOptions(true);
                  }} 
                  className="w-7 h-7 rounded-full bg-[#F6FAF7] text-[#4C5F55] border border-[#DCE6E0] flex items-center justify-center hover:bg-[#EFF6F1]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Snack */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6F1] flex items-center justify-center text-xl opacity-80">
                  🍎
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1B2B24]">Snack</div>
                  <div className="text-xs text-[#8A9A92]">
                    {snackMeals.length > 0 
                      ? `${snackMeals[0].name} · ${snackMeals[0].calories} kcal` 
                      : 'Nothing logged yet'}
                  </div>
                </div>
              </div>
              {snackMeals.length > 0 ? (
                <div className="w-7 h-7 rounded-full bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setFoodModalType('snack');
                    setShowMealEntryOptions(true);
                  }} 
                  className="w-7 h-7 rounded-full bg-[#F6FAF7] text-[#4C5F55] border border-[#DCE6E0] flex items-center justify-center hover:bg-[#EFF6F1]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* AI Coach Summary Card */}
        <section 
          onClick={() => onNavigate('coach')}
          className="bg-[#EFF6F1] rounded-3xl p-4 border border-[#DCE6E0] cursor-pointer hover:bg-[#E3ECE6] transition-colors"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1F7A5C]" />
              <span className="text-sm font-bold text-[#1F7A5C]">AI Coach</span>
            </div>
            <span className="text-xs font-semibold text-[#1F7A5C]">View Coach</span>
          </div>
          <p className="text-xs text-[#4C5F55] leading-relaxed">
            {nutritionSummary.calories === 0 
              ? `Ready to start today? Log your first meal or scan your breakfast plate to get personalized deficit guidance.`
              : nutritionSummary.proteinG < (settings.dailyProteinGoalG * 0.5)
              ? `You're at ${nutritionSummary.proteinG}g protein so far. Aim for a high-protein dinner or shake to hit your ${settings.dailyProteinGoalG}g goal.`
              : `Great job on your protein intake today! You're on track for your target pace.`}
          </p>
        </section>
      </main>

      {/* Floating Add Water Button */}
      <div className="fixed bottom-20 right-5 z-30">
        <button
          onClick={() => setShowWaterBottomSheet(true)}
          className="w-12 h-12 rounded-full bg-[#1F7A5C] text-white flex items-center justify-center shadow-lg hover:bg-[#15533E] active:scale-95 transition-all"
          title="Add Water"
          aria-label="Add Water"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Goal Switch Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#DCE6E0]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1B2B24]">Switch Nutrition Goal</h3>
              <button onClick={() => setShowGoalModal(false)} className="text-[#8A9A92] hover:text-[#1B2B24]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#4C5F55]">
              Choose a nutrition focus to customize your daily metrics and guidance.
            </p>

            <div className="space-y-2.5">
              <div 
                onClick={() => {
                  onSwitchGoal?.('cancer_awareness');
                  setShowGoalModal(false);
                }}
                className="p-3.5 rounded-2xl border border-[#DCE6E0] hover:bg-[#EFF6F1] cursor-pointer transition-colors"
              >
                <div className="font-semibold text-sm text-[#1B2B24]">Cancer-Aware Nutrition</div>
                <div className="text-xs text-[#8A9A92] mt-0.5">Support long-term cellular wellness.</div>
              </div>

              <div className="p-3.5 rounded-2xl border-2 border-[#1F7A5C] bg-[#EFF6F1] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#1F7A5C]">Weight Loss & Management (Active)</div>
                  <div className="text-xs text-[#4C5F55] mt-0.5">Healthy caloric deficit & nutrient-dense meals.</div>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#1F7A5C] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              <div 
                onClick={() => {
                  onSwitchGoal?.('diabetes_awareness');
                  setShowGoalModal(false);
                }}
                className="p-3.5 rounded-2xl border border-[#DCE6E0] hover:bg-[#EFF6F1] cursor-pointer transition-colors"
              >
                <div className="font-semibold text-sm text-[#1B2B24]">Diabetes-Friendly & Glycemic Control</div>
                <div className="text-xs text-[#8A9A92] mt-0.5">Balanced macronutrients and steady fiber.</div>
              </div>
            </div>

            <button 
              onClick={() => setShowGoalModal(false)}
              className="w-full py-2.5 bg-[#1F7A5C] text-white rounded-xl font-semibold text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Feature Sub-Modals */}
      {activeModal === 'weight' && (
        <WLWeight
          onClose={() => {
            setActiveModal(null);
            refreshData();
          }}
          onWeightUpdated={(newWt) => {
            refreshData();
            if (onUpdateSettings) {
              onUpdateSettings({ ...settings, currentWeightLb: newWt });
            }
          }}
          goalWeightLb={settings.goalWeightLb}
        />
      )}

      {activeModal === 'food' && (
        <WLFood
          initialMealType={foodModalType}
          initialMode={foodModalMode}
          initialImage={foodModalImage}
          onClose={() => {
            setActiveModal(null);
            setFoodModalImage(null);
            refreshData();
          }}
          onMealAdded={refreshData}
        />
      )}

      {activeModal === 'water' && (
        <WLWater
          goalWaterL={settings.dailyWaterGoalL}
          onClose={() => {
            setActiveModal(null);
            refreshData();
          }}
          onWaterUpdated={refreshData}
        />
      )}

      {activeModal === 'activity' && (
        <WLActivity
          dailyStepGoal={settings.dailyStepGoal}
          onClose={() => {
            setActiveModal(null);
            refreshData();
          }}
          onActivityUpdated={refreshData}
        />
      )}

      {activeModal === 'goals' && (
        <WLGoals
          onClose={() => {
            setActiveModal(null);
            refreshData();
          }}
          onGoalUpdated={(updatedGoal) => {
            refreshData();
            if (onUpdateSettings) {
              onUpdateSettings({
                ...settings,
                currentWeightLb: updatedGoal.currentWeightLb,
                goalWeightLb: updatedGoal.goalWeightLb,
                dailyCalorieGoalKcal: updatedGoal.dailyCalorieGoalKcal,
                dailyProteinGoalG: updatedGoal.dailyProteinGoalG,
                dailyStepGoal: updatedGoal.dailyStepGoal,
                dailyWaterGoalL: updatedGoal.dailyWaterGoalL,
              });
            }
          }}
        />
      )}

      {showDailyAnalysis && (
        <WLDailyAnalysisHistory
          profile={profile}
          settings={settings}
          onBack={() => {
            setShowDailyAnalysis(false);
            refreshData();
          }}
          onOpenAddFood={() => {
            setFoodModalType('breakfast');
            setFoodModalMode('scan');
            setActiveModal('food');
          }}
        />
      )}

      {/* Meal Entry Options Screen */}
      {showMealEntryOptions && (
        <WLMealEntryOptions
          mealType={foodModalType}
          onSelectMealType={(t) => setFoodModalType(t)}
          onSelectOption={(option, image) => {
            setShowMealEntryOptions(false);
            setFoodModalMode(option);
            setFoodModalImage(image || null);
            setActiveModal('food');
          }}
          onBack={() => setShowMealEntryOptions(false)}
        />
      )}

      {/* Water Bottom Sheet */}
      <WLAddWaterBottomSheet
        isOpen={showWaterBottomSheet}
        onClose={() => setShowWaterBottomSheet(false)}
        onWaterAdded={(_amountL) => {
          refreshData();
        }}
      />
    </div>
  );
}
