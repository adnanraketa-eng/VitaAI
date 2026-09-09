import { useState } from 'react';
import { 
  Info, Bot, Send, User, Sparkles, Sprout, Utensils, 
  ShieldCheck, Droplets, Salad, X, RefreshCw
} from 'lucide-react';
import { ChatMessage } from '../../types';

interface Props {
  userName?: string;
}

export function DiabetesCoachScreen({ userName = 'Alex' }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "You're doing well today. Your protein intake is strong and you're close to your daily goal.",
      time: '9:30 AM'
    },
    {
      id: '2',
      sender: 'user',
      text: 'What should I have for dinner?',
      time: '9:31 AM'
    },
    {
      id: '3',
      sender: 'ai',
      text: "Try grilled salmon with vegetables and a small portion of quinoa. It's a balanced option with protein, fiber and healthy fats.",
      time: '9:32 AM'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  const quickPrompts = [
    'Healthy dinner ideas',
    'Foods to avoid',
    'How much carbs per meal?',
    'Snacks for stable glucose'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputVal('');

    setIsTyping(true);
    setTimeout(() => {
      let reply = "Focusing on low-glycemic carbohydrates combined with high-fiber greens and lean protein helps maintain stable energy levels and smoother glucose curves.";
      const lower = text.toLowerCase();
      if (lower.includes('dinner')) {
        reply = "Grilled chicken breast or tofu paired with steamed broccoli and a half cup of brown rice or quinoa is a delicious, diabetes-friendly dinner choice.";
      } else if (lower.includes('avoid')) {
        reply = "Consider moderating highly refined grains, sugary beverages, and concentrated fruit syrups. Choosing whole fruits provides fiber that tempers glycemic absorption.";
      } else if (lower.includes('carb')) {
        reply = "A common awareness target is roughly 30–45g of quality carbohydrates per meal, prioritizing complex sources like legumes, lentils, oats, and non-starchy vegetables.";
      } else if (lower.includes('snack')) {
        reply = "Great low-GI snacks include a handful of raw almonds, celery sticks with natural peanut butter, or Greek yogurt topped with fresh blueberries.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Hi ${userName}, I'm here to support your daily diabetes-friendly nutrition and wellness habits. What would you like to explore?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#12324A] pb-24 font-sans selection:bg-[#1769AA] selection:text-white">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 sticky top-0 bg-[#F7FAFC]/95 backdrop-blur-md z-30 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#12324A]">AI Coach</h1>
          <p className="text-xs text-[#536675] mt-0.5">Your personal nutrition expert</p>
        </div>

        <button 
          onClick={() => setShowSafetyModal(true)}
          className="w-9 h-9 rounded-full bg-white border border-[#DCE7EE] text-[#1769AA] flex items-center justify-center shadow-2xs hover:bg-[#EAF5FB] transition-colors"
          title="Medical Disclaimer & Safety"
        >
          <Info className="w-5 h-5 text-[#1769AA]" />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-4 space-y-4 mt-2">
        {/* Top Hero Banner (Matching dip9.jpg) */}
        <div className="bg-gradient-to-r from-[#EAF5FB] via-[#F4F9FD] to-[#EAF8F2] rounded-3xl p-5 border border-[#DCE7EE] shadow-2xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1 max-w-[200px]">
              <h2 className="text-lg font-bold text-[#12324A]">
                Hi, {userName}! 👋
              </h2>
              <p className="text-xs text-[#536675] leading-relaxed">
                I'm your AI Nutrition Coach. How can I help you today?
              </p>
            </div>

            {/* Friendly Robot Avatar */}
            <div className="w-16 h-16 rounded-3xl bg-[#1769AA] text-white flex flex-col items-center justify-center shadow-sm relative shrink-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              </div>
              <span className="w-4 h-1 rounded-full bg-[#4DA3D9]" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#39A982] flex items-center justify-center text-white border-2 border-white">
                <Sparkles className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => handleSend("Tell me about nutrition advice for stable glucose")}
              className="px-3 py-1.5 bg-white text-[#12324A] text-xs font-semibold rounded-full border border-[#DCE7EE] shadow-2xs hover:bg-[#EAF5FB] transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Sprout className="w-3.5 h-3.5 text-[#39A982]" />
              <span>Nutrition Advice</span>
            </button>

            <button
              onClick={() => handleSend("Can you suggest healthy meal ideas?")}
              className="px-3 py-1.5 bg-white text-[#12324A] text-xs font-semibold rounded-full border border-[#DCE7EE] shadow-2xs hover:bg-[#EAF5FB] transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Utensils className="w-3.5 h-3.5 text-[#1769AA]" />
              <span>Meal Ideas</span>
            </button>

            <button
              onClick={() => handleSend("How can I keep my blood sugar stable throughout the day?")}
              className="px-3 py-1.5 bg-white text-[#12324A] text-xs font-semibold rounded-full border border-[#DCE7EE] shadow-2xs hover:bg-[#EAF5FB] transition-colors flex items-center gap-1.5 shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#39A982]" />
              <span>Stable Glucose</span>
            </button>
          </div>
        </div>

        {/* Coach Insights Card (Matching dip9.jpg) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-[#12324A] px-1">Coach Insights</h3>
          
          <div className="bg-[#EAF8F2] rounded-3xl p-4 border border-[#D1EAE0] shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#39A982] flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div className="space-y-1 flex-1">
              <h4 className="text-xs font-bold text-[#1E6847]">
                Great job staying on track!
              </h4>
              <p className="text-xs text-[#12324A] leading-relaxed">
                You met your fiber and whole grain goals today. Try to increase your fruits and vegetables intake for even better diabetes-friendly nutrition.
              </p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-white/70 text-[#39A982] flex items-center justify-center shrink-0">
              <Salad className="w-5 h-5 text-[#39A982]" />
            </div>
          </div>
        </div>

        {/* Chat Thread (Matching dip9.jpg & dip10.jpg) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-[#12324A]">Chat with AI Coach</h3>
            <button 
              onClick={handleClearChat}
              className="text-xs font-semibold text-[#1769AA] hover:text-[#12324A] transition-colors"
            >
              Clear Chat
            </button>
          </div>

          <div className="space-y-3">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {isAi && (
                      <div className="w-7 h-7 rounded-full bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center shrink-0 mb-1">
                        <Droplets className="w-3.5 h-3.5 fill-current" />
                      </div>
                    )}

                    <div 
                      className={`p-3.5 rounded-3xl text-xs leading-relaxed ${
                        isAi 
                          ? 'bg-white text-[#12324A] border border-[#DCE7EE] shadow-2xs rounded-bl-sm' 
                          : 'bg-[#1769AA] text-white shadow-2xs rounded-br-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {!isAi && (
                      <div className="w-7 h-7 rounded-full bg-[#12324A] text-white flex items-center justify-center shrink-0 mb-1">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#536675] mt-1 px-9">
                    {msg.time}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#EAF5FB] text-[#1769AA] flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-[#DCE7EE] px-4 py-2.5 rounded-2xl flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1769AA] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1769AA] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1769AA] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#DCE7EE] text-xs font-semibold text-[#12324A] hover:bg-[#EAF5FB] transition-colors shrink-0 shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-20 pt-2 bg-gradient-to-t from-[#F7FAFC] via-[#F7FAFC] to-transparent">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-white rounded-full border border-[#DCE7EE] p-1.5 shadow-md"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-4 py-1.5 text-xs text-[#12324A] placeholder-[#536675] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-9 h-9 rounded-full bg-[#4DA3D9] text-white flex items-center justify-center hover:bg-[#1769AA] disabled:opacity-40 transition-colors shrink-0"
              aria-label="Send"
            >
              <Send className="w-4 h-4 -rotate-45" />
            </button>
          </form>
        </div>
      </main>

      {/* Safety / Educational Disclaimer Modal */}
      {showSafetyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 border border-[#DCE7EE] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#DCE7EE] pb-2">
              <div className="flex items-center gap-2 text-[#1769AA]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-sm text-[#12324A]">Educational Awareness Only</h3>
              </div>
              <button 
                onClick={() => setShowSafetyModal(false)}
                className="w-7 h-7 rounded-full bg-[#F7FAFC] text-[#536675] flex items-center justify-center hover:bg-[#DCE7EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#536675] leading-relaxed">
              VitaAI Diabetes Awareness is strictly an educational tool to encourage healthy lifestyle habits and nutritional balance.
            </p>

            <ul className="text-xs text-[#12324A] space-y-2 list-disc pl-4">
              <li>It does not provide diagnosis or confirm diabetic status.</li>
              <li>It does not prescribe medication or calculate insulin dosage.</li>
              <li>Always consult a certified healthcare professional or endocrinologist for clinical diagnosis and medical management.</li>
            </ul>

            <button
              onClick={() => setShowSafetyModal(false)}
              className="w-full py-2.5 bg-[#1769AA] text-white font-bold text-xs rounded-2xl hover:bg-[#12324A] transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
