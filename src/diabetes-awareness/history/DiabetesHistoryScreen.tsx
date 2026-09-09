import { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronDown, ChevronUp, Droplet, 
  Utensils, Sparkles, Footprints, Check
} from 'lucide-react';
import { DiabetesHistoryDay } from '../types';

interface Props {
  userName?: string;
}

export function DiabetesHistoryScreen({ userName = 'Alex' }: Props) {
  const [expandedDayId, setExpandedDayId] = useState<string | null>('2026-08-21');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('All');

  const historyRecords: DiabetesHistoryDay[] = [
    {
      id: '2026-08-22',
      dateStr: '22 August 2026',
      dayOfWeek: 'Saturday',
      mealsLoggedCount: 3,
      status: 'Complete',
      glucoseAvg: 128,
      waterL: 2.4,
      activityMin: 35,
      footerType: 'average_glucose',
      footerValue: '128 mg/dL',
      timeInRangePct: 84,
      dailyGoalPct: 90,
      meals: [
        { type: 'Breakfast', name: 'Spinach & Egg White Scramble', kcal: 290, gi: 28 },
        { type: 'Lunch', name: 'Mediterranean Lentil Salad', kcal: 410, gi: 32 },
        { type: 'Dinner', name: 'Baked Cod with Steamed Asparagus', kcal: 430, gi: 25 },
      ],
      glucoseReadings: [
        { timeOfDay: 'Morning', value: 114, status: 'In range' },
        { timeOfDay: 'Before lunch', value: 122, status: 'In range' },
        { timeOfDay: 'Evening', value: 130, status: 'In range' },
      ],
      aiRecommendation: 'Superb balance of lean proteins and leafy greens. Your post-meal stability was optimal throughout Saturday.'
    },
    {
      id: '2026-08-21',
      dateStr: '21 August 2026',
      dayOfWeek: 'Friday',
      mealsLoggedCount: 4,
      status: 'On target',
      glucoseAvg: 124,
      waterL: 2.1,
      activityMin: 42,
      footerType: 'time_in_range',
      footerValue: '86%',
      timeInRangePct: 86,
      dailyGoalPct: 88,
      meals: [
        { type: 'Breakfast', name: 'Vegetable Omelet', kcal: 320, gi: 30 },
        { type: 'Lunch', name: 'Quinoa Buddha Bowl', kcal: 440, gi: 36 },
        { type: 'Dinner', name: 'Grilled Salmon with Greens', kcal: 460, gi: 32 },
        { type: 'Snack', name: 'Greek Yogurt', kcal: 140, gi: 20 },
      ],
      glucoseReadings: [
        { timeOfDay: 'Morning', value: 112, status: 'In range' },
        { timeOfDay: 'Before lunch', value: 121, status: 'In range' },
        { timeOfDay: 'Evening', value: 129, status: 'In range' },
      ],
      aiRecommendation: 'Nicely balanced day. Your evening activity is helping keep readings steady.'
    },
    {
      id: '2026-08-20',
      dateStr: '20 August 2026',
      dayOfWeek: 'Thursday',
      mealsLoggedCount: 2,
      status: 'Needs attention',
      glucoseAvg: 141,
      waterL: 1.6,
      activityMin: 18,
      footerType: 'average_glucose',
      footerValue: '141 mg/dL',
      timeInRangePct: 72,
      dailyGoalPct: 65,
      meals: [
        { type: 'Breakfast', name: 'Oatmeal with Berries', kcal: 340, gi: 44 },
        { type: 'Dinner', name: 'Chicken Stir-Fry with Brown Rice', kcal: 520, gi: 48 },
      ],
      glucoseReadings: [
        { timeOfDay: 'Morning', value: 128, status: 'In range' },
        { timeOfDay: 'Evening', value: 148, status: 'In range' },
      ],
      aiRecommendation: 'Higher glycemic carbohydrate intake in the evening. Adding extra fiber and a post-meal walk can help flatten glucose peaks.'
    }
  ];

  const toggleExpand = (id: string) => {
    setExpandedDayId(expandedDayId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#12324A] pb-24 font-sans selection:bg-[#1769AA] selection:text-white">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 sticky top-0 bg-[#F7FAFC]/95 backdrop-blur-md z-30 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#12324A]">History</h1>
          <p className="text-xs text-[#536675] mt-0.5">Your diabetes-friendly journey</p>
        </div>

        <button 
          onClick={() => setSelectedDateFilter(selectedDateFilter === 'All' ? 'This Week' : 'All')}
          className="w-10 h-10 rounded-2xl bg-white border border-[#DCE7EE] text-[#1769AA] flex items-center justify-center shadow-2xs hover:bg-[#EAF5FB] transition-colors"
          title="Filter Calendar"
        >
          <CalendarIcon className="w-5 h-5 text-[#1769AA]" />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-3.5 mt-2">
        {historyRecords.map((record) => {
          const isExpanded = expandedDayId === record.id;

          const badgeClass = record.status === 'Complete' || record.status === 'On target'
            ? 'bg-[#EAF8F2] text-[#39A982]'
            : 'bg-[#FFF5E5] text-[#E8A23A]';

          return (
            <div 
              key={record.id}
              className="bg-white rounded-3xl border border-[#DCE7EE] shadow-2xs overflow-hidden transition-all"
            >
              {/* Card Header clickable */}
              <div 
                onClick={() => toggleExpand(record.id)}
                className="p-4 cursor-pointer hover:bg-[#F7FAFC]/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[#12324A]">{record.dateStr}</h3>
                    <p className="text-xs text-[#536675] mt-0.5">
                      {record.dayOfWeek} · {record.mealsLoggedCount} meals logged
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${badgeClass}`}>
                      {record.status === 'Complete' && <Check className="w-3 h-3" />}
                      {record.status}
                    </span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#536675]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* 4 Quick Stats horizontally */}
                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#DCE7EE]">
                  {/* Glucose */}
                  <div className="text-center">
                    <div className="w-6 h-6 rounded-full bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center mx-auto mb-1">
                      <Droplet className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <div className="text-xs font-bold text-[#12324A]">{record.glucoseAvg}</div>
                    <div className="text-[10px] text-[#536675]">mg/dL · Glucose</div>
                  </div>

                  {/* Meals */}
                  <div className="text-center">
                    <div className="w-6 h-6 rounded-full bg-[#F7FAFC] text-[#12324A] flex items-center justify-center mx-auto mb-1">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs font-bold text-[#12324A]">{record.mealsLoggedCount}</div>
                    <div className="text-[10px] text-[#536675]">logged · Meals</div>
                  </div>

                  {/* Water */}
                  <div className="text-center">
                    <div className="w-6 h-6 rounded-full bg-[#EAF5FB] text-[#2C7A93] flex items-center justify-center mx-auto mb-1">
                      <Droplet className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs font-bold text-[#12324A]">{record.waterL}L</div>
                    <div className="text-[10px] text-[#536675]">Water</div>
                  </div>

                  {/* Activity */}
                  <div className="text-center">
                    <div className="w-6 h-6 rounded-full bg-[#EAF8F2] text-[#39A982] flex items-center justify-center mx-auto mb-1">
                      <Footprints className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs font-bold text-[#12324A]">{record.activityMin}m</div>
                    <div className="text-[10px] text-[#536675]">Activity</div>
                  </div>
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#DCE7EE]">
                  <span className="text-xs text-[#536675]">
                    {record.footerType === 'average_glucose' ? 'Average glucose' : 'Time in range'}
                  </span>
                  <span className="text-xs font-bold text-[#12324A]">
                    {record.footerValue}
                  </span>
                </div>
              </div>

              {/* Expanded Detailed Breakdown (Matching dip4.jpg) */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 space-y-4 bg-[#F7FAFC]/50 border-t border-[#DCE7EE]">
                  {/* Daily details header */}
                  <div>
                    <h4 className="text-xs font-bold text-[#12324A] uppercase tracking-wider mb-2">
                      Daily details
                    </h4>
                    
                    {/* Meals list */}
                    <div className="space-y-1.5">
                      {record.meals.map((meal, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#DCE7EE]/60 last:border-0">
                          <span className="font-semibold text-[#12324A]">
                            {meal.type} — <span className="font-normal text-[#536675]">{meal.name}</span>
                          </span>
                          <span className="text-[11px] text-[#536675] font-medium shrink-0 ml-2">
                            {meal.kcal} kcal · GI {meal.gi}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Glucose readings */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-[#12324A] uppercase tracking-wider">
                        Glucose readings
                      </h4>
                      <span className="text-[11px] text-[#536675]">
                        {record.glucoseReadings.length} logged
                      </span>
                    </div>

                    <div className="space-y-2">
                      {record.glucoseReadings.map((reading, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <span className="text-[#12324A] font-medium">
                            {reading.timeOfDay} — <span className="font-bold">{reading.value} mg/dL</span>
                          </span>
                          <span className="text-[11px] font-semibold text-[#39A982] bg-[#EAF8F2] px-2.5 py-0.5 rounded-full">
                            {reading.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Two Summary Stat Boxes */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-white rounded-2xl p-3 border border-[#DCE7EE] text-center">
                      <span className="text-xl font-extrabold text-[#12324A] block">
                        {record.timeInRangePct}%
                      </span>
                      <span className="text-[11px] text-[#536675] font-medium">Time in range</span>
                    </div>

                    <div className="bg-white rounded-2xl p-3 border border-[#DCE7EE] text-center">
                      <span className="text-xl font-extrabold text-[#12324A] block">
                        {record.dailyGoalPct}%
                      </span>
                      <span className="text-[11px] text-[#536675] font-medium">Daily goal</span>
                    </div>
                  </div>

                  {/* AI Recommendation Card */}
                  <div className="bg-[#EAF8F2] border border-[#D1EAE0] rounded-2xl p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#39A982]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI recommendation</span>
                    </div>
                    <p className="text-xs text-[#12324A] leading-relaxed">
                      {record.aiRecommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
