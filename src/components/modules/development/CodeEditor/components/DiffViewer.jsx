import { useMemo } from 'react';
import { diffLines } from 'diff';
import { X, GitCompare } from 'lucide-react';

const DiffViewer = ({ original, modified, fileName, onClose }) => {
  const diff = useMemo(() => {
    return diffLines(original || '', modified || '');
  }, [original, modified]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-l border-white/10 animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#192233]">
        <div className="flex items-center gap-2">
          <GitCompare size={16} className="text-[#13ecc8]" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white">Comparar Cambios: {fileName}</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto font-mono text-[12px] p-4">
        {diff.map((part, idx) => {
          const lineClass = part.added 
            ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500' 
            : part.removed 
            ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500'
            : 'text-gray-400 border-l-2 border-transparent';
          
          const prefix = part.added ? '+' : part.removed ? '-' : ' ';
          
          return part.value.split('\n').map((line, lineIdx) => {
            if (!line && lineIdx === part.value.split('\n').length - 1) return null;
            
            return (
              <div key={`${idx}-${lineIdx}`} className={`${lineClass} px-3 py-0.5 flex whitespace-pre-wrap`}>
                <span className="w-6 text-gray-600 select-none shrink-0">{prefix}</span>
                <span className="flex-1">{line || ' '}</span>
              </div>
            );
          });
        })}
      </div>

      <div className="p-3 bg-[#192233] border-t border-white/10 flex justify-between items-center">
        <div className="flex gap-4 text-[10px] font-bold uppercase">
          <div className="flex items-center gap-1 text-emerald-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span>Añadido</span>
          </div>
          <div className="flex items-center gap-1 text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Eliminado</span>
          </div>
        </div>
        <span className="text-[10px] text-gray-600 font-bold uppercase">Modo Diff Howard OS</span>
      </div>
    </div>
  );
};

export default DiffViewer;
