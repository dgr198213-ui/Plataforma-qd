import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const FileTabs = () => {
  const {
    files,
    activeFileId,
    setActiveFile,
    closeFile,
    saveFile,
    unsavedFiles
  } = useCodeStore();

  const [dragOverIndex, setDragOverIndex] = useState(null);

  const openFiles = files; // Simplified: Assuming all files in store are "open" tabs in this simplified version

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
    const file = files.find(f => f.id === fileId);
    if (file) {
      saveFile(fileId, file.content);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('tabIndex', index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('tabIndex'));

    if (dragIndex !== dropIndex) {
      // Reordenar pestañas
      // Esto requeriría una acción adicional en el store para persistir el orden si se desea
    }

    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragOverIndex(null);
  };

  const handleContextMenu = (e, fileId) => {
    e.preventDefault();
    console.log('Context menu for file:', fileId);
  };

  return (
    <div className="flex bg-[#0d1117] border-b border-white/10 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
      <div className="flex items-center pl-2">
        <span className="text-xs text-gray-500">EDITOR</span>
      </div>

      <div className="flex flex-1">
        {openFiles.map((file, index) => {
          const isActive = file.id === activeFileId;
          const isUnsaved = unsavedFiles.includes(file.id);

          return (
            <div
              key={file.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onContextMenu={(e) => handleContextMenu(e, file.id)}
              className={`
                flex items-center gap-2 px-4 py-2 border-r border-white/5 min-w-[180px] max-w-[240px]
                ${isActive
                  ? 'bg-[#192233] text-white'
                  : 'bg-[#0d1117] text-gray-400 hover:bg-white/5'
                }
                ${dragOverIndex === index ? 'border-l-2 border-[#13ecc8]' : ''}
                transition-colors cursor-pointer group
              `}
              onClick={() => handleTabClick(file.id)}
            >
              {/* Ícono del archivo */}
              <span className="text-sm">
                {getFileIcon(file.language)}
              </span>

              {/* Nombre del archivo */}
              <span className="flex-1 text-xs font-medium truncate">
                {file.name}
                {file.isNew && (
                  <span className="ml-1 text-[10px] text-[#13ecc8]">(nuevo)</span>
                )}
              </span>

              {/* Indicador de cambios sin guardar */}
              {isUnsaved && (
                <div className="flex items-center gap-1">
                  <AlertCircle size={10} className="text-yellow-500 animate-pulse" />
                  <button
                    onClick={(e) => handleSaveTab(e, file.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-opacity"
                    title="Guardar cambios"
                  >
                    <Save size={12} className="text-gray-400" />
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

      {/* Espacio adicional si no hay suficientes pestañas */}
      <div className="flex-1 border-b border-white/10"></div>
    </div>
  );
};

export default FileTabs;
