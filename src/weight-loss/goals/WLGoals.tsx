import React, { useState } from 'react';
import { 
  ArrowLeft, Target, Sparkles, Check, Plus, 
  Flame, Footprints, Droplets, Shield 
} from 'lucide-react';
import { WLRepository } from '../data/WLRepository';
import { WLGoal } from '../data/WLTypes';

interface Props {
  onClose: () => void;
  onGoalUpdated?: (updated: WLGoal) => void;
}

export function WLGoals({ onClose, onGoalUpdated }: Props) {
  const [goal, setGoal] = useState<WLGoal>(() => WLRepository.getGoals());
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  const toggleHabit = (id: string) => {
    const updatedHabits = goal.healthyHabits.map((h) =>
      h.id === id ? { ...h, completed: !h.completed } : h
    );
    const updated = WLRepository.updateGoals({ healthyHabits: updatedHabits });
    setGoal(updated);
    onGoalUpdated?.(updated);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    const newHabit = {
      id: `h_${Date.now()}`,
      title: newHabitTitle.trim(),
      completed: false,
    };
    const updated = WLRepository.updateGoals({
      healthyHabits: [...goal.healthyHabits, newHabit],
    });
    setGoal(updated);
    setNewHabitTitle('');
    onGoalUpdated?.(updated);
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = WLRepository.updateGoals(goal);
    setGoal(updated);
    onGoalUpdated?.(updated);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  const totalToLose = Math.max(0, goal.startWeightLb - goal.goalWeightLb);
  const lostSoFar = Math.max(0, goal.startWeightLb - goal.currentWeightLb);
  const percentComplete = totalToLose > 0 ? Math.min(100, Math.round((lostSoFar / totalToLose) * 100)) : 0;

  return (
    <div className="fixed inset-0 bg-[#F6FAF7] text-[#1B2B24] z-50 overflow-y-auto pb-16 font-sans selection:bg-[#1F7A5C] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 bg-[#F6FAF7]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[#DCE6E0] flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-[#DCE6E0] flex items-center justify-center text-[#1B2B24] hover:bg-[#EFF6F1] transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A9A92]">Plan & Milestones</span>
            <h1 className="text-base font-bold text-[#1B2B24]">Goals & Habits</h1>
          </div>
        </div>

        <button
          onClick={handleSaveTargets}
          className="text-xs font-bold text-[#1F7A5C] hover:text-[#15533E] px-3 py-1.5 bg-white border border-[#DCE6E0] rounded-full transition-colors flex items-center gap-1 shadow-2xs"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Save</span>
        </button>
      </header>

      {savedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#1F7A5C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-1.5 animate-in fade-in">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Goals Updated!</span>
        </div>
      )}

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Journey Card */}
        <div className="bg-[#1F7A5C] text-white rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Weight Loss Strategy
            </span>
            <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
              {goal.targetPace}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-white/10 rounded-2xl p-2.5">
              <span className="text-[10px] text-white/70 block uppercase font-medium">Start</span>
              <span className="text-base font-black">{goal.startWeightLb} lb</span>
            </div>
            <div className="bg-white/15 rounded-2xl p-2.5 border border-white/20">
              <span className="text-[10px] text-white/80 block uppercase font-bold">Current</span>
              <span className="text-base font-black">{goal.currentWeightLb} lb</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-2.5">
              <span className="text-[10px] text-white/70 block uppercase font-medium">Goal</span>
              <span className="text-base font-black">{goal.goalWeightLb} lb</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-semibold text-white/90">
              <span>{percentComplete}% of overall target</span>
              <span>{Math.max(0, goal.currentWeightLb - goal.goalWeightLb).toFixed(1)} lb to go</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Calorie & Macro Targets */}
        <section className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#1B2B24]">Daily Targets</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#4C5F55] block mb-1">Calorie Target (kcal)</label>
              <input
                type="number"
                value={goal.dailyCalorieGoalKcal}
                onChange={(e) => setGoal({ ...goal, dailyCalorieGoalKcal: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-bold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#1F7A5C] block mb-1">Protein Target (g)</label>
              <input
                type="number"
                value={goal.dailyProteinGoalG}
                onChange={(e) => setGoal({ ...goal, dailyProteinGoalG: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-bold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#4C5F55] block mb-1">Daily Steps Target</label>
              <input
                type="number"
                value={goal.dailyStepGoal}
                onChange={(e) => setGoal({ ...goal, dailyStepGoal: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-bold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#3E8FB0] block mb-1">Water Target (L)</label>
              <input
                type="number"
                step="0.1"
                value={goal.dailyWaterGoalL}
                onChange={(e) => setGoal({ ...goal, dailyWaterGoalL: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-bold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
            </div>
          </div>
        </section>

        {/* Healthy Habits Checklist */}
        <section className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1B2B24] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1F7A5C]" />
              Healthy Daily Habits
            </h2>
            <span className="text-xs text-[#8A9A92]">
              {goal.healthyHabits.filter((h) => h.completed).length} / {goal.healthyHabits.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {goal.healthyHabits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                  habit.completed
                    ? 'bg-[#EFF6F1] border-[#1F7A5C]/40 text-[#1F7A5C]'
                    : 'bg-white border-[#DCE6E0] text-[#1B2B24] hover:bg-[#F6FAF7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      habit.completed
                        ? 'bg-[#1F7A5C] border-[#1F7A5C] text-white'
                        : 'border-[#8A9A92] bg-white'
                    }`}
                  >
                    {habit.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-semibold ${habit.completed ? 'line-through text-[#4C5F55]' : ''}`}>
                    {habit.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Habit input */}
          <form onSubmit={handleAddHabit} className="pt-2 flex gap-2">
            <input
              type="text"
              placeholder="Add custom healthy habit..."
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-medium text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#1F7A5C] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#15533E] transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
