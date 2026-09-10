import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Scale, Plus, Calendar, TrendingDown, TrendingUp, 
  Trash2, Check, AlertCircle 
} from 'lucide-react';
import { WLRepository } from '../data/WLRepository';
import { WLWeightRecord } from '../data/WLTypes';

interface Props {
  onClose: () => void;
  onWeightUpdated?: (newWeight: number) => void;
  goalWeightLb: number;
}

export function WLWeight({ onClose, onWeightUpdated, goalWeightLb }: Props) {
  const [records, setRecords] = useState<WLWeightRecord[]>([]);
  const [avg7Day, setAvg7Day] = useState<number | null>(null);
  const [weightInput, setWeightInput] = useState<string>('');
  const [noteInput, setNoteInput] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [recs, avg] = await Promise.all([
        WLRepository.getWeightRecords(),
        WLRepository.get7DayWeightAverage(),
      ]);
      setRecords(recs);
      setAvg7Day(avg);
    } catch (err) {
      console.warn('WLWeight loadData error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const latestRecord = records[0] || null;

  // Calculate trend from last 2 records
  let trend: 'down' | 'up' | 'stable' | null = null;
  let diffLb: number | null = null;
  if (records.length >= 2) {
    diffLb = parseFloat((records[0].weightLb - records[1].weightLb).toFixed(1));
    if (diffLb < 0) trend = 'down';
    else if (diffLb > 0) trend = 'up';
    else trend = 'stable';
  }

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (isNaN(val) || val <= 50 || val >= 600) {
      setError('Please enter a realistic weight between 50 and 600 lbs.');
      return;
    }

    try {
      const newRecord = await WLRepository.addWeightRecord(val, noteInput.trim() || undefined);
      const updated = [newRecord, ...records];
      setRecords(updated);
      setWeightInput('');
      setNoteInput('');
      setError(null);
      setShowAddForm(false);
      onWeightUpdated?.(val);
      const newAvg = await WLRepository.get7DayWeightAverage();
      setAvg7Day(newAvg);
    } catch (err) {
      setError('Failed to save weight record. Please check your connection.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await WLRepository.deleteWeightRecord(id);
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      if (updated[0]) {
        onWeightUpdated?.(updated[0].weightLb);
      }
      const newAvg = await WLRepository.get7DayWeightAverage();
      setAvg7Day(newAvg);
    } catch (err) {
      console.warn('Delete weight record failed:', err);
    }
  };

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
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A9A92]">Weight Tracker</span>
            <h1 className="text-base font-bold text-[#1B2B24]">Weight Journey</h1>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F7A5C] text-white text-xs font-bold rounded-full shadow-xs hover:bg-[#15533E] transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Weight</span>
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Add Weight Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddWeight}
            className="bg-white rounded-3xl p-5 border-2 border-[#1F7A5C] shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1B2B24] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#1F7A5C]" />
                Record New Weight
              </h2>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-[#8A9A92] hover:text-[#1B2B24]"
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-[#FFF1E8] border border-[#FF8B5E]/30 rounded-xl text-xs text-[#C84A22] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#4C5F55] block mb-1">Weight (lb)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 164.2"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-lg font-bold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4C5F55] block mb-1">Optional Note</label>
              <input
                type="text"
                placeholder="e.g. Morning weigh-in, fasted"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full px-4 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1F7A5C] text-white rounded-xl font-bold text-xs shadow-xs hover:bg-[#15533E] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              Save Record
            </button>
          </form>
        )}

        {/* Current Weight & Quick Stats Card */}
        <div className="bg-[#1F7A5C] text-white rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-[11px] text-white/75 block uppercase tracking-wider font-semibold">
                Latest Measured Weight
              </span>
              <div className="text-3xl font-black">
                {latestRecord ? (
                  <>
                    {latestRecord.weightLb}{' '}
                    <span className="text-base font-normal text-white/80">lb</span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-white/80">No entries yet</span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-white/75 block uppercase tracking-wider font-semibold">
                Target Weight
              </span>
              <div className="text-xl font-bold text-white/90">
                {goalWeightLb} <span className="text-xs font-normal text-white/70">lb</span>
              </div>
            </div>
          </div>

          {/* Stat Row */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
            <div className="bg-white/10 rounded-2xl p-2.5">
              <span className="text-[10px] text-white/70 block uppercase font-medium">7-Day Average</span>
              <span className="text-sm font-bold">
                {avg7Day !== null ? `${avg7Day} lb` : 'Need ≥2 entries'}
              </span>
            </div>

            <div className="bg-white/10 rounded-2xl p-2.5">
              <span className="text-[10px] text-white/70 block uppercase font-medium">Recent Trend</span>
              <span className="text-sm font-bold flex items-center gap-1">
                {trend === 'down' && (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-[#A8F2D0]" />
                    <span className="text-[#A8F2D0]">{diffLb} lb</span>
                  </>
                )}
                {trend === 'up' && (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-[#FFC4B0]" />
                    <span className="text-[#FFC4B0]">+{diffLb} lb</span>
                  </>
                )}
                {trend === 'stable' && <span>0.0 lb</span>}
                {trend === null && <span className="text-white/60">No history</span>}
              </span>
            </div>
          </div>
        </div>

        {/* History List */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1B2B24]">Recorded Weight History</h2>
            <span className="text-xs text-[#8A9A92]">{records.length} total entries</span>
          </div>

          {records.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#DCE6E0] text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center mx-auto">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#1B2B24]">No weight records yet</h3>
              <p className="text-xs text-[#8A9A92] max-w-xs mx-auto">
                Log your first weigh-in using the "Log Weight" button above to begin plotting your weight journey.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#DCE6E0] shadow-xs divide-y divide-[#E7EEE9] overflow-hidden">
              {records.map((r) => (
                <div key={r.id} className="p-3.5 flex items-center justify-between hover:bg-[#F6FAF7] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center font-black text-xs">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#1B2B24]">
                        {r.weightLb} <span className="text-xs font-normal text-[#8A9A92]">lb</span>
                      </div>
                      <div className="text-[11px] text-[#8A9A92] flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(r.recordedAt).toLocaleDateString()} · {new Date(r.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {r.note && <span className="italic">({r.note})</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 text-[#8A9A92] hover:text-[#D65A5A] rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
