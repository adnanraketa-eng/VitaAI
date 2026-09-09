import { useState } from 'react';
import { Info, Sparkles, Send, User, Trash2 } from 'lucide-react';
import { ChatMessage } from '../../types';

export function CoachPage() {
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
  const [inputText, setInputText] = useState('');

  const suggestions = [
    'Healthy dinner ideas',
    'Foods to avoid',
    'How much protein do I need?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate responsive coach reply
    setTimeout(() => {
      let reply = "I'm keeping track of your calories and macros. Let's make sure we meet today's hydration target as well!";
      const lower = text.toLowerCase();
      if (lower.includes('dinner')) {
        reply = "For dinner, aim for 30-40g of lean protein, paired with roasted asparagus or zucchini, and a palm-sized portion of complex carbs.";
      } else if (lower.includes('avoid')) {
        reply = "Focus on avoiding ultra-processed snacks with hidden refined sugars and trans fats. Opt for whole foods with high satiety.";
      } else if (lower.includes('protein')) {
        reply = "Your target is 95-120g of protein daily based on your weight loss trajectory to preserve lean muscle mass during deficit.";
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  const handleClear = () => {
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: "Hello! I am your VitaAI Nutrition Coach. How can I support your weight loss journey today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F6FAF7] text-[#1B2B24] pb-32 font-sans flex flex-col">
      {/* Top Header */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6FAF7]/90 backdrop-blur-md z-30">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1B2B24]">AI Coach</h1>
          <p className="text-xs text-[#4C5F55]">Your personal nutrition expert</p>
        </div>
        <button className="p-2 text-[#8A9A92] hover:text-[#1B2B24] rounded-full">
          <Info className="w-5 h-5" />
        </button>
      </header>

      {/* Subheader */}
      <div className="px-5 py-2 flex items-center justify-between border-b border-[#E7EEE9]">
        <span className="text-xs font-bold text-[#8A9A92] uppercase tracking-wider">
          Chat with AI Coach
        </span>
        <button
          onClick={handleClear}
          className="text-xs font-semibold text-[#8A9A92] hover:text-[#D65A5A] flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Chat
        </button>
      </div>

      {/* Messages Feed */}
      <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] ${isAi ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}
            >
              {isAi ? (
                <div className="w-8 h-8 rounded-full bg-[#EFF6F1] border border-[#DCE6E0] flex items-center justify-center text-[#1F7A5C] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#DCE9E1] text-[#1F7A5C] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}

              <div>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isAi
                      ? 'bg-white border border-[#DCE6E0] text-[#1B2B24] rounded-tl-xs shadow-xs'
                      : 'bg-[#1F7A5C] text-white rounded-tr-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`text-[10px] text-[#8A9A92] mt-1 ${isAi ? 'text-left pl-1' : 'text-right pr-1'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Suggestion Chips & Chat Input Box */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 bg-[#F6FAF7]/95 backdrop-blur-md pt-2 pb-2 space-y-2 z-30">
        {/* Suggestion Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
          {suggestions.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pill)}
              className="px-3 py-1.5 bg-white border border-[#DCE6E0] text-[#1B2B24] text-xs font-semibold rounded-full shrink-0 shadow-xs hover:bg-[#EFF6F1]"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Text Input Row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white rounded-full border border-[#DCE6E0] pl-4 pr-1.5 py-1.5 shadow-xs"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent text-xs text-[#1B2B24] placeholder-[#8A9A92] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-full bg-[#1F7A5C] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#14503C] transition-all shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
