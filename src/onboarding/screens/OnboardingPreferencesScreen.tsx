import { Utensils } from 'lucide-react';
import { 
  OnboardingScaffold, 
  OnboardingOptionChip, 
  OnboardingPrimaryButton,
  OnboardingStickyFooter 
} from '../components/OnboardingComponents';

interface Props {
  dietaryPreference: string;
  dietaryRestrictions: string[];
  onSelectPreference: (pref: string) => void;
  onToggleRestriction: (res: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingPreferencesScreen({
  dietaryPreference,
  dietaryRestrictions,
  onSelectPreference,
  onToggleRestriction,
  onNext,
  onBack,
}: Props) {
  const dietaryOptions = [
    'Balanced / Omnivore',
    'High-Protein Focused',
    'Vegetarian',
    'Vegan',
    'Pescatarian',
    'Mediterranean',
    'Low-Carb',
  ];

  const restrictionsList = [
    'None',
    'Gluten-Free',
    'Dairy-Free',
    'Nut Allergy',
    'Shellfish-Free',
    'Low-Sodium',
    'Egg-Free',
  ];

  return (
    <OnboardingScaffold
      onBack={onBack}
      stepCurrent={5}
      stepTotal={8}
      title="Nutrition & Food Preferences"
      subtitle="Help VitaAI suggest relevant meal ideas and macro splits that fit your personal way of eating."
    >
      <div className="space-y-6 pb-6">
        {/* Primary Dietary Style */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-[#12324A] uppercase tracking-wider block">
            Primary Nutritional Focus
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {dietaryOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onSelectPreference(opt)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                  dietaryPreference === opt
                    ? 'bg-[#EAF5FB] text-[#1769AA] border-[#1769AA] ring-1 ring-[#1769AA]/30'
                    : 'bg-white text-[#12324A] border-[#DCE7EE] hover:border-[#4DA3D9]'
                }`}
              >
                <span>{opt}</span>
                {dietaryPreference === opt && (
                  <div className="w-2 h-2 rounded-full bg-[#1769AA]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Sensitivities / Restrictions */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-[#12324A] uppercase tracking-wider block">
            Dietary Considerations & Allergens
          </label>
          <div className="flex flex-wrap gap-2">
            {restrictionsList.map((res) => {
              const isSelected = dietaryRestrictions.includes(res);
              return (
                <div key={res}>
                  <OnboardingOptionChip
                    label={res}
                    selected={isSelected}
                    onClick={() => onToggleRestriction(res)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Nutritional Guidance Note */}
        <div className="p-3.5 bg-[#F7FAFC] rounded-2xl border border-[#DCE7EE] flex items-start gap-2.5 text-[11px] text-[#536675] leading-relaxed">
          <Utensils className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
          <span>
            Dietary choices are saved to your Weight Loss nutrition settings. VitaAI does not provide medical dietary prescriptions; discuss personal allergies with your clinician.
          </span>
        </div>
      </div>

      <OnboardingStickyFooter>
        <OnboardingPrimaryButton onClick={onNext} disabled={!dietaryPreference}>
          Continue
        </OnboardingPrimaryButton>
      </OnboardingStickyFooter>
    </OnboardingScaffold>
  );
}
