import { Home, FileText, TrendingUp, Bot, User, LucideIcon } from 'lucide-react';
import { BottomTab, ActiveModule } from '../types';

interface Props {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  activeModule?: ActiveModule;
}

export function BottomNavigation({ activeTab, onTabChange, activeModule = 'weight_loss' }: Props) {
  const tabs: { id: BottomTab; label: string; icon: LucideIcon }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: FileText },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'coach', label: 'AI Coach', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const isCancerAwareness = activeModule === 'cancer_awareness';
  const isDiabetesAwareness = activeModule === 'diabetes_awareness';

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#E7EEE9] px-3 py-2 z-40">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          let activePillClass = 'bg-[#DCE9E1] text-[#1F7A5C]';
          let activeTextClass = 'text-[#1F7A5C] font-semibold';

          if (isCancerAwareness) {
            activePillClass = 'bg-[#EFE7F5] text-[#5A3577]';
            activeTextClass = 'text-[#5A3577] font-semibold';
          } else if (isDiabetesAwareness) {
            activePillClass = 'bg-[#EAF5FB] text-[#1769AA]';
            activeTextClass = 'text-[#1769AA] font-semibold';
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 transition-colors"
            >
              <div
                className={`flex items-center justify-center w-14 h-8 rounded-full transition-all ${
                  isActive ? activePillClass : 'text-[#8A9A92] hover:text-[#4C5F55]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 ${
                  isActive ? activeTextClass : 'text-[#8A9A92]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
