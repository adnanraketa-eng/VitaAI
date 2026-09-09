import { useState } from 'react';
import { OnboardingData, PrimaryGoalType, ActivityLevelType } from './OnboardingTypes';
import { OnboardingRepository } from './OnboardingRepository';
import { OnboardingWelcomeScreen } from './screens/OnboardingWelcomeScreen';
import { OnboardingPersonalDetailsScreen } from './screens/OnboardingPersonalDetailsScreen';
import { OnboardingHealthProfileScreen } from './screens/OnboardingHealthProfileScreen';
import { OnboardingGoalScreen } from './screens/OnboardingGoalScreen';
import { OnboardingLifestyleScreen } from './screens/OnboardingLifestyleScreen';
import { OnboardingPreferencesScreen } from './screens/OnboardingPreferencesScreen';
import { OnboardingHabitsScreen } from './screens/OnboardingHabitsScreen';
import { OnboardingNotificationScreen } from './screens/OnboardingNotificationScreen';
import { OnboardingReviewScreen } from './screens/OnboardingReviewScreen';
import { OnboardingCompleteScreen } from './screens/OnboardingCompleteScreen';

interface Props {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingFlow({ onComplete }: Props) {
  // Step numbers:
  // 0: Welcome
  // 1: Personal Details
  // 2: Basic Health Profile (Weight)
  // 3: Primary Goal
  // 4: Lifestyle / Activity
  // 5: Preferences (Nutrition)
  // 6: Daily Habits
  // 7: Notification Preferences
  // 8: Review
  // 9: Complete
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize from any saved draft or sensible baseline
  const [formData, setFormData] = useState<OnboardingData>(() => {
    const draft = OnboardingRepository.getOnboardingDraft();
    return {
      fullName: draft?.fullName || 'Maya Patel',
      email: draft?.email || 'maya.patel@email.com',
      dob: draft?.dob || '1992-09-14',
      age: draft?.age || 32,
      gender: draft?.gender || 'Woman',
      heightCm: draft?.heightCm || 168,
      units: draft?.units || 'imperial',

      currentWeightLb: draft?.currentWeightLb || 164.2,
      goalWeightLb: draft?.goalWeightLb || 145,
      targetPace: draft?.targetPace || '1 lb / week',

      primaryGoal: draft?.primaryGoal || 'weight_loss',

      activityLevel: draft?.activityLevel || 'Moderately Active',
      preferredActivities: draft?.preferredActivities || ['Daily Walking', 'Strength Training'],

      dietaryPreference: draft?.dietaryPreference || 'High-Protein Focused',
      dietaryRestrictions: draft?.dietaryRestrictions || ['None'],

      dailyStepGoal: draft?.dailyStepGoal || 8500,
      dailyWaterGoalL: draft?.dailyWaterGoalL || 2.5,
      dailyCalorieGoalKcal: draft?.dailyCalorieGoalKcal || 1850,
      dailyProteinGoalG: draft?.dailyProteinGoalG || 120,

      notifications: draft?.notifications || {
        dailyReminders: true,
        hydrationAlerts: true,
        weeklyProgress: true,
        aiCoachCheckin: true,
      },
    };
  });

  const updateFormData = (patch: Partial<OnboardingData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...patch };
      OnboardingRepository.saveDraft(updated);
      return updated;
    });
  };

  const handlePersonalDetailsNext = (data: {
    fullName: string;
    email: string;
    dob: string;
    age: number;
    gender: string;
    heightCm: number;
  }) => {
    updateFormData(data);
    setCurrentStep(2);
  };

  const handleHealthProfileNext = (data: {
    currentWeightLb: number;
    goalWeightLb: number;
    targetPace: string;
  }) => {
    updateFormData(data);
    setCurrentStep(3);
  };

  const handleGoalNext = () => {
    setCurrentStep(4);
  };

  const handleLifestyleNext = () => {
    setCurrentStep(5);
  };

  const handlePreferencesNext = () => {
    setCurrentStep(6);
  };

  const handleHabitsNext = (habits: {
    dailyStepGoal: number;
    dailyWaterGoalL: number;
    dailyCalorieGoalKcal: number;
    dailyProteinGoalG: number;
  }) => {
    updateFormData(habits);
    setCurrentStep(7);
  };

  const handleNotificationsNext = () => {
    setCurrentStep(8);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Persist final onboarding completion
      OnboardingRepository.completeOnboarding(formData);
      setCurrentStep(9);
    } catch (e) {
      console.error('Error completing onboarding', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onComplete(formData);
  };

  // Render active step
  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#F7FAFC]">
      {currentStep === 0 && (
        <OnboardingWelcomeScreen onStart={() => setCurrentStep(1)} />
      )}

      {currentStep === 1 && (
        <OnboardingPersonalDetailsScreen
          initialData={{
            fullName: formData.fullName,
            email: formData.email,
            dob: formData.dob,
            gender: formData.gender,
            heightCm: formData.heightCm,
            units: formData.units,
          }}
          onNext={handlePersonalDetailsNext}
          onBack={() => setCurrentStep(0)}
        />
      )}

      {currentStep === 2 && (
        <OnboardingHealthProfileScreen
          initialData={{
            currentWeightLb: formData.currentWeightLb,
            goalWeightLb: formData.goalWeightLb,
            targetPace: formData.targetPace,
            units: formData.units,
          }}
          onNext={handleHealthProfileNext}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <OnboardingGoalScreen
          selectedGoal={formData.primaryGoal}
          onSelectGoal={(g: PrimaryGoalType) => updateFormData({ primaryGoal: g })}
          onNext={handleGoalNext}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <OnboardingLifestyleScreen
          activityLevel={formData.activityLevel}
          preferredActivities={formData.preferredActivities}
          onChangeActivityLevel={(lvl: ActivityLevelType) =>
            updateFormData({ activityLevel: lvl })
          }
          onToggleActivity={(act: string) => {
            const current = formData.preferredActivities;
            const updated = current.includes(act)
              ? current.filter((a) => a !== act)
              : [...current, act];
            updateFormData({ preferredActivities: updated });
          }}
          onNext={handleLifestyleNext}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && (
        <OnboardingPreferencesScreen
          dietaryPreference={formData.dietaryPreference}
          dietaryRestrictions={formData.dietaryRestrictions}
          onSelectPreference={(pref: string) =>
            updateFormData({ dietaryPreference: pref })
          }
          onToggleRestriction={(res: string) => {
            if (res === 'None') {
              updateFormData({ dietaryRestrictions: ['None'] });
              return;
            }
            const current = formData.dietaryRestrictions.filter((r) => r !== 'None');
            const updated = current.includes(res)
              ? current.filter((r) => r !== res)
              : [...current, res];
            updateFormData({
              dietaryRestrictions: updated.length === 0 ? ['None'] : updated,
            });
          }}
          onNext={handlePreferencesNext}
          onBack={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 6 && (
        <OnboardingHabitsScreen
          initialHabits={{
            dailyStepGoal: formData.dailyStepGoal,
            dailyWaterGoalL: formData.dailyWaterGoalL,
            dailyCalorieGoalKcal: formData.dailyCalorieGoalKcal,
            dailyProteinGoalG: formData.dailyProteinGoalG,
          }}
          onNext={handleHabitsNext}
          onBack={() => setCurrentStep(5)}
        />
      )}

      {currentStep === 7 && (
        <OnboardingNotificationScreen
          notifications={formData.notifications}
          onToggleNotification={(k) =>
            updateFormData({
              notifications: {
                ...formData.notifications,
                [k]: !formData.notifications[k],
              },
            })
          }
          onNext={handleNotificationsNext}
          onBack={() => setCurrentStep(6)}
        />
      )}

      {currentStep === 8 && (
        <OnboardingReviewScreen
          data={formData}
          onEditSection={(stepNum) => setCurrentStep(stepNum)}
          onSubmit={handleSubmit}
          onBack={() => setCurrentStep(7)}
          isSubmitting={isSubmitting}
        />
      )}

      {currentStep === 9 && (
        <OnboardingCompleteScreen data={formData} onFinish={handleFinish} />
      )}
    </div>
  );
}
