import { useState } from 'react';
import { 
  Calendar, Zap, Utensils, Award, Search, ChevronDown, ChevronUp,
  Flame, Droplets, Activity, Sparkles
} from 'lucide-react';
import { DailyHistoryRecord } from '../../types';

const INITIAL_RECORDS: DailyHistoryRecord[] = [
  {
    id: '1',
    dateStr: '18 August 2026',
    dayOfWeek: 'Tuesday',
    status: 'Complete',
    calories: 1860,
    proteinG: 132,
    waterL: 2.4,
    exerciseMin: 45,
    weightLb: 164.5,
    weightChangeLb: -0.4,
    weeklyTrendLb: -1.3,
    mealsCount: 4,
    meals: [
      { name: 'Breakfast — Greek Yogurt Bowl', details: 'Protein 29g · Fat 12g · Carbs 46g', calories: 410 },
      { name: 'Lunch — Chicken Quinoa Salad', details: 'Protein 48g · Fat 18g · Carbs 54g', calories: 560 },
      { name: 'Dinner + snacks — Dinner + snacks', details: 'Protein 57g · Fat 31g · Carbs 76g', calories: 890 },
    ],
    aiRecommendation: 'Great protein balance. Add one more glass of water after your evening walk.'
  },
  {
    id: '2',
    dateStr: '17 August 2026',
    dayOfWeek: 'Monday',
    status: 'On target',
    calories: 1740,
    proteinG: 118,
    waterL: 2.1,
    exerciseMin: 30,
    weightLb: 164.9,
    weightChangeLb: -0.2,
    weeklyTrendLb: -1.1,
    mealsCount: 3,
    meals: [
      { name: 'Breakfast — Oatmeal & Berries', details: 'Protein 18g · Fat 8g · Carbs 55g', calories: 380 },
      { name: 'Lunch — Turkey Avocado Wrap', details: 'Protein 42g · Fat 20g · Carbs 45g', calories: 520 },
      { name: 'Dinner — Baked Salmon & Veggies', details: 'Protein 58g · Fat 22g · Carbs 32g', calories: 840 },
    ],
    aiRecommendation: 'Consistent fiber intake today. Kept insulin response very stable.'
  },
  {
    id: '3',
    dateStr: '16 August 2026',
    dayOfWeek: 'Sunday',
    status: 'Almost There',
    calories: 2060,
    proteinG: 109,
    waterL: 1.8,
    exerciseMin: 20,
    weightLb: 165.1,
    weightChangeLb: 0.1,
    weeklyTrendLb: -0.8,
    mealsCount: 4,
    meals: [
      { name: 'Breakfast — Scrambled Eggs & Toast', details: 'Protein 24g · Fat 16g · Carbs 35g', calories: 420 },
      { name: 'Lunch — Grilled Chicken Salad', details: 'Protein 45g · Fat 14g · Carbs 25g', calories: 480 },
      { name: 'Dinner — Whole Wheat Pasta & Lean Beef', details: 'Protein 40g · Fat 25g · Carbs 85g', calories: 960 },
      { name: 'Snack — Almonds & Dark Chocolate', details: 'Protein 8g · Fat 15g · Carbs 12g', calories: 200 }
    ],
    aiRecommendation: 'Calorie intake slightly above target. Recovery hydration will help offset water retention.'
  }
];

export function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState<'week' | 'month' | 'all'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const filteredRecords = INITIAL_RECORDS.filter(r => 
    r.dateStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.dayOfWeek.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] pb-24 font-sans">
      {/* Header */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6FAF7]/90 backdrop-blur-md z-30">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1B2B24]">Daily Food Analysis</h1>
          <p className="text-xs text-[#4C5F55]">Your nutrition history and progress at a glance</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white rounded-full border border-[#DCE6E0] shadow-xs text-[#4C5F55] hover:bg-[#EFF6F1]">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white rounded-full border border-[#DCE6E0] shadow-xs text-[#4C5F55] hover:bg-[#EFF6F1]">
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="px-4 space-y-4 mt-2">
        {/* 2x2 Progress At A Glance Cards */}
        <section className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            {/* Days Tracked */}
            <div className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#1F7A5C] mb-2">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-[#1B2B24]">84</div>
              <div className="text-xs font-bold text-[#1B2B24]">Days tracked</div>
              <div className="text-[11px] text-[#8A9A92]">of 90-day goal</div>
            </div>

            {/* Current Streak */}
            <div className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#FFF1E8] flex items-center justify-center text-[#FF8B5E] mb-2">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div className="text-2xl font-black text-[#1B2B24]">12 days</div>
              <div className="text-xs font-bold text-[#1B2B24]">Current streak</div>
              <div className="text-[11px] text-[#8A9A92]">Keep your rhythm</div>
            </div>

            {/* Meals Logged */}
            <div className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#2E8B8B] mb-2">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-[#1B2B24]">296</div>
              <div className="text-xs font-bold text-[#1B2B24]">Meals logged</div>
              <div className="text-[11px] text-[#8A9A92]">3.5 daily average</div>
            </div>

            {/* Weight Lost */}
            <div className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#1F7A5C] mb-2">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-[#1B2B24]">15.0 lb</div>
              <div className="text-xs font-bold text-[#1B2B24]">Weight lost</div>
              <div className="text-[11px] text-[#8A9A92]">since 27 May</div>
            </div>
          </div>
        </section>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8A9A92] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by date, e.g. 18 Aug"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DCE6E0] rounded-2xl text-xs text-[#1B2B24] placeholder-[#8A9A92] focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]/20 shadow-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter('week')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'week'
                ? 'bg-[#1F7A5C] text-white'
                : 'bg-white text-[#4C5F55] border border-[#DCE6E0]'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setActiveFilter('month')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'month'
                ? 'bg-[#1F7A5C] text-white'
                : 'bg-white text-[#4C5F55] border border-[#DCE6E0]'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#1F7A5C] text-white'
                : 'bg-white text-[#4C5F55] border border-[#DCE6E0]'
            }`}
          >
            All Records
          </button>
        </div>

        {/* Month/Year Chips */}
        <div className="flex gap-2 text-xs font-semibold text-[#4C5F55]">
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#DCE6E0]">
            <Calendar className="w-3.5 h-3.5 text-[#1F7A5C]" /> August
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#DCE6E0]">
            <Calendar className="w-3.5 h-3.5 text-[#1F7A5C]" /> 2026
          </span>
        </div>

        {/* Daily History Cards */}
        <div className="space-y-3">
          {filteredRecords.map((record) => {
            const isExpanded = expandedId === record.id;
            return (
              <div 
                key={record.id} 
                className="bg-white rounded-3xl border border-[#DCE6E0] p-4 shadow-xs space-y-3 transition-all"
              >
                {/* Header Row */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : record.id)}
                  className="flex items-start justify-between cursor-pointer"
                >
                  <div>
                    <div className="text-base font-bold text-[#1B2B24]">{record.dateStr}</div>
                    <div className="text-xs text-[#8A9A92]">{record.dayOfWeek} · {record.mealsCount} meals logged</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      record.status === 'Complete' 
                        ? 'bg-[#EFF6F1] text-[#1F7A5C]' 
                        : record.status === 'On target'
                        ? 'bg-[#EFF6F1] text-[#2E8B8B]'
                        : 'bg-[#FFF1E8] text-[#E8A23D]'
                    }`}>
                      {record.status === 'Complete' ? '✓ Complete' : record.status}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#8A9A92]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8A9A92]" />
                    )}
                  </div>
                </div>

                {/* 4 Metric Stats Summary */}
                <div className="grid grid-cols-4 gap-2 pt-1 border-t border-[#E7EEE9] text-center">
                  <div>
                    <div className="flex items-center justify-center text-[#1F7A5C] mb-0.5">
                      <Flame className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs font-bold text-[#1B2B24]">{record.calories}</div>
                    <div className="text-[10px] text-[#8A9A92]">kcal</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center text-[#2E8B8B] mb-0.5">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs font-bold text-[#1B2B24]">{record.proteinG}g</div>
                    <div className="text-[10px] text-[#8A9A92]">protein</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center text-[#3E8FB0] mb-0.5">
                      <Droplets className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs font-bold text-[#1B2B24]">{record.waterL}L</div>
                    <div className="text-[10px] text-[#8A9A92]">water</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center text-[#1F7A5C] mb-0.5">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs font-bold text-[#1B2B24]">{record.exerciseMin}m</div>
                    <div className="text-[10px] text-[#8A9A92]">exercise</div>
                  </div>
                </div>

                {/* Weight Row */}
                <div className="flex justify-between items-center bg-[#F6FAF7] px-3.5 py-2 rounded-2xl text-xs font-semibold">
                  <span className="text-[#1B2B24]">{record.weightLb} lb</span>
                  <span className="text-[#2E8B8B]">{record.weightChangeLb > 0 ? `+${record.weightChangeLb}` : record.weightChangeLb} lb</span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-2 border-t border-[#E7EEE9] space-y-3">
                    <div className="text-xs font-bold text-[#1B2B24]">Daily details</div>

                    <div className="space-y-2">
                      {record.meals.map((meal, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs">
                          <div>
                            <div className="font-semibold text-[#1B2B24]">{meal.name}</div>
                            <div className="text-[11px] text-[#8A9A92]">{meal.details}</div>
                          </div>
                          <div className="font-bold text-[#1B2B24] whitespace-nowrap pl-2">
                            {meal.calories} kcal
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between text-xs text-[#4C5F55] pt-1">
                      <span>Water intake: {record.waterL}L</span>
                      <span>Weekly trend: {record.weeklyTrendLb} lb</span>
                    </div>

                    {/* AI Recommendation inside day */}
                    <div className="bg-[#EFF6F1] rounded-2xl p-3 border border-[#DCE6E0] space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F7A5C]">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI recommendation
                      </div>
                      <p className="text-xs text-[#4C5F55] leading-relaxed">
                        {record.aiRecommendation}
                      </p>
                    </div>

                    <button 
                      onClick={() => setExpandedId(null)}
                      className="w-full py-1.5 text-xs font-semibold text-[#8A9A92] hover:text-[#1B2B24] text-center"
                    >
                      Hide details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
