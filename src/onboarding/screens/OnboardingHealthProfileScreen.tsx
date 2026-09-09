import React, { useState } from 'react';
import { Scale, Target, TrendingDown, Info } from 'lucide-react';
import { 
  OnboardingScaffold, 
  OnboardingTextField, 
  OnboardingPrimaryButton,
  OnboardingStickyFooter 
} from '../components/OnboardingComponents';

interface Props {
  initialData: {
    currentWeightLb: number;
    goalWeightLb: number;
    targetPace: string;
    units: 'imperial' | 'metric';
  };
  onNext: (data: {
    currentWeightLb: number;
    goalWeightLb: number;
    targetPace: string;
  }) => void;
  onBack: () => void;
}

export function OnboardingHealthProfileScreen({
  initialData,
  onNext,
  onBack,
}: Props) {
  const [unit, setUnit] = useState<'lb' | 'kg'>(initialData.units === 'metric' ? 'kg' : 'lb');

  // Convert for display
  const toDisplay = (lb: number) => (unit === 'kg' ? Math.round(lb * 0.453592 * 10) / 10 : lb);
  const toLb = (val: number) => (unit === 'kg' ? Math.round(val / 0.453592 * 10) / 10 : val);

  const [currentVal, setCurrentVal] = useState<number>(toDisplay(initialData.currentWeightLb || 165));
  const [goalVal, setGoalVal] = useState<number>(toDisplay(initialData.goalWeightLb || 150));
  const [targetPace, setTargetPace] = useState(initialData.targetPace || '1 lb / week');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUnitToggle = (newUnit: 'lb' | 'kg') => {
    if (newUnit === unit) return;
    if (newUnit === 'kg') {
      setCurrentVal(Math.round(currentVal * 0.453592 * 10) / 10);
      setGoalVal(Math.round(goalVal * 0.453592 * 10) / 10);
    } else {
      setCurrentVal(Math.round(currentVal / 0.453592 * 10) / 10);
      setGoalVal(Math.round(goalVal / 0.453592 * 10) / 10);
    }
    setUnit(newUnit);
  };

  const handleContinue = () => {
    const errs: Record<string, string> = {};
    const finalCurrentLb = toLb(currentVal);
    const finalGoalLb = toLb(goalVal);

    if (!currentVal || finalCurrentLb < 50 || finalCurrentLb > 700) {
      errs.current = `Please enter a valid weight (50-700 lb / 23-318 kg)`;
    }

    if (!goalVal || finalGoalLb < 50 || finalGoalLb > 700) {
      errs.goal = `Please enter a valid goal weight`;
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    onNext({
      currentWeightLb: finalCurrentLb,
      goalWeightLb: finalGoalLb,
      targetPace,
    });
  };

  const paceOptions = [
    { label: '0.5 lb / week', sub: 'Gentle & steady' },
    { label: '1 lb / week', sub: 'Recommended for sustainability' },
    { label: '1.5 lb / week', sub: 'Focused deficit' },
    { label: '2 lb / week', sub: 'Intensive pace' },
  ];

  return (
    <OnboardingScaffold
      onBack={onBack}
      stepCurrent={2}
      stepTotal={8}
      title="Basic Health Profile"
      subtitle="Establish your baseline weight metrics. These values are saved directly into your weight tracker settings."
    >
      <div className="space-y-5 pb-6">
        {/* Unit Selector */}
        <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-[#DCE7EE]">
          <span className="text-xs font-bold text-[#12324A]">Preferred Weight Unit</span>
          <div className="flex items-center bg-[#EAF5FB] p-0.5 rounded-xl border border-[#DCE7EE]">
            <button
              type="button"
              onClick={() => handleUnitToggle('lb')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                unit === 'lb'
                  ? 'bg-white text-[#1769AA] shadow-2xs'
                  : 'text-[#536675]'
              }`}
            >
              Pounds (lb)
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('kg')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                unit === 'kg'
                  ? 'bg-white text-[#1769AA] shadow-2xs'
                  : 'text-[#536675]'
              }`}
            >
              Kilograms (kg)
            </button>
          </div>
        </div>

        {/* Current Weight */}
        <OnboardingTextField
          label="Current Measured Weight"
          type="number"
          step="0.1"
          value={currentVal || ''}
          onChange={(e) => {
            setCurrentVal(parseFloat(e.target.value) || 0);
            if (errors.current) setErrors((prev) => ({ ...prev, current: '' }));
          }}
          suffix={unit}
          error={errors.current}
          helperText="Baseline for your deficit calculations"
        />

        {/* Goal Weight */}
        <OnboardingTextField
          label="Target Goal Weight"
          type="number"
          step="0.1"
          value={goalVal || ''}
          onChange={(e) => {
            setGoalVal(parseFloat(e.target.value) || 0);
            if (errors.goal) setErrors((prev) => ({ ...prev, goal: '' }));
          }}
          suffix={unit}
          error={errors.goal}
          helperText="Target sustainable weight"
        />

        {/* Target Pace */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#12324A] uppercase tracking-wider block">
            Target Weight Pace
          </label>
          <div className="grid grid-cols-1 gap-2">
            {paceOptions.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setTargetPace(p.label)}
                className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  targetPace === p.label
                    ? 'bg-[#EAF5FB] border-[#1769AA] ring-1 ring-[#1769AA]/30'
                    : 'bg-white border-[#DCE7EE] hover:border-[#4DA3D9]'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#12324A]">{p.label}</div>
                  <div className="text-[11px] text-[#536675]">{p.sub}</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    targetPace === p.label
                      ? 'border-[#1769AA] bg-[#1769AA]'
                      : 'border-[#DCE7EE]'
                  }`}
                >
                  {targetPace === p.label && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Architecture Architecture Note */}
        <div className="p-3 bg-[#F7FAFC] rounded-2xl border border-[#DCE7EE] flex items-start gap-2.5 text-[11px] text-[#536675] leading-relaxed">
          <Info className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
          <span>
            Measured weights are recorded in your personal Weight Loss module. Shared identity metrics (like height and age) remain distinct.
          </span>
        </div>
      </div>

      <OnboardingStickyFooter>
        <OnboardingPrimaryButton onClick={handleContinue}>
          Continue
        </OnboardingPrimaryButton>
      </OnboardingStickyFooter>
    </OnboardingScaffold>
  );
}
