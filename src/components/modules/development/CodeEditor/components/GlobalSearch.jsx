import { useState, useMemo } from 'react';
import { Search, FileText, X, ChevronRight } from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { files, setActiveFile } = useCodeStore();

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    
    const searchResults = [];
    files.forEach(file => {
      const lines = file.content.split('\n');
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            fileId: file.id,
            fileName: file.name,
            lineContent: line.trim(),
            lineNumber: index + 1
          });
        }
      });
    });
    return searchResults;
  }, [query, files]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#192233] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <Search className="text-[#13ecc8]" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en todos los archivos..."
            className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 text-sm"
            autoFocus
          />
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {query.length < 2 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Escribe al menos 2 caracteres para buscar...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No se encontraron coincidencias para "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveFile(result.fileId); onClose(); }}
                  className="w-full flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <FileText size={12} />
                    <span>{result.fileName}</span>
                    <ChevronRight size={10} />
                    <span className="text-[#13ecc8]">Línea {result.lineNumber}</span>
                  </div>
                  <div className="text-sm text-gray-300 font-mono truncate pl-5 border-l border-white/10">
                    {result.lineContent}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-[#0d1117] border-t border-white/5 text-[10px] text-gray-600 font-bold uppercase flex justify-between">
          <span>{results.length} COINCIDENCIAS ENCONTRADAS</span>
          <span>SISTEMA DE BÚSQUEDA HOWARD OS</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
