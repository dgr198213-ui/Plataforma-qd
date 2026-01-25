import { Search } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-[600px] bg-[#192233] border border-white/10 rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <Search size={20} className="text-[#13ecc8]" />
          <input
            type="text"
            placeholder="Escribe un comando o busca un archivo..."
            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-gray-500"
            autoFocus
          />
        </div>
        <div className="p-2 max-h-[400px] overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase">Comandos Recientes</div>
          <div className="px-3 py-2 hover:bg-[#13ecc8]/20 rounded-lg cursor-pointer flex justify-between items-center group">
            <span className="text-sm">Git: Pull from origin</span>
            <span className="text-xs text-gray-500 group-hover:text-white">Ctrl+P</span>
          </div>
          <div className="px-3 py-2 hover:bg-[#13ecc8]/20 rounded-lg cursor-pointer flex justify-between items-center group">
            <span className="text-sm">File: New File</span>
            <span className="text-xs text-gray-500 group-hover:text-white">Ctrl+N</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
