import { useState, FormEvent } from 'react';
import { 
  Bell, User as UserIcon, Activity, Info, AlertTriangle, 
  Check, Camera, Plus, Sparkles, TrendingUp, ChevronRight, 
  ArrowRight, Sprout, X, RotateCw, CheckCircle2
} from 'lucide-react';
import { UserSharedProfile, BottomTab, ActiveModule } from '../../types';
import { DIABETES_COLORS } from '../constants/colors';

interface Props {
  profile: UserSharedProfile;
  onNavigate: (tab: BottomTab) => void;
  onSwitchGoal: (module: ActiveModule) => void;
}

export function DiabetesHomeScreen({ profile, onNavigate, onSwitchGoal }: Props) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showLogGlucoseModal, setShowLogGlucoseModal] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [glucoseInput, setGlucoseInput] = useState('128');
  const [readingTiming, setReadingTiming] = useState<'Morning' | 'Before lunch' | 'Evening'>('Morning');
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  const firstName = profile.fullName ? profile.fullName.split(' ')[0] : 'Alex';

  const handleSaveGlucose = (e: FormEvent) => {
    e.preventDefault();
    setLoggedSuccess(true);
    setTimeout(() => {
      setLoggedSuccess(false);
      setShowLogGlucoseModal(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#12324A] pb-24 font-sans selection:bg-[#1769AA] selection:text-white">
      {/* Top Header */}
      <header className="px-5 pt-4 pb-2 flex items-center justify-between sticky top-0 bg-[#F7FAFC]/95 backdrop-blur-md z-30">
        <div>
          <h2 className="text-base font-medium text-[#12324A] flex items-center gap-1.5">
            Good morning, {firstName} <span className="inline-block animate-wave">👋</span>
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Notifications */}
          <button 
            onClick={() => onNavigate('coach')}
            className="w-10 h-10 rounded-full bg-white border border-[#DCE7EE] flex items-center justify-center text-[#12324A] relative shadow-2xs hover:bg-[#EAF5FB] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#12324A]" />
            <span className="absolute -top-1 -right-1 bg-[#E8A23A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* User Profile Avatar */}
          <button 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-white border border-[#DCE7EE] flex items-center justify-center text-[#12324A] shadow-2xs hover:bg-[#EAF5FB] transition-colors"
            aria-label="Profile"
          >
            <UserIcon className="w-5 h-5 text-[#12324A]" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-4 mt-1">
        {/* Module Sub-Header & Switch Goal */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#12324A]">
              Diabetes-Friendly Eating
            </h1>
            <p className="text-xs text-[#536675] mt-0.5">
              Smart choices for steadier glucose.
            </p>
          </div>

          <button 
            onClick={() => setShowGoalModal(true)}
            className="w-10 h-10 rounded-2xl bg-[#12324A] text-white flex items-center justify-center shadow-xs hover:bg-[#1769AA] transition-colors"
            title="Switch Goal or View Details"
          >
            <Activity className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Card: Today's Glucose Overview */}
        <div className="bg-[#12324A] text-white rounded-3xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/85 tracking-wide">
              Today's Glucose Overview
            </span>
            <span className="bg-white text-[#12324A] text-[11px] font-bold px-3 py-0.5 rounded-full shadow-2xs">
              In range
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold tracking-tight">128</span>
                <span className="text-sm font-medium text-white/80 ml-1.5">mg/dL</span>
              </div>
              <p className="text-[11px] text-white/65 mt-1 font-medium">
                Last checked 7:30 AM
              </p>
            </div>

            {/* Sparkline Trend */}
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-white/70 font-medium mb-1.5">7-day trend</span>
              <div className="w-28 h-8">
                <svg viewBox="0 0 120 32" className="w-full h-full overflow-visible">
                  <path
                    d="M 0,22 Q 20,24 35,18 T 65,19 T 95,14 T 115,12"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* End Dot */}
                  <circle cx="115" cy="12" r="3.5" fill="#FFFFFF" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Your daily picture */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-[#12324A]">Your daily picture</h3>
            <button 
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-[#1769AA] hover:text-[#12324A] transition-colors"
            >
              View history
            </button>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Avg Glucose */}
            <div className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#1769AA] bg-[#EAF5FB] px-2 py-0.5 rounded-full">
                  7-day
                </span>
              </div>
              <div className="mt-3">
                <span className="text-[11px] text-[#536675] font-medium block">Avg Glucose</span>
                <span className="text-lg font-bold text-[#12324A] tracking-tight">128 mg/dL</span>
              </div>
            </div>

            {/* 2. Time in Range */}
            <div className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#39A982] bg-[#EAF8F2] px-2 py-0.5 rounded-full">
                  Good
                </span>
              </div>
              <div className="mt-3">
                <span className="text-[11px] text-[#536675] font-medium block">Time in Range</span>
                <span className="text-lg font-bold text-[#12324A] tracking-tight">82%</span>
              </div>
            </div>

            {/* 3. Glycemic Load */}
            <div className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#FFF5E5] text-[#E8A23A] flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#E8A23A] bg-[#FFF5E5] px-2 py-0.5 rounded-full">
                  Moderate
                </span>
              </div>
              <div className="mt-3">
                <span className="text-[11px] text-[#536675] font-medium block">Glycemic Load</span>
                <span className="text-lg font-bold text-[#12324A] tracking-tight">68</span>
              </div>
            </div>

            {/* 4. Daily Goal */}
            <div className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold text-[#39A982] bg-[#EAF8F2] px-2 py-0.5 rounded-full">
                  On track
                </span>
              </div>
              <div className="mt-3">
                <span className="text-[11px] text-[#536675] font-medium block">Daily Goal</span>
                <span className="text-lg font-bold text-[#12324A] tracking-tight">85%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Quick actions */}
        <section className="space-y-2.5">
          <h3 className="text-sm font-bold text-[#12324A] px-1">Quick actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Scan Food */}
            <button 
              onClick={() => setShowAddMealModal(true)}
              className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs text-center hover:bg-[#F7FAFC] transition-colors group"
            >
              <div className="w-11 h-11 rounded-full bg-[#FDEEEE] text-[#D95C5C] flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-105">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#12324A] block">Scan Food</span>
            </button>

            {/* Add Meal */}
            <button 
              onClick={() => setShowAddMealModal(true)}
              className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs text-center hover:bg-[#F7FAFC] transition-colors group"
            >
              <div className="w-11 h-11 rounded-full bg-[#EAF8F2] text-[#39A982] flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-105">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#12324A] block">Add Meal</span>
            </button>

            {/* Log Glucose */}
            <button 
              onClick={() => setShowLogGlucoseModal(true)}
              className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs text-center hover:bg-[#F7FAFC] transition-colors group"
            >
              <div className="w-11 h-11 rounded-full bg-[#EAF5FB] text-[#4DA3D9] flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-105">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#12324A] block">Log Glucose</span>
            </button>

            {/* AI Insight */}
            <button 
              onClick={() => onNavigate('coach')}
              className="bg-white rounded-3xl p-4 border border-[#DCE7EE] shadow-2xs text-center hover:bg-[#F7FAFC] transition-colors group"
            >
              <div className="w-11 h-11 rounded-full bg-[#FFF5E5] text-[#E8A23A] flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-105">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#12324A] block">AI Insight</span>
            </button>
          </div>
        </section>

        {/* AI Diabetes Coach Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE7EE] shadow-2xs space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#12324A]">AI Diabetes Coach</h4>
              <p className="text-xs text-[#536675] mt-0.5">
                Personalized tips for stable blood sugar.
              </p>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('coach')}
            className="w-full bg-[#12324A] text-white font-semibold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-1.5 hover:bg-[#1769AA] transition-colors shadow-2xs"
          >
            <span>Ask AI Coach</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Tip Card */}
        <div className="bg-[#1E6847] text-white rounded-3xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold block">Daily tip</span>
            <p className="text-xs text-white/90 leading-snug">
              Choose whole foods and control portions to keep glucose steady.
            </p>
          </div>
        </div>
      </main>

      {/* Floating Action Button (+) */}
      <button
        onClick={() => setShowLogGlucoseModal(true)}
        className="fixed bottom-20 right-5 w-12 h-12 rounded-full bg-black text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30"
        aria-label="Quick Action"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Switch Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 border border-[#DCE7EE] shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-1 border-b border-[#DCE7EE]">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-[#1769AA]" />
                <h3 className="font-bold text-base text-[#12324A]">Switch Active Goal</h3>
              </div>
              <button 
                onClick={() => setShowGoalModal(false)}
                className="w-8 h-8 rounded-full bg-[#F7FAFC] text-[#536675] flex items-center justify-center hover:bg-[#DCE7EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#536675]">
              VitaAI seamlessly switches your dashboard and daily targets while keeping your one shared profile intact.
            </p>

            <div className="space-y-2.5">
              {/* Diabetes Awareness (Active) */}
              <div className="p-3.5 rounded-2xl border-2 border-[#1769AA] bg-[#EAF5FB]">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-[#12324A]">Diabetes-Friendly Eating</div>
                  <span className="text-[10px] font-bold text-[#1769AA] bg-white px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>
                <div className="text-xs text-[#536675] mt-0.5">Glycemic balance and blood sugar awareness.</div>
              </div>

              {/* Cancer-Aware Nutrition */}
              <div 
                onClick={() => {
                  onSwitchGoal('cancer_awareness');
                  setShowGoalModal(false);
                }}
                className="p-3.5 rounded-2xl border border-[#DCE7EE] hover:bg-[#EFE7F5] cursor-pointer transition-colors"
              >
                <div className="font-semibold text-sm text-[#12324A]">Cancer-Aware Nutrition</div>
                <div className="text-xs text-[#536675] mt-0.5">Support long-term cellular wellness.</div>
              </div>

              {/* Weight Loss */}
              <div 
                onClick={() => {
                  onSwitchGoal('weight_loss');
                  setShowGoalModal(false);
                }}
                className="p-3.5 rounded-2xl border border-[#DCE7EE] hover:bg-[#EFF6F1] cursor-pointer transition-colors"
              >
                <div className="font-semibold text-sm text-[#12324A]">Weight Loss & Fitness</div>
                <div className="text-xs text-[#536675] mt-0.5">Calorie balance and healthy metabolism.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Glucose Modal */}
      {showLogGlucoseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 border border-[#DCE7EE] shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-1 border-b border-[#DCE7EE]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1769AA]" />
                <h3 className="font-bold text-base text-[#12324A]">Log Glucose Reading</h3>
              </div>
              <button 
                onClick={() => setShowLogGlucoseModal(false)}
                className="w-8 h-8 rounded-full bg-[#F7FAFC] text-[#536675] flex items-center justify-center hover:bg-[#DCE7EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loggedSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#39A982] mx-auto animate-bounce" />
                <h4 className="font-bold text-sm text-[#12324A]">Reading Logged!</h4>
                <p className="text-xs text-[#536675]">Your daily trend has been updated.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveGlucose} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-[#536675] block mb-1">
                    Blood Glucose Level (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={glucoseInput}
                    onChange={(e) => setGlucoseInput(e.target.value)}
                    className="w-full bg-[#F7FAFC] border border-[#DCE7EE] rounded-2xl px-4 py-2.5 text-base font-bold text-[#12324A] focus:outline-none focus:border-[#1769AA]"
                    placeholder="128"
                    min="40"
                    max="400"
                    required
                  />
                  <span className="text-[11px] text-[#39A982] font-medium block mt-1">
                    Target range: 70–180 mg/dL (In range)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#536675] block mb-1">Timing</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Morning', 'Before lunch', 'Evening'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setReadingTiming(t)}
                        className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                          readingTiming === t 
                            ? 'bg-[#12324A] text-white border-[#12324A]' 
                            : 'bg-[#F7FAFC] text-[#536675] border-[#DCE7EE]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1769AA] text-white font-bold text-xs rounded-2xl hover:bg-[#12324A] transition-colors"
                  >
                    Save Reading
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 border border-[#DCE7EE] shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-1 border-b border-[#DCE7EE]">
              <h3 className="font-bold text-base text-[#12324A]">Log Diabetes-Friendly Meal</h3>
              <button 
                onClick={() => setShowAddMealModal(false)}
                className="w-8 h-8 rounded-full bg-[#F7FAFC] text-[#536675] flex items-center justify-center hover:bg-[#DCE7EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#536675]">
              Quickly record your dish to estimate glycemic index and nutrient balance.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setShowAddMealModal(false)}
                className="w-full p-3 rounded-2xl bg-[#EAF8F2] text-[#39A982] border border-[#D1EAE0] flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-xs font-bold block">Quinoa & Roasted Veggie Bowl</span>
                  <span className="text-[11px] text-[#536675]">410 kcal · Low GI (34)</span>
                </div>
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowAddMealModal(false)}
                className="w-full p-3 rounded-2xl bg-[#F7FAFC] text-[#12324A] border border-[#DCE7EE] flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-xs font-bold block">Grilled Salmon & Steamed Broccoli</span>
                  <span className="text-[11px] text-[#536675]">460 kcal · Low GI (28)</span>
                </div>
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowAddMealModal(false)}
              className="w-full py-2.5 bg-[#1769AA] text-white font-bold text-xs rounded-2xl hover:bg-[#12324A] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
