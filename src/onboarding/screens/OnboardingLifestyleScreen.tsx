import { ReactNode } from 'react';
import { Footprints, Dumbbell, Zap, Bike } from 'lucide-react';
import { 
  OnboardingScaffold, 
  OnboardingSelectionCard, 
  OnboardingOptionChip, 
  OnboardingPrimaryButton,
  OnboardingStickyFooter 
} from '../components/OnboardingComponents';
import { ActivityLevelType } from '../OnboardingTypes';

interface Props {
  activityLevel: ActivityLevelType;
  preferredActivities: string[];
  onChangeActivityLevel: (level: ActivityLevelType) => void;
  onToggleActivity: (activity: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingLifestyleScreen({
  activityLevel,
  preferredActivities,
  onChangeActivityLevel,
  onToggleActivity,
  onNext,
  onBack,
}: Props) {
  const levels: {
    id: ActivityLevelType;
    title: string;
    description: string;
    icon: ReactNode;
  }[] = [
    {
      id: 'Sedentary',
      title: 'Sedentary',
      description: 'Mostly sitting during work, minimal structured movement during the week.',
      icon: <Footprints className="w-4 h-4" />,
    },
    {
      id: 'Lightly Active',
      title: 'Lightly Active',
      description: 'Light daily walking, casual strolling, or 1–2 light workouts per week.',
      icon: <Bike className="w-4 h-4" />,
    },
    {
      id: 'Moderately Active',
      title: 'Moderately Active',
      description: 'Consistent movement, active days, or structured workouts 3–5 days per week.',
      icon: <Dumbbell className="w-4 h-4" />,
    },
    {
      id: 'Very Active',
      title: 'Very Active',
      description: 'Physically demanding job or vigorous athletic training 6+ days per week.',
      icon: <Zap className="w-4 h-4" />,
    },
  ];

  const activityOptions = [
    'Daily Walking',
    'Strength Training',
    'Running / Jogging',
    'HIIT & Intervals',
    'Yoga & Stretching',
    'Cycling',
    'Swimming',
    'Pilates',
  ];

  return (
    <OnboardingScaffold
      onBack={onBack}
      stepCurrent={4}
      stepTotal={8}
      title="Lifestyle & Daily Movement"
      subtitle="Your baseline activity helps calculate realistic calorie expenditure and step suggestions."
    >
      <div className="space-y-5 pb-6">
        {/* Activity Level Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#12324A] uppercase tracking-wider block">
            Current Baseline Activity
          </label>
          <div className="space-y-2.5">
            {levels.map((lvl) => (
              <div key={lvl.id}>
                <OnboardingSelectionCard
                  title={lvl.title}
                  description={lvl.description}
                  icon={lvl.icon}
                  selected={activityLevel === lvl.id}
                  onClick={() => onChangeActivityLevel(lvl.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Movement Preferences */}
        <div className="space-y-2.5 pt-2">
          <label className="text-xs font-bold text-[#12324A] uppercase tracking-wider block">
            Preferred Forms of Movement (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {activityOptions.map((act) => {
              const isSelected = preferredActivities.includes(act);
              return (
                <div key={act}>
                  <OnboardingOptionChip
                    label={act}
                    selected={isSelected}
                    onClick={() => onToggleActivity(act)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <OnboardingStickyFooter>
        <OnboardingPrimaryButton onClick={onNext} disabled={!activityLevel}>
          Continue
        </OnboardingPrimaryButton>
      </OnboardingStickyFooter>
    </OnboardingScaffold>
  );
}
