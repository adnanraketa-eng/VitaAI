import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, MoreVertical, Check, MapPin, Flag,
  Flame, Award, Droplets, Footprints, Leaf, X, Trophy, Zap, Scale, Plus
} from 'lucide-react';
import { BottomTab, UserSharedProfile, WeightLossSettings } from '../../types';
import { WLRepository } from '../data/WLRepository';
import { WLWeightRecord, WLMealEntry, WLWaterRecord, WLActivityRecord, WLDailyNutritionSummary } from '../data/WLTypes';
import { WLWeight } from '../weight/WLWeight';

interface Props {
  profile: UserSharedProfile;
  settings: WeightLossSettings;
  onNavigate: (tab: BottomTab) => void;
  onUpdateSettings?: (settings: WeightLossSettings) => void;
}

type PeriodFilter = 'week' | '30d' | '90d';

export function WLProgress({ profile, settings, onNavigate, onUpdateSettings }: Props) {
  const [period, setPeriod] = useState<PeriodFilter>('week');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  // Stateful records from WLRepository for reactive updates
  const [weightRecords, setWeightRecords] = useState<WLWeightRecord[]>([]);
  const [mealEntries, setMealEntries] = useState<WLMealEntry[]>([]);
  const [waterRecords, setWaterRecords] = useState<WLWaterRecord[]>([]);
  const [activityRecords, setActivityRecords] = useState<WLActivityRecord[]>([]);
  const [todayNutrition, setTodayNutrition] = useState<WLDailyNutritionSummary>({
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    fiberG: 0,
    waterL: 0,
    analysesCount: 0,
    remainingCalories: settings.dailyCalorieGoalKcal,
  });
  const [todayWater, setTodayWater] = useState<number>(0);
  const [todayAct, setTodayAct] = useState<{ steps: number; exerciseMin: number; caloriesBurned: number }>({
    steps: 0,
    exerciseMin: 0,
    caloriesBurned: 0,
  });

  const loadProgressData = async () => {
    try {
      const [weights, meals, water, acts, nut, tWat, tAct] = await Promise.all([
        WLRepository.getWeightRecords(),
        WLRepository.getMealEntries(),
        WLRepository.getWaterRecords(),
        WLRepository.getActivityRecords(),
        WLRepository.getNutritionSummaryForDate(new Date(), settings.dailyCalorieGoalKcal),
        WLRepository.getTodayWaterL(),
        WLRepository.getTodayActivity(),
      ]);
      setWeightRecords(weights);
      setMealEntries(meals);
      setWaterRecords(water);
      setActivityRecords(acts);
      setTodayNutrition(nut);
      setTodayWater(tWat);
      setTodayAct(tAct);
    } catch (err) {
      console.warn('WLProgress loadData error:', err);
    }
  };

  useEffect(() => {
    loadProgressData();
  }, [settings.dailyCalorieGoalKcal]);

  const currentWeight = weightRecords[0]?.weightLb || settings.currentWeightLb || 159.6;
  const earliestRecord = weightRecords[weightRecords.length - 1];
  const startWeight = settings.startWeightLb || earliestRecord?.weightLb || 179.7;
  const goalWeight = settings.goalWeightLb || 147.3;

  const startDateStr = earliestRecord 
    ? new Date(earliestRecord.recordedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '12 Jan 2025';

  const totalToLose = Math.max(0, startWeight - goalWeight);
  const lostSoFar = Math.max(0, startWeight - currentWeight);
  const remaining = Math.max(0, currentWeight - goalWeight);
  const progressPercent = totalToLose > 0 
    ? Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100))) 
    : 0;

  // Dynamic estimated completion date & target month from real target pace and weight remaining
  const { estCompletionStr, targetMonthStr } = useMemo(() => {
    if (currentWeight <= goalWeight) {
      return { estCompletionStr: 'Achieved!', targetMonthStr: 'Goal achieved' };
    }
    const toGo = currentWeight - goalWeight;
    const pace = settings.targetPace === 'gentle' ? 0.5 : settings.targetPace === 'fast' ? 2.0 : 1.0;
    const weeksRemaining = Math.max(1, Math.ceil(toGo / pace));
    const est = new Date();
    est.setDate(est.getDate() + weeksRemaining * 7);
    const month = est.toLocaleDateString('en-US', { month: 'long' });
    return {
      estCompletionStr: `Est. ${est.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
      targetMonthStr: `On track for ${month}`,
    };
  }, [currentWeight, goalWeight, settings.targetPace]);

  // Circumference for circular progress ring (radius = 34)
  const ringRadius = 34;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (ringCircumference * progressPercent) / 100;

  // Real period data calculated dynamically from existing repository records
  const periodDays = period === 'week' ? 7 : period === '30d' ? 30 : 90;

  const periodData = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - periodDays);

    const pMeals = mealEntries.filter((m) => new Date(m.loggedAt) >= cutoff);
    const pWater = waterRecords.filter((w) => new Date(w.loggedAt) >= cutoff);
    const pActivity = activityRecords.filter((a) => new Date(a.loggedAt) >= cutoff);

    const mealDays = new Set(pMeals.map((m) => new Date(m.loggedAt).toDateString())).size || 1;
    const waterDays = new Set(pWater.map((w) => new Date(w.loggedAt).toDateString())).size || 1;
    const actDays = new Set(pActivity.map((a) => new Date(a.loggedAt).toDateString())).size || 1;

    const avgCal = pMeals.length > 0 
      ? Math.round(pMeals.reduce((acc, m) => acc + (m.calories || 0), 0) / mealDays)
      : 0;
    const avgProt = pMeals.length > 0
      ? Math.round(pMeals.reduce((acc, m) => acc + (m.proteinG || 0), 0) / mealDays)
      : 0;
    const avgWat = pWater.length > 0
      ? parseFloat((pWater.reduce((acc, w) => acc + (w.amountL || 0), 0) / waterDays).toFixed(1))
      : 0;
    const avgStp = pActivity.length > 0
      ? Math.round(pActivity.reduce((acc, a) => acc + (a.steps || 0), 0) / actDays)
      : 0;

    return { avgCal, avgProt, avgWat, avgStp };
  }, [mealEntries, waterRecords, activityRecords, periodDays]);

  // Selected period values (uses period-specific data, falling back to today or defaults if empty)
  const caloriesVal = periodData.avgCal > 0 
    ? periodData.avgCal 
    : (todayNutrition.calories > 0 ? todayNutrition.calories : 1620);
  const caloriesTarget = settings.dailyCalorieGoalKcal || 1850;

  const proteinVal = periodData.avgProt > 0 
    ? periodData.avgProt 
    : (todayNutrition.proteinG > 0 ? todayNutrition.proteinG : 86);
  const proteinTarget = settings.dailyProteinGoalG || 105;

  const waterVal = periodData.avgWat > 0 
    ? periodData.avgWat 
    : (todayWater > 0 ? todayWater : 1.8);
  const waterTarget = settings.dailyWaterGoalL || 2.4;

  const stepsVal = periodData.avgStp > 0 
    ? periodData.avgStp 
    : (todayAct.steps > 0 ? todayAct.steps : 7432);
  const stepsTarget = settings.dailyStepGoal || 9000;
  const stepsTargetLabel = stepsTarget >= 1000 ? `${(stepsTarget / 1000).toFixed(0)}k` : `${stepsTarget}`;

  const habitSectionTitle = period === 'week' 
    ? "THIS WEEK'S HABITS" 
    : period === '30d' 
      ? "30-DAY HABITS" 
      : "90-DAY HABITS";
  const habitSectionSubtitle = period === 'week' 
    ? "Small wins, all week" 
    : period === '30d' 
      ? "Consistency over 30 days" 
      : "Long-term momentum";

  // Achievements list for "See all" functionality
  const achievementsList = useMemo(() => [
    {
      id: 'streak_7',
      title: '7 day streak',
      subtitle: 'Unlocked today',
      icon: <Flame className="w-5 h-5 text-[#FF7A50] fill-[#FF7A50]" />,
      bg: 'bg-[#FEF0EA]',
      unlocked: true,
    },
    {
      id: 'weight_milestone',
      title: lostSoFar > 0 ? `${lostSoFar.toFixed(0)} lb lost` : '11 lb lost',
      subtitle: 'A milestone worth celebrating',
      icon: <Award className="w-5 h-5 text-[#1F7A5C]" />,
      bg: 'bg-[#E8F5EE]',
      unlocked: true,
    },
    {
      id: 'hydration_hero',
      title: 'Hydration Hero',
      subtitle: 'Logged 2.0L+ water',
      icon: <Droplets className="w-5 h-5 text-[#3E8FB0]" />,
      bg: 'bg-[#E8F4F8]',
      unlocked: waterVal >= 2.0,
    },
    {
      id: 'protein_champion',
      title: 'Protein Champion',
      subtitle: 'Reached 80g+ protein',
      icon: <Leaf className="w-5 h-5 text-[#1F7A5C]" />,
      bg: 'bg-[#E8F5EE]',
      unlocked: proteinVal >= 80,
    },
    {
      id: 'step_master',
      title: 'Active Mover',
      subtitle: 'Achieved 7,000+ steps',
      icon: <Footprints className="w-5 h-5 text-[#2E8B8B]" />,
      bg: 'bg-[#E6F4F1]',
      unlocked: stepsVal >= 7000,
    },
  ], [lostSoFar, waterVal, proteinVal, stepsVal]);

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] pb-36 font-sans selection:bg-[#1F7A5C] selection:text-white">
      {/* 1 — Top Header */}
      <header className="px-5 pt-3 pb-2.5 flex items-center justify-between sticky top-0 bg-[#F6FAF7]/95 backdrop-blur-md z-20 border-b border-[#DCE6E0]/60">
        <button 
          type="button"
          onClick={() => onNavigate('home')} 
          className="p-1 -ml-1 text-[#1B2B24] hover:bg-[#EFF6F1] rounded-full transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="text-center">
          <span className="text-[11px] font-medium text-[#8A9A92] block leading-tight">VitaAI · Weight loss</span>
          <h1 className="font-bold text-lg text-[#1B2B24] leading-tight">Your progress</h1>
        </div>

        <div className="flex items-center gap-3 relative">
          <button 
            type="button"
            onClick={() => onNavigate('history')}
            className="p-1 text-[#1B2B24] hover:bg-[#EFF6F1] rounded-full transition-colors"
            title="Calendar / History"
            aria-label="Calendar"
          >
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </button>
          
          <button 
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-1 text-[#1B2B24] hover:bg-[#EFF6F1] rounded-full transition-colors"
            title="More options"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 stroke-[2.2]" />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 top-8 w-44 bg-white border border-[#DCE6E0] rounded-2xl shadow-lg p-1.5 z-30">
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  setShowWeightModal(true);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#1B2B24] hover:bg-[#F6FAF7] transition-colors"
              >
                Update Weight
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  onNavigate('history');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#1B2B24] hover:bg-[#F6FAF7] transition-colors"
              >
                View History
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-5">
        {/* Top Green Progress Summary Card */}
        <section className="bg-[#1F7A5C] text-white rounded-3xl p-6 shadow-xs relative overflow-hidden">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-4">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{targetMonthStr}</span>
          </div>

          {/* Middle Row: Current Weight + Circular Progress Ring */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-white/80 block font-medium">Current weight</span>
              <div className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
                {currentWeight} <span className="text-lg font-bold text-white/90">lb</span>
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-22 h-22 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 84 84">
                <circle
                  cx="42"
                  cy="42"
                  r={ringRadius}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="42"
                  cy="42"
                  r={ringRadius}
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-white leading-none">{progressPercent}%</span>
                <span className="text-[10px] text-white/80 font-medium leading-tight mt-0.5">complete</span>
              </div>
            </div>
          </div>

          {/* Dynamic motivational distance message */}
          <p className="text-xs text-white/90 font-medium mt-3 mb-4">
            {lostSoFar > 0 
              ? `You're ${lostSoFar.toFixed(1)} lb closer to your goal.`
              : `You're ${remaining.toFixed(1)} lb away from your goal.`}
          </p>

          {/* Bottom stats: Target, Lost, Remaining */}
          <div className="border-t border-white/20 pt-3.5 grid grid-cols-3 gap-2">
            <div>
              <span className="text-[11px] text-white/75 block font-medium">Target</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{goalWeight} lb</span>
            </div>
            <div>
              <span className="text-[11px] text-white/75 block font-medium">Lost</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{lostSoFar.toFixed(1)} lb</span>
            </div>
            <div>
              <span className="text-[11px] text-white/75 block font-medium">Remaining</span>
              <span className="text-sm font-bold text-white mt-0.5 block">{remaining.toFixed(1)} lb</span>
            </div>
          </div>
        </section>

        {/* Period Selection Buttons: This Week / 30 Days / 90 Days */}
        <div className="flex bg-[#EFF6F1] p-1 rounded-2xl border border-[#DCE6E0]">
          {(['week', '30d', '90d'] as const).map((key) => {
            const label = key === 'week' ? 'This Week' : key === '30d' ? '30 Days' : '90 Days';
            const isSelected = period === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  isSelected
                    ? 'bg-[#1F7A5C] text-white shadow-2xs'
                    : 'text-[#4C5F55] hover:text-[#1B2B24]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 2 — Journey Map */}
        <div className="bg-white rounded-3xl border border-[#DCE6E0] p-6 shadow-2xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#1F7A5C] block mb-1">
            JOURNEY MAP
          </span>
          <h2 className="text-xl font-bold text-[#1B2B24] mb-6">Milestones that matter</h2>

          {/* Vertical milestone timeline */}
          <div className="space-y-0 relative">
            {/* Milestone 1: Start journey */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#E8F5EE] text-[#1F7A5C] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="w-0.5 bg-[#DCE6E0] h-9 my-1" />
              </div>
              <div className="pt-0.5">
                <div className="text-sm font-bold text-[#1B2B24]">Start journey</div>
                <div className="text-xs text-[#8A9A92] mt-0.5">{startDateStr} · {startWeight} lb</div>
              </div>
            </div>

            {/* Milestone 2: First 11 lb down */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#E8F5EE] text-[#1F7A5C] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="w-0.5 bg-[#DCE6E0] h-9 my-1" />
              </div>
              <div className="pt-0.5">
                <div className="text-sm font-bold text-[#1B2B24]">
                  {lostSoFar >= 5 ? `First ${Math.round(lostSoFar)} lb down` : 'First 11 lb down'}
                </div>
                <div className="text-xs text-[#8A9A92] mt-0.5">20 Feb 2025 · Completed</div>
              </div>
            </div>

            {/* Milestone 3: Current position */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#FEF0EA] text-[#FF7A50] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 fill-current" />
                </div>
                <div className="w-0.5 bg-[#DCE6E0] h-9 my-1" />
              </div>
              <div className="pt-0.5">
                <div className="text-sm font-bold text-[#1B2B24]">Current position</div>
                <div className="text-xs text-[#8A9A92] mt-0.5">{currentWeight} lb · Keep your rhythm</div>
              </div>
            </div>

            {/* Milestone 4: Goal achieved */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#F0F3F1] text-[#8A9A92] flex items-center justify-center shrink-0">
                  <Flag className="w-4 h-4 fill-current" />
                </div>
              </div>
              <div className="pt-0.5">
                <div className="text-sm font-bold text-[#8A9A92]">Goal achieved</div>
                <div className="text-xs text-[#8A9A92] mt-0.5">{goalWeight} lb · {estCompletionStr}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 — Achievements */}
        <section className="space-y-3">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#1F7A5C] block mb-1">
              ACHIEVEMENTS
            </span>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1B2B24]">You earned these</h2>
              <button 
                type="button" 
                onClick={() => setShowAllAchievements(true)}
                className="text-xs font-semibold text-[#1F7A5C] hover:underline"
              >
                See all
              </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {/* 7 day streak */}
            <div className="min-w-[190px] flex-1 bg-white rounded-3xl border border-[#DCE6E0] p-4.5 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FEF0EA] flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-[#FF7A50] fill-[#FF7A50]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1B2B24]">7 day streak</div>
                <div className="text-xs text-[#8A9A92] mt-0.5">Unlocked today</div>
              </div>
            </div>

            {/* 11 lb lost */}
            <div className="min-w-[190px] flex-1 bg-white rounded-3xl border border-[#DCE6E0] p-4.5 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#1F7A5C]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1B2B24]">
                  {lostSoFar > 0 ? `${lostSoFar.toFixed(0)} lb lost` : '11 lb lost'}
                </div>
                <div className="text-xs text-[#8A9A92] mt-0.5">A milestone worth celebrating</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 & 5 — Habit Progress Cards (Period-responsive) */}
        <section className="space-y-3">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#1F7A5C] block mb-1">
              {habitSectionTitle}
            </span>
            <h2 className="text-xl font-bold text-[#1B2B24]">{habitSectionSubtitle}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Calories Card */}
            <div className="bg-white rounded-3xl border border-[#DCE6E0] p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4C5F55]">Calories</span>
                <Flame className="w-4 h-4 text-[#FF7A50] fill-[#FF7A50]" />
              </div>
              <div className="text-base font-bold text-[#1B2B24]">
                {caloriesVal.toLocaleString()} <span className="text-xs font-normal text-[#8A9A92]">/ {caloriesTarget.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-[#F6FAF7] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF7A50] rounded-full transition-all" 
                  style={{ width: `${Math.min(100, Math.round((caloriesVal / caloriesTarget) * 100))}%` }} 
                />
              </div>
            </div>

            {/* Protein Card */}
            <div className="bg-white rounded-3xl border border-[#DCE6E0] p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4C5F55]">Protein</span>
                <Leaf className="w-4 h-4 text-[#1F7A5C]" />
              </div>
              <div className="text-base font-bold text-[#1B2B24]">
                {proteinVal} <span className="text-xs font-normal text-[#8A9A92]">/ {proteinTarget} g</span>
              </div>
              <div className="w-full h-2 bg-[#F6FAF7] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1F7A5C] rounded-full transition-all" 
                  style={{ width: `${Math.min(100, Math.round((proteinVal / proteinTarget) * 100))}%` }} 
                />
              </div>
            </div>

            {/* Water Card */}
            <div className="bg-white rounded-3xl border border-[#DCE6E0] p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4C5F55]">Water</span>
                <Droplets className="w-4 h-4 text-[#3E8FB0]" />
              </div>
              <div className="text-base font-bold text-[#1B2B24]">
                {waterVal.toFixed(1)} <span className="text-xs font-normal text-[#8A9A92]">/ {waterTarget.toFixed(1)} L</span>
              </div>
              <div className="w-full h-2 bg-[#F6FAF7] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3E8FB0] rounded-full transition-all" 
                  style={{ width: `${Math.min(100, Math.round((waterVal / waterTarget) * 100))}%` }} 
                />
              </div>
            </div>

            {/* Steps Card */}
            <div className="bg-white rounded-3xl border border-[#DCE6E0] p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4C5F55]">Steps</span>
                <Footprints className="w-4 h-4 text-[#2E8B8B]" />
              </div>
              <div className="text-base font-bold text-[#1B2B24]">
                {stepsVal.toLocaleString()} <span className="text-xs font-normal text-[#8A9A92]">/ {stepsTargetLabel}</span>
              </div>
              <div className="w-full h-2 bg-[#F6FAF7] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2E8B8B] rounded-full transition-all" 
                  style={{ width: `${Math.min(100, Math.round((stepsVal / stepsTarget) * 100))}%` }} 
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button: Update Current Weight */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-30 pointer-events-none">
        <button
          type="button"
          onClick={() => setShowWeightModal(true)}
          className="w-full py-3.5 bg-[#1F7A5C] text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-[#18634B] active:scale-[0.99] transition-all flex items-center justify-center gap-2 pointer-events-auto border border-white/20 backdrop-blur-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Update Current Weight</span>
        </button>
      </div>

      {/* Existing Weight Modal Flow */}
      {showWeightModal && (
        <WLWeight
          onClose={() => setShowWeightModal(false)}
          onWeightUpdated={async (newW) => {
            try {
              const updated = await WLRepository.getWeightRecords();
              setWeightRecords(updated);
              if (onUpdateSettings) {
                onUpdateSettings({ ...settings, currentWeightLb: newW });
              }
            } catch (err) {
              console.warn('Update weight records in progress failed:', err);
            }
          }}
          goalWeightLb={settings.goalWeightLb}
        />
      )}

      {/* Achievements Detail Modal ("See all") */}
      {showAllAchievements && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#DCE6E0] shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-[#DCE6E0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#1F7A5C]" />
                <h3 className="text-base font-bold text-[#1B2B24]">Your Achievements</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAllAchievements(false)}
                className="p-1 text-[#8A9A92] hover:text-[#1B2B24] rounded-full hover:bg-[#F6FAF7] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-2.5 max-h-80 overflow-y-auto">
              {achievementsList.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
                    item.unlocked
                      ? 'bg-white border-[#DCE6E0]'
                      : 'bg-[#F9FAF9] border-[#EAEFEA] opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#1B2B24] truncate">{item.title}</div>
                    <div className="text-xs text-[#8A9A92]">{item.subtitle}</div>
                  </div>
                  {item.unlocked && (
                    <span className="text-[10px] font-bold text-[#1F7A5C] bg-[#E8F5EE] px-2 py-0.5 rounded-full shrink-0">
                      Earned
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#F6FAF7] border-t border-[#DCE6E0]">
              <button
                type="button"
                onClick={() => setShowAllAchievements(false)}
                className="w-full py-2.5 bg-[#1F7A5C] text-white rounded-xl text-xs font-bold hover:bg-[#18634B] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

