import { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Bot, User, Bell, ArrowLeft, 
  RotateCcw, Check, RefreshCw 
} from 'lucide-react';
import { BottomTab, UserSharedProfile, WeightLossSettings } from '../../types';
import { WLRepository } from '../data/WLRepository';
import { WLCoachMessage } from '../data/WLTypes';

interface Props {
  profile: UserSharedProfile;
  settings: WeightLossSettings;
  onNavigate: (tab: BottomTab) => void;
}

export function WLCoach({ profile, settings, onNavigate }: Props) {
  const initialGreeting: WLCoachMessage = {
    id: 'init',
    sender: 'ai',
    text: `Hello ${profile.fullName.trim().split(' ')[0] || 'there'}! I'm your dedicated Weight Loss & Nutrition Coach. I have your current weight (${settings.currentWeightLb} lb), goal (${settings.goalWeightLb} lb), and daily targets loaded. How can I support your deficit and meal plan today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<WLCoachMessage[]>([initialGreeting]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    WLRepository.getCoachMessages()
      .then((existing) => {
        if (active && existing.length > 0) {
          setMessages(existing);
        }
      })
      .catch((err) => {
        console.warn('WLCoach load messages error:', err);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickChips = [
    'How do I hit my protein goal today?',
    'Healthy high-volume snacks under 150 kcal',
    'Evaluate my calorie deficit for this week',
    'Tips to manage evening sugar cravings',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    try {
      const userMsg = await WLRepository.addCoachMessage('user', query.trim());
      setMessages((prev) => [...prev, userMsg]);
      if (!textToSend) setInput('');
      setIsLoading(true);

      // Prepare real context from repository
      const [latestWeightRecord, todaySummary, todayWater, todayActivity] = await Promise.all([
        WLRepository.getLatestWeight(),
        WLRepository.getTodayNutritionSummary(settings.dailyCalorieGoalKcal),
        WLRepository.getTodayWaterL(),
        WLRepository.getTodayActivity(),
      ]);
      const latestWeight = latestWeightRecord?.weightLb || settings.currentWeightLb;

      const systemContext = `
You are the VitaAI Weight Loss and Nutrition Coach.
User: ${profile.fullName} (Age: ${profile.age || 'N/A'}, Sex: ${profile.gender || 'N/A'}, Height: ${profile.heightCm || 'N/A'}cm).
Current Weight: ${latestWeight} lb | Goal Weight: ${settings.goalWeightLb} lb | Target Pace: ${settings.targetPace}.
Daily Targets: ${settings.dailyCalorieGoalKcal} kcal, ${settings.dailyProteinGoalG}g Protein, ${settings.dailyWaterGoalL}L Water, ${settings.dailyStepGoal} Steps.
Today's Real Stats:
- Calories logged: ${todaySummary.calories} kcal (${todaySummary.remainingCalories} kcal left)
- Protein logged: ${todaySummary.proteinG}g / ${settings.dailyProteinGoalG}g
- Hydration: ${todayWater}L
- Steps: ${todayActivity.steps}
- Dietary Preferences: ${settings.dietaryPreferences.join(', ')}

Guidelines:
- Give compassionate, science-grounded, empathetic nutritional and weight-loss advice.
- Stay strictly in Weight Loss mode; do not introduce unsolicited Cancer or Diabetes medical treatments.
- Keep response concise, structured with bullet points where helpful, and encouraging.
      `.trim();

      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `${systemContext}\n\nUser Question: ${query.trim()}`,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data.text || data.response || data.message || "I'm analyzing your weight loss journey. Focus on steady protein intake and hydration today!";
          const aiMsg = await WLRepository.addCoachMessage('ai', replyText);
          setMessages((prev) => [...prev, aiMsg]);
        } else {
          throw new Error('AI service error');
        }
      } catch (err) {
        // Fallback context-aware response
        let fallback = `Based on your daily goal of ${settings.dailyCalorieGoalKcal} kcal and ${settings.dailyProteinGoalG}g of protein, `;
        if (todaySummary.proteinG < settings.dailyProteinGoalG * 0.5) {
          fallback += `you still need ${settings.dailyProteinGoalG - todaySummary.proteinG}g of protein today. Prioritize lean chicken, Greek yogurt, or a whey shake with your next meal!`;
        } else {
          fallback += `you're on great track with your macros today. Maintain consistent hydration (${todayWater}/${settings.dailyWaterGoalL}L logged) to stay energized.`;
        }

        const aiMsg = await WLRepository.addCoachMessage('ai', fallback);
        setMessages((prev) => [...prev, aiMsg]);
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      console.warn('Error sending coach message:', err);
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await WLRepository.clearCoachMessages();
      setMessages([
        {
          id: `fresh_${Date.now()}`,
          sender: 'ai',
          text: `Conversation cleared. How can I assist your weight loss journey today, ${profile.fullName.trim().split(' ')[0]}?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.warn('Clear coach history failed:', err);
    }
  };

  const firstName = profile.fullName.trim().split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] flex flex-col pb-24 font-sans selection:bg-[#1F7A5C] selection:text-white">
      {/* Top App Bar */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6FAF7]/95 backdrop-blur-md z-20 border-b border-[#DCE6E0]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] border border-[#1F7A5C]/20 text-[#1F7A5C] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-sm text-[#1B2B24]">AI Nutrition Coach</h1>
              <span className="text-[10px] font-bold bg-[#EFF6F1] text-[#1F7A5C] px-1.5 py-0.2 rounded-full">
                Weight Loss
              </span>
            </div>
            <span className="text-[11px] text-[#8A9A92] block -mt-0.5">
              Calorie Deficit & Macro Specialist
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="p-2 text-[#8A9A92] hover:text-[#1B2B24] rounded-full hover:bg-black/5"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onNavigate('profile')} 
            className="w-9 h-9 bg-[#DCE9E1] text-[#1F7A5C] rounded-full flex items-center justify-center border border-[#1F7A5C]/20 hover:opacity-90 font-bold text-xs"
            title="Profile"
          >
            {firstName[0] || 'V'}
          </button>
        </div>
      </header>

      {/* Messages Thread */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isAI = m.sender === 'ai';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isAI ? 'justify-start' : 'justify-end'} animate-in fade-in`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-full bg-[#EFF6F1] border border-[#DCE6E0] text-[#1F7A5C] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-3xl px-4 py-3 text-xs leading-relaxed ${
                  isAI
                    ? 'bg-white border border-[#DCE6E0] text-[#1B2B24] shadow-2xs'
                    : 'bg-[#1F7A5C] text-white shadow-2xs font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`text-[9px] mt-1.5 flex justify-end ${
                    isAI ? 'text-[#8A9A92]' : 'text-white/70'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs text-[#8A9A92] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[#EFF6F1] flex items-center justify-center text-[#1F7A5C]">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <span>Coach is analyzing your nutrition targets...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input & Quick Chips Area */}
      <div className="sticky bottom-16 bg-[#F6FAF7]/95 backdrop-blur-md border-t border-[#DCE6E0] p-3 max-w-md w-full mx-auto space-y-2">
        {/* Quick prompt suggestions */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1 bg-white border border-[#DCE6E0] rounded-full text-[11px] font-semibold text-[#4C5F55] hover:border-[#1F7A5C] hover:text-[#1F7A5C] whitespace-nowrap transition-colors shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Text Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask your coach anything about weight loss..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-white border border-[#DCE6E0] rounded-2xl text-xs font-medium text-[#1B2B24] placeholder-[#8A9A92] focus:outline-none focus:border-[#1F7A5C] shadow-2xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-[#1F7A5C] text-white flex items-center justify-center shadow-xs hover:bg-[#15533E] disabled:opacity-50 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
