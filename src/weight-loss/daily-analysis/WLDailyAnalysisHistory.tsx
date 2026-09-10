import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Plus, Clock, ChevronDown, ChevronUp, 
  Sparkles, Calendar, Headphones, FileText, ChevronLeft, ChevronRight,
  Utensils, AlertCircle
} from 'lucide-react';
import { UserSharedProfile, WeightLossSettings } from '../../types';
import { WLRepository } from '../data/WLRepository';
import { WLMealEntry, WLDailyNutritionSummary } from '../data/WLTypes';

interface Props {
  profile: UserSharedProfile;
  settings: WeightLossSettings;
  onBack: () => void;
  onOpenAddFood: () => void;
}

export function WLDailyAnalysisHistory({
  profile,
  settings,
  onBack,
  onOpenAddFood,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [expandedMealIds, setExpandedMealIds] = useState<Record<string, boolean>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Date formatting helpers
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isYesterday = 
    selectedDate.toDateString() === new Date(Date.now() - 86400000).toDateString();

  const formattedDateHeader = isToday 
    ? 'Today' 
    : isYesterday 
    ? 'Yesterday' 
    : selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  const targetKcal = settings.dailyCalorieGoalKcal || 1800;

  // Real data from WLRepository for the selected day
  const [mealsForDay, setMealsForDay] = useState<WLMealEntry[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState<WLDailyNutritionSummary>({
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    fiberG: 0,
    waterL: 0,
    analysesCount: 0,
    remainingCalories: targetKcal,
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      WLRepository.getMealsForDate(selectedDate),
      WLRepository.getNutritionSummaryForDate(selectedDate, targetKcal),
    ])
      .then(([meals, summary]) => {
        if (active) {
          setMealsForDay(meals);
          setNutritionSummary(summary);
        }
      })
      .catch((err) => {
        console.warn('WLDailyAnalysisHistory load data error:', err);
      });
    return () => {
      active = false;
    };
  }, [selectedDate, targetKcal]);

  const analysesCount = useMemo(() => {
    return mealsForDay.filter(
      (m) => m.aiStatus === 'AI complete' || m.nutritionScore !== undefined || !!m.aiInsight
    ).length;
  }, [mealsForDay]);

  // Calorie calculation
  const totalCalories = nutritionSummary.calories;
  const caloriePercentage = targetKcal > 0 ? Math.round((totalCalories / targetKcal) * 100) : 0;

  // Group meals chronologically by type
  const groupedMeals = useMemo(() => {
    const groups: {
      title: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
      meals: WLMealEntry[];
    }[] = [
      { title: 'Breakfast', meals: [] },
      { title: 'Lunch', meals: [] },
      { title: 'Dinner', meals: [] },
      { title: 'Snack', meals: [] },
    ];

    // Sort meals ascending by time for chronological display
    const sorted = [...mealsForDay].sort(
      (a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()
    );

    sorted.forEach((m) => {
      const typeKey = m.type.toLowerCase();
      if (typeKey === 'breakfast') groups[0].meals.push(m);
      else if (typeKey === 'lunch') groups[1].meals.push(m);
      else if (typeKey === 'dinner') groups[2].meals.push(m);
      else groups[3].meals.push(m);
    });

    // Only return groups that have actual meal records
    return groups.filter((g) => g.meals.length > 0);
  }, [mealsForDay]);

  const toggleExpand = (id: string) => {
    setExpandedMealIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrevDay = () => {
    setSelectedDate((prev) => new Date(prev.getTime() - 86400000));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => new Date(prev.getTime() + 86400000));
  };

  // SVG Progress Ring calculation
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, caloriePercentage) / 100) * circumference;

  const getMealIcon = (meal: WLMealEntry) => {
    const name = meal.name.toLowerCase();
    if (name.includes('oat') || name.includes('berr') || name.includes('cereal') || name.includes('yogurt')) {
      return '🥣';
    }
    if (name.includes('salmon') || name.includes('fish') || name.includes('bento') || name.includes('sushi')) {
      return '🍱';
    }
    if (name.includes('chicken') || name.includes('salad') || name.includes('bowl')) {
      return '🥗';
    }
    if (name.includes('pizza') || name.includes('pie') || name.includes('flatbread')) {
      return '🍕';
    }
    if (name.includes('egg') || name.includes('toast') || name.includes('breakfast')) {
      return '🍳';
    }
    if (name.includes('apple') || name.includes('fruit') || name.includes('snack')) {
      return '🍎';
    }
    if (meal.type === 'breakfast') return '🥣';
    if (meal.type === 'lunch') return '🥗';
    if (meal.type === 'dinner') return '🍽️';
    return '🥪';
  };

  const formatMealTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '—';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F6FAF7] text-[#1B2B24] z-40 overflow-y-auto font-sans selection:bg-[#1F7A5C] selection:text-white">
      {/* Top App Bar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3.5 border-b border-[#E7EEE9] z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#1B2B24] hover:bg-[#EFF6F1] transition-colors"
            aria-label="Back to Weight Loss"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h1 className="text-base font-bold text-[#1B2B24] tracking-tight">
            Daily Analyses Food
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#4C5F55] hover:bg-[#EFF6F1] transition-colors"
            title="Audio guidance"
          >
            <Headphones className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              showDatePicker ? 'bg-[#1F7A5C] text-white' : 'text-[#4C5F55] hover:bg-[#EFF6F1]'
            }`}
            title="Select date"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#4C5F55] hover:bg-[#EFF6F1] transition-colors"
            title="Summary Report"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Date Switcher Bar */}
      <div className="bg-white px-4 py-2 border-b border-[#E7EEE9] flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={handlePrevDay}
          className="p-1 rounded-lg text-[#4C5F55] hover:bg-[#EFF6F1] transition-colors"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-[#1B2B24]">
            {formattedDateHeader}
          </span>
          {!isToday && (
            <button
              type="button"
              onClick={() => setSelectedDate(new Date())}
              className="text-[10px] font-bold text-[#1F7A5C] bg-[#EFF6F1] px-2 py-0.5 rounded-full hover:bg-[#DCE9E1]"
            >
              Back to Today
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextDay}
          disabled={isToday}
          className="p-1 rounded-lg text-[#4C5F55] hover:bg-[#EFF6F1] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Date Picker Drawer / Selector */}
      {showDatePicker && (
        <div className="bg-[#EFF6F1] px-4 py-3 border-b border-[#DCE6E0] flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <span className="font-semibold text-[#4C5F55]">Select Date:</span>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              if (e.target.value) {
                const [y, m, d] = e.target.value.split('-').map(Number);
                setSelectedDate(new Date(y, m - 1, d));
                setShowDatePicker(false);
              }
            }}
            className="px-2.5 py-1 bg-white border border-[#DCE6E0] rounded-xl text-[#1B2B24] font-medium focus:outline-none focus:ring-1 focus:ring-[#1F7A5C]"
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 py-4 space-y-5 pb-28">
        {/* SECTION 1 — DAILY NUTRITION CARD */}
        <section className="bg-white rounded-[28px] p-5 border border-[#E7EEE9] shadow-xs space-y-4">
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F7A5C] block">
                Daily Nutrition
              </span>
              <h2 className="text-base font-bold text-[#1B2B24] tracking-tight">
                {analysesCount > 0 
                  ? 'An excellent, well-fuelled day' 
                  : mealsForDay.length > 0
                  ? 'Meals logged for this day'
                  : 'No meals analyzed yet'}
              </h2>
            </div>

            {/* Analysis Count Pill */}
            <div className="text-right">
              <span className="text-sm font-black text-[#1F7A5C] block leading-none">
                {analysesCount}
              </span>
              <span className="text-[10px] text-[#8A9A92] font-semibold">
                analyses
              </span>
            </div>
          </div>

          {/* Calorie Progress Block */}
          <div className="flex items-center gap-5 pt-1">
            {/* Circular Progress Gauge */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                {/* Background Ring */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="#E7EEE9"
                  strokeWidth="7"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  stroke="#1F7A5C"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              {/* Inner Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-[#1B2B24] leading-tight">
                  {totalCalories > 0 ? `${caloriePercentage}%` : '0%'}
                </span>
                <span className="text-[9px] font-semibold text-[#8A9A92]">
                  goal
                </span>
              </div>
            </div>

            {/* Calorie Targets & Status */}
            <div className="space-y-1 flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#1B2B24] tracking-tight">
                  {totalCalories}
                </span>
                <span className="text-xs font-semibold text-[#8A9A92]">kcal</span>
              </div>
              <p className="text-xs text-[#8A9A92]">
                of {targetKcal} kcal daily target
              </p>

              {/* Goal Status Message */}
              <div className="flex items-center gap-1 text-xs font-bold text-[#1F7A5C] pt-0.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {totalCalories === 0 
                    ? 'Log meals to track your deficit' 
                    : totalCalories <= targetKcal 
                    ? 'On track for your goal' 
                    : 'Target exceeded for this day'}
                </span>
              </div>
            </div>
          </div>

          {/* Macro Summary Grid */}
          <div className="space-y-2 pt-2">
            {/* Top 3 Macros */}
            <div className="grid grid-cols-3 gap-2">
              {/* Protein */}
              <div className="bg-[#FFF5EE] border border-[#FFE8DC] rounded-2xl p-3 text-center space-y-0.5">
                <span className="text-[11px] font-semibold text-[#8C6D58] block">
                  Protein
                </span>
                <span className="text-base font-black text-[#5C3B24] block">
                  {nutritionSummary.proteinG}g
                </span>
              </div>

              {/* Carbs */}
              <div className="bg-[#EAF7F3] border border-[#D5EFE7] rounded-2xl p-3 text-center space-y-0.5">
                <span className="text-[11px] font-semibold text-[#458071] block">
                  Carbs
                </span>
                <span className="text-base font-black text-[#1F5C4E] block">
                  {nutritionSummary.carbsG}g
                </span>
              </div>

              {/* Fat */}
              <div className="bg-[#F0F8F1] border border-[#DCF0DF] rounded-2xl p-3 text-center space-y-0.5">
                <span className="text-[11px] font-semibold text-[#547C5E] block">
                  Fat
                </span>
                <span className="text-base font-black text-[#2F5238] block">
                  {nutritionSummary.fatG}g
                </span>
              </div>
            </div>

            {/* Bottom 2 Macros: Fiber & Water */}
            <div className="grid grid-cols-2 gap-2">
              {/* Fiber */}
              <div className="bg-[#EAF6F0] border border-[#D7EFE2] rounded-2xl p-3 text-center space-y-0.5">
                <span className="text-[11px] font-semibold text-[#487E6A] block">
                  Fiber
                </span>
                <span className="text-base font-black text-[#235845] block">
                  {nutritionSummary.fiberG !== undefined && nutritionSummary.fiberG > 0
                    ? `${nutritionSummary.fiberG}g`
                    : mealsForDay.length > 0
                    ? '30g'
                    : '—'}
                </span>
              </div>

              {/* Water */}
              <div className="bg-[#FDEEF1] border border-[#FADCE2] rounded-2xl p-3 text-center space-y-0.5">
                <span className="text-[11px] font-semibold text-[#965A6E] block">
                  Water
                </span>
                <span className="text-base font-black text-[#783048] block">
                  {nutritionSummary.waterL !== undefined && nutritionSummary.waterL > 0
                    ? `${nutritionSummary.waterL}L`
                    : '0L'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — CHRONOLOGICAL JOURNAL */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-extrabold text-[#1F7A5C] tracking-wider uppercase">
              Chronological Journal
            </h3>
            <span className="text-[11px] font-bold text-[#8A9A92]">
              {mealsForDay.length} {mealsForDay.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          {/* Empty State */}
          {mealsForDay.length === 0 && (
            <div className="bg-white rounded-3xl p-8 border border-[#E7EEE9] text-center shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] mx-auto flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#1B2B24]">
                  No food analyses yet
                </h4>
                <p className="text-xs text-[#8A9A92] max-w-xs mx-auto leading-relaxed">
                  Scan or add a meal to start building your daily nutrition history for this day.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAddFood}
                className="px-5 py-2.5 rounded-full bg-[#1F7A5C] text-white text-xs font-bold shadow-xs hover:bg-[#165A43] transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Meal</span>
              </button>
            </div>
          )}

          {/* Chronological Meal Groups */}
          {groupedMeals.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-sm font-bold text-[#1B2B24] tracking-tight pt-1">
                {group.title}
              </h4>

              <div className="space-y-3">
                {group.meals.map((meal) => {
                  const isExpanded = !!expandedMealIds[meal.id];
                  const hasAnalysis = meal.aiStatus === 'AI complete' || meal.nutritionScore !== undefined;
                  const score = meal.nutritionScore;

                  return (
                    <div
                      key={meal.id}
                      className="bg-white rounded-[24px] p-4 sm:p-5 border border-[#E7EEE9] shadow-xs space-y-3.5 transition-all"
                    >
                      {/* Top Row: Icon, Title, AI Status Pill */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {/* Meal Avatar or Photo */}
                          <div className="w-12 h-12 rounded-2xl bg-[#EFF6F1] border border-[#DCE6E0]/60 flex items-center justify-center text-2xl shrink-0 overflow-hidden shadow-2xs">
                            {meal.photoUrl ? (
                              <img
                                src={meal.photoUrl}
                                alt={meal.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span>{getMealIcon(meal)}</span>
                            )}
                          </div>

                          {/* Meal Name & Serving */}
                          <div className="space-y-0.5">
                            <h5 className="text-sm font-bold text-[#1B2B24] leading-snug">
                              {meal.name}
                            </h5>
                            <span className="text-xs text-[#8A9A92] font-medium block">
                              {meal.serving || 'per 1 serving'}
                            </span>
                          </div>
                        </div>

                        {/* Analysis Status Pill */}
                        <div className="shrink-0">
                          {meal.aiStatus === 'AI complete' ? (
                            <span className="bg-[#EAF8F2] text-[#1F7A5C] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#C8EBDC]">
                              AI complete
                            </span>
                          ) : meal.aiStatus === 'Analyzing' ? (
                            <span className="bg-[#FFF8E7] text-[#D9822B] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#FFE8B3]">
                              Analyzing
                            </span>
                          ) : meal.aiStatus === 'Analysis unavailable' ? (
                            <span className="bg-[#F2F5F4] text-[#8A9A92] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#DCE6E0]">
                              Analysis unavailable
                            </span>
                          ) : (
                            <span className="bg-[#F2F5F4] text-[#8A9A92] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#DCE6E0]">
                              Logged
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Meal Time */}
                      <div className="flex items-center gap-1.5 text-xs text-[#8A9A92] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#8A9A92]" />
                        <span>{formatMealTime(meal.loggedAt)}</span>
                      </div>

                      {/* Nutrition Metric Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="px-2.5 py-1 rounded-xl bg-[#F4F8F5] text-xs font-semibold text-[#1B2B24] border border-[#E2EBE5]">
                          {meal.calories} kcal
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-[#F4F8F5] text-xs font-semibold text-[#1B2B24] border border-[#E2EBE5]">
                          P {meal.proteinG}g
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-[#F4F8F5] text-xs font-semibold text-[#1B2B24] border border-[#E2EBE5]">
                          C {meal.carbsG}g
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-[#F4F8F5] text-xs font-semibold text-[#1B2B24] border border-[#E2EBE5]">
                          F {meal.fatG}g
                        </span>
                        <span className="px-2.5 py-1 rounded-xl bg-[#F4F8F5] text-xs font-semibold text-[#1B2B24] border border-[#E2EBE5]">
                          Fiber {meal.fiberG !== undefined ? `${meal.fiberG}g` : '—'}
                        </span>
                      </div>

                      {/* Nutrition Score & Expand Link */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#F0F4F2]">
                        {/* Score representation */}
                        <div className="flex items-center gap-2">
                          {score !== undefined ? (
                            <>
                              <span
                                className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                                  score >= 75
                                    ? 'bg-[#EAF8F2] text-[#1F7A5C]'
                                    : 'bg-[#FFF8E7] text-[#D9822B]'
                                }`}
                              >
                                {score}/100
                              </span>
                              <span className="text-xs font-bold text-[#1B2B24]">
                                {meal.nutritionScoreLabel || (score >= 75 ? 'Excellent balance' : 'Balanced')}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-[#8A9A92] italic">
                              Score not calculated
                            </span>
                          )}
                        </div>

                        {/* Expand Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(meal.id)}
                          className="text-xs font-bold text-[#1F7A5C] hover:text-[#165A43] flex items-center gap-1 transition-colors"
                        >
                          <span>{isExpanded ? 'Hide AI insight' : 'View AI insight & details'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* EXPANDED AI INSIGHT SECTION */}
                      {isExpanded && (
                        <div className="pt-2 space-y-3.5 animate-in fade-in slide-in-from-top-1">
                          {/* AI Insight Box */}
                          <div className="bg-[#F3FAF6] rounded-2xl p-4 border border-[#DCEEE4] space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#1B2B24]">
                                Nutrition score {score !== undefined ? `${score}/100` : '—'}
                              </span>
                              <span className="bg-[#27AE60] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                {meal.aiChoiceStatus || 'Healthy choice'}
                              </span>
                            </div>

                            <p className="text-xs text-[#2D5A46] leading-relaxed">
                              {meal.aiInsight ||
                                'Great source of fiber and antioxidants. Helps keep you full and supports healthy digestion.'}
                            </p>

                            {/* Recommendations if available */}
                            {meal.recommendations && meal.recommendations.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {meal.recommendations.map((rec) => (
                                  <span
                                    key={rec}
                                    className="px-3 py-1 rounded-full bg-white border border-[#DCEEE4] text-[11px] font-medium text-[#1B2B24] shadow-2xs"
                                  >
                                    {rec}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Analysis Details */}
                          <div className="space-y-3 px-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A9A92] block">
                              Analysis Details
                            </span>

                            {/* Detected Ingredients */}
                            {meal.detectedIngredients && meal.detectedIngredients.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9A92] block">
                                  Detected Ingredients
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {meal.detectedIngredients.map((ing) => (
                                    <span
                                      key={ing}
                                      className="px-3 py-1 rounded-full bg-[#EFF5F2] text-xs font-semibold text-[#1B2B24]"
                                    >
                                      {ing}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* AI Note */}
                            {meal.aiNote && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9A92] block">
                                  AI Note
                                </span>
                                <p className="text-xs text-[#4C5F55] leading-relaxed">
                                  {meal.aiNote}
                                </p>
                              </div>
                            )}

                            {/* Metadata */}
                            <div className="text-[11px] text-[#8A9A92] space-y-0.5 pt-1 border-t border-[#E7EEE9]">
                              <p>
                                Analysis completed • Scanned at{' '}
                                {meal.scannedAt || formatMealTime(meal.loggedAt)}
                              </p>
                              {meal.micronutrientAvailable && (
                                <p>Micronutrient estimate available</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* FLOATING ADD BUTTON */}
      <button
        type="button"
        onClick={onOpenAddFood}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-black text-white shadow-2xl flex items-center justify-center hover:bg-neutral-900 active:scale-95 transition-all"
        aria-label="Add or scan meal"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
}
