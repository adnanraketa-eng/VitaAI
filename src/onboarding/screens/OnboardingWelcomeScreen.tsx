import { Sparkles, Heart, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { OnboardingPrimaryButton } from '../components/OnboardingComponents';

interface Props {
  onStart: () => void;
}

export function OnboardingWelcomeScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#12324A] flex flex-col justify-between font-sans selection:bg-[#1769AA] selection:text-white">
      {/* Top Brand bar */}
      <header className="px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#1769AA] text-white flex items-center justify-center font-black text-sm shadow-xs">
            V
          </div>
          <div>
            <span className="font-extrabold text-base text-[#12324A] tracking-tight block">VitaAI</span>
            <span className="text-[10px] font-semibold text-[#536675] -mt-0.5 block">
              Personalized Health & Wellness
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-[#1769AA] bg-[#EAF5FB] px-2.5 py-1 rounded-full">
          Shared Profile
        </span>
      </header>

      {/* Hero Visual & Messaging */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 py-4 flex flex-col justify-center space-y-6">
        {/* Visual Graphic Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#EAF5FB] to-[#EAF8F2] border border-[#DCE7EE] p-6 flex flex-col items-center text-center shadow-2xs overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-white shadow-xs border border-[#DCE7EE] flex items-center justify-center text-[#1769AA] mb-4">
            <Sparkles className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#39A982] bg-white/80 px-3 py-1 rounded-full border border-[#DCE7EE]/60 shadow-2xs mb-2">
            One Account · Complete Wellness
          </span>

          <h1 className="text-2xl font-black tracking-tight text-[#12324A]">
            Welcome to VitaAI
          </h1>
          <p className="text-xs text-[#536675] max-w-xs mt-2 leading-relaxed">
            Your personal AI-powered wellness companion. Build sustainable habits, understand your nutrition, and track your health journey with confidence.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="space-y-3">
          <div className="p-3.5 bg-white rounded-2xl border border-[#DCE7EE] flex items-center gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#12324A]">One Shared Health Profile</h3>
              <p className="text-[11px] text-[#536675]">
                Your personal details connect seamlessly across Weight Loss, Diabetes, and Cancer Awareness.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-[#DCE7EE] flex items-center gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#12324A]">Compassionate, Science-Grounded AI</h3>
              <p className="text-[11px] text-[#536675]">
                Tailored coaching for your nutrition deficit, daily hydration, movement, and habit consistency.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-[#DCE7EE] flex items-center gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#FFF5E5] text-[#E8A23A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#12324A]">Private & Secure</h3>
              <p className="text-[11px] text-[#536675]">
                Your measurements belong entirely to you and are never shared without permission.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <footer className="px-6 py-5 border-t border-[#DCE7EE] bg-white/90 backdrop-blur-md max-w-md w-full mx-auto space-y-2">
        <OnboardingPrimaryButton onClick={onStart} icon={<ArrowRight className="w-4 h-4" />}>
          Get Started
        </OnboardingPrimaryButton>
        <p className="text-[11px] text-center text-[#536675]">
          Takes about 2 minutes to personalize your experience
        </p>
      </footer>
    </div>
  );
}
