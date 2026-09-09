import { useState } from 'react';
import { 
  Flame, Dumbbell, Droplets, Footprints, Camera, Plus, Check, 
  Sparkles, RotateCw, MoreVertical, Bell, User as UserIcon,
  FileText, TrendingUp, Bot, Settings, X
} from 'lucide-react';
import { BottomTab, ActiveModule } from '../../types';

interface Props {
  onNavigate: (tab: BottomTab) => void;
  onSwitchGoal?: (goal: ActiveModule) => void;
}

export function HomePage({ onNavigate, onSwitchGoal }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] pb-24 font-sans">
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
            Good morning, Maya...
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2 bg-white rounded-full border border-[#E7EEE9] shadow-xs hover:bg-[#EFF6F1]">
            <Bell className="w-4 h-4 text-[#4C5F55]" />
            <span className="absolute -top-1 -right-1 bg-[#FF8B5E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <button 
            onClick={() => onNavigate('profile')} 
            className="w-9 h-9 bg-[#DCE9E1] text-[#1F7A5C] rounded-full flex items-center justify-center border border-[#1F7A5C]/20 hover:opacity-90"
          >
            <UserIcon className="w-4 h-4" />
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
              onClick={() => { setShowMenu(false); onNavigate('history'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#1B2B24] hover:bg-[#EFF6F1] rounded-xl text-left"
            >
              <FileText className="w-4 h-4 text-[#1F7A5C]" />
              Daily Food Analysis
            </button>
            <button
              onClick={() => { setShowMenu(false); onNavigate('history'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#1B2B24] hover:bg-[#EFF6F1] rounded-xl text-left"
            >
              <FileText className="w-4 h-4 text-[#2E8B8B]" />
              Permanent History Reports
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
              Profile & Settings
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

          <div className="flex justify-between items-baseline mb-4">
            <div>
              <span className="text-[11px] text-white/70 block uppercase tracking-wider">Current weight</span>
              <div className="text-3xl font-extrabold tracking-tight">
                181.4 <span className="text-lg font-normal text-white/80">lb</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-white/70 block uppercase tracking-wider">Goal weight</span>
              <div className="text-xl font-bold text-white/90">
                165 <span className="text-sm font-normal text-white/70">lb</span>
              </div>
            </div>
          </div>

          {/* Progress Bar & Sub-stats */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-white/90">
              <span>13.7 lb lost</span>
              <span>45% of your journey</span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden flex">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: '45%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-white/70 pt-0.5">
              <span>Started at 195.1 lb</span>
              <span>16.4 lb to go</span>
            </div>
          </div>
        </div>

        {/* Today's Focus */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1B2B24]">Today's Focus</h3>
            <button className="text-sm font-semibold text-[#1F7A5C] hover:underline">See plan</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Calories */}
            <div className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#1F7A5C]">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#4C5F55]">78%</span>
              </div>
              <div className="text-sm font-bold text-[#1B2B24]">Calories</div>
              <div className="text-xs text-[#8A9A92] mb-2 font-medium">1420 / 1800 kcal</div>
              <div className="w-full h-1.5 bg-[#DCE9E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#1F7A5C] rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            {/* Protein */}
            <div className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#2E8B8B]">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#4C5F55]">76%</span>
              </div>
              <div className="text-sm font-bold text-[#1B2B24]">Protein</div>
              <div className="text-xs text-[#8A9A92] mb-2 font-medium">92 / 120 g</div>
              <div className="w-full h-1.5 bg-[#DCE9E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#2E8B8B] rounded-full" style={{ width: '76%' }} />
              </div>
            </div>

            {/* Water */}
            <div className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#3E8FB0]">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#4C5F55]">62%</span>
              </div>
              <div className="text-sm font-bold text-[#1B2B24]">Water</div>
              <div className="text-xs text-[#8A9A92] mb-2 font-medium">5 / 8 glasses</div>
              <div className="w-full h-1.5 bg-[#DCE9E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#3E8FB0] rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#1F7A5C]">
                  <Footprints className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#4C5F55]">80%</span>
              </div>
              <div className="text-sm font-bold text-[#1B2B24]">Steps</div>
              <div className="text-xs text-[#8A9A92] mb-2 font-medium">6420 / 8000</div>
              <div className="w-full h-1.5 bg-[#DCE9E1] rounded-full overflow-hidden">
                <div className="h-full bg-[#1F7A5C] rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onNavigate('history')}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1F7A5C] text-white rounded-2xl font-semibold text-sm shadow-xs hover:bg-[#14503C] transition-all"
          >
            <Plus className="w-4 h-4" />
            Log a Meal
          </button>
          <button 
            onClick={() => onNavigate('history')}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white text-[#1B2B24] border border-[#DCE6E0] rounded-2xl font-semibold text-sm shadow-xs hover:bg-[#EFF6F1] transition-all"
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
              380 kcal remaining
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
                  strokeDasharray="78, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-[#1B2B24]">1420</span>
                <span className="text-[10px] text-[#8A9A92] -mt-1 font-medium">kcal</span>
              </div>
            </div>

            {/* Macro Bars */}
            <div className="flex-1 space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#1B2B24] mb-1">
                  <span>Protein</span>
                  <span>92g</span>
                </div>
                <div className="h-2 bg-[#DCE9E1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1F7A5C] rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#1B2B24] mb-1">
                  <span>Carbs</span>
                  <span>146g</span>
                </div>
                <div className="h-2 bg-[#DCE9E1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2E8B8B] rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#1B2B24] mb-1">
                  <span>Fat</span>
                  <span>48g</span>
                </div>
                <div className="h-2 bg-[#DCE9E1] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF8B5E] rounded-full" style={{ width: '50%' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Today's Meals */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1B2B24]">Today's Meals</h3>
            <button onClick={() => onNavigate('history')} className="text-sm font-semibold text-[#1F7A5C] hover:underline">
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
                  <div className="text-xs text-[#8A9A92]">Quick yogurt bowl · 410 kcal</div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Lunch */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6F1] flex items-center justify-center text-xl">
                  🥗
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1B2B24]">Lunch</div>
                  <div className="text-xs text-[#8A9A92]">Chicken grain bowl · 560 kcal</div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* Dinner */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6F1] flex items-center justify-center text-xl opacity-70">
                  🍽️
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1B2B24]">Dinner</div>
                  <div className="text-xs text-[#8A9A92]">Plan your protein-rich dinner</div>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('history')} 
                className="w-7 h-7 rounded-full bg-[#F6FAF7] text-[#4C5F55] border border-[#DCE6E0] flex items-center justify-center hover:bg-[#EFF6F1]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Snack */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6F1] flex items-center justify-center text-xl opacity-70">
                  🍎
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1B2B24]">Snack</div>
                  <div className="text-xs text-[#8A9A92]">Nothing logged yet</div>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('history')} 
                className="w-7 h-7 rounded-full bg-[#F6FAF7] text-[#4C5F55] border border-[#DCE6E0] flex items-center justify-center hover:bg-[#EFF6F1]"
              >
                <Plus className="w-4 h-4" />
              </button>
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
            You're doing well on protein today. A protein-rich dinner could help you stay on target.
          </p>
        </section>
      </main>

      {/* Goal Switch Modal (as shown in pri1.jpg) */}
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
    </div>
  );
}
