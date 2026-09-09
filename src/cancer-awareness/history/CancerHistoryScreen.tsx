import { useState } from 'react';
import { 
  Calendar, ChevronRight, Sparkles, Sprout, Apple, 
  Wheat, Drumstick, Plus, CheckCircle2, FileText
} from 'lucide-react';
import { DailyNutritionReportModal } from './DailyNutritionReportModal';
import { CancerNutritionReport } from '../types';

interface Props {
  userName?: string;
}

export function CancerHistoryScreen({ userName = 'Maya Patel' }: Props) {
  const [selectedReport, setSelectedReport] = useState<CancerNutritionReport | null>(null);

  // Sample real data record reflecting actual daily tracking shown in screenshot chh1.jpg
  const sampleReport: CancerNutritionReport = {
    id: 'report-aug-12',
    dateStr: '2025-08-12',
    titleDate: 'Aug 12, 2025',
    score: 75,
    statusBadge: 'Steady Day',
    summaryNote: 'High protein & fiber consistency achieved.',
    aiQuote: 'You stayed close to your calorie target and reached most of your protein goal. Keeping this consistency will support sustainable wellness and cellular vitality.',
    calories: { current: 1650, target: 1800 },
    protein: { current: 108, target: 120 },
    fiber: { current: 22, target: 30 },
    water: { current: 2.2, target: 2.5 },
    activityMin: { current: 48, target: 60 },
    mealPerformance: {
      breakfast: 90,
      lunch: 88,
      dinner: 92,
      snacks: 62,
      bestMeal: { name: 'Grilled Chicken Bowl', score: 88 },
      couldImprove: { name: 'Evening Snack', score: 62 }
    },
    todayWins: [
      'Protein target almost reached',
      'Stayed within calorie target',
      'High-fiber choices',
      '7-day healthy meal streak'
    ],
    areasToImprove: [
      { title: 'Increase water', note: 'About 300 ml remaining to reach today\'s goal.' },
      { title: 'Increase protein', note: '12 g remaining to reach today\'s target.' },
      { title: 'Reduce high-calorie snacking', note: 'Consider a protein-rich snack tomorrow.' }
    ],
    tomorrowFocus: [
      'Start the day with a protein-rich breakfast',
      'Add vegetables to lunch and dinner',
      'Keep water nearby throughout the day'
    ]
  };

  const days = [
    {
      id: 'day-1',
      dateLabel: 'Yesterday',
      dateSub: 'Aug 14, 2025',
      score: 78,
      fiber: '24 / 30g',
      fruits: '4.1 / 5cups',
      grains: '2 / 3servings',
      meat: '0.8 / 1oz',
      aiSummary: 'Good effort! Try adding more whole grains and reducing processed foods tomorrow.'
    },
    {
      id: 'day-2',
      dateLabel: 'Aug 13, 2025',
      dateSub: '',
      score: 92,
      fiber: '30 / 30g',
      fruits: '5.6 / 5cups',
      grains: '3 / 3servings',
      meat: '0 / 1oz',
      aiSummary: 'Excellent! You achieved all your nutrition goals. Keep up the amazing work!'
    },
    {
      id: 'day-3',
      dateLabel: 'Aug 12, 2025',
      dateSub: '',
      score: 75,
      fiber: '22 / 30g',
      fruits: '4.8 / 5cups',
      grains: '2 / 3servings',
      meat: '0.5 / 1oz',
      aiSummary: 'Steady consistency on hydration and plant-based nourishment throughout the day.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6F3F7] text-[#2A2233] pb-24 font-sans">
      {/* Header */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6F3F7]/90 backdrop-blur-md z-30">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2A2233]">History</h1>
          <p className="text-xs text-[#6B6275]">Your progress at a glance</p>
        </div>
      </header>

      {/* Main List */}
      <main className="px-4 space-y-4 mt-2">
        {days.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedReport({ ...sampleReport, titleDate: item.dateSub || item.dateLabel, score: item.score })}
            className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs cursor-pointer hover:border-[#5A3577]/40 transition-all space-y-4"
          >
            {/* Top Row: Date & Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#EFE7F5] rounded-lg text-[#5A3577]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2A2233]">{item.dateLabel}</h3>
                  {item.dateSub && <p className="text-[11px] text-[#6B6275]">{item.dateSub}</p>}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  item.score >= 90 
                    ? 'bg-[#E4F0E6] text-[#4C8F63]' 
                    : 'bg-[#EFE7F5] text-[#5A3577]'
                }`}>
                  {item.score}/100
                </span>
                <ChevronRight className="w-4 h-4 text-[#6B6275]" />
              </div>
            </div>

            {/* 4 Mini Progress Rings */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              {/* Fiber */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#4C8F63] bg-[#E4F0E6]/50 flex items-center justify-center text-[#4C8F63] mb-1">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#2A2233]">Fiber</span>
                <span className="text-[9px] text-[#6B6275] font-medium">{item.fiber}</span>
              </div>

              {/* Fruits & Vegetables */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#2C7A93] bg-[#E1EFF2]/50 flex items-center justify-center text-[#2C7A93] mb-1">
                  <Apple className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#2A2233]">Fruits & Veg</span>
                <span className="text-[9px] text-[#6B6275] font-medium">{item.fruits}</span>
              </div>

              {/* Whole Grains */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#C98A2B] bg-[#F7EBD8]/50 flex items-center justify-center text-[#C98A2B] mb-1">
                  <Wheat className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#2A2233]">Whole Grains</span>
                <span className="text-[9px] text-[#6B6275] font-medium">{item.grains}</span>
              </div>

              {/* Processed Meat */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#B5504A] bg-[#F5E3E1]/50 flex items-center justify-center text-[#B5504A] mb-1">
                  <Drumstick className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#2A2233]">Proc. Meat</span>
                <span className="text-[9px] text-[#6B6275] font-medium">{item.meat}</span>
              </div>
            </div>

            {/* AI Daily Summary Subcard */}
            <div className="bg-[#EFE7F5]/70 rounded-2xl p-3 border border-[#E4DEE9] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#5A3577] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[11px] font-bold text-[#5A3577] block">AI Daily Summary</span>
                <p className="text-xs text-[#402359] mt-0.5 leading-snug">
                  {item.aiSummary}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5A3577] self-center shrink-0" />
            </div>
          </div>
        ))}
      </main>

      {/* Floating Action Button (+) */}
      <button 
        aria-label="Add entry"
        className="fixed bottom-20 right-6 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Detail Modal */}
      {selectedReport && (
        <DailyNutritionReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          userName={userName}
        />
      )}
    </div>
  );
}
