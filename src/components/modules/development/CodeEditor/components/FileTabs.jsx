import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const FileTabs = () => {
  const {
    files,
    currentFileId,
    openFiles: openFileIds,
    setActiveFile,
    closeFile,
    saveFile,
    getUnsavedFiles
  } = useCodeStore();

  const [dragOverIndex, setDragOverIndex] = useState(null);

  const openFiles = (openFileIds || []).map(id => files.find(f => f.id === id)).filter(Boolean);
  const unsavedFiles = getUnsavedFiles();

  const getFileIcon = (language) => {
    const iconMap = {
      'javascript': '📄',
      'typescript': '📘',
      'python': '🐍',
      'html': '🌐',
      'css': '🎨',
      'json': '📋',
      'markdown': '📝',
      'jsx': '⚛️',
      'tsx': '⚛️',
      'default': '📄'
    };
    return iconMap[language] || iconMap.default;
  };

  const handleTabClick = (fileId) => {
    setActiveFile(fileId);
  };

  const handleCloseTab = (e, fileId) => {
    e.stopPropagation();
    closeFile(fileId);
  };

  const handleSaveTab = (e, fileId) => {
    e.stopPropagation();
    saveFile(fileId);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('tabIndex', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    // const dragIndex = parseInt(e.dataTransfer.getData('tabIndex'));
    // Reordenar pestañas si fuera necesario
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
  };

  return (
    <div className="flex bg-[#0d1117] border-b border-white/10 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
      <div className="flex items-center pl-2 pr-2 border-r border-white/10">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Editor</span>
      </div>

      <div className="flex flex-1">
        {openFiles.map((file, index) => {
          const isActive = file.id === currentFileId;
          const isUnsaved = unsavedFiles.includes(file.id);

          return (
            <div
              key={file.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                flex items-center gap-2 px-4 py-2 border-r border-white/5 min-w-[140px] max-w-[200px]
                ${isActive
                  ? 'bg-[#192233] text-white border-t-2 border-t-[#13ecc8]'
                  : 'bg-[#0d1117] text-gray-400 hover:bg-white/5'
                }
                ${dragOverIndex === index ? 'border-l-2 border-[#13ecc8]' : ''}
                transition-all cursor-pointer group relative
              `}
              onClick={() => handleTabClick(file.id)}
            >
              {/* Ícono del archivo */}
              <span className="text-sm">
                {getFileIcon(file.language)}
              </span>

              {/* Nombre del archivo */}
              <span className="flex-1 text-[11px] font-medium truncate">
                {file.name}
              </span>

              {/* Indicador de cambios sin guardar */}
              {isUnsaved && (
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 group-hover:hidden" />
                  <button
                    onClick={(e) => handleSaveTab(e, file.id)}
                    className="hidden group-hover:block p-0.5 hover:bg-white/10 rounded transition-opacity"
                    title="Guardar cambios"
                  >
                    <Save size={12} className="text-gray-400 hover:text-white" />
                  </button>
                </div>
              )}

              {/* Botón de cerrar */}
              <button
                onClick={(e) => handleCloseTab(e, file.id)}
                className={`
                  p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity
                  ${isActive ? 'hover:bg-white/20' : 'hover:bg-white/10'}
                `}
                title="Cerrar pestaña"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Espacio adicional */}
      <div className="flex-1 border-b border-white/10"></div>
    </div>
  );
};

export default FileTabs;
