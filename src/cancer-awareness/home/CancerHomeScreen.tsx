import { useState } from 'react';
import { 
  Menu, Bell, Shield, RotateCw, ArrowRight, Scan, Search, 
  Droplets, Plus, Sprout, Apple, Wheat, Drumstick, Sparkles, 
  Flame, Info, ChevronRight, X, Check, Utensils
} from 'lucide-react';
import { BottomTab, UserSharedProfile } from '../../types';
import { DailyNutritionReportModal } from '../history/DailyNutritionReportModal';
import { CancerNutritionReport } from '../types';

interface Props {
  profile: UserSharedProfile;
  onNavigate: (tab: BottomTab) => void;
  onSwitchGoal: (module: 'weight_loss' | 'cancer_awareness' | 'diabetes_awareness') => void;
}

export function CancerHomeScreen({ profile, onNavigate, onSwitchGoal }: Props) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [waterAmountL, setWaterAmountL] = useState(1.7);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  // Real report structure for modal
  const sampleReport: CancerNutritionReport = {
    id: 'report-today',
    dateStr: '2025-08-15',
    titleDate: 'Aug 15, 2025',
    score: 85,
    statusBadge: 'Great Choice',
    summaryNote: 'High protein and dietary fiber intake achieved.',
    aiQuote: 'Excellent work focusing on vibrant phytonutrients today. Your plant variety is directly supporting your immunity and digestion.',
    calories: { current: 1720, target: 1850 },
    protein: { current: 112, target: 120 },
    fiber: { current: 28, target: 30 },
    water: { current: Number(waterAmountL.toFixed(1)), target: 2.5 },
    activityMin: { current: 52, target: 60 },
    mealPerformance: {
      breakfast: 88,
      lunch: 92,
      dinner: 85,
      snacks: 70,
      bestMeal: { name: 'Grilled Chicken Bowl', score: 88 },
      couldImprove: { name: 'Afternoon Snack', score: 70 }
    },
    todayWins: [
      'Fiber target almost reached (28g)',
      'High antioxidant meal variety',
      'Zero ultra-processed meats consumed',
      '7-day healthy meal streak'
    ],
    areasToImprove: [
      { title: 'Hydration', note: 'About 800 ml remaining to reach today\'s 2.5L target.' },
      { title: 'Cruciferous Greens', note: 'Consider adding broccoli or kale to tomorrow\'s dinner.' }
    ],
    tomorrowFocus: [
      'Begin the day with hydration and lemon water',
      'Incorporate berries and leafy greens',
      'Keep healthy raw nuts available for snacks'
    ]
  };

  const handleAddWater = () => {
    setWaterAmountL((prev) => Math.min(3.5, Number((prev + 0.25).toFixed(2))));
  };

  return (
    <div className="min-h-screen bg-[#F6F3F7] text-[#2A2233] pb-24 font-sans">
      {/* Header */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6F3F7]/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <button 
            title="Menu"
            aria-label="Open menu"
            className="p-2 -ml-2 text-[#2A2233] hover:bg-black/5 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-sm font-bold text-[#2A2233]">
              Good Morning, {profile.fullName.split(' ')[0] || 'Maya'}
            </h1>
            <p className="text-[11px] text-[#6B6275]">You're one step closer to your health goals.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification with Badge */}
          <button 
            title="Notifications"
            className="relative p-2 text-[#2A2233] hover:bg-black/5 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#E8674B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Avatar Circle */}
          <button 
            onClick={() => onNavigate('profile')}
            title="View Profile"
            className="w-8 h-8 rounded-full bg-[#EFE7F5] border border-[#5A3577]/30 text-[#5A3577] flex items-center justify-center font-bold text-xs"
          >
            {profile.fullName.charAt(0) || 'M'}
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="px-4 space-y-4 mt-2">
        {/* HERO CARD: YOUR GOAL */}
        <section className="bg-gradient-to-br from-[#EFE7F5] via-[#F6F3F7] to-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs relative overflow-hidden">
          {/* Top Row: Badge & Switch Goal */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A3577]">
              <Shield className="w-4 h-4 text-[#5A3577]" />
              <span className="tracking-wide uppercase text-[11px]">YOUR GOAL</span>
            </div>

            <button 
              onClick={() => setShowGoalModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E4DEE9] text-[#5A3577] rounded-full text-xs font-semibold hover:bg-[#EFE7F5] transition-colors shadow-2xs"
            >
              <RotateCw className="w-3 h-3" />
              <span>Switch Goal</span>
            </button>
          </div>

          {/* Middle: Title & Subtitle with 3D Ribbon Emblem */}
          <div className="flex items-center justify-between mt-3 relative z-10">
            <div className="max-w-[210px]">
              <h2 className="text-xl font-extrabold text-[#2A2233] leading-tight">
                Cancer-Aware Nutrition
              </h2>
              <p className="text-xs text-[#6B6275] mt-1 leading-relaxed">
                Make mindful food choices today to support long-term wellness and cell protection.
              </p>
            </div>

            {/* 3D Purple Ribbon Illustration Graphic */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#5A3577] to-[#402359] text-white flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition-transform">
                <Shield className="w-8 h-8 text-white/90" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E8674B] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
                +
              </div>
            </div>
          </div>

          {/* Learn More Button */}
          <div className="mt-4 relative z-10">
            <button 
              onClick={() => setShowLearnMoreModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#5A3577] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#402359] transition-colors"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* QUICK ACTIONS: Scan Food & Search Food */}
        <section className="grid grid-cols-2 gap-3">
          {/* Scan Food */}
          <div 
            onClick={() => onNavigate('coach')}
            className="bg-[#FCFBFD] rounded-3xl p-4 border border-[#E4DEE9] shadow-xs cursor-pointer hover:border-[#5A3577]/40 transition-colors flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E1EFF2] text-[#2C7A93] flex items-center justify-center shrink-0">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2A2233]">Scan Food</div>
              <p className="text-[11px] text-[#6B6275]">Analyze instantly</p>
            </div>
          </div>

          {/* Search Food */}
          <div 
            onClick={() => onNavigate('coach')}
            className="bg-[#FCFBFD] rounded-3xl p-4 border border-[#E4DEE9] shadow-xs cursor-pointer hover:border-[#5A3577]/40 transition-colors flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#F6F3F7] text-[#6B6275] flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2A2233]">Search Food</div>
              <p className="text-[11px] text-[#6B6275]">Find healthy foods</p>
            </div>
          </div>
        </section>

        {/* WATER INTAKE CARD */}
        <section className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#E1EFF2] text-[#2C7A93] flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-[#6B6275]">Water Intake</span>
                <div className="text-sm font-extrabold text-[#2A2233]">
                  {waterAmountL.toFixed(1)} L <span className="text-xs font-normal text-[#6B6275]">/ 2.5 L</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddWater}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E1EFF2] text-[#2C7A93] rounded-full text-xs font-bold hover:bg-[#cde4e8] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#E1EFF2] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#2C7A93] rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (waterAmountL / 2.5) * 100)}%` }}
            />
          </div>
        </section>

        {/* TODAY'S PROGRESS (69% COMPLETE) - 4 Grid Cards */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-[#2A2233]">Today's Progress</h3>
            <span className="text-xs font-semibold text-[#5A3577]">69% Complete</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* 1. Fiber */}
            <div className="bg-[#FCFBFD] rounded-3xl p-4 border border-[#E4DEE9] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-[#E4F0E6] text-[#4C8F63] flex items-center justify-center">
                  <Sprout className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E4F0E6] text-[#4C8F63]">
                  Good
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#2A2233] block">Fiber</span>
                <span className="text-[11px] text-[#4C8F63] font-medium">On track</span>
              </div>
              <div className="w-full h-1.5 bg-[#E4F0E6] rounded-full overflow-hidden">
                <div className="h-full bg-[#4C8F63] rounded-full" style={{ width: '93%' }} />
              </div>
              <span className="text-[11px] text-[#6B6275] block font-medium">28 g of 30 g</span>
            </div>

            {/* 2. Fruits & Vegetables */}
            <div className="bg-[#FCFBFD] rounded-3xl p-4 border border-[#E4DEE9] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-[#E1EFF2] text-[#2C7A93] flex items-center justify-center">
                  <Apple className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E4F0E6] text-[#4C8F63]">
                  Good
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#2A2233] block">Fruits & Veg</span>
                <span className="text-[11px] text-[#4C8F63] font-medium">On track</span>
              </div>
              <div className="w-full h-1.5 bg-[#E1EFF2] rounded-full overflow-hidden">
                <div className="h-full bg-[#2C7A93] rounded-full" style={{ width: '100%' }} />
              </div>
              <span className="text-[11px] text-[#6B6275] block font-medium">5.2 cups of 5 cups</span>
            </div>

            {/* 3. Whole Grains */}
            <div className="bg-[#FCFBFD] rounded-3xl p-4 border border-[#E4DEE9] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-[#F7EBD8] text-[#C98A2B] flex items-center justify-center">
                  <Wheat className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F7EBD8] text-[#C98A2B]">
                  Building
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#2A2233] block">Whole Grains</span>
                <span className="text-[11px] text-[#C98A2B] font-medium">In progress</span>
              </div>
              <div className="w-full h-1.5 bg-[#F7EBD8] rounded-full overflow-hidden">
                <div className="h-full bg-[#C98A2B] rounded-full" style={{ width: '66%' }} />
              </div>
              <span className="text-[11px] text-[#6B6275] block font-medium">2 servings of 3</span>
            </div>

            {/* 4. Processed Meat */}
            <div className="bg-[#FCFBFD] rounded-3xl p-4 border border-[#E4DEE9] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-[#F5E3E1] text-[#B5504A] flex items-center justify-center">
                  <Drumstick className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F5E3E1] text-[#B5504A]">
                  Limit
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#2A2233] block">Processed Meat</span>
                <span className="text-[11px] text-[#B5504A] font-medium">Low intake</span>
              </div>
              <div className="w-full h-1.5 bg-[#F5E3E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#B5504A] rounded-full" style={{ width: '50%' }} />
              </div>
              <span className="text-[11px] text-[#6B6275] block font-medium">0.5 oz of 1 oz</span>
            </div>
          </div>
        </section>

        {/* RECENT FOOD ANALYSIS */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-[#2A2233]">Recent Food Analysis</h3>
            <button 
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-[#5A3577] hover:underline"
            >
              View all
            </button>
          </div>

          <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-3.5">
            {/* Meal graphic banner placeholder */}
            <div className="h-28 rounded-2xl bg-gradient-to-r from-[#F7EBD8] to-[#EFE7F5] flex items-center justify-center text-4xl shadow-inner">
              🥗
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-[#2A2233]">Grilled Chicken Bowl</h4>
                  <span className="px-2 py-0.5 bg-[#FBE7E1] text-[#B5504A] rounded-md text-[10px] font-bold uppercase">
                    BALANCED
                  </span>
                </div>
                <p className="text-xs text-[#4C8F63] font-medium mt-0.5">
                  Great choice! High in protein and fiber.
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-[#2A2233]">85</span>
                <span className="text-[10px] text-[#6B6275] block -mt-1">/100</span>
              </div>
            </div>

            {/* AI tip box */}
            <div className="bg-[#EFE7F5]/80 rounded-2xl p-3 border border-[#E4DEE9] flex items-center gap-2 text-xs text-[#402359]">
              <Sparkles className="w-4 h-4 text-[#5A3577] shrink-0" />
              <span>Consider adding more leafy greens tomorrow.</span>
            </div>

            <button 
              onClick={() => setShowFullAnalysis(true)}
              className="w-full py-3 bg-[#5A3577] text-white rounded-2xl font-bold text-xs hover:bg-[#402359] transition-colors shadow-xs"
            >
              View full analysis →
            </button>
          </div>
        </section>

        {/* TWO METRIC CARDS: Nutrition Score & Healthy Streak */}
        <section className="grid grid-cols-2 gap-3">
          {/* Nutrition Score */}
          <div className="bg-[#FCFBFD] rounded-3xl p-4 border border-[#E4DEE9] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B6275]">
              <span className="text-xs font-medium">Nutrition Score</span>
              <Info className="w-3.5 h-3.5" />
            </div>

            <div className="py-2 flex items-center justify-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" stroke="#EFE7F5" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="32" cy="32" r="26"
                    stroke="#5A3577" strokeWidth="6"
                    strokeDasharray="163"
                    strokeDashoffset="29"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-base font-black text-[#2A2233]">82</span>
                  <span className="text-[9px] text-[#6B6275] block -mt-1">/100</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-[#4C8F63]">Great</span>
            </div>
          </div>

          {/* Healthy Streak */}
          <div className="bg-[#FCFBFD] rounded-3xl p-4 border border-[#E4DEE9] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#6B6275]">
              <span className="text-xs font-medium">Healthy Streak</span>
              <Flame className="w-4 h-4 text-[#E8674B]" />
            </div>

            <div className="py-3 text-center">
              <span className="text-3xl font-black text-[#2A2233]">7</span>
              <span className="text-xs font-bold text-[#6B6275] ml-1">Days</span>
            </div>

            <div className="text-center">
              <span className="text-xs font-medium text-[#6B6275]">Keep it up!</span>
            </div>
          </div>
        </section>

        {/* AI INSIGHT */}
        <section className="bg-[#EFE7F5] rounded-3xl p-4 border border-[#E4DEE9] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5A3577] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-[#5A3577] block">AI Insight</span>
            <p className="text-xs text-[#402359] mt-0.5 leading-relaxed">
              Your fiber intake is improving! Adding more berries and leafy greens will further support your immunity.
            </p>
          </div>
          <div className="text-2xl">
            🥣
          </div>
        </section>
      </main>

      {/* Floating Action Button (+) */}
      <button 
        onClick={() => onNavigate('coach')}
        aria-label="Add or ask AI"
        className="fixed bottom-20 right-6 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Goal Switch Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E4DEE9]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2A2233]">Switch Nutrition Goal</h3>
              <button onClick={() => setShowGoalModal(false)} className="text-[#6B6275] hover:text-[#2A2233]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#6B6275]">
              Choose a nutrition focus to customize your daily metrics and guidance.
            </p>

            <div className="space-y-2.5">
              {/* Cancer-Aware Nutrition (Active) */}
              <div 
                onClick={() => {
                  onSwitchGoal('cancer_awareness');
                  setShowGoalModal(false);
                }}
                className="p-3.5 rounded-2xl border-2 border-[#5A3577] bg-[#EFE7F5] flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold text-sm text-[#5A3577]">Cancer-Aware Nutrition (Active)</div>
                  <div className="text-xs text-[#402359] mt-0.5">Support long-term cellular wellness & cell protection.</div>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#5A3577] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Weight Loss & Management */}
              <div 
                onClick={() => {
                  onSwitchGoal('weight_loss');
                  setShowGoalModal(false);
                }}
                className="p-3.5 rounded-2xl border border-[#E4DEE9] hover:bg-[#F6F3F7] cursor-pointer transition-colors"
              >
                <div className="font-semibold text-sm text-[#2A2233]">Weight Loss & Management</div>
                <div className="text-xs text-[#6B6275] mt-0.5">Healthy caloric deficit & nutrient-dense meals.</div>
              </div>

              {/* Diabetes-Friendly & Glycemic Control */}
              <div 
                onClick={() => {
                  onSwitchGoal('diabetes_awareness');
                  setShowGoalModal(false);
                }}
                className="p-3.5 rounded-2xl border border-[#E4DEE9] hover:bg-[#F6F3F7] cursor-pointer transition-colors"
              >
                <div className="font-semibold text-sm text-[#2A2233]">Diabetes-Friendly & Glycemic Control</div>
                <div className="text-xs text-[#6B6275] mt-0.5">Balanced macronutrients and steady fiber.</div>
              </div>
            </div>

            <button 
              onClick={() => setShowGoalModal(false)}
              className="w-full py-2.5 bg-[#5A3577] text-white rounded-xl font-semibold text-sm hover:bg-[#402359]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Learn More Educational Modal */}
      {showLearnMoreModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E4DEE9]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#5A3577]" />
                <h3 className="text-base font-bold text-[#2A2233]">Cancer-Aware Nutrition</h3>
              </div>
              <button onClick={() => setShowLearnMoreModal(false)} className="text-[#6B6275] hover:text-[#2A2233]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B6275] leading-relaxed">
              Cancer-aware nutrition emphasizes foods rich in natural antioxidants, phytochemicals, and dietary fiber that support normal cell function and cellular repair.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#E4F0E6] rounded-xl text-[#2A2233]">
                <span className="font-bold text-[#4C8F63] block">Cruciferous & Colorful Plants</span>
                Broccoli, cabbage, kale, berries, and tomatoes contain protective sulforaphane, carotenoids, and vitamin C.
              </div>
              <div className="p-2.5 bg-[#F7EBD8] rounded-xl text-[#2A2233]">
                <span className="font-bold text-[#C98A2B] block">Dietary Fiber & Whole Grains</span>
                Promotes a healthy microbiome and gut barrier integrity, aiding regular metabolic elimination.
              </div>
              <div className="p-2.5 bg-[#F5E3E1] rounded-xl text-[#2A2233]">
                <span className="font-bold text-[#B5504A] block">Limit Processed Meats</span>
                Evidence suggests reducing cured and ultra-processed meats to minimize carcinogenic compounds.
              </div>
            </div>

            <div className="p-2.5 bg-[#F6F3F7] rounded-xl text-[10px] text-[#6B6275] italic">
              Disclaimer: VitaAI provides general nutritional education and does not replace medical advice, diagnosis, or clinical cancer care.
            </div>

            <button 
              onClick={() => setShowLearnMoreModal(false)}
              className="w-full py-2.5 bg-[#5A3577] text-white rounded-xl font-semibold text-xs hover:bg-[#402359]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Full Analysis Modal */}
      {showFullAnalysis && (
        <DailyNutritionReportModal
          report={sampleReport}
          onClose={() => setShowFullAnalysis(false)}
          userName={profile.fullName}
        />
      )}
    </div>
  );
}
