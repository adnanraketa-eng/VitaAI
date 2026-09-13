import { useState, useEffect } from 'react';
import { 
  User, Shield, Sparkles, ChevronRight, Bell, 
  HelpCircle, LogOut, RotateCw, Edit3, Settings, 
  Scale, Check, Loader2, AlertCircle
} from 'lucide-react';
import { UserSharedProfile, WeightLossSettings } from '../../types';
import { PersonalDetailsModal } from '../../profile/PersonalDetailsModal';
import { WLSettings } from '../settings/WLSettings';
import { supabase } from '../../core/supabase';
import { WLRepository } from '../data/WLRepository';
import { ProfileRepository } from '../../core/profile';
import { calculateAge } from '../../profile/ProfileScreen';

interface Props {
  profile: UserSharedProfile;
  settings: WeightLossSettings;
  onUpdateProfile: (profile: UserSharedProfile) => void;
  onUpdateSettings: (settings: WeightLossSettings) => void;
  onSwitchGoalRequest: () => void;
  onRestartOnboarding?: () => void;
}

export function WLProfile({
  profile,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onSwitchGoalRequest,
  onRestartOnboarding,
}: Props) {
  const [localProfile, setLocalProfile] = useState<UserSharedProfile>({ ...profile });
  const [localSettings, setLocalSettings] = useState<WeightLossSettings>({ ...settings });
  const [isEditingProfile, setIsEditingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    setLocalProfile({ ...profile });
  }, [profile]);

  useEffect(() => {
    setLocalSettings({ ...settings });
  }, [settings]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || 'V').toUpperCase();
  };

  const firstName = localProfile.fullName.trim().split(' ')[0] || 'User';

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setProfileError(null);
    try {
      const computedAge = calculateAge(localProfile.dob) ?? localProfile.age;

      // 1. Update shared profile in public.profiles using existing ProfileRepository
      await ProfileRepository.updateProfile({
        fullName: localProfile.fullName,
        dateOfBirth: localProfile.dob,
        gender: localProfile.gender,
        heightCm: Number(localProfile.heightCm),
      });

      // 2. Persist to existing Weight Loss profile backend (weight_loss_profiles) using existing WLRepository
      await WLRepository.updateGoals({
        currentWeightLb: localSettings.currentWeightLb,
        goalWeightLb: localSettings.goalWeightLb,
        startWeightLb: localSettings.startWeightLb,
        targetPace: localSettings.targetPace,
        dailyCalorieGoalKcal: localSettings.dailyCalorieGoalKcal,
        dailyProteinGoalG: localSettings.dailyProteinGoalG,
        dailyCarbsGoalG: localSettings.dailyCarbsGoalG,
        dailyFatGoalG: localSettings.dailyFatGoalG,
        dailyFiberGoalG: localSettings.dailyFiberGoalG,
        dailyWaterGoalL: localSettings.dailyWaterGoalL,
        dailyStepGoal: localSettings.dailyStepGoal,
        dietaryPreferences: localSettings.dietaryPreferences,
      });

      const updated: UserSharedProfile = {
        ...localProfile,
        age: computedAge,
      };

      setLocalProfile(updated);
      onUpdateProfile(updated);
      onUpdateSettings(localSettings);
      setIsProfileSaved(true);
      setShowSavedToast(true);
      setTimeout(() => {
        setIsProfileSaved(false);
        setShowSavedToast(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to save profile:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save profile changes. Please try again.';
      setProfileError(msg);
      setTimeout(() => setProfileError(null), 4000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] pb-28 font-sans selection:bg-[#1F7A5C] selection:text-white">
      {/* Saved Toast */}
      {showSavedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#1F7A5C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 z-50 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Profile Saved</span>
        </div>
      )}

      {/* Top App Bar */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6FAF7]/90 backdrop-blur-md z-30">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1B2B24]">{firstName}'s Profile</h1>
          <p className="text-xs text-[#4C5F55]">Account details & module preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 bg-white rounded-full border border-[#E7EEE9] shadow-xs hover:bg-[#EFF6F1]">
            <Bell className="w-4 h-4 text-[#4C5F55]" />
          </button>
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="p-2 bg-white rounded-full border border-[#E7EEE9] shadow-xs text-[#4C5F55] hover:bg-[#EFF6F1]"
            title="Weight Loss Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-4 mt-2">
        {/* User Shared Profile Hero Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-[#DCE9E1] text-[#1F7A5C] flex items-center justify-center font-bold text-xl border-2 border-[#1F7A5C]/30">
                  {getInitials(localProfile.fullName)}
                </div>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1F7A5C] text-white rounded-full flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
                  title="Edit Profile"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                </button>
              </div>

              <div>
                <h2 className="text-base font-bold text-[#1B2B24]">{localProfile.fullName}</h2>
                <p className="text-xs text-[#8A9A92]">{localProfile.email}</p>
                <div className="inline-block mt-1 px-2.5 py-0.5 bg-[#EFF6F1] text-[#1F7A5C] text-[10px] font-bold rounded-full">
                  Weight Loss & Deficit Strategy
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[#E7EEE9] text-xs">
            <div>
              <span className="text-[10px] text-[#8A9A92] block uppercase tracking-wider">Member Since</span>
              <span className="font-semibold text-[#1B2B24]">{localProfile.memberSince}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8A9A92] block uppercase tracking-wider">Height</span>
              <span className="font-semibold text-[#1B2B24]">{localProfile.heightCm} cm</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8A9A92] block uppercase tracking-wider">Age / Sex</span>
              <span className="font-semibold text-[#1B2B24]">{localProfile.age} · {localProfile.gender}</span>
            </div>
          </div>
        </div>

        {/* Profile Information & Edit Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1B2B24]">Profile Information</h3>
            </div>
            <button
              id="btn-toggle-edit-profile"
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs font-bold text-[#1F7A5C] hover:text-[#15533E] flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Collapse' : 'Edit'}</span>
            </button>
          </div>

          {isEditingProfile && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-[#8A9A92] block mb-1">Full Name</label>
                <input
                  id="input-profile-fullname"
                  type="text"
                  value={localProfile.fullName}
                  onChange={(e) => setLocalProfile({ ...localProfile, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-semibold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#8A9A92] block mb-1">Height (cm)</label>
                  <input
                    id="input-profile-height"
                    type="number"
                    value={localProfile.heightCm || ''}
                    onChange={(e) => setLocalProfile({ ...localProfile, heightCm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-semibold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
                    placeholder="175"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#8A9A92] block mb-1">Gender</label>
                  <select
                    id="select-profile-gender"
                    value={localProfile.gender}
                    onChange={(e) => setLocalProfile({ ...localProfile, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-semibold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#8A9A92] block mb-1">Date of Birth</label>
                <input
                  id="input-profile-dob"
                  type="date"
                  value={localProfile.dob}
                  onChange={(e) => setLocalProfile({ ...localProfile, dob: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-semibold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#8A9A92] block mb-1">Current Weight (lb)</label>
                  <input
                    id="input-profile-current-weight"
                    type="number"
                    step="0.1"
                    value={localSettings.currentWeightLb || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, currentWeightLb: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-semibold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
                    placeholder="180"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#8A9A92] block mb-1">Goal Weight (lb)</label>
                  <input
                    id="input-profile-goal-weight"
                    type="number"
                    step="0.1"
                    value={localSettings.goalWeightLb || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, goalWeightLb: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-semibold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
                    placeholder="160"
                  />
                </div>
              </div>

              {profileError && (
                <div className="p-2.5 bg-[#FFF1F0] border border-[#D65A5A]/30 rounded-xl text-xs text-[#D65A5A] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <button
                id="btn-save-wl-profile"
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="w-full py-3 px-4 bg-[#1F7A5C] hover:bg-[#15533E] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isProfileSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 1. Personal Details Card */}
        <button
          id="wl-profile-personal-details-button"
          type="button"
          onClick={() => setShowPersonalDetails(true)}
          className="w-full bg-white rounded-3xl border border-[#DCE6E0] p-4 flex items-center justify-between text-left hover:bg-[#F6FAF7] transition-colors shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1B2B24] block">Personal Details</span>
              <span className="text-[11px] text-[#8A9A92]">Shared personal info across all goals</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8A9A92] shrink-0" />
        </button>

        {/* 2. Weight Loss Settings Card */}
        <button
          id="wl-profile-weight-loss-settings-button"
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="w-full bg-white rounded-3xl border border-[#DCE6E0] p-4 flex items-center justify-between text-left hover:bg-[#F6FAF7] transition-colors shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1B2B24] block">Weight Loss Settings</span>
              <span className="text-[11px] text-[#8A9A92]">
                Goal: {settings.goalWeightLb} lb · Pace: {settings.targetPace}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8A9A92] shrink-0" />
        </button>

        {/* Goal / Module Switcher */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A9A92] px-1">
            Module Focus
          </h3>
          <div className="bg-white rounded-3xl border border-[#DCE6E0] shadow-xs divide-y divide-[#E7EEE9] overflow-hidden">
            <div 
              onClick={onSwitchGoalRequest}
              className="p-3.5 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <RotateCw className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1B2B24]">Switch Active Health Module</div>
                  <div className="text-xs text-[#8A9A92]">Weight Loss, Cancer Awareness, or Diabetes</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>
          </div>
        </div>

        {/* Account & App Actions */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A9A92] px-1">
            Support & Privacy
          </h3>
          <div className="bg-white rounded-3xl border border-[#DCE6E0] shadow-xs divide-y divide-[#E7EEE9] overflow-hidden">
            <div className="p-3.5 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#4C5F55] flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-[#1B2B24]">Privacy & Data Protection</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>
            <div className="p-3.5 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#4C5F55] flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-[#1B2B24]">Help & Support</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>
            {onRestartOnboarding && (
              <div 
                onClick={onRestartOnboarding}
                className="p-3.5 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1B2B24]">Revisit Onboarding Setup</div>
                    <div className="text-xs text-[#8A9A92]">Reconfigure shared goals and preferences</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
              </div>
            )}
          </div>
        </div>

        {/* Sign Out Button */}
        <button 
          id="btn-sign-out-wl"
          onClick={async () => {
            if (window.confirm('Are you sure you want to sign out of VitaAI?')) {
              try {
                await supabase.auth.signOut();
              } catch (err) {
                console.error('Sign out error:', err);
              }
            }
          }}
          className="w-full p-4 rounded-3xl bg-white border border-[#DCE6E0] text-xs font-bold text-[#D65A5A] hover:bg-[#FFF1F0] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of VitaAI</span>
        </button>
      </main>

      {/* Sub-Modals */}
      {showPersonalDetails && (
        <PersonalDetailsModal
          profile={localProfile}
          activeModule="weight_loss"
          onSaveProfile={async (p) => {
            setLocalProfile(p);
            onUpdateProfile(p);
            try {
              await ProfileRepository.updateProfile({
                fullName: p.fullName,
                dateOfBirth: p.dob,
                gender: p.gender,
                heightCm: p.heightCm,
              });
            } catch (err) {
              console.error('Failed to update shared profile:', err);
            }
            setShowPersonalDetails(false);
          }}
          onClose={() => setShowPersonalDetails(false)}
        />
      )}

      {showSettingsModal && (
        <WLSettings
          settings={localSettings}
          onSaveSettings={(s) => {
            setLocalSettings(s);
            onUpdateSettings(s);
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
