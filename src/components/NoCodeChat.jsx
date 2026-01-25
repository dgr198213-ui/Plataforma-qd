import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

const NoCodeChat = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Describe lo que quieres crear y yo me encargo del código.' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '✨ He generado el código. ¿Quieres que añada algo más?'
      }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#10221f] text-white pb-24 flex flex-col">
      <div className="sticky top-0 bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">No-Code Chat</h2>
        <div className="w-6" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl p-3 ${
              msg.role === 'user'
                ? 'bg-[#13ecc8] text-[#10221f]'
                : 'bg-[#192233] border border-white/5'
            }`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#192233] border border-white/5 rounded-xl p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0d1117] border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Describe lo que quieres crear..."
            className="flex-1 bg-[#192233] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#13ecc8]/50"
          />
          <button
            onClick={sendMessage}
            className="bg-[#13ecc8] text-[#10221f] p-3 rounded-xl"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoCodeChat;
