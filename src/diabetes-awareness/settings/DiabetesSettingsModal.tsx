import { useState } from 'react';
import { 
  ArrowLeft, Droplet, Bell, Utensils, Footprints, 
  Scale, ChevronRight, Check 
} from 'lucide-react';
import { DiabetesAwarenessSettings } from '../types';

interface Props {
  settings: DiabetesAwarenessSettings;
  onSaveSettings: (settings: DiabetesAwarenessSettings) => void;
  onClose: () => void;
}

export function DiabetesSettingsModal({
  settings,
  onSaveSettings,
  onClose,
}: Props) {
  const [localSettings, setLocalSettings] = useState<DiabetesAwarenessSettings>({ ...settings });
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
    <div className="fixed inset-0 bg-[#F7FAFC] text-[#12324A] z-50 overflow-y-auto pb-12 font-sans selection:bg-[#1769AA] selection:text-white">
      {/* Top Bar (Matches dip11.jpg header) */}
      <div className="sticky top-0 bg-[#F7FAFC]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[#DCE7EE] flex items-center justify-between z-10">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white border border-[#DCE7EE] flex items-center justify-center text-[#12324A] hover:bg-[#EAF5FB] transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-[#12324A]">Diabetes Settings</h1>

        <button 
          onClick={handleSave}
          className="text-sm font-bold text-[#39A982] hover:text-[#1E6847] px-2 py-1 transition-colors flex items-center gap-1"
        >
          {showSavedToast && <Check className="w-4 h-4 stroke-[3]" />}
          <span>{showSavedToast ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {showSavedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#39A982] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 z-50 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Settings Saved</span>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 pt-4 space-y-5">
        {/* ACTIVE GOAL Card (Matches dip11.jpg) */}
        <div className="bg-[#EAF8F2] rounded-3xl p-4 border border-[#D1EAE0] flex items-start gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#39A982] flex items-center justify-center shrink-0 shadow-2xs">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#39A982] tracking-wider uppercase block">
              MODULE SETTINGS
            </span>
            <h2 className="text-base font-bold text-[#12324A]">Diabetes-Friendly</h2>
            <p className="text-xs text-[#536675]">
              Personalized glycemic control and reminder targets.
            </p>
          </div>
        </div>

        {/* Diabetes Settings Group (From dip11.jpg & dip12.jpg) */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-bold text-[#12324A]">Diabetes settings</h3>
            <p className="text-xs text-[#536675]">Stored strictly in the Diabetes Awareness module.</p>
          </div>

          <div className="bg-white rounded-3xl border border-[#DCE7EE] shadow-2xs divide-y divide-[#DCE7EE] overflow-hidden">
            {/* Glucose target range */}
            <div 
              onClick={() => setEditingField(editingField === 'targetRange' ? null : 'targetRange')}
              className="p-4 flex items-center justify-between hover:bg-[#F7FAFC] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#536675] font-medium block">Glucose target range</span>
                  {editingField === 'targetRange' ? (
                    <input
                      type="text"
                      value={localSettings.glucoseTargetRange}
                      onChange={(e) => setLocalSettings({ ...localSettings, glucoseTargetRange: e.target.value })}
                      className="text-xs font-bold text-[#12324A] border-b border-[#1769AA] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#12324A] block">{localSettings.glucoseTargetRange}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Glucose logging reminder */}
            <div 
              onClick={() => setEditingField(editingField === 'glucoseReminder' ? null : 'glucoseReminder')}
              className="p-4 flex items-center justify-between hover:bg-[#F7FAFC] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF5FB] text-[#4DA3D9] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#536675] font-medium block">Glucose logging reminder</span>
                  {editingField === 'glucoseReminder' ? (
                    <select
                      value={localSettings.glucoseLoggingReminder}
                      onChange={(e) => setLocalSettings({ ...localSettings, glucoseLoggingReminder: e.target.value })}
                      className="text-xs font-bold text-[#12324A] border-b border-[#1769AA] focus:outline-none bg-transparent"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Twice Daily">Twice Daily</option>
                      <option value="After Meals">After Meals</option>
                      <option value="Off">Off</option>
                    </select>
                  ) : (
                    <span className="text-xs font-bold text-[#12324A] block">{localSettings.glucoseLoggingReminder}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Meal logging reminder */}
            <div 
              onClick={() => setEditingField(editingField === 'mealReminder' ? null : 'mealReminder')}
              className="p-4 flex items-center justify-between hover:bg-[#F7FAFC] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#536675] font-medium block">Meal logging reminder</span>
                  {editingField === 'mealReminder' ? (
                    <select
                      value={localSettings.mealLoggingReminder}
                      onChange={(e) => setLocalSettings({ ...localSettings, mealLoggingReminder: e.target.value })}
                      className="text-xs font-bold text-[#12324A] border-b border-[#1769AA] focus:outline-none bg-transparent"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Before Meals">Before Meals</option>
                      <option value="Off">Off</option>
                    </select>
                  ) : (
                    <span className="text-xs font-bold text-[#12324A] block">{localSettings.mealLoggingReminder}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Daily water goal */}
            <div 
              onClick={() => setEditingField(editingField === 'waterGoal' ? null : 'waterGoal')}
              className="p-4 flex items-center justify-between hover:bg-[#F7FAFC] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF5FB] text-[#2C7A93] flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#536675] font-medium block">Daily water goal</span>
                  {editingField === 'waterGoal' ? (
                    <input
                      type="number"
                      step="0.1"
                      value={localSettings.dailyWaterGoalL}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyWaterGoalL: Number(e.target.value) || 0 })}
                      className="text-xs font-bold text-[#12324A] border-b border-[#1769AA] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#12324A] block">{localSettings.dailyWaterGoalL} L</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Daily activity goal */}
            <div 
              onClick={() => setEditingField(editingField === 'activityGoal' ? null : 'activityGoal')}
              className="p-4 flex items-center justify-between hover:bg-[#F7FAFC] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#536675] font-medium block">Daily activity goal</span>
                  {editingField === 'activityGoal' ? (
                    <input
                      type="number"
                      value={localSettings.dailyActivityGoalMin}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyActivityGoalMin: Number(e.target.value) || 0 })}
                      className="text-xs font-bold text-[#12324A] border-b border-[#1769AA] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#12324A] block">{localSettings.dailyActivityGoalMin} min</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Preferred glucose units */}
            <div 
              onClick={() => setEditingField(editingField === 'units' ? null : 'units')}
              className="p-4 flex items-center justify-between hover:bg-[#F7FAFC] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#536675] font-medium block">Preferred glucose units</span>
                  {editingField === 'units' ? (
                    <select
                      value={localSettings.preferredGlucoseUnits}
                      onChange={(e) => setLocalSettings({ ...localSettings, preferredGlucoseUnits: e.target.value as 'mg/dL' | 'mmol/L' })}
                      className="text-xs font-bold text-[#12324A] border-b border-[#1769AA] focus:outline-none bg-transparent"
                    >
                      <option value="mg/dL">mg/dL</option>
                      <option value="mmol/L">mmol/L</option>
                    </select>
                  ) : (
                    <span className="text-xs font-bold text-[#12324A] block">{localSettings.preferredGlucoseUnits}</span>
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
