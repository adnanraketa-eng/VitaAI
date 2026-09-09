import { useState } from 'react';
import { 
  ArrowLeft, User, Calendar, Clock, Ruler, Mail, 
  ChevronRight, Check, Sparkles, Droplet, Shield
} from 'lucide-react';
import { UserSharedProfile, ActiveModule } from '../types';

interface Props {
  profile: UserSharedProfile;
  activeModule: ActiveModule;
  onSaveProfile: (profile: UserSharedProfile) => void;
  onClose: () => void;
}

export function PersonalDetailsModal({
  profile,
  activeModule,
  onSaveProfile,
  onClose,
}: Props) {
  const [localProfile, setLocalProfile] = useState<UserSharedProfile>({ ...profile });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    onSaveProfile(localProfile);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  const getTheme = () => {
    if (activeModule === 'diabetes_awareness') {
      return {
        bg: 'bg-[#F7FAFC]',
        text: 'text-[#12324A]',
        accent: 'text-[#1769AA]',
        accentBg: 'bg-[#EAF5FB]',
        saveBtn: 'text-[#39A982] hover:text-[#1E6847]',
        goalCardBg: 'bg-[#EAF8F2] border-[#D1EAE0]',
        goalIcon: <Droplet className="w-5 h-5 fill-current" />,
        goalIconBg: 'bg-white text-[#39A982]',
        goalTitle: 'Diabetes-Friendly',
        goalTag: 'text-[#39A982]',
        cardBg: 'bg-white border-[#DCE7EE]',
        border: 'border-[#DCE7EE]',
      };
    }
    if (activeModule === 'cancer_awareness') {
      return {
        bg: 'bg-[#F6F3F7]',
        text: 'text-[#2A2233]',
        accent: 'text-[#5A3577]',
        accentBg: 'bg-[#EFE7F5]',
        saveBtn: 'text-[#4C8F63] hover:text-[#38714C]',
        goalCardBg: 'bg-[#FCFBFD] border-[#E4DEE9]',
        goalIcon: <Shield className="w-5 h-5" />,
        goalIconBg: 'bg-[#E4F0E6] text-[#4C8F63]',
        goalTitle: 'Cancer-Aware',
        goalTag: 'text-[#6B6275]',
        cardBg: 'bg-[#FCFBFD] border-[#E4DEE9]',
        border: 'border-[#E4DEE9]',
      };
    }
    return {
      bg: 'bg-[#F6FAF7]',
      text: 'text-[#1B2B24]',
      accent: 'text-[#1F7A5C]',
      accentBg: 'bg-[#EFF6F1]',
      saveBtn: 'text-[#1F7A5C] hover:text-[#15533E]',
      goalCardBg: 'bg-[#EFF6F1] border-[#DCE6E0]',
      goalIcon: <Sparkles className="w-5 h-5" />,
      goalIconBg: 'bg-white text-[#1F7A5C]',
      goalTitle: 'Weight Loss & Management',
      goalTag: 'text-[#1F7A5C]',
      cardBg: 'bg-white border-[#DCE6E0]',
      border: 'border-[#DCE6E0]',
    };
  };

  const theme = getTheme();

  return (
    <div className={`fixed inset-0 ${theme.bg} z-50 overflow-y-auto pb-12 font-sans ${theme.text}`}>
      {/* Top Header */}
      <div className={`sticky top-0 ${theme.bg}/95 backdrop-blur-md px-4 pt-4 pb-3 border-b ${theme.border} flex items-center justify-between z-10`}>
        <button 
          onClick={onClose}
          className={`w-10 h-10 rounded-full bg-white border ${theme.border} flex items-center justify-center ${theme.text} hover:opacity-80 transition-colors`}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold">Personal Details</h1>

        <button 
          onClick={handleSave}
          className={`text-sm font-bold ${theme.saveBtn} px-2 py-1 transition-colors flex items-center gap-1`}
        >
          {showSavedToast && <Check className="w-4 h-4 stroke-[3]" />}
          <span>{showSavedToast ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {showSavedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#39A982] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 z-50 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Profile Updated</span>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 pt-4 space-y-5">
        {/* Active Goal Card */}
        <div className={`${theme.goalCardBg} rounded-3xl p-4 border flex items-start gap-3.5 shadow-2xs`}>
          <div className={`w-10 h-10 rounded-2xl ${theme.goalIconBg} flex items-center justify-center shrink-0 shadow-2xs`}>
            {theme.goalIcon}
          </div>
          <div className="space-y-0.5">
            <span className={`text-[11px] font-bold ${theme.goalTag} tracking-wider uppercase block`}>
              ACTIVE GOAL
            </span>
            <h2 className="text-base font-bold">{theme.goalTitle}</h2>
            <p className="text-xs opacity-75">
              Personal information is shared across all your health goals.
            </p>
          </div>
        </div>

        {/* ONE Shared Personal Information Section */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-bold">Personal information</h3>
            <p className="text-xs opacity-75">Shared profile details used across all modules.</p>
          </div>

          <div className={`${theme.cardBg} rounded-3xl border shadow-2xs divide-y ${theme.border} overflow-hidden`}>
            {/* Full Name */}
            <div 
              onClick={() => setEditingField(editingField === 'fullName' ? null : 'fullName')}
              className="p-4 flex items-center justify-between hover:bg-black/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl ${theme.accentBg} ${theme.accent} flex items-center justify-center`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs opacity-70 font-medium block">Full name</span>
                  {editingField === 'fullName' ? (
                    <input
                      type="text"
                      value={localProfile.fullName}
                      onChange={(e) => setLocalProfile({ ...localProfile, fullName: e.target.value })}
                      className="text-xs font-bold border-b border-current focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold block">{localProfile.fullName}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </div>

            {/* Date of Birth */}
            <div 
              onClick={() => setEditingField(editingField === 'dob' ? null : 'dob')}
              className="p-4 flex items-center justify-between hover:bg-black/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl ${theme.accentBg} ${theme.accent} flex items-center justify-center`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs opacity-70 font-medium block">Date of birth</span>
                  {editingField === 'dob' ? (
                    <input
                      type="text"
                      value={localProfile.dob}
                      onChange={(e) => setLocalProfile({ ...localProfile, dob: e.target.value })}
                      className="text-xs font-bold border-b border-current focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold block">{localProfile.dob}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </div>

            {/* Age */}
            <div 
              onClick={() => setEditingField(editingField === 'age' ? null : 'age')}
              className="p-4 flex items-center justify-between hover:bg-black/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl ${theme.accentBg} ${theme.accent} flex items-center justify-center`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs opacity-70 font-medium block">Age</span>
                  {editingField === 'age' ? (
                    <input
                      type="number"
                      value={localProfile.age}
                      onChange={(e) => setLocalProfile({ ...localProfile, age: Number(e.target.value) || localProfile.age })}
                      className="text-xs font-bold border-b border-current focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold block">{localProfile.age} years</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </div>

            {/* Gender */}
            <div 
              onClick={() => setEditingField(editingField === 'gender' ? null : 'gender')}
              className="p-4 flex items-center justify-between hover:bg-black/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl ${theme.accentBg} ${theme.accent} flex items-center justify-center`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs opacity-70 font-medium block">Gender</span>
                  {editingField === 'gender' ? (
                    <select
                      value={localProfile.gender}
                      onChange={(e) => setLocalProfile({ ...localProfile, gender: e.target.value })}
                      className="text-xs font-bold border-b border-current focus:outline-none bg-transparent"
                    >
                      <option value="Woman">Woman</option>
                      <option value="Man">Man</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <span className="text-xs font-bold block">{localProfile.gender}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </div>

            {/* Height */}
            <div 
              onClick={() => setEditingField(editingField === 'height' ? null : 'height')}
              className="p-4 flex items-center justify-between hover:bg-black/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl ${theme.accentBg} ${theme.accent} flex items-center justify-center`}>
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs opacity-70 font-medium block">Height</span>
                  {editingField === 'height' ? (
                    <input
                      type="number"
                      value={localProfile.heightCm}
                      onChange={(e) => setLocalProfile({ ...localProfile, heightCm: Number(e.target.value) || localProfile.heightCm })}
                      className="text-xs font-bold border-b border-current focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold block">{localProfile.heightCm} cm</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </div>

            {/* Email / Account Information */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl ${theme.accentBg} ${theme.accent} flex items-center justify-center`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs opacity-70 font-medium block">Email address</span>
                  <span className="text-xs font-bold block">{localProfile.email}</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold opacity-60 px-2 py-0.5 rounded-md bg-black/5">
                Primary
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
