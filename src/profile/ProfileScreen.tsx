import { useState, useEffect } from 'react';
import { 
  User, Droplet, Shield, Sparkles, ChevronRight, Bell, Lock, 
  HelpCircle, LogOut, Flame, RotateCw, Edit3, Settings, 
  TrendingUp, Droplets, Award, Utensils, Moon, Info, Scale,
  AlertCircle, Loader2
} from 'lucide-react';
import { UserSharedProfile, WeightLossSettings, ActiveModule } from '../types';
import { DiabetesAwarenessSettings } from '../diabetes-awareness/types';
import { CancerAwarenessSettings } from '../cancer-awareness/types';
import { PersonalDetailsModal } from './PersonalDetailsModal';
import { WeightLossSettingsModal } from '../weight-loss/settings/WeightLossSettingsModal';
import { DiabetesSettingsModal } from '../diabetes-awareness/settings/DiabetesSettingsModal';
import { CancerSettingsModal } from '../cancer-awareness/settings/CancerSettingsModal';
import { ProfileRepository } from '../core/profile';
import { SharedProfile } from '../core/profile/ProfileTypes';

export function calculateAge(dobString: string | null | undefined): number | null {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

interface Props {
  activeModule: ActiveModule;
  profile: UserSharedProfile;
  onUpdateProfile: (profile: UserSharedProfile) => void;
  weightLossSettings: WeightLossSettings;
  onUpdateWeightLossSettings: (settings: WeightLossSettings) => void;
  diabetesSettings: DiabetesAwarenessSettings;
  onUpdateDiabetesSettings: (settings: DiabetesAwarenessSettings) => void;
  cancerSettings: CancerAwarenessSettings;
  onUpdateCancerSettings: (settings: CancerAwarenessSettings) => void;
  onSwitchGoalRequest: () => void;
}

export function ProfileScreen({
  activeModule,
  profile,
  onUpdateProfile,
  weightLossSettings,
  onUpdateWeightLossSettings,
  diabetesSettings,
  onUpdateDiabetesSettings,
  cancerSettings,
  onUpdateCancerSettings,
  onSwitchGoalRequest,
}: Props) {
  // Navigation to sub-modals
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showModuleSettings, setShowModuleSettings] = useState(false);

  // Authoritative shared profile state loaded directly from public.profiles
  const [profileData, setProfileData] = useState<SharedProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadUserProfile = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await ProfileRepository.getProfile();
      setProfileData(data);
      if (data) {
        const computedAge = calculateAge(data.dateOfBirth);
        onUpdateProfile({
          fullName: data.fullName || '',
          email: data.email || '',
          avatarUrl: profile.avatarUrl || '',
          dob: data.dateOfBirth || '',
          age: computedAge ?? 0,
          gender: data.gender || '',
          heightCm: data.heightCm || 0,
          memberSince: profile.memberSince || 'Today',
          streakDays: profile.streakDays || 1,
          units: profile.units || 'imperial',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load profile from database.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleSaveProfile = async (updated: UserSharedProfile) => {
    try {
      const saved = await ProfileRepository.updateProfile({
        fullName: updated.fullName,
        dateOfBirth: updated.dob,
        gender: updated.gender,
        heightCm: updated.heightCm,
      });
      setProfileData(saved);
      onUpdateProfile(updated);
    } catch (err) {
      console.error('Failed to update shared profile:', err);
      onUpdateProfile(updated);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || 'U').toUpperCase();
  };

  // Authoritative shared profile fields loaded from public.profiles
  const fullName = profileData?.fullName ?? profile.fullName ?? '';
  const email = profileData?.email ?? profile.email ?? '';
  const dob = profileData?.dateOfBirth ?? profile.dob ?? '';
  const computedAge = calculateAge(dob);
  const age = computedAge !== null ? computedAge : (profile.age || null);
  const gender = profileData?.gender ?? profile.gender ?? '';
  const heightCm = profileData?.heightCm ?? profile.heightCm ?? null;

  const currentSharedProfile: UserSharedProfile = {
    ...profile,
    fullName,
    email,
    dob,
    age: age ?? 0,
    gender,
    heightCm: heightCm ?? 0,
  };

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
      <Loader2 className="w-6 h-6 animate-spin opacity-60 text-current" />
      <p className="text-xs font-medium opacity-75">Loading shared profile...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>{errorMessage}</span>
      </div>
      <button 
        type="button"
        onClick={loadUserProfile}
        className="px-2.5 py-1 bg-white border border-red-200 rounded-xl font-bold hover:bg-red-50 text-[10px]"
      >
        Retry
      </button>
    </div>
  );

  /* ==========================================================
     DIABETES AWARENESS PROFILE VIEW
     ========================================================== */
  if (activeModule === 'diabetes_awareness') {
    return (
      <div className="min-h-screen bg-[#F7FAFC] text-[#12324A] pb-24 font-sans selection:bg-[#1769AA] selection:text-white">
        {/* Header */}
        <header className="px-5 pt-4 pb-2 sticky top-0 bg-[#F7FAFC]/95 backdrop-blur-md z-30">
          <h1 className="text-2xl font-black tracking-tight text-[#12324A]">Profile</h1>
          <p className="text-xs text-[#536675]">Manage your account and preferences</p>
        </header>

        <main className="px-4 space-y-4 mt-2">
          {/* Shared User Identity Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE7EE] shadow-2xs space-y-4">
            {isLoading ? (
              renderLoadingState()
            ) : (
              <>
                {errorMessage && renderErrorState()}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center font-extrabold text-2xl shrink-0 border-2 border-[#1769AA]/20">
                    {getInitials(fullName || 'User')}
                  </div>

                  <div className="space-y-1 flex-1">
                    <h2 className="text-lg font-bold text-[#12324A]">{fullName || 'User'}</h2>
                    <p className="text-xs text-[#536675]">{email || 'No email provided'}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E8A23A] bg-[#FFF5E5] px-2 py-0.5 rounded-full">
                        <Flame className="w-3 h-3 fill-current" /> {profile.streakDays} Day Streak
                      </span>
                      <span className="text-[11px] text-[#536675]">Member since {profile.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Shared Profile Details: DOB, Age, Gender, Height */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#DCE7EE] text-center">
                  <div>
                    <span className="text-[10px] text-[#536675] block uppercase font-medium">DOB</span>
                    <span className="text-xs font-bold text-[#12324A] truncate block">{dob || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#536675] block uppercase font-medium">Age</span>
                    <span className="text-xs font-bold text-[#12324A] block">
                      {age !== null && age !== undefined ? `${age} yrs` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#536675] block uppercase font-medium">Gender</span>
                    <span className="text-xs font-bold text-[#12324A] truncate block">{gender || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#536675] block uppercase font-medium">Height</span>
                    <span className="text-xs font-bold text-[#12324A] block">
                      {heightCm ? `${heightCm} cm` : '—'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Active Goal Card */}
          <div className="bg-[#EAF8F2] rounded-3xl p-5 border border-[#D1EAE0] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#39A982]">
                <Droplet className="w-4 h-4 fill-current" />
                <span>ACTIVE GOAL</span>
              </div>
              <button 
                onClick={onSwitchGoalRequest}
                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D1EAE0] text-[#12324A] rounded-full text-xs font-semibold hover:bg-white/80 transition-colors shadow-2xs"
              >
                <RotateCw className="w-3 h-3" />
                <span>Switch Goal</span>
              </button>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[#12324A]">Diabetes-Friendly Eating</h3>
              <p className="text-xs text-[#536675] mt-0.5">
                Personalized for glycemic index control, balanced carbohydrates, and steady energy.
              </p>
            </div>
          </div>

          {/* Settings Navigation List */}
          <div className="bg-white rounded-3xl border border-[#DCE7EE] shadow-2xs overflow-hidden divide-y divide-[#DCE7EE]">
            {/* 1. Shared Personal Details */}
            <button 
              onClick={() => setShowPersonalDetails(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F7FAFC] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#12324A] block">Personal Details</span>
                  <span className="text-[11px] text-[#536675]">Shared personal info across all goals</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </button>

            {/* 2. Diabetes Awareness Settings (Module-specific) */}
            <button 
              onClick={() => setShowModuleSettings(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F7FAFC] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#12324A] block">Diabetes Awareness Settings</span>
                  <span className="text-[11px] text-[#536675]">Target: {diabetesSettings.glucoseTargetRange} · {diabetesSettings.preferredGlucoseUnits}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </button>

            {/* Notifications */}
            <div className="p-4 flex items-center justify-between text-left hover:bg-[#F7FAFC] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF5FB] text-[#4DA3D9] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#12324A] block">Reminders & Alerts</span>
                  <span className="text-[11px] text-[#536675]">Daily reminders active</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Privacy & Safety */}
            <div className="p-4 flex items-center justify-between text-left hover:bg-[#F7FAFC] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF5E5] text-[#E8A23A] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#12324A] block">Privacy & Security</span>
                  <span className="text-[11px] text-[#536675]">Data is encrypted & private</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Help & Support */}
            <div className="p-4 flex items-center justify-between text-left hover:bg-[#F7FAFC] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F7FAFC] text-[#536675] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#12324A] block">Help & Support</span>
                  <span className="text-[11px] text-[#536675]">FAQs & contact</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>
          </div>

          {/* Sign Out Button */}
          <button className="w-full py-3.5 bg-white border border-[#DCE7EE] text-[#D95C5C] rounded-3xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#FDEEEE] transition-colors shadow-2xs">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </main>

        {/* Modals */}
        {showPersonalDetails && (
          <PersonalDetailsModal
            profile={currentSharedProfile}
            activeModule={activeModule}
            onSaveProfile={handleSaveProfile}
            onClose={() => setShowPersonalDetails(false)}
          />
        )}
        {showModuleSettings && (
          <DiabetesSettingsModal
            settings={diabetesSettings}
            onSaveSettings={onUpdateDiabetesSettings}
            onClose={() => setShowModuleSettings(false)}
          />
        )}
      </div>
    );
  }

  /* ==========================================================
     CANCER AWARENESS PROFILE VIEW
     ========================================================== */
  if (activeModule === 'cancer_awareness') {
    return (
      <div className="min-h-screen bg-[#F6F3F7] text-[#2A2233] pb-24 font-sans selection:bg-[#5A3577] selection:text-white">
        {/* Header */}
        <header className="px-5 pt-3 pb-2 sticky top-0 bg-[#F6F3F7]/90 backdrop-blur-md z-30">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2A2233]">Profile</h1>
          <p className="text-xs text-[#6B6275]">Manage your account and preferences</p>
        </header>

        <main className="px-4 space-y-4 mt-2">
          {/* Shared User Identity Card */}
          <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-4">
            {isLoading ? (
              renderLoadingState()
            ) : (
              <>
                {errorMessage && renderErrorState()}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#EFE7F5] text-[#5A3577] flex items-center justify-center font-extrabold text-2xl shrink-0 border-2 border-[#5A3577]/20">
                    {getInitials(fullName || 'User')}
                  </div>

                  <div className="space-y-1 flex-1">
                    <h2 className="text-lg font-bold text-[#2A2233]">{fullName || 'User'}</h2>
                    <p className="text-xs text-[#6B6275]">{email || 'No email provided'}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E8674B] bg-[#FBE7E1] px-2 py-0.5 rounded-full">
                        <Flame className="w-3 h-3" /> {profile.streakDays} Day Streak
                      </span>
                      <span className="text-[11px] text-[#6B6275]">Member since {profile.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Shared Profile Details: DOB, Age, Gender, Height */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#E4DEE9] text-center">
                  <div>
                    <span className="text-[10px] text-[#6B6275] block uppercase font-medium">DOB</span>
                    <span className="text-xs font-bold text-[#2A2233] truncate block">{dob || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B6275] block uppercase font-medium">Age</span>
                    <span className="text-xs font-bold text-[#2A2233] block">
                      {age !== null && age !== undefined ? `${age} yrs` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B6275] block uppercase font-medium">Gender</span>
                    <span className="text-xs font-bold text-[#2A2233] truncate block">{gender || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B6275] block uppercase font-medium">Height</span>
                    <span className="text-xs font-bold text-[#2A2233] block">
                      {heightCm ? `${heightCm} cm` : '—'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Active Goal Card */}
          <div className="bg-gradient-to-br from-[#EFE7F5] via-[#FCFBFD] to-[#F6F3F7] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5A3577]">
                <Shield className="w-4 h-4" />
                <span>ACTIVE GOAL</span>
              </div>
              <button 
                onClick={onSwitchGoalRequest}
                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E4DEE9] text-[#5A3577] rounded-full text-xs font-semibold hover:bg-[#EFE7F5] transition-colors shadow-2xs"
              >
                <RotateCw className="w-3 h-3" />
                <span>Switch Goal</span>
              </button>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[#2A2233]">Cancer-Aware Nutrition</h3>
              <p className="text-xs text-[#6B6275] mt-0.5">
                Personalized for cellular wellness, antioxidant nourishment, and long-term health.
              </p>
            </div>
          </div>

          {/* Settings Navigation List */}
          <div className="bg-[#FCFBFD] rounded-3xl border border-[#E4DEE9] shadow-xs overflow-hidden divide-y divide-[#E4DEE9]">
            {/* 1. Shared Personal Details */}
            <button 
              onClick={() => setShowPersonalDetails(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F6F3F7] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFE7F5] text-[#5A3577] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2A2233] block">Personal Details</span>
                  <span className="text-[11px] text-[#6B6275]">Shared personal info across all goals</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </button>

            {/* 2. Cancer Awareness Settings (Module-specific) */}
            <button 
              onClick={() => setShowModuleSettings(true)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F6F3F7] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#E4F0E6] text-[#4C8F63] flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2A2233] block">Cancer Awareness Settings</span>
                  <span className="text-[11px] text-[#6B6275]">Screening reminders: {cancerSettings.screeningReminders}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </button>

            {/* Notifications */}
            <div className="p-4 flex items-center justify-between text-left hover:bg-[#F6F3F7] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#E1EFF2] text-[#2C7A93] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2A2233] block">Notifications</span>
                  <span className="text-[11px] text-[#6B6275]">Daily analysis & hydration alerts</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Privacy & Security */}
            <div className="p-4 flex items-center justify-between text-left hover:bg-[#F6F3F7] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F6F3F7] text-[#6B6275] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2A2233] block">Privacy & Security</span>
                  <span className="text-[11px] text-[#6B6275]">Protected account information</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Help & Support */}
            <div className="p-4 flex items-center justify-between text-left hover:bg-[#F6F3F7] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F7EBD8] text-[#C98A2B] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2A2233] block">Help & Support</span>
                  <span className="text-[11px] text-[#6B6275]">FAQ, guides, and contact</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>
          </div>

          {/* Sign Out Button */}
          <button className="w-full p-4 rounded-3xl bg-[#FCFBFD] border border-[#E4DEE9] text-xs font-bold text-[#B5504A] hover:bg-[#F5E3E1] transition-colors flex items-center justify-center gap-2 shadow-xs">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </main>

        {/* Modals */}
        {showPersonalDetails && (
          <PersonalDetailsModal
            profile={currentSharedProfile}
            activeModule={activeModule}
            onSaveProfile={handleSaveProfile}
            onClose={() => setShowPersonalDetails(false)}
          />
        )}
        {showModuleSettings && (
          <CancerSettingsModal
            settings={cancerSettings}
            onSaveSettings={onUpdateCancerSettings}
            onClose={() => setShowModuleSettings(false)}
          />
        )}
      </div>
    );
  }

  /* ==========================================================
     WEIGHT LOSS PROFILE VIEW
     ========================================================== */
  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] pb-24 font-sans selection:bg-[#1F7A5C] selection:text-white">
      {/* Header */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6FAF7]/90 backdrop-blur-md z-30">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1B2B24]">
            {fullName ? `${fullName.split(' ')[0]}'s Profile` : 'Profile'}
          </h1>
          <p className="text-xs text-[#4C5F55]">Manage account and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 bg-white rounded-full border border-[#E7EEE9] shadow-xs hover:bg-[#EFF6F1]">
            <Bell className="w-4 h-4 text-[#4C5F55]" />
            <span className="absolute -top-1 -right-1 bg-[#FF8B5E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <button 
            onClick={() => setShowModuleSettings(true)}
            className="p-2 bg-white rounded-full border border-[#E7EEE9] shadow-xs text-[#4C5F55] hover:bg-[#EFF6F1]"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="px-4 space-y-4 mt-2">
        {/* User Hero Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-4">
          {isLoading ? (
            renderLoadingState()
          ) : (
            <>
              {errorMessage && renderErrorState()}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-[#DCE9E1] text-[#1F7A5C] flex items-center justify-center font-bold text-xl border-2 border-[#1F7A5C]/30">
                      {getInitials(fullName || 'User')}
                    </div>
                    <button 
                      onClick={() => setShowPersonalDetails(true)}
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1F7A5C] text-white rounded-full flex items-center justify-center shadow-xs"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#1B2B24]">{fullName || 'User'}</h2>
                    <p className="text-xs text-[#8A9A92]">{email || 'No email provided'}</p>
                    <div className="inline-block mt-1 px-2.5 py-0.5 bg-[#EFF6F1] text-[#1F7A5C] text-[10px] font-bold rounded-full">
                      Weight Loss & Management
                    </div>
                  </div>
                </div>
              </div>

              {/* Shared Profile Details: DOB, Age, Gender, Height */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#E7EEE9] text-center">
                <div>
                  <span className="text-[10px] text-[#8A9A92] block uppercase font-medium">DOB</span>
                  <span className="text-xs font-bold text-[#1B2B24] truncate block">{dob || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8A9A92] block uppercase font-medium">Age</span>
                  <span className="text-xs font-bold text-[#1B2B24] block">
                    {age !== null && age !== undefined ? `${age} yrs` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8A9A92] block uppercase font-medium">Gender</span>
                  <span className="text-xs font-bold text-[#1B2B24] truncate block">{gender || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8A9A92] block uppercase font-medium">Height</span>
                  <span className="text-xs font-bold text-[#1B2B24] block">
                    {heightCm ? `${heightCm} cm` : '—'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 4 Quick Stats Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-3.5 border border-[#DCE6E0] shadow-xs">
            <div className="w-7 h-7 rounded-full bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center mb-1">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-[#1B2B24]">82</div>
            <div className="text-[11px] text-[#8A9A92]">Avg. Nutrition Score This Week</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#DCE6E0] shadow-xs">
            <div className="w-7 h-7 rounded-full bg-[#EFF6F1] text-[#2E8B8B] flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-[#1B2B24]">27</div>
            <div className="text-[11px] text-[#8A9A92]">Days Tracked This Month</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#DCE6E0] shadow-xs">
            <div className="w-7 h-7 rounded-full bg-[#EFF6F1] text-[#3E8FB0] flex items-center justify-center mb-1">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-[#1B2B24]">{weightLossSettings.dailyWaterGoalL} L</div>
            <div className="text-[11px] text-[#8A9A92]">Water Intake Goal</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#DCE6E0] shadow-xs">
            <div className="w-7 h-7 rounded-full bg-[#FFF1E8] text-[#FF8B5E] flex items-center justify-center mb-1">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-xl font-black text-[#1B2B24]">12</div>
            <div className="text-[11px] text-[#8A9A92]">Achievements Unlocked</div>
          </div>
        </div>

        {/* Your Goal Card */}
        <section className="bg-white rounded-3xl p-4 border border-[#DCE6E0] shadow-xs flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1B2B24]">Weight Loss & Management</h3>
              <p className="text-xs text-[#8A9A92] mt-0.5 pr-2">
                Goal weight: {weightLossSettings.goalWeightLb} lb (Current: {weightLossSettings.currentWeightLb} lb)
              </p>
            </div>
          </div>
          <button 
            onClick={onSwitchGoalRequest}
            className="px-3 py-1 bg-[#F6FAF7] border border-[#DCE6E0] text-[#1F7A5C] text-xs font-semibold rounded-full shrink-0 hover:bg-[#EFF6F1]"
          >
            Edit Goal
          </button>
        </section>

        {/* Navigation Sections */}
        <div className="bg-white rounded-3xl border border-[#DCE6E0] shadow-xs divide-y divide-[#E7EEE9] overflow-hidden">
          {/* 1. Shared Personal Details */}
          <button
            onClick={() => setShowPersonalDetails(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-[#EFF6F1] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1B2B24]">Personal Details</div>
                <div className="text-[11px] text-[#8A9A92]">Shared profile: name, age, height, DOB</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
          </button>

          {/* 2. Weight Loss Settings (Module-specific) */}
          <button
            onClick={() => setShowModuleSettings(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-[#EFF6F1] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1B2B24]">Weight Loss Settings</div>
                <div className="text-[11px] text-[#8A9A92]">Target pace: {weightLossSettings.targetPace} · Step goal: {weightLossSettings.dailyStepGoal.toLocaleString()}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
          </button>
        </div>

        {/* Preferences Section */}
        <section className="bg-white rounded-3xl border border-[#DCE6E0] p-2 shadow-xs space-y-1">
          <div className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-[#8A9A92]">
            Preferences
          </div>

          <div className="divide-y divide-[#E7EEE9]">
            <div 
              onClick={() => setShowModuleSettings(true)}
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-[#F6FAF7] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Utensils className="w-4 h-4 text-[#4C5F55]" />
                <div>
                  <div className="text-xs font-bold text-[#1B2B24]">Dietary Preferences</div>
                  <div className="text-[11px] text-[#8A9A92]">{weightLossSettings.dietaryPreferences.join(' · ')}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-[#F6FAF7] rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[#4C5F55]" />
                <div>
                  <div className="text-xs font-bold text-[#1B2B24]">Notifications</div>
                  <div className="text-[11px] text-[#8A9A92]">Manage reminders and alerts</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-[#F6FAF7] rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-[#4C5F55]" />
                <div>
                  <div className="text-xs font-bold text-[#1B2B24]">Appearance</div>
                  <div className="text-[11px] text-[#8A9A92]">Light theme · {profile.units === 'imperial' ? 'Imperial units' : 'Metric units'}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>
          </div>
        </section>

        {/* Support & More */}
        <section className="bg-white rounded-3xl border border-[#DCE6E0] p-2 shadow-xs space-y-1">
          <div className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-[#8A9A92]">
            Support & More
          </div>

          <div className="divide-y divide-[#E7EEE9]">
            <div className="p-3 flex items-center justify-between hover:bg-[#F6FAF7] rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-[#4C5F55]" />
                <div>
                  <div className="text-xs font-bold text-[#1B2B24]">Help Center</div>
                  <div className="text-[11px] text-[#8A9A92]">FAQs, guides and support</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-[#F6FAF7] rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#4C5F55]" />
                <div>
                  <div className="text-xs font-bold text-[#1B2B24]">Privacy & Security</div>
                  <div className="text-[11px] text-[#8A9A92]">Manage your data and privacy</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            <div className="p-3 flex items-center justify-between hover:bg-[#F6FAF7] rounded-xl cursor-pointer">
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-[#4C5F55]" />
                <div>
                  <div className="text-xs font-bold text-[#1B2B24]">About</div>
                  <div className="text-[11px] text-[#8A9A92]">VitaAI v1.0.0 (Weight Loss Module)</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>
          </div>
        </section>

        {/* Log Out Button */}
        <button className="w-full py-3 bg-white border border-[#D65A5A]/30 text-[#D65A5A] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#FFF1E8] transition-colors">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </main>

      {/* Modals */}
      {showPersonalDetails && (
        <PersonalDetailsModal
          profile={currentSharedProfile}
          activeModule={activeModule}
          onSaveProfile={handleSaveProfile}
          onClose={() => setShowPersonalDetails(false)}
        />
      )}
      {showModuleSettings && (
        <WeightLossSettingsModal
          settings={weightLossSettings}
          onSaveSettings={onUpdateWeightLossSettings}
          onClose={() => setShowModuleSettings(false)}
        />
      )}
    </div>
  );
}
