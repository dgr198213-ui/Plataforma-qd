import { useState, useMemo } from 'react';
import {
  Folder, FolderOpen, ChevronRight, ChevronDown,
  Search, Eye, EyeOff, FolderPlus, FilePlus, RefreshCw
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const FileExplorer = ({ onSelectFile }) => {
  const {
    projects,
    currentProjectId,
    files,
    createFile,
    createFolder,
    setCurrentProject
  } = useCodeStore();

  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' | 'list' | 'grid'
  const [showHidden, setShowHidden] = useState(false);

  // Estructura de proyecto basada en los archivos reales del store
  const projectStructure = useMemo(() => {
    const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];

    const children = files.map(file => ({
      id: file.id,
      name: file.name,
      type: 'file',
      language: file.language,
      hidden: file.name.startsWith('.')
    }));

    // Mock folders based on names if they have slashes (not implemented here for simplicity)

    return {
      id: 'root',
      name: currentProject?.name || 'Proyecto Howard',
      type: 'folder',
      children: children
    };
  }, [projects, currentProjectId, files]);

  const getFileIcon = (item) => {
    if (item.type === 'folder') {
      return expandedFolders.has(item.id) ? (
        <FolderOpen size={16} className="text-blue-400" />
      ) : (
        <Folder size={16} className="text-blue-400" />
      );
    }

    const iconMap = {
      'javascript': '📄',
      'jsx': '⚛️',
      'tsx': '📘',
      'html': '🌐',
      'css': '🎨',
      'json': '📋',
      'markdown': '📝',
      'env': '🔧',
      'binary': '📦',
      'default': '📄'
    };

    return <span className="text-sm">{iconMap[item.language] || iconMap.default}</span>;
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderTree = (items, depth = 0) => {
    return items
      .filter(item => showHidden || !item.hidden)
      .filter(item =>
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.children && item.children.some(child =>
          child.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
      .map(item => {
        const isExpanded = expandedFolders.has(item.id);
        const isSelected = selectedItem === item.id;

        return (
          <div key={item.id}>
            {/* Elemento del árbol */}
            <div
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded transition-colors cursor-pointer
                ${isSelected ? 'bg-[#13ecc8]/20 text-white' : 'hover:bg-white/5'}
              `}
              style={{ paddingLeft: `${depth * 20 + 12}px` }}
              onClick={() => {
                if (item.type === 'folder') {
                  toggleFolder(item.id);
                } else {
                  setSelectedItem(item.id);
                  if (onSelectFile) {
                    onSelectFile(item);
                  } else {
                    useCodeStore.getState().setActiveFile(item.id);
                  }
                }
              }}
            >
              {/* Chevron para carpetas */}
              {item.type === 'folder' && (
                <span className="w-4">
                  {isExpanded ? (
                    <ChevronDown size={14} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={14} className="text-gray-500" />
                  )}
                </span>
              )}

              {/* Icono */}
              <span className="w-5 flex items-center justify-center">
                {getFileIcon(item)}
              </span>

              {/* Nombre */}
              <span className={`
                flex-1 text-sm truncate
                ${item.hidden ? 'text-gray-500 italic' : ''}
              `}>
                {item.name}
                {item.hidden && <span className="ml-1 text-xs">(oculto)</span>}
              </span>

              {/* Indicadores */}
              {item.type === 'folder' && item.children && (
                <span className="text-xs text-gray-500 px-1.5">
                  {item.children.filter(c => !c.hidden || showHidden).length}
                </span>
              )}
            </div>

            {/* Renderizar hijos si es carpeta expandida */}
            {item.type === 'folder' && isExpanded && item.children && (
              renderTree(item.children, depth + 1)
            )}
          </div>
        );
      });
  };

  return (
    <div className="w-64 bg-[#0d1117] border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Folder size={16} className="text-blue-400" />
            <h3 className="text-sm font-bold">EXPLORADOR</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowHidden(!showHidden)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title={showHidden ? "Ocultar archivos" : "Mostrar ocultos"}
            >
              {showHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              onClick={() => {/* Refrescar */}}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Refrescar"
            >
              <RefreshCw size={14} />
            </button>
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
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Filtros y vista */}
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('tree')}
            className={`flex-1 px-2 py-1 text-xs rounded ${viewMode === 'tree' ? 'bg-[#13ecc8] text-[#10221f]' : 'bg-[#192233]'}`}
          >
            Árbol
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 px-2 py-1 text-xs rounded ${viewMode === 'list' ? 'bg-[#13ecc8] text-[#10221f]' : 'bg-[#192233]'}`}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 px-2 py-1 text-xs rounded ${viewMode === 'grid' ? 'bg-[#13ecc8] text-[#10221f]' : 'bg-[#192233]'}`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Selector de proyecto */}
      <div className="px-3 py-2 border-b border-white/10">
        <select
          value={currentProjectId}
          onChange={(e) => setCurrentProject(e.target.value)}
          className="w-full bg-[#192233] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#13ecc8]/50"
        >
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Árbol de archivos */}
      <div className="flex-1 overflow-y-auto p-2">
        {renderTree([projectStructure])}
      </div>

      {/* Acciones rápidas */}
      <div className="p-3 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => createFile('nuevo-archivo.js', 'javascript')}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-[#192233] rounded-lg text-xs hover:bg-[#192233]/80 transition-colors"
          >
            <FilePlus size={12} />
            Nuevo Archivo
          </button>
          <button
            onClick={() => createFolder('nueva-carpeta')}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-[#192233] rounded-lg text-xs hover:bg-[#192233]/80 transition-colors"
          >
            <FolderPlus size={12} />
            Nueva Carpeta
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
