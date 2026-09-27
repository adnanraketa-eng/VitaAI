import { useState } from 'react';
import { 
  ArrowLeft, Shield, Calendar, Clock, AlertTriangle, 
  HeartHandshake, ChevronRight, Check, Droplet, Sparkles 
} from 'lucide-react';
import { CancerAwarenessSettings } from '../types';
import { ActiveModule } from '../../types';

interface Props {
  settings: CancerAwarenessSettings;
  onSaveSettings: (settings: CancerAwarenessSettings) => void;
  onClose: () => void;
  activeModule?: ActiveModule;
  onSwitchAccount?: (module: ActiveModule) => void;
}

export function CancerSettingsModal({
  settings,
  onSaveSettings,
  onClose,
  activeModule = 'cancer_awareness',
  onSwitchAccount,
}: Props) {
  const [currentModule, setCurrentModule] = useState<ActiveModule>(activeModule);
  const [localSettings, setLocalSettings] = useState<CancerAwarenessSettings>({ ...settings });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleAccountSwitch = (mod: ActiveModule) => {
    setCurrentModule(mod);
    try {
      localStorage.setItem('vita_active_module', mod);
    } catch {
      // storage fallback
    }
    if (onSwitchAccount) {
      onSwitchAccount(mod);
    }
    if (mod !== 'cancer_awareness') {
      onClose();
    }
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-[#F6F3F7] text-[#2A2233] z-50 overflow-y-auto pb-12 font-sans selection:bg-[#5A3577] selection:text-white">
      {/* Top Header */}
      <div className="sticky top-0 bg-[#F6F3F7]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[#E4DEE9] flex items-center justify-between z-10">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white border border-[#E4DEE9] flex items-center justify-center text-[#2A2233] hover:bg-[#EFE7F5] transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-[#2A2233]">Cancer Awareness Settings</h1>

        <button 
          onClick={handleSave}
          className="text-sm font-bold text-[#4C8F63] hover:text-[#38714C] px-2 py-1 transition-colors flex items-center gap-1"
        >
          {showSavedToast && <Check className="w-4 h-4 stroke-[3]" />}
          <span>{showSavedToast ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {showSavedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#4C8F63] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 z-50 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Settings Saved</span>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 pt-4 space-y-5">
        {/* ACTIVE GOAL Card */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#E4F0E6] text-[#4C8F63] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6275] block">
              MODULE SETTINGS
            </span>
            <div className="text-base font-bold text-[#2A2233]">Cancer-Aware</div>
            <p className="text-xs text-[#6B6275]">
              Personalized prevention and screening schedule targets.
            </p>
          </div>
        </div>

        {/* Account Switch Section */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-bold text-[#2A2233]">Account Switch</h3>
            <p className="text-xs text-[#6B6275]">Select your active health module experience.</p>
          </div>

          <div className="space-y-2.5">
            {/* Option 1: Cancer Awareness */}
            <div
              id="account-switch-cancer-modal-cancer"
              onClick={() => handleAccountSwitch('cancer_awareness')}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                currentModule === 'cancer_awareness'
                  ? 'border-2 border-[#5A3577] bg-[#EFE7F5]'
                  : 'border-[#E4DEE9] bg-white hover:bg-[#F6F3F7]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  currentModule === 'cancer_awareness' ? 'bg-white text-[#5A3577] shadow-2xs' : 'bg-[#EFE7F5] text-[#6B6275]'
                }`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-bold ${currentModule === 'cancer_awareness' ? 'text-[#5A3577]' : 'text-[#2A2233]'}`}>
                    Cancer Awareness
                  </div>
                  <div className={`text-xs ${currentModule === 'cancer_awareness' ? 'text-[#6B6275] font-medium' : 'text-[#6B6275]'}`}>
                    Cancer-Aware Nutrition & Cellular Wellness
                  </div>
                </div>
              </div>
              {currentModule === 'cancer_awareness' ? (
                <div className="w-5 h-5 rounded-full bg-[#5A3577] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#E4DEE9] shrink-0" />
              )}
            </div>

            {/* Option 2: Diabetes Awareness */}
            <div
              id="account-switch-cancer-modal-diabetes"
              onClick={() => handleAccountSwitch('diabetes_awareness')}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                currentModule === 'diabetes_awareness'
                  ? 'border-2 border-[#1769AA] bg-[#EAF5FB]'
                  : 'border-[#E4DEE9] bg-white hover:bg-[#F6F3F7]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  currentModule === 'diabetes_awareness' ? 'bg-white text-[#1769AA] shadow-2xs' : 'bg-[#EAF5FB] text-[#6B6275]'
                }`}>
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-bold ${currentModule === 'diabetes_awareness' ? 'text-[#1769AA]' : 'text-[#2A2233]'}`}>
                    Diabetes Awareness
                  </div>
                  <div className={`text-xs ${currentModule === 'diabetes_awareness' ? 'text-[#536675] font-medium' : 'text-[#6B6275]'}`}>
                    Diabetes-Friendly Eating & Glycemic Control
                  </div>
                </div>
              </div>
              {currentModule === 'diabetes_awareness' ? (
                <div className="w-5 h-5 rounded-full bg-[#1769AA] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#E4DEE9] shrink-0" />
              )}
            </div>

            {/* Option 3: 3 Modules */}
            <div
              id="account-switch-cancer-modal-3modules"
              onClick={() => handleAccountSwitch('weight_loss')}
              className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                currentModule === 'weight_loss'
                  ? 'border-2 border-[#1F7A5C] bg-[#EFF6F1]'
                  : 'border-[#E4DEE9] bg-white hover:bg-[#F6F3F7]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  currentModule === 'weight_loss' ? 'bg-white text-[#1F7A5C] shadow-2xs' : 'bg-[#EFF6F1] text-[#6B6275]'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-bold ${currentModule === 'weight_loss' ? 'text-[#1F7A5C]' : 'text-[#2A2233]'}`}>
                    3 Modules
                  </div>
                  <div className={`text-xs font-semibold mt-0.5 tracking-tight ${
                    currentModule === 'weight_loss' ? 'text-[#1F7A5C]' : 'text-[#4C5F55]'
                  }`}>
                    Weight Loss • Nutrition • AI Coach
                  </div>
                </div>
              </div>
              {currentModule === 'weight_loss' ? (
                <div className="w-5 h-5 rounded-full bg-[#1F7A5C] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#E4DEE9] shrink-0" />
              )}
            </div>
          </div>
        </div>

        {/* Cancer Awareness Settings Group */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-bold text-[#2A2233]">Cancer Awareness settings</h3>
            <p className="text-xs text-[#6B6275]">Stored strictly in the Cancer Awareness module.</p>
          </div>

          <div className="bg-[#FCFBFD] rounded-3xl border border-[#E4DEE9] shadow-xs overflow-hidden divide-y divide-[#E4DEE9]">
            {/* Screening reminders */}
            <div 
              onClick={() => setEditingField(editingField === 'screeningReminders' ? null : 'screeningReminders')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F6F3F7]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFE7F5] text-[#5A3577] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#2A2233] block">Screening reminders</span>
                  {editingField === 'screeningReminders' ? (
                    <select
                      value={localSettings.screeningReminders}
                      onChange={(e) => setLocalSettings({ ...localSettings, screeningReminders: e.target.value })}
                      className="text-xs font-bold text-[#5A3577] border-b border-[#5A3577] focus:outline-none bg-transparent"
                    >
                      <option value="Every 3 months">Every 3 months</option>
                      <option value="Every 6 months">Every 6 months</option>
                      <option value="Annually">Annually</option>
                      <option value="Off">Off</option>
                    </select>
                  ) : (
                    <span className="text-xs font-semibold text-[#6B6275] block">{localSettings.screeningReminders}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Screening history */}
            <div 
              onClick={() => setEditingField(editingField === 'screeningHistory' ? null : 'screeningHistory')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F6F3F7]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#E4F0E6] text-[#4C8F63] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#2A2233] block">Screening history</span>
                  {editingField === 'screeningHistory' ? (
                    <input
                      type="text"
                      value={localSettings.screeningHistory}
                      onChange={(e) => setLocalSettings({ ...localSettings, screeningHistory: e.target.value })}
                      className="text-xs font-bold text-[#5A3577] border-b border-[#5A3577] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-semibold text-[#6B6275] block">{localSettings.screeningHistory}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Family history */}
            <div 
              onClick={() => setEditingField(editingField === 'familyHistory' ? null : 'familyHistory')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F6F3F7]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#E1EFF2] text-[#2C7A93] flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#2A2233] block">Family history</span>
                  {editingField === 'familyHistory' ? (
                    <input
                      type="text"
                      value={localSettings.familyHistory}
                      onChange={(e) => setLocalSettings({ ...localSettings, familyHistory: e.target.value })}
                      className="text-xs font-bold text-[#5A3577] border-b border-[#5A3577] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-semibold text-[#6B6275] block">{localSettings.familyHistory}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Risk factors */}
            <div 
              onClick={() => setEditingField(editingField === 'riskFactors' ? null : 'riskFactors')}
              className="p-4 cursor-pointer hover:bg-[#F6F3F7]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#FBE7E1] text-[#E8674B] flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[#2A2233] block">Risk factors</span>
                    {editingField === 'riskFactors' ? (
                      <input
                        type="text"
                        value={localSettings.riskFactors}
                        onChange={(e) => setLocalSettings({ ...localSettings, riskFactors: e.target.value })}
                        className="text-xs font-bold text-[#5A3577] border-b border-[#5A3577] focus:outline-none bg-transparent"
                        autoFocus
                      />
                    ) : (
                      <span className="text-xs font-semibold text-[#6B6275] block">{localSettings.riskFactors}</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
              </div>
              <p className="text-[11px] text-[#8A9A92] mt-1.5 pl-12">
                Factors you'd like to keep on record - not a medical assessment.
              </p>
            </div>

            {/* Healthy lifestyle goal */}
            <div 
              onClick={() => setEditingField(editingField === 'lifestyleGoal' ? null : 'lifestyleGoal')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F6F3F7]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#E4F0E6] text-[#4C8F63] flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#2A2233] block">Healthy lifestyle goal</span>
                  {editingField === 'lifestyleGoal' ? (
                    <input
                      type="text"
                      value={localSettings.lifestyleGoal}
                      onChange={(e) => setLocalSettings({ ...localSettings, lifestyleGoal: e.target.value })}
                      className="text-xs font-bold text-[#5A3577] border-b border-[#5A3577] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-semibold text-[#6B6275] block">{localSettings.lifestyleGoal}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Reminder frequency */}
            <div 
              onClick={() => setEditingField(editingField === 'reminderFrequency' ? null : 'reminderFrequency')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F6F3F7]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFE7F5] text-[#5A3577] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-medium text-[#2A2233] block">Reminder frequency</span>
                  {editingField === 'reminderFrequency' ? (
                    <select
                      value={localSettings.reminderFrequency}
                      onChange={(e) => setLocalSettings({ ...localSettings, reminderFrequency: e.target.value })}
                      className="text-xs font-bold text-[#5A3577] border-b border-[#5A3577] focus:outline-none bg-transparent"
                    >
                      <option value="Every 3 months">Every 3 months</option>
                      <option value="Every 6 months">Every 6 months</option>
                      <option value="Annually">Annually</option>
                    </select>
                  ) : (
                    <span className="text-xs font-semibold text-[#6B6275] block">{localSettings.reminderFrequency}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
