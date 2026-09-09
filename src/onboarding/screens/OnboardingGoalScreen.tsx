import { ReactNode } from 'react';
import { Flame, ShieldCheck, Activity, Heart } from 'lucide-react';
import { 
  OnboardingScaffold, 
  OnboardingSelectionCard, 
  OnboardingPrimaryButton,
  OnboardingStickyFooter 
} from '../components/OnboardingComponents';
import { PrimaryGoalType } from '../OnboardingTypes';

interface Props {
  selectedGoal: PrimaryGoalType;
  onSelectGoal: (goal: PrimaryGoalType) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingGoalScreen({
  selectedGoal,
  onSelectGoal,
  onNext,
  onBack,
}: Props) {
  const goals: {
    id: PrimaryGoalType;
    title: string;
    description: string;
    badge?: string;
    icon: ReactNode;
  }[] = [
    {
      id: 'weight_loss',
      title: 'Weight Loss & Calorie Deficit',
      description: 'Build healthy habits, manage calorie deficit, hit protein targets, and achieve a sustainable weight.',
      badge: 'Most Popular',
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: 'weight_management',
      title: 'Weight Management & Maintenance',
      description: 'Maintain a stable weight routine, sustain daily nutrition balance, and track everyday wellness.',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: 'diabetes_awareness',
      title: 'Diabetes Awareness & Glycemic Balance',
      description: 'Focus on blood sugar insights, steady carb distribution, meal mindfulness, and metabolic balance.',
      badge: 'Specialized',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      id: 'cancer_awareness',
      title: 'Cancer Awareness & Preventative Health',
      description: 'Stay proactive with lifestyle factors, preventative screenings, anti-inflammatory nutrition, and vitality.',
      badge: 'Preventative',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
  ];

  return (
    <OnboardingScaffold
      onBack={onBack}
      stepCurrent={3}
      stepTotal={8}
      title="Choose the goal that matters most right now"
      subtitle="VitaAI personalizes your experience around your immediate priority. You can switch or explore modules anytime."
    >
      <div className="space-y-3 pb-6">
        {goals.map((g) => (
          <div key={g.id}>
            <OnboardingSelectionCard
              title={g.title}
              description={g.description}
              badge={g.badge}
              icon={g.icon}
              selected={selectedGoal === g.id}
              onClick={() => onSelectGoal(g.id)}
            />
          </div>
        ))}
      </div>

      <OnboardingStickyFooter>
        <OnboardingPrimaryButton
          onClick={onNext}
          disabled={!selectedGoal}
        >
          Continue
        </OnboardingPrimaryButton>
      </OnboardingStickyFooter>
    </OnboardingScaffold>
  );
}
