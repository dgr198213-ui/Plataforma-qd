import { useState } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight, Play } from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const Terminal = () => {
  const { terminalOutput } = useCodeStore();
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="h-48 bg-black border-t border-white/10 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TerminalIcon size={14} className="text-[#13ecc8]" />
            <span className="text-xs font-bold uppercase tracking-wider">Terminal</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-gray-500">
            <span className="text-white border-b border-[#13ecc8]">Output</span>
            <span className="hover:text-white cursor-pointer">Debug Console</span>
            <span className="hover:text-white cursor-pointer">Problems</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"><Play size={14} /></button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"><X size={14} /></button>
        </div>
      </div>
      <div className="flex-1 p-3 font-mono text-[11px] text-green-400 overflow-auto scrollbar-thin scrollbar-thumb-gray-800">
        <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
        <div className="flex items-center gap-2 mt-2">
          <ChevronRight size={14} className="text-[#13ecc8]" />
          <span className="animate-pulse w-2 h-3 bg-[#13ecc8]"></span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
