import { User, Bot, Code } from 'lucide-react';

export default function MessageList({ messages, onShowCode }) {
  return (
    <div className="space-y-4">
      {messages.length === 0 && (
        <div className="text-center py-10 text-gray-500 italic text-sm">
          No hay mensajes en esta conversación. Comienza describiendo lo que quieres crear.
        </div>
      )}
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
            msg.role === 'user'
              ? 'bg-[#13ecc8] text-[#10221f] rounded-tr-none'
              : 'bg-[#192233] border border-white/5 text-gray-200 rounded-tl-none'
          }`}>
            <div className={`flex items-center gap-2 mb-2 opacity-70 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {msg.role === 'user' ? 'Tú' : 'Howard AI'}
              </span>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
            {msg.code && (
              <button
                onClick={() => onShowCode(msg)}
                className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  msg.role === 'user'
                    ? 'bg-black/20 hover:bg-black/30 text-[#10221f]'
                    : 'bg-[#13ecc8]/10 hover:bg-[#13ecc8]/20 text-[#13ecc8] border border-[#13ecc8]/20'
                }`}
              >
                <Code size={14} />
                {msg.applied ? 'Código Aplicado' : 'Ver Código Generado'}
                {msg.applied && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
              </button>
            )}
            <div className={`text-[9px] mt-2 opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
