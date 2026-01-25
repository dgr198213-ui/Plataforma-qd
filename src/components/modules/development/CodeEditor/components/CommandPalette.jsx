import { useState, useEffect, useRef } from 'react';
import { Search, FileText, Play, Save, Trash2 } from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const { files, setActiveFile, saveFile, clearTerminal } = useCodeStore();

  const commands = [
    { id: 'run', label: 'Ejecutar Código', icon: Play, action: () => console.log('Ejecutando...') },
    { id: 'save-all', label: 'Guardar Todo', icon: Save, action: () => files.forEach(f => saveFile(f.id)) },
    { id: 'clear-term', label: 'Limpiar Terminal', icon: Trash2, action: clearTerminal },
  ];

  const fileItems = files.map(f => ({
    id: `file-${f.id}`,
    label: `Abrir: ${f.name}`,
    icon: FileText,
    action: () => setActiveFile(f.id)
  }));

  const allItems = [...commands, ...fileItems];
  const filteredItems = allItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#192233] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <Search className="text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe un comando o busca un archivo..."
            className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 text-sm"
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded border border-white/10">
            <span className="text-[10px] text-gray-400 font-mono">ESC</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No se encontraron resultados para "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => { item.action(); onClose(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                    isSelected ? 'bg-[#13ecc8]/20 text-white' : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} className={isSelected ? 'text-[#13ecc8]' : 'text-gray-500'} />
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  {isSelected && <span className="text-[10px] text-[#13ecc8] font-mono">ENTER</span>}
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 bg-[#0d1117] border-t border-white/5 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">↑↓</kbd>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Navegar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">↵</kbd>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Seleccionar</span>
            </div>
          </div>
          <span className="text-[10px] text-gray-600 font-bold uppercase">{filteredItems.length} RESULTADOS</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
