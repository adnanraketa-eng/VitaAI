import { useState } from 'react';
import { 
  User, Shield, Sparkles, ChevronRight, Bell, 
  HelpCircle, LogOut, RotateCw, Edit3, Settings, 
  Scale
} from 'lucide-react';
import { UserSharedProfile, WeightLossSettings } from '../../types';
import { PersonalDetailsModal } from '../../profile/PersonalDetailsModal';
import { WLSettings } from '../settings/WLSettings';

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
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || 'V').toUpperCase();
  };

  const firstName = profile.fullName.trim().split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] pb-28 font-sans selection:bg-[#1F7A5C] selection:text-white">
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
                  {getInitials(profile.fullName)}
                </div>
                <button 
                  onClick={() => setShowPersonalDetails(true)}
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1F7A5C] text-white rounded-full flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
                  title="Edit Profile"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                </button>
              </div>

              <div>
                <h2 className="text-base font-bold text-[#1B2B24]">{profile.fullName}</h2>
                <p className="text-xs text-[#8A9A92]">{profile.email}</p>
                <div className="inline-block mt-1 px-2.5 py-0.5 bg-[#EFF6F1] text-[#1F7A5C] text-[10px] font-bold rounded-full">
                  Weight Loss & Deficit Strategy
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[#E7EEE9] text-xs">
            <div>
              <span className="text-[10px] text-[#8A9A92] block uppercase tracking-wider">Member Since</span>
              <span className="font-semibold text-[#1B2B24]">{profile.memberSince}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8A9A92] block uppercase tracking-wider">Height</span>
              <span className="font-semibold text-[#1B2B24]">{profile.heightCm} cm</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8A9A92] block uppercase tracking-wider">Age / Sex</span>
              <span className="font-semibold text-[#1B2B24]">{profile.age} · {profile.gender}</span>
            </div>
          </div>
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
          onClick={() => {
            if (window.confirm('Are you sure you want to sign out of VitaAI?')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full p-4 rounded-3xl bg-white border border-[#DCE6E0] text-xs font-bold text-[#D65A5A] hover:bg-[#FFF1F0] transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of VitaAI</span>
        </button>
      </main>

      {/* Sub-Modals */}
      {showPersonalDetails && (
        <PersonalDetailsModal
          profile={profile}
          activeModule="weight_loss"
          onSaveProfile={(p) => {
            onUpdateProfile(p);
            setShowPersonalDetails(false);
          }}
          onClose={() => setShowPersonalDetails(false)}
        />
      )}

      {showSettingsModal && (
        <WLSettings
          settings={settings}
          onSaveSettings={(s) => {
            onUpdateSettings(s);
            setShowSettingsModal(false);
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
