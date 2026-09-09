import { useState } from 'react';
import { 
  ArrowLeft, Scale, Target, Activity, Footprints, 
  Droplet, Flame, Beef, Utensils, ChevronRight, Check, Sparkles 
} from 'lucide-react';
import { WeightLossSettings } from '../../types';

interface Props {
  settings: WeightLossSettings;
  onSaveSettings: (settings: WeightLossSettings) => void;
  onClose: () => void;
}

export function WeightLossSettingsModal({
  settings,
  onSaveSettings,
  onClose,
}: Props) {
  const [localSettings, setLocalSettings] = useState<WeightLossSettings>({ ...settings });
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
    <div className="fixed inset-0 bg-[#F6FAF7] text-[#1B2B24] z-50 overflow-y-auto pb-12 font-sans selection:bg-[#1F7A5C] selection:text-white">
      {/* Top Header */}
      <div className="sticky top-0 bg-[#F6FAF7]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[#DCE6E0] flex items-center justify-between z-10">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white border border-[#DCE6E0] flex items-center justify-center text-[#1B2B24] hover:bg-[#EFF6F1] transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold">Weight Loss Settings</h1>

        <button 
          onClick={handleSave}
          className="text-sm font-bold text-[#1F7A5C] hover:text-[#15533E] px-2 py-1 transition-colors flex items-center gap-1"
        >
          {showSavedToast && <Check className="w-4 h-4 stroke-[3]" />}
          <span>{showSavedToast ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {showSavedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#1F7A5C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 z-50 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Settings Saved</span>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 pt-4 space-y-5">
        {/* Active Goal Header */}
        <div className="bg-[#EFF6F1] rounded-3xl p-4 border border-[#DCE6E0] flex items-start gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#1F7A5C] flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#1F7A5C] tracking-wider uppercase block">
              MODULE SETTINGS
            </span>
            <h2 className="text-base font-bold text-[#1B2B24]">Weight Loss & Management</h2>
            <p className="text-xs text-[#4C5F55]">
              Personalized metrics and targets for your weight goals.
            </p>
          </div>
        </div>

        {/* Settings Group */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-bold text-[#1B2B24]">Weight & Activity Targets</h3>
            <p className="text-xs text-[#8A9A92]">Stored strictly in the Weight Loss module.</p>
          </div>

          <div className="bg-white rounded-3xl border border-[#DCE6E0] shadow-2xs divide-y divide-[#E7EEE9] overflow-hidden">
            {/* Current Weight */}
            <div 
              onClick={() => setEditingField(editingField === 'currentWeight' ? null : 'currentWeight')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Current weight</span>
                  {editingField === 'currentWeight' ? (
                    <input
                      type="number"
                      step="0.1"
                      value={localSettings.currentWeightLb}
                      onChange={(e) => setLocalSettings({ ...localSettings, currentWeightLb: Number(e.target.value) || 0 })}
                      className="text-xs font-bold text-[#1F7A5C] border-b border-[#1F7A5C] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#1F7A5C] block">{localSettings.currentWeightLb} lb</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Goal Weight */}
            <div 
              onClick={() => setEditingField(editingField === 'goalWeight' ? null : 'goalWeight')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Goal weight</span>
                  {editingField === 'goalWeight' ? (
                    <input
                      type="number"
                      step="0.1"
                      value={localSettings.goalWeightLb}
                      onChange={(e) => setLocalSettings({ ...localSettings, goalWeightLb: Number(e.target.value) || 0 })}
                      className="text-xs font-bold text-[#1B2B24] border-b border-[#1F7A5C] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#1B2B24] block">{localSettings.goalWeightLb} lb</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Target Pace */}
            <div 
              onClick={() => setEditingField(editingField === 'targetPace' ? null : 'targetPace')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Target pace</span>
                  {editingField === 'targetPace' ? (
                    <select
                      value={localSettings.targetPace}
                      onChange={(e) => setLocalSettings({ ...localSettings, targetPace: e.target.value })}
                      className="text-xs font-bold text-[#1B2B24] border-b border-[#1F7A5C] focus:outline-none bg-transparent"
                    >
                      <option value="0.5 lb / week">0.5 lb / week (Gentle)</option>
                      <option value="1.0 lb / week">1.0 lb / week (Steady)</option>
                      <option value="1.5 lb / week">1.5 lb / week (Active)</option>
                      <option value="2.0 lb / week">2.0 lb / week (Intensive)</option>
                    </select>
                  ) : (
                    <span className="text-xs font-bold text-[#1B2B24] block">{localSettings.targetPace}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Activity Level */}
            <div 
              onClick={() => setEditingField(editingField === 'activityLevel' ? null : 'activityLevel')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Activity level</span>
                  {editingField === 'activityLevel' ? (
                    <select
                      value={localSettings.activityLevel}
                      onChange={(e) => setLocalSettings({ ...localSettings, activityLevel: e.target.value })}
                      className="text-xs font-bold text-[#1B2B24] border-b border-[#1F7A5C] focus:outline-none bg-transparent"
                    >
                      <option value="Sedentary">Sedentary</option>
                      <option value="Lightly active">Lightly active</option>
                      <option value="Moderately active">Moderately active</option>
                      <option value="Very active">Very active</option>
                    </select>
                  ) : (
                    <span className="text-xs font-bold text-[#1B2B24] block">{localSettings.activityLevel}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Daily Step Goal */}
            <div 
              onClick={() => setEditingField(editingField === 'stepGoal' ? null : 'stepGoal')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Daily step goal</span>
                  {editingField === 'stepGoal' ? (
                    <input
                      type="number"
                      value={localSettings.dailyStepGoal}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyStepGoal: Number(e.target.value) || 0 })}
                      className="text-xs font-bold text-[#1B2B24] border-b border-[#1F7A5C] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#1B2B24] block">{localSettings.dailyStepGoal.toLocaleString()} steps</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Daily Water Goal */}
            <div 
              onClick={() => setEditingField(editingField === 'waterGoal' ? null : 'waterGoal')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Daily water goal</span>
                  {editingField === 'waterGoal' ? (
                    <input
                      type="number"
                      step="0.1"
                      value={localSettings.dailyWaterGoalL}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyWaterGoalL: Number(e.target.value) || 0 })}
                      className="text-xs font-bold text-[#1B2B24] border-b border-[#1F7A5C] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#1B2B24] block">{localSettings.dailyWaterGoalL} L</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Daily Calorie Goal */}
            <div 
              onClick={() => setEditingField(editingField === 'calorieGoal' ? null : 'calorieGoal')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Daily calorie goal</span>
                  {editingField === 'calorieGoal' ? (
                    <input
                      type="number"
                      value={localSettings.dailyCalorieGoalKcal}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyCalorieGoalKcal: Number(e.target.value) || 0 })}
                      className="text-xs font-bold text-[#1B2B24] border-b border-[#1F7A5C] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#1B2B24] block">{localSettings.dailyCalorieGoalKcal} kcal</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Daily Protein Goal */}
            <div 
              onClick={() => setEditingField(editingField === 'proteinGoal' ? null : 'proteinGoal')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Beef className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Daily protein goal</span>
                  {editingField === 'proteinGoal' ? (
                    <input
                      type="number"
                      value={localSettings.dailyProteinGoalG}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyProteinGoalG: Number(e.target.value) || 0 })}
                      className="text-xs font-bold text-[#1B2B24] border-b border-[#1F7A5C] focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#1B2B24] block">{localSettings.dailyProteinGoalG} g</span>
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
