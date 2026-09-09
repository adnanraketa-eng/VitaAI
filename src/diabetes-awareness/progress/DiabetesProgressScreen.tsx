import { useState } from 'react';
import { 
  Calendar as CalendarIcon, TrendingDown, TrendingUp, CheckCircle, 
  Sparkles, Utensils, Flame, Check
} from 'lucide-react';
import { BottomTab } from '../../types';

interface Props {
  onNavigate: (tab: BottomTab) => void;
}

export function DiabetesProgressScreen({ onNavigate }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7 Days' | '30 Days' | '3 Months' | '6 Months'>('7 Days');

  const consistencyDays = [
    { day: 'M', checked: true },
    { day: 'T', checked: true },
    { day: 'W', checked: true },
    { day: 'T', checked: true },
    { day: 'F', checked: true },
    { day: 'S', checked: false },
    { day: 'S', checked: true },
  ];

  const goals = [
    { name: 'Glucose logging', current: 6, total: 7 },
    { name: 'Meal logging', current: 7, total: 7 },
    { name: 'Hydration', current: 6, total: 7 },
    { name: 'Activity', current: 5, total: 7 },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#12324A] pb-24 font-sans selection:bg-[#1769AA] selection:text-white">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 sticky top-0 bg-[#F7FAFC]/95 backdrop-blur-md z-30 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#12324A]">Progress</h1>
          <p className="text-xs text-[#536675] mt-0.5">Your health trends over time</p>
        </div>

        <button 
          className="w-10 h-10 rounded-2xl bg-white border border-[#DCE7EE] text-[#1769AA] flex items-center justify-center shadow-2xs hover:bg-[#EAF5FB] transition-colors"
          title="Date Range"
        >
          <CalendarIcon className="w-5 h-5 text-[#1769AA]" />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-4 mt-2">
        {/* Time Period Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(['7 Days', '30 Days', '3 Months', '6 Months'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                selectedPeriod === period
                  ? 'bg-[#12324A] text-white shadow-xs'
                  : 'bg-white text-[#536675] border border-[#DCE7EE] hover:bg-[#F7FAFC]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* 1. Summary Card (Matching dip5.jpg) */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE7EE] shadow-2xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#536675] font-medium block">Average Glucose</span>
              <div className="flex items-baseline mt-1">
                <span className="text-3xl font-extrabold text-[#12324A]">128</span>
                <span className="text-xs text-[#536675] font-semibold ml-1.5">mg/dL</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#536675] font-medium block">Time in range</span>
              <span className="text-2xl font-bold text-[#39A982] mt-1 block">82%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-[#EAF8F2] text-[#39A982] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>6 mg/dL lower</span>
            </span>
            <span className="text-xs text-[#536675]">vs previous 7 days</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#DCE7EE]">
            <div>
              <span className="text-xs font-bold text-[#12324A] block">On track this week</span>
              <span className="text-[11px] text-[#536675]">Target range: 70–180 mg/dL</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#EAF8F2] text-[#39A982] flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* 2. Time in Range Card (Matching dip5.jpg) */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE7EE] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#12324A]">Time in Range</h3>
              <p className="text-xs text-[#536675] mt-0.5">Your glucose was in the target range</p>
            </div>
            <span className="text-xl font-extrabold text-[#39A982]">82%</span>
          </div>

          {/* Multi-Segment Horizontal Bar */}
          <div className="h-3 w-full rounded-full bg-[#F7FAFC] flex overflow-hidden">
            <div style={{ width: '82%' }} className="bg-[#2C7A93] h-full rounded-l-full" />
            <div style={{ width: '5%' }} className="bg-[#E8A23A] h-full" />
            <div style={{ width: '13%' }} className="bg-[#D95C5C] h-full rounded-r-full" />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs pt-1 text-[#536675]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2C7A93]" />
              <span>In range</span>
              <span className="font-bold text-[#12324A]">82%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8A23A]" />
              <span>Below</span>
              <span className="font-bold text-[#12324A]">5%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D95C5C]" />
              <span>Above</span>
              <span className="font-bold text-[#12324A]">13%</span>
            </div>
          </div>
        </div>

        {/* 3. Glucose Statistics (Matching dip6.jpg) */}
        <section className="space-y-2.5">
          <div className="px-1">
            <h3 className="text-sm font-bold text-[#12324A]">Glucose Statistics</h3>
            <p className="text-xs text-[#536675]">A clear view of your week</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Average */}
            <div className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs">
              <div className="flex items-center justify-between text-[#536675]">
                <span className="text-xs font-medium">Average</span>
                <TrendingUp className="w-4 h-4 text-[#1769AA]" />
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold text-[#12324A]">128 mg/dL</span>
              </div>
            </div>

            {/* Lowest */}
            <div className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs">
              <div className="flex items-center justify-between text-[#536675]">
                <span className="text-xs font-medium">Lowest</span>
                <TrendingDown className="w-4 h-4 text-[#39A982]" />
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold text-[#12324A]">96 mg/dL</span>
              </div>
            </div>

            {/* Highest */}
            <div className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs">
              <div className="flex items-center justify-between text-[#536675]">
                <span className="text-xs font-medium">Highest</span>
                <TrendingUp className="w-4 h-4 text-[#D95C5C]" />
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold text-[#12324A]">164 mg/dL</span>
              </div>
            </div>

            {/* Consistency */}
            <div className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs">
              <div className="flex items-center justify-between text-[#536675]">
                <span className="text-xs font-medium">Consistency</span>
                <CheckCircle className="w-4 h-4 text-[#39A982]" />
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold text-[#12324A]">78%</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Nutrition Progress (Matching dip6.jpg) */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE7EE] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#12324A]">Nutrition Progress</h3>
              <p className="text-xs text-[#536675] mt-0.5">How your food choices are trending</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#FFF5E5] text-[#E8A23A] flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div>
              <span className="text-xl font-black text-[#12324A] block">18</span>
              <span className="text-[11px] text-[#536675]">Meals logged</span>
            </div>
            <div>
              <span className="text-xl font-black text-[#12324A] block">41</span>
              <span className="text-[11px] text-[#536675]">Average GI</span>
            </div>
            <div>
              <span className="text-xl font-black text-[#12324A] block">72%</span>
              <span className="text-[11px] text-[#536675]">Low-GI meals</span>
            </div>
          </div>
        </div>

        {/* 5. This Week vs Previous Week (Matching dip6.jpg) */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE7EE] shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-[#12324A]">This Week vs Previous Week</h3>

          <div className="space-y-2.5 divide-y divide-[#DCE7EE]/60 text-xs">
            {/* Average Glucose */}
            <div className="flex items-center justify-between pt-2 first:pt-0">
              <div>
                <span className="font-semibold text-[#12324A] block">Average Glucose</span>
                <span className="text-[11px] text-[#39A982]">Improved by 6 mg/dL</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#12324A] block">128 mg/dL</span>
                <span className="text-[11px] text-[#536675]">was 134</span>
              </div>
            </div>

            {/* Time in Range */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="font-semibold text-[#12324A] block">Time in Range</span>
                <span className="text-[11px] text-[#39A982]">Improved by 6 points</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#12324A] block">82%</span>
                <span className="text-[11px] text-[#536675]">was 76%</span>
              </div>
            </div>

            {/* Meals Logged */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="font-semibold text-[#12324A] block">Meals Logged</span>
                <span className="text-[11px] text-[#536675]">3 more meals recorded</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#12324A] block">18</span>
                <span className="text-[11px] text-[#536675]">was 15</span>
              </div>
            </div>

            {/* Average GI */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="font-semibold text-[#12324A] block">Average GI</span>
                <span className="text-[11px] text-[#39A982]">Lower is better</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#12324A] block">41</span>
                <span className="text-[11px] text-[#536675]">was 46</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Daily Consistency (Matching dip7.jpg) */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE7EE] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#12324A]">Daily Consistency</h3>
            <span className="text-lg font-black text-[#2C7A93]">78%</span>
          </div>
          <p className="text-xs text-[#536675]">
            You stayed consistent with your diabetes-friendly routine.
          </p>

          <div className="flex items-center justify-between pt-2 px-1">
            {consistencyDays.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#536675]">{item.day}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    item.checked
                      ? 'bg-[#2C7A93] text-white'
                      : 'border-2 border-[#DCE7EE] bg-white'
                  }`}
                >
                  {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Your Goals (Matching dip7.jpg & dip8.jpg) */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE7EE] shadow-2xs space-y-3.5">
          <h3 className="text-sm font-bold text-[#12324A]">Your Goals</h3>

          <div className="space-y-3">
            {goals.map((g, idx) => {
              const pct = Math.round((g.current / g.total) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#12324A]">{g.name}</span>
                    <span className="font-bold text-[#536675]">{g.current} / {g.total} days</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#F7FAFC] overflow-hidden border border-[#DCE7EE]/40">
                    <div 
                      style={{ width: `${pct}%` }} 
                      className="h-full bg-[#12324A] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. AI Progress Insight (Matching dip8.jpg) */}
        <div className="bg-[#12324A] text-white rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white/90">
            <Sparkles className="w-4 h-4 text-white" />
            <span>AI Progress Insight</span>
          </div>

          <p className="text-xs text-white/85 leading-relaxed">
            Your average glucose is trending lower than last week, and your meal consistency has improved.
          </p>

          <button 
            onClick={() => onNavigate('coach')}
            className="px-5 py-2 bg-white text-[#12324A] rounded-full text-xs font-bold hover:bg-[#EAF5FB] transition-colors shadow-2xs"
          >
            View AI Insight
          </button>
        </div>

        {/* 9. Last 6 Days Tracking Streak (Matching dip8.jpg) */}
        <div className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#FFF5E5] text-[#E8A23A] flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#12324A] block">
              Last 6 Days Tracking Streak
            </span>
            <span className="text-xs text-[#536675]">
              You've logged progress for 6 consecutive days.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
