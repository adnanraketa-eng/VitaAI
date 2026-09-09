import { useState } from 'react';
import { 
  ArrowLeft, Shield, Calendar, Clock, AlertTriangle, 
  HeartHandshake, ChevronRight, Check 
} from 'lucide-react';
import { CancerAwarenessSettings } from '../types';

interface Props {
  settings: CancerAwarenessSettings;
  onSaveSettings: (settings: CancerAwarenessSettings) => void;
  onClose: () => void;
}

export function CancerSettingsModal({
  settings,
  onSaveSettings,
  onClose,
}: Props) {
  const [localSettings, setLocalSettings] = useState<CancerAwarenessSettings>({ ...settings });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);

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
