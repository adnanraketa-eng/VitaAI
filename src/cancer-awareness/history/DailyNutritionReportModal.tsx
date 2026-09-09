import React from 'react';
import { 
  ArrowLeft, CheckCircle2, Award, AlertTriangle, Lightbulb, 
  Archive, Flame, Droplets, Utensils, Sprout, Activity, Sparkles
} from 'lucide-react';
import { CancerNutritionReport } from '../types';

interface Props {
  report: CancerNutritionReport;
  onClose: () => void;
  userName: string;
}

export function DailyNutritionReportModal({ report, onClose, userName }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-[#F6F3F7] overflow-y-auto font-sans text-[#2A2233]">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-[#F6F3F7]/95 backdrop-blur-md border-b border-[#E4DEE9] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose}
            className="p-1.5 -ml-1 text-[#2A2233] hover:bg-black/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#2A2233]">Daily Nutrition Report</h1>
            <p className="text-[11px] text-[#6B6275]">{report.titleDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E4F0E6] text-[#4C8F63] rounded-full text-xs font-semibold border border-[#4C8F63]/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Archived</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 space-y-4 pb-12">
        {/* Title greeting */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs">
          <span className="text-xs font-medium text-[#6B6275]">Good evening, {userName}</span>
          <h2 className="text-xl font-bold text-[#2A2233] mt-0.5">Your Daily Nutrition Report</h2>
          <p className="text-xs text-[#6B6275] mt-0.5">{report.titleDate}</p>
        </div>

        {/* Daily Nutrition Score */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#2A2233]">Daily Nutrition Score</h3>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#E4F0E6] text-[#4C8F63] border border-[#4C8F63]/30">
                {report.statusBadge}
              </div>
              <p className="text-xs text-[#6B6275] max-w-[200px]">
                {report.summaryNote}
              </p>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#EFE7F5"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#4C8F63"
                  strokeWidth="8"
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * report.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-[#2A2233]">{report.score}</span>
                <span className="text-[10px] text-[#6B6275]">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Summary Metrics */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-[#2A2233]">Daily Summary</h3>

          {/* Calories */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#2A2233]">
              <span className="flex items-center gap-1.5 text-[#C98A2B]">
                <Flame className="w-3.5 h-3.5" /> Calories
              </span>
              <span>{report.calories.current} / {report.calories.target} kcal</span>
            </div>
            <div className="w-full h-2 bg-[#F7EBD8] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#C98A2B] rounded-full" 
                style={{ width: `${Math.min(100, (report.calories.current / report.calories.target) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Protein */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#2A2233]">
              <span className="flex items-center gap-1.5 text-[#2C7A93]">
                <Utensils className="w-3.5 h-3.5" /> Protein
              </span>
              <span>{report.protein.current} / {report.protein.target} g</span>
            </div>
            <div className="w-full h-2 bg-[#E1EFF2] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#2C7A93] rounded-full" 
                style={{ width: `${Math.min(100, (report.protein.current / report.protein.target) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Fiber */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#2A2233]">
              <span className="flex items-center gap-1.5 text-[#4C8F63]">
                <Sprout className="w-3.5 h-3.5" /> Fiber
              </span>
              <span>{report.fiber.current} / {report.fiber.target} g</span>
            </div>
            <div className="w-full h-2 bg-[#E4F0E6] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#4C8F63] rounded-full" 
                style={{ width: `${Math.min(100, (report.fiber.current / report.fiber.target) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Water */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#2A2233]">
              <span className="flex items-center gap-1.5 text-[#2C7A93]">
                <Droplets className="w-3.5 h-3.5" /> Water
              </span>
              <span>{report.water.current} / {report.water.target} L</span>
            </div>
            <div className="w-full h-2 bg-[#E1EFF2] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#2C7A93] rounded-full" 
                style={{ width: `${Math.min(100, (report.water.current / report.water.target) * 100)}%` }} 
              />
            </div>
          </div>

          {/* Activity */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#2A2233]">
              <span className="flex items-center gap-1.5 text-[#5A3577]">
                <Activity className="w-3.5 h-3.5" /> Activity
              </span>
              <span>{report.activityMin.current} / {report.activityMin.target} min</span>
            </div>
            <div className="w-full h-2 bg-[#EFE7F5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5A3577] rounded-full" 
                style={{ width: `${Math.min(100, (report.activityMin.current / report.activityMin.target) * 100)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* AI Encouragement Quote */}
        <div className="bg-[#EFE7F5] rounded-3xl p-4 border border-[#E4DEE9] space-y-2">
          <div className="flex items-center gap-2 text-[#5A3577] font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Great progress today, {userName}!</span>
          </div>
          <p className="text-xs text-[#402359] leading-relaxed italic">
            "{report.aiQuote}"
          </p>
        </div>

        {/* Today's Meal Performance */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#2A2233]">Today's Meal Performance</h3>
          
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#F6F3F7] p-2 rounded-2xl border border-[#E4DEE9]">
              <span className="text-[11px] text-[#6B6275] block">Breakfast</span>
              <span className="text-base font-extrabold text-[#4C8F63]">{report.mealPerformance.breakfast}</span>
            </div>
            <div className="bg-[#F6F3F7] p-2 rounded-2xl border border-[#E4DEE9]">
              <span className="text-[11px] text-[#6B6275] block">Lunch</span>
              <span className="text-base font-extrabold text-[#4C8F63]">{report.mealPerformance.lunch}</span>
            </div>
            <div className="bg-[#F6F3F7] p-2 rounded-2xl border border-[#E4DEE9]">
              <span className="text-[11px] text-[#6B6275] block">Dinner</span>
              <span className="text-base font-extrabold text-[#4C8F63]">{report.mealPerformance.dinner}</span>
            </div>
            <div className="bg-[#F6F3F7] p-2 rounded-2xl border border-[#E4DEE9]">
              <span className="text-[11px] text-[#6B6275] block">Snacks</span>
              <span className="text-base font-extrabold text-[#C98A2B]">{report.mealPerformance.snacks}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#E4F0E6] p-3 rounded-2xl border border-[#4C8F63]/20 space-y-1">
              <span className="text-[11px] font-bold text-[#4C8F63] flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Best Meal
              </span>
              <div className="text-xs font-bold text-[#2A2233]">{report.mealPerformance.bestMeal.name}</div>
              <div className="text-[11px] text-[#6B6275]">Score: {report.mealPerformance.bestMeal.score}/100</div>
            </div>

            <div className="bg-[#F7EBD8] p-3 rounded-2xl border border-[#C98A2B]/20 space-y-1">
              <span className="text-[11px] font-bold text-[#C98A2B] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Could Improve
              </span>
              <div className="text-xs font-bold text-[#2A2233]">{report.mealPerformance.couldImprove.name}</div>
              <div className="text-[11px] text-[#6B6275]">Score: {report.mealPerformance.couldImprove.score}/100</div>
            </div>
          </div>
        </div>

        {/* Today's Wins */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A2233]">
            <Award className="w-4 h-4 text-[#4C8F63]" />
            <span>Today's Wins</span>
          </div>
          <div className="space-y-2 text-xs text-[#2A2233]">
            {report.todayWins.map((win, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4C8F63] shrink-0" />
                <span>{win}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas to Improve */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A2233]">
            <AlertTriangle className="w-4 h-4 text-[#C98A2B]" />
            <span>Areas to Improve</span>
          </div>
          <div className="space-y-2">
            {report.areasToImprove.map((item, idx) => (
              <div key={idx} className="bg-[#F6F3F7] p-3 rounded-2xl border border-[#E4DEE9]">
                <div className="text-xs font-bold text-[#2A2233]">{item.title}</div>
                <div className="text-[11px] text-[#6B6275] mt-0.5">{item.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tomorrow's Focus */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A2233]">
            <Lightbulb className="w-4 h-4 text-[#2C7A93]" />
            <span>Tomorrow's Focus</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#6B6275] list-disc list-inside">
            {report.tomorrowFocus.map((focus, idx) => (
              <li key={idx}>{focus}</li>
            ))}
          </ul>
        </div>

        {/* Button: View in Permanent History */}
        <button 
          onClick={onClose}
          className="w-full py-3.5 bg-[#5A3577] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-[#402359] transition-colors"
        >
          <Archive className="w-4 h-4" />
          <span>View in Permanent History</span>
        </button>
      </main>
    </div>
  );
}
