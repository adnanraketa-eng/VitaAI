import { useState, useEffect } from 'react';
import { BottomTab, ActiveModule, UserSharedProfile, WeightLossSettings } from './types';
import { BottomNavigation } from './components/BottomNavigation';
import { WLHome } from './weight-loss/home/WLHome';
import { WLHistory } from './weight-loss/history/WLHistory';
import { WLProgress } from './weight-loss/progress/WLProgress';
import { WLCoach } from './weight-loss/coach/WLCoach';
import { WLProfile } from './weight-loss/profile/WLProfile';
import { WLRepository } from './weight-loss/data/WLRepository';
import { ProfileScreen } from './profile/ProfileScreen';
import { CancerHomeScreen } from './cancer-awareness/home/CancerHomeScreen';
import { CancerHistoryScreen } from './cancer-awareness/history/CancerHistoryScreen';
import { CancerProgressScreen } from './cancer-awareness/progress/CancerProgressScreen';
import { CancerCoachScreen } from './cancer-awareness/coach/CancerCoachScreen';
import { CancerAwarenessSettings } from './cancer-awareness/types';
import { DiabetesHomeScreen } from './diabetes-awareness/home/DiabetesHomeScreen';
import { DiabetesHistoryScreen } from './diabetes-awareness/history/DiabetesHistoryScreen';
import { DiabetesProgressScreen } from './diabetes-awareness/progress/DiabetesProgressScreen';
import { DiabetesCoachScreen } from './diabetes-awareness/coach/DiabetesCoachScreen';
import { DiabetesAwarenessSettings } from './diabetes-awareness/types';
import { OnboardingFlow } from './onboarding/OnboardingFlow';
import { OnboardingRepository } from './onboarding/OnboardingRepository';
import { OnboardingData } from './onboarding/OnboardingTypes';

export default function App() {
  const [activeTab, setActiveTab] = useState<BottomTab>('home');
  const [activeModule, setActiveModule] = useState<ActiveModule>('weight_loss');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() =>
    OnboardingRepository.isOnboardingCompleted()
  );

  useEffect(() => {
    let isMounted = true;
    OnboardingRepository.checkOnboardingCompleted().then((completed) => {
      if (isMounted && completed) {
        setIsOnboarded(true);
      }
    }).catch(() => {
      // Fail closed to uncompleted state
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // One shared profile across all modules
  const [sharedProfile, setSharedProfile] = useState<UserSharedProfile>({
    fullName: 'Maya Patel',
    email: 'maya.patel@email.com',
    avatarUrl: '',
    dob: '14 Sep 1992',
    age: 32,
    gender: 'Woman',
    heightCm: 168,
    memberSince: 'May 15, 2024',
    streakDays: 7,
    units: 'imperial'
  });

  // Diabetes Awareness settings (isolated)
  const [diabetesSettings, setDiabetesSettings] = useState<DiabetesAwarenessSettings>({
    glucoseTargetRange: '70–180 mg/dL',
    glucoseLoggingReminder: 'Daily',
    mealLoggingReminder: 'Daily',
    dailyWaterGoalL: 2.4,
    dailyActivityGoalMin: 30,
    preferredGlucoseUnits: 'mg/dL'
  });

  // Cancer Awareness settings (isolated)
  const [cancerSettings, setCancerSettings] = useState<CancerAwarenessSettings>({
    screeningReminders: 'Every 6 months',
    screeningHistory: 'Not specified',
    familyHistory: 'Not specified',
    riskFactors: 'Not specified',
    lifestyleGoal: 'Maintain a healthy weight',
    reminderFrequency: 'Every 6 months'
  });

  // Weight Loss settings (isolated)
  const [weightLossSettings, setWeightLossSettings] = useState<WeightLossSettings>({
    currentWeightLb: 164.2,
    goalWeightLb: 145,
    startWeightLb: 172.5,
    targetPace: '1 lb / week',
    activityLevel: 'Moderate',
    dailyStepGoal: 8500,
    dailyWaterGoalL: 2.5,
    dailyCalorieGoalKcal: 1850,
    dailyProteinGoalG: 120,
    dietaryPreferences: ['High-protein', 'Balanced']
  });

  const isCancerAwareness = activeModule === 'cancer_awareness';
  const isDiabetesAwareness = activeModule === 'diabetes_awareness';

  const handleOnboardingComplete = (data: OnboardingData) => {
    setSharedProfile((prev) => ({
      ...prev,
      fullName: data.fullName,
      email: data.email,
      dob: data.dob,
      age: data.age,
      gender: data.gender,
      heightCm: data.heightCm,
      units: data.units,
    }));

    setWeightLossSettings((prev) => ({
      ...prev,
      currentWeightLb: data.currentWeightLb,
      goalWeightLb: data.goalWeightLb,
      targetPace: data.targetPace,
      activityLevel: data.activityLevel,
      dailyStepGoal: data.dailyStepGoal,
      dailyWaterGoalL: data.dailyWaterGoalL,
      dailyCalorieGoalKcal: data.dailyCalorieGoalKcal,
      dailyProteinGoalG: data.dailyProteinGoalG,
      dietaryPreferences: [
        data.dietaryPreference,
        ...data.dietaryRestrictions.filter((r) => r !== 'None'),
      ],
    }));

    if (data.currentWeightLb) {
      WLRepository.addWeightRecord(data.currentWeightLb, 'Initial weigh-in from onboarding');
    }

    if (data.primaryGoal === 'diabetes_awareness') {
      setActiveModule('diabetes_awareness');
    } else if (data.primaryGoal === 'cancer_awareness') {
      setActiveModule('cancer_awareness');
    } else {
      setActiveModule('weight_loss');
    }

    setActiveTab('home');
    setIsOnboarded(true);
  };

  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-[#E3ECF3] flex justify-center selection:bg-[#1769AA] selection:text-white">
        <div className="w-full max-w-md bg-[#F7FAFC] min-h-screen relative shadow-2xl flex flex-col border-x border-[#DCE7EE]">
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  const getOuterBg = () => {
    if (isDiabetesAwareness) return 'bg-[#E3ECF3]';
    if (isCancerAwareness) return 'bg-[#EAE4EE]';
    return 'bg-[#E7EEE9]';
  };

  const getContainerBg = () => {
    if (isDiabetesAwareness) return 'bg-[#F7FAFC] border-[#DCE7EE]';
    if (isCancerAwareness) return 'bg-[#F6F3F7] border-[#E4DEE9]';
    return 'bg-[#F6FAF7] border-[#DCE6E0]';
  };

  const getSelectionColor = () => {
    if (isDiabetesAwareness) return 'selection:bg-[#1769AA] selection:text-white';
    if (isCancerAwareness) return 'selection:bg-[#5A3577] selection:text-white';
    return 'selection:bg-[#1F7A5C] selection:text-white';
  };

  return (
    <div className={`min-h-screen ${getOuterBg()} flex justify-center ${getSelectionColor()}`}>
      {/* Mobile viewport container */}
      <div className={`w-full max-w-md ${getContainerBg()} min-h-screen relative shadow-2xl flex flex-col border-x`}>
        {/* Render Current Tab Page */}
        <div className="flex-1">
          {isDiabetesAwareness ? (
            <>
              {activeTab === 'home' && (
                <DiabetesHomeScreen 
                  profile={sharedProfile} 
                  onNavigate={setActiveTab} 
                  onSwitchGoal={(mod) => {
                    setActiveModule(mod);
                    setActiveTab('home');
                  }} 
                />
              )}
              {activeTab === 'history' && <DiabetesHistoryScreen userName={sharedProfile.fullName} />}
              {activeTab === 'progress' && <DiabetesProgressScreen onNavigate={setActiveTab} />}
              {activeTab === 'coach' && <DiabetesCoachScreen userName={sharedProfile.fullName.split(' ')[0]} />}
              {activeTab === 'profile' && (
                <ProfileScreen 
                  activeModule={activeModule}
                  profile={sharedProfile}
                  onUpdateProfile={setSharedProfile}
                  weightLossSettings={weightLossSettings}
                  onUpdateWeightLossSettings={setWeightLossSettings}
                  diabetesSettings={diabetesSettings}
                  onUpdateDiabetesSettings={setDiabetesSettings}
                  cancerSettings={cancerSettings}
                  onUpdateCancerSettings={setCancerSettings}
                  onSwitchGoalRequest={() => {
                    setActiveModule('cancer_awareness');
                    setActiveTab('home');
                  }}
                />
              )}
            </>
          ) : isCancerAwareness ? (
            <>
              {activeTab === 'home' && (
                <CancerHomeScreen 
                  profile={sharedProfile} 
                  onNavigate={setActiveTab} 
                  onSwitchGoal={(mod) => {
                    setActiveModule(mod);
                    setActiveTab('home');
                  }} 
                />
              )}
              {activeTab === 'history' && <CancerHistoryScreen userName={sharedProfile.fullName} />}
              {activeTab === 'progress' && <CancerProgressScreen onNavigate={setActiveTab} />}
              {activeTab === 'coach' && <CancerCoachScreen userName={sharedProfile.fullName.split(' ')[0]} />}
              {activeTab === 'profile' && (
                <ProfileScreen 
                  activeModule={activeModule}
                  profile={sharedProfile}
                  onUpdateProfile={setSharedProfile}
                  weightLossSettings={weightLossSettings}
                  onUpdateWeightLossSettings={setWeightLossSettings}
                  diabetesSettings={diabetesSettings}
                  onUpdateDiabetesSettings={setDiabetesSettings}
                  cancerSettings={cancerSettings}
                  onUpdateCancerSettings={setCancerSettings}
                  onSwitchGoalRequest={() => {
                    setActiveModule('weight_loss');
                    setActiveTab('home');
                  }}
                />
              )}
            </>
          ) : (
            <>
              {activeTab === 'home' && (
                <WLHome 
                  profile={sharedProfile}
                  settings={weightLossSettings}
                  onNavigate={setActiveTab} 
                  onSwitchGoal={(mod) => {
                    setActiveModule(mod);
                    setActiveTab('home');
                  }}
                  onUpdateSettings={setWeightLossSettings}
                />
              )}
              {activeTab === 'history' && (
                <WLHistory 
                  profile={sharedProfile} 
                  onNavigate={setActiveTab} 
                />
              )}
              {activeTab === 'progress' && (
                <WLProgress 
                  profile={sharedProfile}
                  settings={weightLossSettings}
                  onNavigate={setActiveTab}
                  onUpdateSettings={setWeightLossSettings}
                />
              )}
              {activeTab === 'coach' && (
                <WLCoach 
                  profile={sharedProfile}
                  settings={weightLossSettings}
                  onNavigate={setActiveTab} 
                />
              )}
              {activeTab === 'profile' && (
                <WLProfile 
                  profile={sharedProfile}
                  settings={weightLossSettings}
                  onUpdateProfile={setSharedProfile}
                  onUpdateSettings={setWeightLossSettings}
                  onRestartOnboarding={() => setIsOnboarded(false)}
                  onSwitchGoalRequest={() => {
                    setActiveModule('diabetes_awareness');
                    setActiveTab('home');
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Global Bottom Navigation */}
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          activeModule={activeModule}
        />
      </div>
    </div>
  );
}
