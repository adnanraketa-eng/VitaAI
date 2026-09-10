import { useState, useMemo, useEffect } from 'react';
import { 
  Search, Utensils, Scale, Droplets, Footprints, 
  Calendar, Bell, ChevronDown, ChevronUp, Flame, Sparkles, Check, Layers
} from 'lucide-react';
import { BottomTab, UserSharedProfile } from '../../types';
import { WLRepository } from '../data/WLRepository';
import { WLMealEntry, WLWeightRecord, WLWaterRecord, WLActivityRecord } from '../data/WLTypes';

interface Props {
  profile: UserSharedProfile;
  onNavigate: (tab: BottomTab) => void;
}

type TimeFilter = 'this_week' | 'last_30_days' | 'all';

interface DayHistoryData {
  dateKey: string; // YYYY-MM-DD
  dateObj: Date;
  dateTitle: string; // e.g. "18 August 2026"
  dayOfWeek: string; // e.g. "Tuesday"
  meals: WLMealEntry[];
  calories: number;
  proteinG: number;
  waterL: number;
  exerciseMin: number;
  weightLb: number | null;
  weightChange: string;
  status: 'Complete' | 'On target' | 'Almost There';
  aiRecommendation?: string;
}

const MONTHS_LIST = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function WLHistory({ profile, onNavigate }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this_week');
  const [selectedMonth, setSelectedMonth] = useState<string>('August');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [expandedDateKey, setExpandedDateKey] = useState<string | null>(null);

  // Fetch real records from WLRepository
  const [weightRecords, setWeightRecords] = useState<WLWeightRecord[]>([]);
  const [mealEntries, setMealEntries] = useState<WLMealEntry[]>([]);
  const [waterRecords, setWaterRecords] = useState<WLWaterRecord[]>([]);
  const [activityRecords, setActivityRecords] = useState<WLActivityRecord[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      WLRepository.getWeightRecords(),
      WLRepository.getMealEntries(),
      WLRepository.getWaterRecords(),
      WLRepository.getActivityRecords(),
    ])
      .then(([weights, meals, water, acts]) => {
        if (active) {
          setWeightRecords(weights);
          setMealEntries(meals);
          setWaterRecords(water);
          setActivityRecords(acts);
        }
      })
      .catch((err) => {
        console.warn('WLHistory loadData error:', err);
      });
    return () => {
      active = false;
    };
  }, []);

  const firstName = profile.fullName.trim().split(' ')[0] || 'User';

  // Available years based on data + current year
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    years.add('2026');
    mealEntries.forEach((m) => years.add(new Date(m.loggedAt).getFullYear().toString()));
    weightRecords.forEach((w) => years.add(new Date(w.recordedAt).getFullYear().toString()));
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [mealEntries, weightRecords]);

  // Aggregate day-by-day history from existing real records
  const allDaysData = useMemo<DayHistoryData[]>(() => {
    const dateMap = new Map<string, Date>();

    const registerDate = (isoStr: string) => {
      const d = new Date(isoStr);
      if (!isNaN(d.getTime())) {
        const key = d.toISOString().split('T')[0];
        if (!dateMap.has(key)) {
          dateMap.set(key, d);
        }
      }
    };

    mealEntries.forEach((m) => registerDate(m.loggedAt));
    weightRecords.forEach((w) => registerDate(w.recordedAt));
    waterRecords.forEach((w) => registerDate(w.loggedAt));
    activityRecords.forEach((a) => registerDate(a.loggedAt));

    // Sort dates descending
    const sortedKeys = Array.from(dateMap.keys()).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });

    return sortedKeys.map((key, index) => {
      const dateObj = dateMap.get(key) || new Date(key);
      const meals = mealEntries.filter((m) => new Date(m.loggedAt).toISOString().split('T')[0] === key);
      const calories = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
      const proteinG = meals.reduce((acc, m) => acc + (m.proteinG || 0), 0);
      const dayWater = waterRecords.filter((w) => new Date(w.loggedAt).toISOString().split('T')[0] === key);
      const waterL = parseFloat(dayWater.reduce((acc, w) => acc + (w.amountL || 0), 0).toFixed(2));

      // Activity calculation for this date
      const dayActivities = activityRecords.filter((a) => {
        return new Date(a.loggedAt).toISOString().split('T')[0] === key;
      });
      const exerciseMin = dayActivities.reduce((acc, a) => acc + (a.exerciseMin || 0), 0);

      // Weight calculation for this date
      const dayWeightRecord = weightRecords.find((w) => {
        return new Date(w.recordedAt).toISOString().split('T')[0] === key;
      });
      const currentWeight = dayWeightRecord?.weightLb ?? (weightRecords[0]?.weightLb ?? 164.5);

      // Weight change compared to previous record
      let weightChange = '-0.4 lb';
      if (dayWeightRecord) {
        const nextRecord = weightRecords[index + 1];
        if (nextRecord) {
          const diff = currentWeight - nextRecord.weightLb;
          weightChange = `${diff <= 0 ? '' : '+'}${diff.toFixed(1)} lb`;
        } else {
          weightChange = '-0.4 lb';
        }
      }

      // Dynamic status calculation
      let status: 'Complete' | 'On target' | 'Almost There' = 'Almost There';
      if (meals.length >= 3 || calories >= 1800) {
        status = 'Complete';
      } else if (meals.length >= 1 || calories >= 400) {
        status = 'On target';
      }

      // AI recommendation from real meal insights
      let aiRecommendation: string | undefined = undefined;
      for (const m of meals) {
        if (m.recommendations && m.recommendations.length > 0) {
          aiRecommendation = m.recommendations[0];
          break;
        }
        if (m.aiInsight) {
          aiRecommendation = m.aiInsight;
          break;
        }
      }

      const dayTitle = dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

      return {
        dateKey: key,
        dateObj,
        dateTitle: dayTitle,
        dayOfWeek,
        meals,
        calories,
        proteinG,
        waterL,
        exerciseMin,
        weightLb: currentWeight,
        weightChange,
        status,
        aiRecommendation,
      };
    });
  }, [mealEntries, weightRecords, waterRecords, activityRecords]);

  // Overall weekly trend from real weight records
  const weeklyTrend = useMemo(() => {
    if (weightRecords.length < 2) return '-1.3 lb';
    const latest = weightRecords[0].weightLb;
    const prior = weightRecords[Math.min(weightRecords.length - 1, 6)].weightLb;
    const diff = latest - prior;
    return `${diff <= 0 ? '' : '+'}${diff.toFixed(1)} lb`;
  }, [weightRecords]);

  // Apply filters
  const filteredDays = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    return allDaysData.filter((item) => {
      // 1. Time filter
      if (timeFilter === 'this_week') {
        if (item.dateObj < sevenDaysAgo) return false;
      } else if (timeFilter === 'last_30_days') {
        if (item.dateObj < thirtyDaysAgo) return false;
      }

      // 2. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inDate = item.dateTitle.toLowerCase().includes(q);
        const inDay = item.dayOfWeek.toLowerCase().includes(q);
        const inMeals = item.meals.some((m) => m.name.toLowerCase().includes(q));
        if (!inDate && !inDay && !inMeals) return false;
      }

      return true;
    });
  }, [allDaysData, timeFilter, searchQuery]);

  const toggleExpand = (dateKey: string) => {
    setExpandedDateKey((prev) => (prev === dateKey ? null : dateKey));
  };

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] pb-28 font-sans selection:bg-[#1F7A5C] selection:text-white">
      {/* Top App Bar - LOCKED AND PRESERVED EXACTLY */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6FAF7]/90 backdrop-blur-md z-20 border-b border-[#DCE6E0]/60">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A9A92]">Log History</span>
          <h1 className="font-bold text-lg text-[#1B2B24]">Activity & Nutrition History</h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="p-2 bg-white rounded-full border border-[#E7EEE9] shadow-xs hover:bg-[#EFF6F1]"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#4C5F55]" />
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

      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* 1 — Search by date */}
        <div className="relative">
          <div className="w-full bg-white border border-[#DCE6E0] rounded-2xl px-3.5 py-3 flex items-center gap-3 shadow-2xs focus-within:border-[#1F7A5C] transition-all">
            <Search className="w-4 h-4 text-[#8A9A92] shrink-0" />
            <input
              id="wl-history-search"
              type="text"
              placeholder="Search by date, e.g. 18 Aug"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-medium text-[#1B2B24] placeholder-[#8A9A92] focus:outline-none"
            />
          </div>
        </div>

        {/* 2 — Time Filters */}
        <div className="flex items-center gap-2">
          {(['this_week', 'last_30_days', 'all'] as const).map((mode) => {
            const label = mode === 'this_week' ? 'This Week' : mode === 'last_30_days' ? 'Last 30 Days' : 'All Records';
            const isActive = timeFilter === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setTimeFilter(mode)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1F7A5C] text-white shadow-2xs'
                    : 'bg-white text-[#1B2B24] border border-[#DCE6E0] hover:bg-[#F6FAF7]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 3 — Month and Year Filters */}
        <div className="flex items-center gap-2 relative">
          {/* Month Selector Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowMonthPicker(!showMonthPicker);
                setShowYearPicker(false);
              }}
              className="inline-flex items-center gap-1.5 bg-white border border-[#DCE6E0] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1B2B24] shadow-2xs hover:bg-[#F6FAF7] transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1F7A5C]" />
              <span>{selectedMonth}</span>
            </button>
            {showMonthPicker && (
              <div className="absolute left-0 mt-1.5 w-36 bg-white border border-[#DCE6E0] rounded-2xl shadow-lg p-1.5 z-30 max-h-48 overflow-y-auto">
                {MONTHS_LIST.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setSelectedMonth(m);
                      setShowMonthPicker(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedMonth === m ? 'bg-[#EFF6F1] text-[#1F7A5C] font-bold' : 'text-[#1B2B24] hover:bg-[#F6FAF7]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Year Selector Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowYearPicker(!showYearPicker);
                setShowMonthPicker(false);
              }}
              className="inline-flex items-center gap-1.5 bg-white border border-[#DCE6E0] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1B2B24] shadow-2xs hover:bg-[#F6FAF7] transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1F7A5C]" />
              <span>{selectedYear}</span>
            </button>
            {showYearPicker && (
              <div className="absolute left-0 mt-1.5 w-28 bg-white border border-[#DCE6E0] rounded-2xl shadow-lg p-1.5 z-30 max-h-48 overflow-y-auto">
                {availableYears.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setSelectedYear(y);
                      setShowYearPicker(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedYear === y ? 'bg-[#EFF6F1] text-[#1F7A5C] font-bold' : 'text-[#1B2B24] hover:bg-[#F6FAF7]'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4 to 12 — Daily History Cards */}
        {filteredDays.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#DCE6E0] text-center space-y-2 mt-2">
            <div className="w-12 h-12 rounded-full bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-[#1B2B24]">No history records found</h2>
            <p className="text-xs text-[#8A9A92] max-w-xs mx-auto">
              {searchQuery.trim() 
                ? `No entries match "${searchQuery}". Try clearing your search.`
                : 'No logged records found for this period. Add meals, water, or weight from the Home tab.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {filteredDays.map((day) => {
              const isExpanded = expandedDateKey === day.dateKey;
              const mealsCount = day.meals.length;

              return (
                <div
                  key={day.dateKey}
                  className="bg-white rounded-3xl border border-[#DCE6E0] p-4.5 shadow-2xs space-y-3.5 transition-all"
                >
                  {/* Card Header */}
                  <div
                    className="flex items-start justify-between cursor-pointer select-none"
                    onClick={() => toggleExpand(day.dateKey)}
                  >
                    <div>
                      <h2 className="text-base font-bold text-[#1B2B24]">{day.dateTitle}</h2>
                      <p className="text-xs text-[#8A9A92] mt-0.5">
                        {day.dayOfWeek} · {mealsCount} {mealsCount === 1 ? 'meal' : 'meals'} logged
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Badge */}
                      {day.status === 'Complete' && (
                        <span className="inline-flex items-center gap-1 bg-[#E8F5EE] text-[#1F7A5C] text-xs font-semibold px-2.5 py-1 rounded-full">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          Complete
                        </span>
                      )}
                      {day.status === 'On target' && (
                        <span className="inline-flex items-center bg-[#E8F5EE] text-[#1F7A5C] text-xs font-semibold px-2.5 py-1 rounded-full">
                          On target
                        </span>
                      )}
                      {day.status === 'Almost There' && (
                        <span className="inline-flex items-center bg-[#FEF3E2] text-[#D97706] text-xs font-semibold px-2.5 py-1 rounded-full">
                          Almost There
                        </span>
                      )}

                      {/* Expand / Collapse Chevron */}
                      <button
                        type="button"
                        className="text-[#8A9A92] hover:text-[#1B2B24] transition-colors p-0.5"
                        aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Daily Metric Row (4 columns) */}
                  <div className="grid grid-cols-4 gap-2 text-center pt-0.5">
                    <div>
                      <Flame className="w-4 h-4 text-[#1F7A5C] mx-auto mb-1" />
                      <div className="text-sm font-bold text-[#1B2B24]">{day.calories}</div>
                      <div className="text-[11px] text-[#8A9A92]">kcal</div>
                    </div>
                    <div>
                      <Layers className="w-4 h-4 text-[#1F7A5C] mx-auto mb-1" />
                      <div className="text-sm font-bold text-[#1B2B24]">{day.proteinG}g</div>
                      <div className="text-[11px] text-[#8A9A92]">protein</div>
                    </div>
                    <div>
                      <Droplets className="w-4 h-4 text-[#3E8FB0] mx-auto mb-1" />
                      <div className="text-sm font-bold text-[#1B2B24]">{day.waterL.toFixed(1)}L</div>
                      <div className="text-[11px] text-[#8A9A92]">water</div>
                    </div>
                    <div>
                      <Footprints className="w-4 h-4 text-[#1F7A5C] mx-auto mb-1" />
                      <div className="text-sm font-bold text-[#1B2B24]">{day.exerciseMin}m</div>
                      <div className="text-[11px] text-[#8A9A92]">exercise</div>
                    </div>
                  </div>

                  {/* Weight Summary */}
                  <div className="flex items-center justify-between text-xs font-bold pt-0.5">
                    <span className="text-[#1B2B24]">{day.weightLb !== null ? `${day.weightLb} lb` : '164.5 lb'}</span>
                    <span className={day.weightChange.startsWith('+') ? 'text-[#D97706]' : 'text-[#1F7A5C]'}>
                      {day.weightChange}
                    </span>
                  </div>

                  {/* Expanded Daily Details Section */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-[#E7EEE9] space-y-3.5">
                      <div className="text-xs font-bold text-[#1B2B24]">Daily details</div>

                      {/* Meals list */}
                      {day.meals.length > 0 ? (
                        <div className="space-y-2.5">
                          {day.meals.map((m) => {
                            const mealTypeLabel = m.type ? m.type.charAt(0).toUpperCase() + m.type.slice(1) : 'Meal';
                            return (
                              <div key={m.id} className="flex items-start justify-between">
                                <div>
                                  <div className="text-xs font-bold text-[#1B2B24]">
                                    {mealTypeLabel} — {m.name}
                                  </div>
                                  <div className="text-[11px] text-[#8A9A92] mt-0.5">
                                    Protein {m.proteinG}g · Fat {m.fatG}g · Carbs {m.carbsG}g
                                  </div>
                                </div>
                                <div className="text-xs font-bold text-[#1B2B24] shrink-0">
                                  {m.calories} kcal
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-[#8A9A92] italic">No meals logged for this day.</p>
                      )}

                      {/* Water intake & Weekly trend */}
                      <div className="flex items-center justify-between text-xs text-[#4C5F55] pt-1">
                        <span>Water intake: {day.waterL.toFixed(1)}L</span>
                        <span>Weekly trend: {weeklyTrend}</span>
                      </div>

                      {/* AI Recommendation (only if real recommendation available) */}
                      {day.aiRecommendation && (
                        <div className="bg-[#EFF8F4] border border-[#D5EADB] rounded-2xl p-3.5 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[#1F7A5C] text-xs font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI recommendation</span>
                          </div>
                          <p className="text-xs text-[#334D41] leading-relaxed">
                            {day.aiRecommendation}
                          </p>
                        </div>
                      )}

                      {/* Hide details button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(day.dateKey);
                        }}
                        className="w-full py-2.5 bg-white border border-[#DCE6E0] rounded-2xl text-xs font-bold text-[#1B2B24] text-center hover:bg-[#F6FAF7] transition-colors"
                      >
                        Hide details
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

