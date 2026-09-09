import { useState } from 'react';
import { 
  Info, Shield, MessageSquare, Send, Sparkles, 
  Sprout, RotateCcw, Bot
} from 'lucide-react';
import { ChatMessage } from '../../types';

interface Props {
  userName?: string;
}

export function CancerCoachScreen({ userName = 'Alex' }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Chat cleared! How can I help you with your nutrition today?",
      time: '07:58 PM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    'Healthy dinner ideas',
    'Foods to avoid',
    'How much fiber do I need?'
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
    setIsTyping(true);

    // Responsive Cancer-Aware Nutrition Coaching (strictly educational, no medical diagnosis/treatment)
    setTimeout(() => {
      let reply = "Focusing on colorful, antioxidant-rich plants, whole grains, and staying well hydrated supports healthy cellular function.";
      const lower = text.toLowerCase();

      if (lower.includes('dinner') || lower.includes('ideas')) {
        reply = "A great cancer-aware dinner is a warm roasted veggie bowl: steamed broccoli, roasted carrots, spiced chickpeas, and quinoa with a lemon-tahini dressing. It delivers both protective phytochemicals and dietary fiber.";
      } else if (lower.includes('avoid') || lower.includes('limit')) {
        reply = "Evidence suggests limiting processed meats (like sausages, bacon, and hot dogs), minimizing alcohol, and reducing ultra-processed foods with high refined sugars. Choosing whole, minimally processed ingredients is the key habit.";
      } else if (lower.includes('fiber')) {
        reply = "Aiming for at least 30g of dietary fiber each day is strongly recommended. Beans, lentils, oats, berries, and leafy greens are excellent ways to hit this target smoothly.";
      } else if (lower.includes('protein')) {
        reply = "Plant-based proteins (lentils, beans, tofu, seeds) and moderate lean fish or poultry provide clean protein without the saturated fats found in high-temperature processed meats.";
      } else if (lower.includes('insight') || lower.includes('health')) {
        reply = "Your fiber and whole grain tracking today was great! Adding one extra serving of berries or dark leafy greens tomorrow will give you an extra boost of natural antioxidants.";
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: "Chat cleared! How can I help you with your nutrition today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F6F3F7] text-[#2A2233] pb-24 font-sans flex flex-col">
      {/* Header */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 bg-[#F6F3F7]/90 backdrop-blur-md z-30">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2A2233]">AI Coach</h1>
          <p className="text-xs text-[#6B6275]">Your personal nutrition expert</p>
        </div>
        <button 
          title="Coach Information"
          className="w-8 h-8 rounded-full border border-[#E4DEE9] bg-[#FCFBFD] flex items-center justify-center text-[#5A3577] shadow-2xs hover:bg-[#EFE7F5]"
        >
          <Info className="w-4 h-4" />
        </button>
      </header>

      {/* Main Container */}
      <main className="px-4 space-y-4 mt-2 flex-1 flex flex-col">
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-br from-[#EFE7F5] via-[#FCFBFD] to-[#F6F3F7] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1 max-w-[220px]">
              <h2 className="text-lg font-bold text-[#2A2233]">Hi, {userName}! 👋</h2>
              <p className="text-xs text-[#6B6275] leading-relaxed">
                I'm your AI Nutrition Coach. How can I help you today?
              </p>
            </div>

            {/* Robot Avatar Illustration */}
            <div className="w-14 h-14 rounded-2xl bg-[#5A3577] text-white flex items-center justify-center shadow-md">
              <Bot className="w-8 h-8" />
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => handleSend('Tell me my health insights today')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E4DEE9] rounded-full text-xs font-semibold text-[#2C7A93] shadow-2xs hover:bg-[#E1EFF2]"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Health Insights</span>
            </button>
            <button 
              onClick={() => handleSend('What are general cancer-aware nutrition tips?')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E4DEE9] rounded-full text-xs font-semibold text-[#5A3577] shadow-2xs hover:bg-[#EFE7F5]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Anything</span>
            </button>
          </div>
        </div>

        {/* Coach Insights Card */}
        <div className="bg-[#FCFBFD] rounded-3xl p-5 border border-[#E4DEE9] shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-[#2A2233]">Coach Insights</h3>

          <div className="bg-[#E4F0E6] rounded-2xl p-4 border border-[#4C8F63]/20 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FCFBFD] text-[#4C8F63] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-xs font-bold text-[#2A2233]">
                Great job staying on track!
              </div>
              <p className="text-xs text-[#4C5F55] leading-relaxed">
                You met your fiber and whole grain goals today. Try to increase your fruits and vegetables intake for even better cancer-aware nutrition.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FCFBFD] text-lg flex items-center justify-center shrink-0">
              🥗
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="space-y-3 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2A2233]">Chat with AI Coach</h3>
            <button 
              onClick={handleClearChat}
              className="text-xs font-semibold text-[#2C7A93] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Chat</span>
            </button>
          </div>

          {/* Messages list */}
          <div className="space-y-3 min-h-[140px] flex-1">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-[#5A3577] text-white rounded-br-none shadow-xs' 
                    : 'bg-[#FCFBFD] text-[#2A2233] border border-[#E4DEE9] rounded-bl-none shadow-xs flex items-start gap-2.5'
                }`}>
                  {msg.sender === 'ai' && (
                    <div className="p-1 rounded-full bg-[#EFE7F5] text-[#5A3577] shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}
                  <div>{msg.text}</div>
                </div>
                <span className="text-[10px] text-[#6B6275] mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-[#FCFBFD] border border-[#E4DEE9] rounded-2xl w-24 text-xs text-[#6B6275]">
                <Sparkles className="w-3.5 h-3.5 text-[#5A3577] animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="whitespace-nowrap px-3 py-1.5 bg-[#FCFBFD] border border-[#2C7A93]/30 text-[#2C7A93] rounded-full text-xs font-semibold hover:bg-[#E1EFF2] transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <div className="relative flex items-center mt-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="w-full bg-[#FCFBFD] border border-[#E4DEE9] rounded-full py-3.5 pl-4 pr-12 text-xs text-[#2A2233] focus:outline-hidden focus:border-[#5A3577] shadow-xs"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              aria-label="Send message"
              className="absolute right-1.5 w-9 h-9 rounded-full bg-[#EFE7F5] text-[#5A3577] disabled:opacity-40 flex items-center justify-center hover:bg-[#5A3577] hover:text-white transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
