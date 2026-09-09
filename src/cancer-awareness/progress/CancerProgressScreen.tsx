import { useState } from 'react';
import { 
  Calendar, ChevronDown, Sprout, Apple, Wheat, 
  Drumstick, Droplets, TrendingUp, TrendingDown 
} from 'lucide-react';
import { BottomTab } from '../../types';

interface Props {
  onNavigate?: (tab: BottomTab) => void;
}

export function CancerProgressScreen({ onNavigate }: Props) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [chartDays, setChartDays] = useState<'7' | '14' | '30'>('7');

  const trendData = [
    {
      id: 'fiber',
      icon: Sprout,
      name: 'Fiber',
      val: '28g avg',
      change: '↑ 15%',
      isPositive: true,
      color: '#4C8F63',
      bgColor: '#E4F0E6',
      points: 'M0,25 Q20,24 40,20 T80,14 T120,8'
    },
    {
      id: 'fruits',
      icon: Apple,
      name: 'Fruits & Vegetables',
      val: '5.2 cups',
      change: '↑ 10%',
      isPositive: true,
      color: '#2C7A93',
      bgColor: '#E1EFF2',
      points: 'M0,22 Q30,20 60,18 T100,12 T120,6'
    },
    {
      id: 'grains',
      icon: Wheat,
      name: 'Whole Grains',
      val: '3 servings',
      change: '↑ 8%',
      isPositive: true,
      color: '#C98A2B',
      bgColor: '#F7EBD8',
      points: 'M0,24 Q30,22 60,20 T90,16 T120,10'
    },
    {
      id: 'meat',
      icon: Drumstick,
      name: 'Processed Meat',
      val: '0.5 oz',
      change: '↓ 20%',
      isPositive: true, // Lower is better for processed meat limit
      color: '#B5504A',
      bgColor: '#F5E3E1',
      points: 'M0,6 Q30,8 60,14 T90,18 T120,22'
    },
    {
      id: 'water',
      icon: Droplets,
      name: 'Water Intake',
      val: '1.6 L avg',
      change: '↑ 12%',
      isPositive: true,
      color: '#2C7A93',
      bgColor: '#E1EFF2',
      points: 'M0,20 Q30,18 60,12 T90,10 T120,4'
    }
  ];

  const goals = [
    {
      id: 'g1',
      icon: Sprout,
      title: 'Increase Fiber Intake',
      subtitle: '30g daily goal',
      current: '28 / 30 g',
      pct: 93,
      color: '#4C8F63',
      bgColor: '#E4F0E6'
    },
    {
      id: 'g2',
      icon: Apple,
      title: 'Eat More Fruits & Vegetables',
      subtitle: '5 cups daily goal',
      current: '5.2 / 5 cups',
      pct: 104,
      color: '#2C7A93',
      bgColor: '#E1EFF2'
    },
    {
      id: 'g3',
      icon: Wheat,
      title: 'Whole Grains',
      subtitle: '3 servings daily goal',
      current: '3 / 3 servings',
      pct: 100,
      color: '#C98A2B',
      bgColor: '#F7EBD8'
    },
    {
      id: 'g4',
      icon: Drumstick,
      title: 'Limit Processed Meat',
      subtitle: 'Less than 1 oz daily',
      current: '0.5 / 1 oz',
      pct: 50,
      color: '#B5504A',
      bgColor: '#F5E3E1'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6F3F7] text-[#2A2233] pb-24 font-sans">
      {/* Header */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6F3F7]/90 backdrop-blur-md z-30">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2A2233]">Progress</h1>
          <p className="text-xs text-[#6B6275]">Track your health journey and improvements</p>
        </div>

        <button 
          onClick={() => setTimeRange(timeRange === 'week' ? 'month' : 'week')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FCFBFD] border border-[#E4DEE9] rounded-full text-xs font-semibold text-[#2C7A93] shadow-2xs hover:bg-[#E1EFF2]"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{timeRange === 'week' ? 'This Week' : 'This Month'}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Container */}
      <main className="px-4 space-y-4 mt-2">
        {/* Top Summary Card (4 Quadrants) */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs">
          <div className="grid grid-cols-2 gap-4 divide-x divide-[#E4DEE9]">
            {/* Left Column */}
            <div className="space-y-4 pr-2">
              <div>
                <span className="text-xs text-[#6B6275] block">Average Score</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-extrabold text-[#2C7A93]">82</span>
                  <span className="text-xs text-[#6B6275]">/100</span>
                </div>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#E1EFF2] text-[#2C7A93] text-[10px] font-bold rounded-full">
                  Good
                </span>
              </div>

              <div>
                <span className="text-xs text-[#6B6275] block">Consistency</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-extrabold text-[#2A2233]">7</span>
                  <span className="text-xs text-[#6B6275]">Days</span>
                </div>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#E4F0E6] text-[#4C8F63] text-[10px] font-bold rounded-full">
                  Great
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 pl-4">
              <div>
                <span className="text-xs text-[#6B6275] block">Total Improvement</span>
                <div className="text-2xl font-extrabold text-[#4C8F63] mt-0.5">+12</div>
                <span className="text-[11px] text-[#6B6275]">vs last week</span>
              </div>

              <div>
                <span className="text-xs text-[#6B6275] block">Goal Progress</span>
                <div className="text-2xl font-extrabold text-[#2C7A93] mt-0.5">75%</div>
                <div className="w-full h-1.5 bg-[#E1EFF2] rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-[#2C7A93] rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Score Over Time Card */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2A2233]">Nutrition Score Over Time</h3>
            <button 
              onClick={() => setChartDays(chartDays === '7' ? '14' : '7')}
              className="flex items-center gap-1 text-xs text-[#6B6275] border border-[#E4DEE9] px-2.5 py-1 rounded-lg hover:bg-[#F6F3F7]"
            >
              <span>{chartDays} Days</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Value Labels */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#2A2233]">
            <span>72</span>
            <span>76</span>
            <span>79</span>
            <span>75</span>
            <span>92</span>
            <span>78</span>
            <span className="bg-[#2C7A93] text-white rounded-md py-0.5 text-[11px] shadow-2xs font-bold">
              87
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-28 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
              <defs>
                <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2C7A93" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2C7A93" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#E4DEE9" strokeWidth="0.75" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#E4DEE9" strokeWidth="0.75" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="#E4DEE9" strokeWidth="0.75" />

              {/* Area Fill */}
              <path
                d="M 15 50 Q 55 42 100 36 T 150 44 T 200 15 T 250 38 T 285 22 L 285 80 L 15 80 Z"
                fill="url(#scoreArea)"
              />

              {/* Curve Stroke */}
              <path
                d="M 15 50 Q 55 42 100 36 T 150 44 T 200 15 T 250 38 T 285 22"
                fill="none"
                stroke="#2C7A93"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="15" cy="50" r="3.5" fill="#FCFBFD" stroke="#2C7A93" strokeWidth="2" />
              <circle cx="58" cy="42" r="3.5" fill="#FCFBFD" stroke="#2C7A93" strokeWidth="2" />
              <circle cx="103" cy="36" r="3.5" fill="#FCFBFD" stroke="#2C7A93" strokeWidth="2" />
              <circle cx="148" cy="44" r="3.5" fill="#FCFBFD" stroke="#2C7A93" strokeWidth="2" />
              <circle cx="193" cy="15" r="3.5" fill="#FCFBFD" stroke="#2C7A93" strokeWidth="2" />
              <circle cx="238" cy="38" r="3.5" fill="#FCFBFD" stroke="#2C7A93" strokeWidth="2" />
              <circle cx="285" cy="22" r="4.5" fill="#2C7A93" stroke="#FCFBFD" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Date Axis Labels */}
          <div className="grid grid-cols-7 text-center text-[10px] text-[#6B6275]">
            <span>Aug 9</span>
            <span>Aug 10</span>
            <span>Aug 11</span>
            <span>Aug 12</span>
            <span>Aug 13</span>
            <span>Aug 14</span>
            <span className="font-semibold text-[#2C7A93]">Aug 15</span>
          </div>
        </div>

        {/* Nutrient Trends Horizontal Scroll */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2A2233]">Nutrient Trends</h3>
            <button className="text-xs font-semibold text-[#2C7A93] hover:underline">
              View All
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
            {trendData.map((trend) => {
              const Icon = trend.icon;
              return (
                <div 
                  key={trend.id}
                  className="min-w-[130px] bg-[#FCFBFD] rounded-2xl p-3 border border-[#E4DEE9] shadow-xs flex flex-col justify-between shrink-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: trend.bgColor, color: trend.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#2A2233] leading-tight">
                    {trend.name}
                  </span>
                  <div className="text-sm font-extrabold mt-1" style={{ color: trend.color }}>
                    {trend.val}
                  </div>
                  
                  <div className="text-[10px] text-[#6B6275] flex items-center gap-1 mt-0.5">
                    <span className="font-semibold" style={{ color: trend.color }}>{trend.change}</span>
                    <span>vs last week</span>
                  </div>

                  {/* Sparkline curve */}
                  <div className="h-6 w-full mt-2">
                    <svg className="w-full h-full" viewBox="0 0 120 30">
                      <path
                        d={trend.points}
                        fill="none"
                        stroke={trend.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Goal Progress Section */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2A2233]">Goal Progress</h3>
            <button className="text-xs font-semibold text-[#2C7A93] hover:underline">
              Edit Goals
            </button>
          </div>

          <div className="space-y-4">
            {goals.map((g) => {
              const Icon = g.icon;
              return (
                <div key={g.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: g.bgColor, color: g.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#2A2233]">{g.title}</div>
                        <div className="text-[11px] text-[#6B6275]">{g.subtitle}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#2A2233]">{g.current}</span>
                      <span className="text-xs font-semibold ml-1.5" style={{ color: g.color }}>
                        {g.pct}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-[#F6F3F7] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, g.pct)}%`, 
                        backgroundColor: g.color 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
