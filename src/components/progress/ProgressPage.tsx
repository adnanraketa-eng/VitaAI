import { useState } from 'react';
import { 
  ArrowLeft, Calendar, MoreVertical, Droplets, Footprints, 
  TrendingDown, TrendingUp, Zap, Heart, Check, MapPin, Flag, Plus, X
} from 'lucide-react';
import { BottomTab } from '../../types';

interface Props {
  onNavigate: (tab: BottomTab) => void;
}

export function ProgressPage({ onNavigate }: Props) {
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(159.6);
  const [inputWeight, setInputWeight] = useState('159.6');

  const handleUpdateWeight = () => {
    const val = parseFloat(inputWeight);
    if (!isNaN(val) && val > 50 && val < 500) {
      setCurrentWeight(val);
    }
    setShowWeightModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] pb-28 font-sans">
      {/* Top Bar */}
      <header className="px-4 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6FAF7]/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('home')}
            className="p-1.5 -ml-1 text-[#1B2B24] hover:bg-black/5 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8A9A92] font-bold">VitaAI · Weight loss</div>
            <h1 className="text-xl font-bold tracking-tight text-[#1B2B24]">Your progress</h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="p-2 text-[#4C5F55] hover:bg-white rounded-full">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="p-2 text-[#4C5F55] hover:bg-white rounded-full">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="px-4 space-y-4 mt-2">
        {/* Dual Top Cards: Water & Steps */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-[#1B2B24]">Water</span>
              <Droplets className="w-4 h-4 text-[#3E8FB0]" />
            </div>
            <div className="text-lg font-black text-[#1B2B24] mb-2">1.8 <span className="text-xs font-normal text-[#8A9A92]">/ 2.4 L</span></div>
            <div className="w-full h-1.5 bg-[#DCE9E1] rounded-full overflow-hidden">
              <div className="h-full bg-[#3E8FB0] rounded-full" style={{ width: '75%' }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#DCE6E0] shadow-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-[#1B2B24]">Steps</span>
              <Footprints className="w-4 h-4 text-[#1F7A5C]" />
            </div>
            <div className="text-lg font-black text-[#1B2B24] mb-2">7,432 <span className="text-xs font-normal text-[#8A9A92]">/ 9k</span></div>
            <div className="w-full h-1.5 bg-[#DCE9E1] rounded-full overflow-hidden">
              <div className="h-full bg-[#1F7A5C] rounded-full" style={{ width: '82%' }} />
            </div>
          </div>
        </div>

        {/* Hero Progress Card */}
        <div className="bg-[#1F7A5C] text-white rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white">
              <Zap className="w-3.5 h-3.5 fill-current" /> On track for May
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-white/70 block uppercase tracking-wider">Current weight</span>
              <div className="text-3xl font-black">{currentWeight} <span className="text-base font-normal">lb</span></div>
              <p className="text-xs text-white/80 mt-1">You're 12.3 lb closer to your goal.</p>
            </div>

            {/* Circular Progress Indicator */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-white"
                  strokeDasharray="62, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-extrabold block">62%</span>
                <span className="text-[9px] text-white/80 block -mt-0.5">complete</span>
              </div>
            </div>
          </div>

          {/* Target / Lost / Remaining 3-col */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-center">
            <div>
              <span className="text-[10px] uppercase text-white/70 block">Target</span>
              <span className="text-sm font-bold">147.3 lb</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-white/70 block">Lost</span>
              <span className="text-sm font-bold">20.1 lb</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-white/70 block">Remaining</span>
              <span className="text-sm font-bold">12.3 lb</span>
            </div>
          </div>
        </div>

        {/* Weekly Trend Bar Chart */}
        <section className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9A92]">Weekly Trend</span>
              <h3 className="text-base font-bold text-[#1B2B24]">Steady progress</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#FFF1E8] text-[#E8A23D] rounded-full">
              This week
            </span>
          </div>

          {/* Simple Visual Bar Columns */}
          <div className="flex items-end justify-between h-28 pt-4 px-2">
            {[
              { day: 'M', h: '25%', active: false },
              { day: 'T', h: '40%', active: false },
              { day: 'W', h: '55%', active: false },
              { day: 'T', h: '65%', active: false },
              { day: 'F', h: '75%', active: false },
              { day: 'S', h: '90%', active: false },
              { day: 'S', h: '100%', active: true },
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                <div 
                  className={`w-7 rounded-lg transition-all ${bar.active ? 'bg-[#1F7A5C]' : 'bg-[#8FC7C7]'}`}
                  style={{ height: bar.h }}
                />
                <span className={`text-[11px] font-semibold ${bar.active ? 'text-[#1B2B24]' : 'text-[#8A9A92]'}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#E7EEE9] text-xs font-semibold">
            <span className="text-[#8A9A92]">Avg. weekly change</span>
            <span className="text-[#1F7A5C]">-1.8 lb</span>
          </div>
        </section>

        {/* Body Metrics: Health Snapshot */}
        <section className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9A92]">Body Metrics</span>
              <h3 className="text-base font-bold text-[#1B2B24]">Your health snapshot</h3>
            </div>
            <button className="text-xs font-semibold text-[#1F7A5C] hover:underline">Details</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#F6FAF7] rounded-2xl border border-[#DCE6E0]">
              <div className="flex justify-between items-center mb-1">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#1F7A5C]">
                  <TrendingDown className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-[#2E8B8B] font-bold flex items-center gap-0.5">
                  ↘ 1.2
                </span>
              </div>
              <div className="text-lg font-black text-[#1B2B24]">24.1</div>
              <div className="text-[11px] text-[#8A9A92]">BMI · Healthy range</div>
            </div>

            <div className="p-3 bg-[#F6FAF7] rounded-2xl border border-[#DCE6E0]">
              <div className="flex justify-between items-center mb-1">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#2E8B8B]">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-[10px] text-[#2E8B8B] font-bold flex items-center gap-0.5">
                  ↘ 0.6%
                </span>
              </div>
              <div className="text-lg font-black text-[#1B2B24]">28.4%</div>
              <div className="text-[11px] text-[#8A9A92]">Body fat</div>
            </div>

            <div className="p-3 bg-[#F6FAF7] rounded-2xl border border-[#DCE6E0]">
              <div className="flex justify-between items-center mb-1">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#FF8B5E]">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-[10px] text-[#1F7A5C] font-bold flex items-center gap-0.5">
                  ↗ 0.7 lb
                </span>
              </div>
              <div className="text-lg font-black text-[#1B2B24]">94.0 lb</div>
              <div className="text-[11px] text-[#8A9A92]">Muscle mass</div>
            </div>

            <div className="p-3 bg-[#F6FAF7] rounded-2xl border border-[#DCE6E0]">
              <div className="flex justify-between items-center mb-1">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#1F7A5C]">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-[#1F7A5C] font-bold flex items-center gap-0.5">
                  ↗ 8%
                </span>
              </div>
              <div className="text-lg font-black text-[#1B2B24]">2,140</div>
              <div className="text-[11px] text-[#8A9A92]">Calories burned</div>
            </div>
          </div>
        </section>

        {/* Transformation Table (Then -> Now -> Next) */}
        <section className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9A92]">Then → Now → Next</span>
            <h3 className="text-base font-bold text-[#1B2B24]">Your transformation</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#8A9A92] border-b border-[#E7EEE9]">
                  <th className="py-2 text-left font-semibold">Measure</th>
                  <th className="py-2 text-center font-semibold">Before</th>
                  <th className="py-2 text-center font-bold text-[#1F7A5C]">Current</th>
                  <th className="py-2 text-right font-semibold">Goal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7EEE9]">
                <tr>
                  <td className="py-2.5 font-bold text-[#1B2B24]">Weight</td>
                  <td className="py-2.5 text-center text-[#4C5F55]">179.7</td>
                  <td className="py-2.5 text-center">
                    <span className="bg-[#EFF6F1] text-[#1F7A5C] font-bold px-2.5 py-0.5 rounded-full">
                      {currentWeight}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-semibold text-[#1B2B24]">147.3 lb</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-[#1B2B24]">BMI</td>
                  <td className="py-2.5 text-center text-[#4C5F55]">27.2</td>
                  <td className="py-2.5 text-center">
                    <span className="bg-[#EFF6F1] text-[#1F7A5C] font-bold px-2.5 py-0.5 rounded-full">
                      24.1
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-semibold text-[#1B2B24]">22.2</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-[#1B2B24]">Waist</td>
                  <td className="py-2.5 text-center text-[#4C5F55]">91</td>
                  <td className="py-2.5 text-center">
                    <span className="bg-[#EFF6F1] text-[#1F7A5C] font-bold px-2.5 py-0.5 rounded-full">
                      82
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-semibold text-[#1B2B24]">76 cm</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-[#1B2B24]">Body fat</td>
                  <td className="py-2.5 text-center text-[#4C5F55]">34.1%</td>
                  <td className="py-2.5 text-center">
                    <span className="bg-[#EFF6F1] text-[#1F7A5C] font-bold px-2.5 py-0.5 rounded-full">
                      28.4%
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-semibold text-[#1B2B24]">24.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Journey Map Milestones */}
        <section className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9A92]">Journey Map</span>
            <h3 className="text-base font-bold text-[#1B2B24]">Milestones that matter</h3>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DCE9E1]">
            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#1F7A5C] text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1B2B24]">Start journey</div>
                <div className="text-[11px] text-[#8A9A92]">12 Jan 2025 · 179.7 lb</div>
              </div>
            </div>

            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#1F7A5C] text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1B2B24]">First 11 lb down</div>
                <div className="text-[11px] text-[#8A9A92]">20 Feb 2025 · Completed</div>
              </div>
            </div>

            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#FFF1E8] text-[#FF8B5E] border border-[#FF8B5E] flex items-center justify-center">
                <MapPin className="w-3 h-3" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1B2B24]">Current position</div>
                <div className="text-[11px] text-[#FF8B5E] font-semibold">{currentWeight} lb · Keep your rhythm</div>
              </div>
            </div>

            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#E7EEE9] text-[#8A9A92] flex items-center justify-center">
                <Flag className="w-3 h-3" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#8A9A92]">Goal achieved</div>
                <div className="text-[11px] text-[#8A9A92]">147.3 lb · Est. 16 May</div>
              </div>
            </div>
          </div>
        </section>

        {/* Motivational Quote Card */}
        <section className="bg-[#FFF1E8] rounded-3xl p-4 border border-[#FF8B5E]/30 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#FF8B5E] shrink-0">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1B2B24]">"Consistency is your superpower."</h4>
            <p className="text-[11px] text-[#4C5F55] mt-0.5">
              Plan one nourishing meal and a 20-minute walk today.
            </p>
          </div>
        </section>

        {/* Update Current Weight Button */}
        <button
          onClick={() => setShowWeightModal(true)}
          className="w-full py-3.5 bg-[#1F7A5C] text-white rounded-2xl font-bold text-sm shadow-xs hover:bg-[#14503C] flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Update Current Weight
        </button>
      </main>

      {/* Update Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#DCE6E0]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1B2B24]">Log New Weight</h3>
              <button onClick={() => setShowWeightModal(false)} className="text-[#8A9A92]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#4C5F55] block mb-1.5">Current Weight (lb)</label>
              <input
                type="number"
                step="0.1"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                className="w-full px-4 py-3 bg-[#EDF3EE] rounded-2xl text-xl font-bold text-[#1B2B24] focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowWeightModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-[#4C5F55] font-semibold rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateWeight}
                className="flex-1 py-2.5 bg-[#1F7A5C] text-white font-semibold rounded-xl text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
