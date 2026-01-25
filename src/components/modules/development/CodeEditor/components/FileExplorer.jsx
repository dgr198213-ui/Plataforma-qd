import { useState } from 'react';
import {
  Folder, FolderOpen, ChevronDown,
  Search, Trash2, FilePlus, RefreshCw
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const FileExplorer = () => {
  const {
    files,
    createFile,
    deleteFile,
    switchFile,
    currentFileId
  } = useCodeStore();
  const [searchQuery, setSearchQuery] = useState('');

  const getFileIcon = (language) => {
    const iconMap = {
      'javascript': '📄',
      'jsx': '⚛️',
      'typescript': '📘',
      'html': '🌐',
      'css': '🎨',
      'json': '📋',
      'default': '📄'
    };
    return <span className="text-sm">{iconMap[language] || iconMap.default}</span>;
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-[#0d1117] border-r border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Folder size={16} className="text-blue-400" />
            <h3 className="text-sm font-bold">EXPLORADOR</h3>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-white/10 rounded transition-colors" title="Refrescar"><RefreshCw size={14} /></button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative mb-2">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar archivos..."
            className="w-full bg-[#192233] border border-white/10 rounded-lg px-6 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#13ecc8]/50"
          />
        </div>
      </div>

      {/* List of Files */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center gap-2 px-2 py-1.5 text-blue-400">
          <ChevronDown size={14} />
          <FolderOpen size={16} />
          <span className="text-sm font-bold">src</span>
        </div>

        <div className="ml-4 space-y-1">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              onClick={() => switchFile(file.id)}
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded transition-colors cursor-pointer group
                ${file.id === currentFileId ? 'bg-[#13ecc8]/20 text-white' : 'hover:bg-white/5 text-gray-400'}
              `}
            >
              {getFileIcon(file.language)}
              <span className="flex-1 text-sm truncate">{file.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); if (confirm('¿Eliminar archivo?')) deleteFile(file.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => createFile('nuevo-archivo.js', 'javascript')}
          className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-[#192233] rounded-lg text-xs hover:bg-[#192233]/80 transition-colors"
        >
          <FilePlus size={12} />
          Nuevo Archivo
        </button>
      </div>
    </div>
  );
};

export default FileExplorer;
