import React, { useState } from 'react';
import { 
  ArrowLeft, Droplets, Plus, RotateCcw, Check, 
  Calendar, Trash2 
} from 'lucide-react';
import { WLRepository } from '../data/WLRepository';
import { WLWaterRecord } from '../data/WLTypes';

interface Props {
  goalWaterL: number;
  onClose: () => void;
  onWaterUpdated?: () => void;
}

export function WLWater({ goalWaterL, onClose, onWaterUpdated }: Props) {
  const [todayWater, setTodayWater] = useState<number>(() => WLRepository.getTodayWaterL());
  const [records, setRecords] = useState<WLWaterRecord[]>(() => WLRepository.getWaterRecords());
  const [customAmountMl, setCustomAmountMl] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const percent = Math.min(100, Math.round((todayWater / goalWaterL) * 100));

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 1500);
  };

  const handleAddWaterL = (amountL: number) => {
    WLRepository.addWater(amountL);
    const updatedTotal = WLRepository.getTodayWaterL();
    setTodayWater(updatedTotal);
    setRecords(WLRepository.getWaterRecords());
    showToast(`+${(amountL * 1000).toFixed(0)} ml logged!`);
    onWaterUpdated?.();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const ml = parseFloat(customAmountMl);
    if (!isNaN(ml) && ml > 0 && ml <= 5000) {
      handleAddWaterL(ml / 1000);
      setCustomAmountMl('');
    }
  };

  const handleResetToday = () => {
    WLRepository.clearTodayWater();
    setTodayWater(0);
    setRecords(WLRepository.getWaterRecords());
    showToast('Today’s water reset.');
    onWaterUpdated?.();
  };

  return (
    <div className="fixed inset-0 bg-[#F6FAF7] text-[#1B2B24] z-50 overflow-y-auto pb-16 font-sans selection:bg-[#3E8FB0] selection:text-white">
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
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A9A92]">Hydration</span>
            <h1 className="text-base font-bold text-[#1B2B24]">Today's Water</h1>
          </div>
        </div>

        <button
          onClick={handleResetToday}
          className="text-xs text-[#8A9A92] hover:text-[#D65A5A] flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Today
        </button>
      </header>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-[#3E8FB0] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Progress Card */}
        <div className="bg-[#3E8FB0] text-white rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-[11px] text-white/80 block uppercase tracking-wider font-semibold">
                Logged Hydration
              </span>
              <div className="text-4xl font-black">
                {todayWater.toFixed(1)} <span className="text-lg font-normal text-white/80">L</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-white/80 block uppercase tracking-wider font-semibold">
                Daily Goal
              </span>
              <div className="text-2xl font-bold">
                {goalWaterL.toFixed(1)} <span className="text-sm font-normal text-white/70">L</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-white/90">
              <span>{percent}% Completed</span>
              <span>{Math.max(0, goalWaterL - todayWater).toFixed(1)} L Remaining</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Log Buttons */}
        <section className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#1B2B24]">Quick Add</h2>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => handleAddWaterL(0.25)}
              className="p-3 bg-[#EFF6F1] hover:bg-[#DCE9E1] border border-[#DCE6E0] rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Droplets className="w-5 h-5 text-[#3E8FB0]" />
              <span className="text-xs font-bold text-[#1B2B24]">+250 ml</span>
              <span className="text-[10px] text-[#8A9A92]">1 Glass</span>
            </button>

            <button
              onClick={() => handleAddWaterL(0.5)}
              className="p-3 bg-[#EFF6F1] hover:bg-[#DCE9E1] border border-[#DCE6E0] rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Droplets className="w-5 h-5 text-[#3E8FB0]" />
              <span className="text-xs font-bold text-[#1B2B24]">+500 ml</span>
              <span className="text-[10px] text-[#8A9A92]">1 Bottle</span>
            </button>

            <button
              onClick={() => handleAddWaterL(0.75)}
              className="p-3 bg-[#EFF6F1] hover:bg-[#DCE9E1] border border-[#DCE6E0] rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Droplets className="w-5 h-5 text-[#3E8FB0]" />
              <span className="text-xs font-bold text-[#1B2B24]">+750 ml</span>
              <span className="text-[10px] text-[#8A9A92]">Large Flask</span>
            </button>
          </div>

          {/* Custom Amount Form */}
          <form onSubmit={handleAddCustom} className="pt-2 flex gap-2">
            <input
              type="number"
              placeholder="Custom amount (ml)"
              value={customAmountMl}
              onChange={(e) => setCustomAmountMl(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-bold text-[#1B2B24] focus:outline-none focus:border-[#3E8FB0]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#3E8FB0] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#2F7492] transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </form>
        </section>

        {/* Water History */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#1B2B24]">Recent Water Logs</h2>

          {records.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-[#DCE6E0] text-center space-y-1">
              <p className="text-xs font-bold text-[#1B2B24]">No water entries recorded</p>
              <p className="text-[11px] text-[#8A9A92]">Use the quick buttons above to track your daily hydration.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#DCE6E0] shadow-xs divide-y divide-[#E7EEE9] overflow-hidden max-h-60 overflow-y-auto">
              {records.map((rec) => (
                <div key={rec.id} className="p-3 flex items-center justify-between hover:bg-[#F6FAF7]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#EFF6F1] text-[#3E8FB0] flex items-center justify-center">
                      <Droplets className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1B2B24]">
                        {(rec.amountL * 1000).toFixed(0)} ml ({rec.amountL} L)
                      </span>
                      <span className="text-[10px] text-[#8A9A92] block">
                        {new Date(rec.loggedAt).toLocaleDateString()} at {new Date(rec.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#3E8FB0] bg-[#EFF6F1] px-2 py-0.5 rounded-full">
                    Logged
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
