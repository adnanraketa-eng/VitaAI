import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Heart, Flame } from 'lucide-react';
import { OnboardingPrimaryButton } from '../components/OnboardingComponents';
import { OnboardingData } from '../OnboardingTypes';

interface Props {
  data: OnboardingData;
  onFinish: () => void;
}

export function OnboardingCompleteScreen({ data, onFinish }: Props) {
  const firstName = data.fullName.trim().split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#12324A] flex flex-col justify-between font-sans selection:bg-[#1769AA] selection:text-white">
      {/* Top Brand bar */}
      <header className="px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-[#1769AA] text-white flex items-center justify-center font-black text-xs shadow-xs">
            V
          </div>
          <span className="font-extrabold text-sm text-[#12324A] tracking-tight">VitaAI</span>
        </div>
        <span className="text-[10px] font-bold text-[#39A982] bg-[#EAF8F2] px-2.5 py-1 rounded-full">
          Setup Complete
        </span>
      </header>

      {/* Center Celebration Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 py-4 flex flex-col justify-center space-y-6 text-center">
        {/* Animated Check Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-[#EAF8F2] border border-[#39A982]/30 flex items-center justify-center text-[#39A982] shadow-sm">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-black tracking-tight text-[#12324A]">
            You're all set, {firstName}!
          </h1>
          <p className="text-xs text-[#536675] max-w-xs mx-auto leading-relaxed">
            Your shared profile has been created and your personalized targets are ready.
          </p>
        </div>

        {/* Ready checklist */}
        <div className="bg-white rounded-3xl border border-[#DCE7EE] p-4 text-left space-y-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#12324A]">One Shared Account</h4>
              <p className="text-[11px] text-[#536675]">
                {data.fullName} · {data.gender} · {data.heightCm} cm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF5E5] text-[#E8A23A] flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#12324A]">Personalized Daily Targets</h4>
              <p className="text-[11px] text-[#536675]">
                {data.dailyCalorieGoalKcal} kcal · {data.dailyProteinGoalG}g protein · {data.dailyStepGoal.toLocaleString()} steps
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#12324A]">AI Nutrition & Wellness Coach</h4>
              <p className="text-[11px] text-[#536675]">
                Initialized with your goals and ready to support your journey.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <footer className="px-6 py-5 border-t border-[#DCE7EE] bg-white/90 backdrop-blur-md max-w-md w-full mx-auto">
        <OnboardingPrimaryButton onClick={onFinish} icon={<ArrowRight className="w-4 h-4" />}>
          Continue to VitaAI
        </OnboardingPrimaryButton>
      </footer>
    </div>
  );
}
