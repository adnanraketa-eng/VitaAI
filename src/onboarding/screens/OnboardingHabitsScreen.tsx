import { useState } from 'react';
import { Footprints, Droplets, Flame, Beef } from 'lucide-react';
import { 
  OnboardingScaffold, 
  OnboardingPrimaryButton,
  OnboardingStickyFooter 
} from '../components/OnboardingComponents';

interface Props {
  initialHabits: {
    dailyStepGoal: number;
    dailyWaterGoalL: number;
    dailyCalorieGoalKcal: number;
    dailyProteinGoalG: number;
  };
  onNext: (habits: {
    dailyStepGoal: number;
    dailyWaterGoalL: number;
    dailyCalorieGoalKcal: number;
    dailyProteinGoalG: number;
  }) => void;
  onBack: () => void;
}

export function OnboardingHabitsScreen({
  initialHabits,
  onNext,
  onBack,
}: Props) {
  const [steps, setSteps] = useState(initialHabits.dailyStepGoal || 8500);
  const [water, setWater] = useState(initialHabits.dailyWaterGoalL || 2.5);
  const [calories, setCalories] = useState(initialHabits.dailyCalorieGoalKcal || 1850);
  const [protein, setProtein] = useState(initialHabits.dailyProteinGoalG || 120);

  const stepOptions = [6000, 8500, 10000, 12000];
  const waterOptions = [2.0, 2.5, 3.0, 3.5];
  const proteinOptions = [90, 110, 125, 145];

  return (
    <OnboardingScaffold
      onBack={onBack}
      stepCurrent={6}
      stepTotal={8}
      title="Daily Habit Targets"
      subtitle="Select initial everyday targets. You can fine-tune these anytime inside your settings."
    >
      <div className="space-y-5 pb-6">
        {/* Daily Steps */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE7EE] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center">
                <Footprints className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#12324A] block">Daily Step Goal</span>
                <span className="text-[10px] text-[#536675]">Sustainable movement</span>
              </div>
            </div>
            <span className="text-sm font-extrabold text-[#1769AA]">
              {steps.toLocaleString()} steps
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {stepOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSteps(s)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  steps === s
                    ? 'bg-[#1769AA] text-white border-[#1769AA] shadow-2xs'
                    : 'bg-white text-[#12324A] border-[#DCE7EE] hover:border-[#4DA3D9]'
                }`}
              >
                {s >= 1000 ? `${s / 1000}k` : s}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Hydration */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE7EE] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#12324A] block">Daily Water Goal</span>
                <span className="text-[10px] text-[#536675]">Fluid intake & hydration</span>
              </div>
            </div>
            <span className="text-sm font-extrabold text-[#39A982]">{water} L</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {waterOptions.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWater(w)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  water === w
                    ? 'bg-[#39A982] text-white border-[#39A982] shadow-2xs'
                    : 'bg-white text-[#12324A] border-[#DCE7EE] hover:border-[#39A982]/50'
                }`}
              >
                {w} L
              </button>
            ))}
          </div>
        </div>

        {/* Daily Calorie Intake */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE7EE] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFF5E5] text-[#E8A23A] flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#12324A] block">Calorie Target</span>
                <span className="text-[10px] text-[#536675]">Deficit budget</span>
              </div>
            </div>
            <span className="text-sm font-extrabold text-[#E8A23A]">{calories} kcal</span>
          </div>

          <input
            type="range"
            min="1200"
            max="3200"
            step="50"
            value={calories}
            onChange={(e) => setCalories(Number(e.target.value))}
            className="w-full accent-[#E8A23A] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-semibold text-[#536675]">
            <span>1,200 kcal</span>
            <span>2,000 kcal</span>
            <span>3,200 kcal</span>
          </div>
        </div>

        {/* Daily Protein Target */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE7EE] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center">
                <Beef className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#12324A] block">Daily Protein</span>
                <span className="text-[10px] text-[#536675]">Satiety & lean tissue retention</span>
              </div>
            </div>
            <span className="text-sm font-extrabold text-[#1769AA]">{protein} g</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {proteinOptions.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProtein(p)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  protein === p
                    ? 'bg-[#1769AA] text-white border-[#1769AA] shadow-2xs'
                    : 'bg-white text-[#12324A] border-[#DCE7EE] hover:border-[#4DA3D9]'
                }`}
              >
                {p} g
              </button>
            ))}
          </div>
        </div>
      </div>

      <OnboardingStickyFooter>
        <OnboardingPrimaryButton
          onClick={() =>
            onNext({
              dailyStepGoal: steps,
              dailyWaterGoalL: water,
              dailyCalorieGoalKcal: calories,
              dailyProteinGoalG: protein,
            })
          }
        >
          Continue
        </OnboardingPrimaryButton>
      </OnboardingStickyFooter>
    </OnboardingScaffold>
  );
}
