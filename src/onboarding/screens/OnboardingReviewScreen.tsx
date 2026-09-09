import { User, Scale, Target, Activity, Utensils, Edit3, ShieldCheck } from 'lucide-react';
import { 
  OnboardingScaffold, 
  OnboardingPrimaryButton,
  OnboardingStickyFooter 
} from '../components/OnboardingComponents';
import { OnboardingData } from '../OnboardingTypes';

interface Props {
  data: OnboardingData;
  onEditSection: (stepNumber: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function OnboardingReviewScreen({
  data,
  onEditSection,
  onSubmit,
  onBack,
  isSubmitting = false,
}: Props) {
  const goalLabelMap: Record<string, string> = {
    weight_loss: 'Weight Loss & Calorie Deficit',
    weight_management: 'Weight Management',
    diabetes_awareness: 'Diabetes Awareness & Glycemic Balance',
    cancer_awareness: 'Cancer Awareness & Preventative Health',
  };

  return (
    <OnboardingScaffold
      onBack={onBack}
      stepCurrent={8}
      stepTotal={8}
      title="Review Your Profile"
      subtitle="Verify your shared personal details and initial targets before entering VitaAI."
    >
      <div className="space-y-4 pb-6">
        {/* Card 1: Shared Profile Details */}
        <div className="bg-white rounded-2xl border border-[#DCE7EE] p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#12324A] uppercase tracking-wider">
                Personal Identity (Shared)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(1)}
              className="text-xs font-bold text-[#1769AA] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#DCE7EE]/60">
            <div>
              <span className="text-[10px] text-[#536675] block">Full Name</span>
              <span className="font-bold text-[#12324A]">{data.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#536675] block">Email</span>
              <span className="font-semibold text-[#12324A] truncate block max-w-[130px]">
                {data.email}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#536675] block">DOB / Age</span>
              <span className="font-semibold text-[#12324A]">
                {data.dob} ({data.age} yrs)
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#536675] block">Gender / Height</span>
              <span className="font-semibold text-[#12324A]">
                {data.gender} · {data.heightCm} cm
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Primary Goal & Baseline Weight */}
        <div className="bg-white rounded-2xl border border-[#DCE7EE] p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#12324A] uppercase tracking-wider">
                Primary Goal & Weight Target
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(2)}
              className="text-xs font-bold text-[#1769AA] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-2 text-xs pt-1 border-t border-[#DCE7EE]/60">
            <div>
              <span className="text-[10px] text-[#536675] block">Active Focus</span>
              <span className="font-bold text-[#12324A]">
                {goalLabelMap[data.primaryGoal] || data.primaryGoal}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-[#536675] block">Current</span>
                <span className="font-bold text-[#12324A]">{data.currentWeightLb} lb</span>
              </div>
              <div>
                <span className="text-[10px] text-[#536675] block">Goal</span>
                <span className="font-bold text-[#39A982]">{data.goalWeightLb} lb</span>
              </div>
              <div>
                <span className="text-[10px] text-[#536675] block">Pace</span>
                <span className="font-semibold text-[#12324A]">{data.targetPace}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Lifestyle & Nutrition Targets */}
        <div className="bg-white rounded-2xl border border-[#DCE7EE] p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#FFF5E5] text-[#E8A23A] flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#12324A] uppercase tracking-wider">
                Everyday Targets
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onEditSection(5)}
              className="text-xs font-bold text-[#1769AA] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 border-t border-[#DCE7EE]/60">
            <div>
              <span className="text-[10px] text-[#536675] block">Daily Calorie Target</span>
              <span className="font-bold text-[#12324A]">{data.dailyCalorieGoalKcal} kcal</span>
            </div>
            <div>
              <span className="text-[10px] text-[#536675] block">Protein Target</span>
              <span className="font-bold text-[#12324A]">{data.dailyProteinGoalG} g</span>
            </div>
            <div>
              <span className="text-[10px] text-[#536675] block">Daily Step Goal</span>
              <span className="font-bold text-[#12324A]">{data.dailyStepGoal.toLocaleString()} steps</span>
            </div>
            <div>
              <span className="text-[10px] text-[#536675] block">Daily Hydration</span>
              <span className="font-bold text-[#12324A]">{data.dailyWaterGoalL} L</span>
            </div>
          </div>
        </div>

        {/* Security assurance */}
        <div className="p-3 bg-[#EAF8F2] rounded-2xl border border-[#39A982]/20 flex items-center gap-2.5 text-[11px] text-[#12324A]">
          <ShieldCheck className="w-4 h-4 text-[#39A982] shrink-0" />
          <span>
            Your shared profile and module settings will be initialized upon completion.
          </span>
        </div>
      </div>

      <OnboardingStickyFooter>
        <OnboardingPrimaryButton
          onClick={onSubmit}
          loading={isSubmitting}
        >
          Complete Setup
        </OnboardingPrimaryButton>
      </OnboardingStickyFooter>
    </OnboardingScaffold>
  );
}
