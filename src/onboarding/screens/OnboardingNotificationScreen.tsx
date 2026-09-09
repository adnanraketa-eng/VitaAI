import { ReactNode } from 'react';
import { Bell, Droplets, TrendingUp, Sparkles } from 'lucide-react';
import { 
  OnboardingScaffold, 
  OnboardingPrimaryButton,
  OnboardingStickyFooter 
} from '../components/OnboardingComponents';

interface NotificationSettings {
  dailyReminders: boolean;
  hydrationAlerts: boolean;
  weeklyProgress: boolean;
  aiCoachCheckin: boolean;
}

interface Props {
  notifications: NotificationSettings;
  onToggleNotification: (key: keyof NotificationSettings) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingNotificationScreen({
  notifications,
  onToggleNotification,
  onNext,
  onBack,
}: Props) {
  const items: {
    key: keyof NotificationSettings;
    title: string;
    description: string;
    icon: ReactNode;
  }[] = [
    {
      key: 'dailyReminders',
      title: 'Daily Meal & Habit Reminders',
      description: 'Gentle prompts around meal times and evening check-ins.',
      icon: <Bell className="w-4 h-4 text-[#1769AA]" />,
    },
    {
      key: 'hydrationAlerts',
      title: 'Hydration Nudges',
      description: 'Reminders spaced throughout the day to meet your water target.',
      icon: <Droplets className="w-4 h-4 text-[#39A982]" />,
    },
    {
      key: 'weeklyProgress',
      title: 'Weekly Progress Review',
      description: 'A weekly snapshot of your deficit, consistency, and weight trends.',
      icon: <TrendingUp className="w-4 h-4 text-[#E8A23A]" />,
    },
    {
      key: 'aiCoachCheckin',
      title: 'AI Coach Check-ins',
      description: 'Occasional encouraging insights and high-protein suggestions.',
      icon: <Sparkles className="w-4 h-4 text-[#1769AA]" />,
    },
  ];

  return (
    <OnboardingScaffold
      onBack={onBack}
      stepCurrent={7}
      stepTotal={8}
      title="Notification Preferences"
      subtitle="Stay consistent with optional, respectful reminders. You can alter these anytime in Profile Settings."
    >
      <div className="space-y-3 pb-6">
        {items.map((item) => {
          const enabled = notifications[item.key];
          return (
            <div
              key={item.key}
              onClick={() => onToggleNotification(item.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                enabled
                  ? 'bg-white border-[#DCE7EE] shadow-2xs'
                  : 'bg-[#F7FAFC] border-[#DCE7EE]/70 opacity-70'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF5FB] flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#12324A]">{item.title}</h3>
                  <p className="text-[11px] text-[#536675] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div
                className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 flex items-center ${
                  enabled ? 'bg-[#1769AA]' : 'bg-[#DCE7EE]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <OnboardingStickyFooter>
        <OnboardingPrimaryButton onClick={onNext}>
          Continue to Review
        </OnboardingPrimaryButton>
      </OnboardingStickyFooter>
    </OnboardingScaffold>
  );
}
