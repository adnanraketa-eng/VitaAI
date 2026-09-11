import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Scale, Target, Activity, Footprints, 
  Droplet, Flame, Beef, Utensils, ChevronRight, Check, Sparkles,
  Wheat, Egg, Leaf, AlertCircle, Trash2, Loader2
} from 'lucide-react';
import { WeightLossSettings } from '../../types';
import { WLRepository } from '../data/WLRepository';
import { ProfileRepository } from '../../core/profile';

interface Props {
  settings: WeightLossSettings;
  onSaveSettings: (settings: WeightLossSettings) => void;
  onClose: () => void;
}

export function WLSettings({
  settings,
  onSaveSettings,
  onClose,
}: Props) {
  const [localSettings, setLocalSettings] = useState<WeightLossSettings>(() => ({
    ...settings,
    dailyCarbsGoalG: settings.dailyCarbsGoalG ?? 200,
    dailyFatGoalG: settings.dailyFatGoalG ?? 65,
    dailyFiberGoalG: settings.dailyFiberGoalG ?? 30,
  }));
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await ProfileRepository.deleteAccount();
      try {
        sessionStorage.setItem('vita_auth_notice', 'Your account has been deleted.');
      } catch {
        // Storage access error fallback
      }
      onClose();
    } catch (err: unknown) {
      setIsDeleting(false);
      const message =
        err instanceof Error ? err.message : 'An error occurred while deleting your account.';
      setDeleteError(message);
    }
  };

  useEffect(() => {
    let active = true;
    WLRepository.getGoals()
      .then((goals) => {
        if (active && goals) {
          setLocalSettings((prev) => ({
            ...prev,
            dailyCarbsGoalG: prev.dailyCarbsGoalG ?? goals.dailyCarbsGoalG ?? 200,
            dailyFatGoalG: prev.dailyFatGoalG ?? goals.dailyFatGoalG ?? 65,
            dailyFiberGoalG: prev.dailyFiberGoalG ?? goals.dailyFiberGoalG ?? 30,
          }));
        }
      })
      .catch((err) => {
        console.warn('WLSettings load goals error:', err);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    setErrorMessage(null);
    try {
      await WLRepository.updateGoals({
        dailyCalorieGoalKcal: localSettings.dailyCalorieGoalKcal,
        dailyProteinGoalG: localSettings.dailyProteinGoalG,
        dailyCarbsGoalG: localSettings.dailyCarbsGoalG ?? 200,
        dailyFatGoalG: localSettings.dailyFatGoalG ?? 65,
        dailyFiberGoalG: localSettings.dailyFiberGoalG ?? 30,
        dailyWaterGoalL: localSettings.dailyWaterGoalL,
        dailyStepGoal: localSettings.dailyStepGoal,
        currentWeightLb: localSettings.currentWeightLb,
        goalWeightLb: localSettings.goalWeightLb,
        targetPace: localSettings.targetPace,
      });
      onSaveSettings(localSettings);
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
        onClose();
      }, 600);
    } catch (err) {
      console.warn('Save settings failed:', err);
      setErrorMessage('Failed to save settings. Please try again.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
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

        <h1 className="text-base font-bold">Weight Loss Personal Settings</h1>

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

      {errorMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 z-50 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 pt-4 space-y-5">
        {/* Module Header Card */}
        <div className="bg-[#EFF6F1] rounded-3xl p-4 border border-[#DCE6E0] flex items-start gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#1F7A5C] flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#1F7A5C] tracking-wider uppercase block">
              MODULE-SPECIFIC SETTINGS
            </span>
            <h2 className="text-base font-bold text-[#1B2B24]">Weight Loss & Deficit Strategy</h2>
            <p className="text-xs text-[#4C5F55]">
              These preferences configure your calorie targets, pace, and macros.
            </p>
          </div>
        </div>

        {/* Weight & Activity Targets */}
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
                      onChange={(e) => setLocalSettings({ ...localSettings, currentWeightLb: parseFloat(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-[#DCE6E0] rounded-lg text-sm font-bold text-[#1B2B24]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1B2B24]">{localSettings.currentWeightLb} lb</span>
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
                      onChange={(e) => setLocalSettings({ ...localSettings, goalWeightLb: parseFloat(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-[#DCE6E0] rounded-lg text-sm font-bold text-[#1B2B24]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1B2B24]">{localSettings.goalWeightLb} lb</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Target Pace */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Target pace</span>
                  <span className="text-sm font-bold text-[#1B2B24]">{localSettings.targetPace}</span>
                </div>
              </div>
              <select
                value={localSettings.targetPace}
                onChange={(e) => setLocalSettings({ ...localSettings, targetPace: e.target.value })}
                className="bg-[#EFF6F1] text-[#1F7A5C] text-xs font-bold px-3 py-1.5 rounded-full border border-[#DCE6E0] focus:outline-none"
              >
                <option value="0.5 lb / week">0.5 lb / week (Gentle)</option>
                <option value="1 lb / week">1 lb / week (Standard)</option>
                <option value="1.5 lb / week">1.5 lb / week (Accelerated)</option>
                <option value="2 lb / week">2 lb / week (Max deficit)</option>
              </select>
            </div>

            {/* Activity Level */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Activity level</span>
                  <span className="text-sm font-bold text-[#1B2B24]">{localSettings.activityLevel}</span>
                </div>
              </div>
              <select
                value={localSettings.activityLevel}
                onChange={(e) => setLocalSettings({ ...localSettings, activityLevel: e.target.value })}
                className="bg-[#EFF6F1] text-[#1F7A5C] text-xs font-bold px-3 py-1.5 rounded-full border border-[#DCE6E0] focus:outline-none"
              >
                <option value="Sedentary">Sedentary (desk job)</option>
                <option value="Light">Light (1-2 workouts/wk)</option>
                <option value="Moderate">Moderate (3-5 workouts/wk)</option>
                <option value="Very Active">Very Active (6+ workouts/wk)</option>
              </select>
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
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyStepGoal: parseInt(e.target.value) || 0 })}
                      className="w-28 px-2 py-1 border border-[#DCE6E0] rounded-lg text-sm font-bold text-[#1B2B24]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1B2B24]">{localSettings.dailyStepGoal.toLocaleString()} steps</span>
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
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#3E8FB0] flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Daily water goal</span>
                  {editingField === 'waterGoal' ? (
                    <input
                      type="number"
                      step="0.1"
                      value={localSettings.dailyWaterGoalL}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyWaterGoalL: parseFloat(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-[#DCE6E0] rounded-lg text-sm font-bold text-[#1B2B24]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1B2B24]">{localSettings.dailyWaterGoalL} L</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>
          </div>
        </div>

        {/* Nutrition & Macro Goals */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-bold text-[#1B2B24]">Daily Nutrition & Macros</h3>
            <p className="text-xs text-[#8A9A92]">Caloric budget and protein targets.</p>
          </div>

          <div className="bg-white rounded-3xl border border-[#DCE6E0] shadow-2xs divide-y divide-[#E7EEE9] overflow-hidden">
            {/* Daily Calorie Goal */}
            <div 
              onClick={() => setEditingField(editingField === 'calorieGoal' ? null : 'calorieGoal')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Daily calorie target</span>
                  {editingField === 'calorieGoal' ? (
                    <input
                      type="number"
                      value={localSettings.dailyCalorieGoalKcal}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyCalorieGoalKcal: parseInt(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-[#DCE6E0] rounded-lg text-sm font-bold text-[#1B2B24]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1B2B24]">{localSettings.dailyCalorieGoalKcal} kcal</span>
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
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#2E8B8B] flex items-center justify-center">
                  <Beef className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Daily protein target</span>
                  {editingField === 'proteinGoal' ? (
                    <input
                      type="number"
                      value={localSettings.dailyProteinGoalG}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyProteinGoalG: parseInt(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-[#DCE6E0] rounded-lg text-sm font-bold text-[#1B2B24]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1B2B24]">{localSettings.dailyProteinGoalG} g</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Daily Carbohydrate Target */}
            <div 
              onClick={() => setEditingField(editingField === 'carbsGoal' ? null : 'carbsGoal')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#D97706] flex items-center justify-center">
                  <Wheat className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Daily carbohydrate target</span>
                  {editingField === 'carbsGoal' ? (
                    <input
                      type="number"
                      value={localSettings.dailyCarbsGoalG ?? 200}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyCarbsGoalG: parseInt(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-[#DCE6E0] rounded-lg text-sm font-bold text-[#1B2B24]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1B2B24]">{localSettings.dailyCarbsGoalG ?? 200} g</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Daily Fat Target */}
            <div 
              onClick={() => setEditingField(editingField === 'fatGoal' ? null : 'fatGoal')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#FF8B5E] flex items-center justify-center">
                  <Egg className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Daily fat target</span>
                  {editingField === 'fatGoal' ? (
                    <input
                      type="number"
                      value={localSettings.dailyFatGoalG ?? 65}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyFatGoalG: parseInt(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-[#DCE6E0] rounded-lg text-sm font-bold text-[#1B2B24]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1B2B24]">{localSettings.dailyFatGoalG ?? 65} g</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>

            {/* Daily Fiber Target */}
            <div 
              onClick={() => setEditingField(editingField === 'fiberGoal' ? null : 'fiberGoal')}
              className="p-4 flex items-center justify-between hover:bg-[#F6FAF7] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#8A9A92] font-medium block">Daily fiber target</span>
                  {editingField === 'fiberGoal' ? (
                    <input
                      type="number"
                      value={localSettings.dailyFiberGoalG ?? 30}
                      onChange={(e) => setLocalSettings({ ...localSettings, dailyFiberGoalG: parseInt(e.target.value) || 0 })}
                      className="w-24 px-2 py-1 border border-[#DCE6E0] rounded-lg text-sm font-bold text-[#1B2B24]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#1B2B24]">{localSettings.dailyFiberGoalG ?? 30} g</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8A9A92]" />
            </div>
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-bold text-[#1B2B24]">Food Preferences</h3>
            <p className="text-xs text-[#8A9A92]">Select dietary focuses that shape AI suggestions.</p>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-[#DCE6E0] shadow-2xs space-y-2">
            <div className="flex flex-wrap gap-2">
              {['High-protein', 'Balanced whole foods', 'Low-carb', 'Mediterranean', 'Vegetarian', 'Intermittent fasting'].map((pref) => {
                const isSelected = localSettings.dietaryPreferences.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setLocalSettings({
                          ...localSettings,
                          dietaryPreferences: localSettings.dietaryPreferences.filter((p) => p !== pref),
                        });
                      } else {
                        setLocalSettings({
                          ...localSettings,
                          dietaryPreferences: [...localSettings.dietaryPreferences, pref],
                        });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#1F7A5C] border-[#1F7A5C] text-white shadow-2xs'
                        : 'bg-[#F6FAF7] border-[#DCE6E0] text-[#4C5F55] hover:bg-[#EFF6F1]'
                    }`}
                  >
                    {pref} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="pt-2 pb-6">
          <button
            type="button"
            id="btn-delete-account-settings"
            onClick={() => {
              setDeleteError(null);
              setShowDeleteConfirm(true);
            }}
            className="w-full py-3.5 px-4 bg-white border border-[#D65A5A]/30 text-[#D65A5A] hover:bg-[#FFF1F0] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-4 h-4 text-[#D65A5A]" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          id="modal-delete-account-confirm"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-[#DCE6E0] space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#1B2B24]">Delete Account?</h3>
              <p className="text-xs text-[#4C5F55] leading-relaxed">
                This will permanently delete your VitaAI account and associated data. This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div
                id="delete-account-error-msg"
                className="p-3 bg-[#FFF1F0] border border-[#D65A5A]/30 rounded-xl text-xs text-[#D65A5A] flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-[#D65A5A]" />
                <span className="font-medium">{deleteError}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                id="btn-cancel-delete"
                disabled={isDeleting}
                onClick={() => {
                  if (!isDeleting) {
                    setShowDeleteConfirm(false);
                    setDeleteError(null);
                  }
                }}
                className="flex-1 py-2.5 px-4 bg-[#F6FAF7] border border-[#DCE6E0] text-[#4C5F55] hover:bg-[#EFF6F1] rounded-xl font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-delete"
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 px-4 bg-[#D65A5A] hover:bg-[#C04848] text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Account</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
