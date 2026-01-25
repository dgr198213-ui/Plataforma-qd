import { useState, useMemo } from 'react';
import {
  Folder, FolderOpen, ChevronRight, ChevronDown,
  Search, Eye, EyeOff, FolderPlus, FilePlus, RefreshCw
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const FileExplorer = () => {
  const {
    projects = [],
    currentProjectId,
    files = [],
    createFile,
    createFolder,
    setCurrentProject,
    currentFileId,
    setActiveFile
  } = useCodeStore();

  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [searchQuery, setSearchQuery] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' | 'list'

  const projectStructure = useMemo(() => {
    const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];

    const children = files.map(file => ({
      id: file.id,
      name: file.name,
      type: 'file',
      language: file.language,
      hidden: file.name?.startsWith('.')
    }));

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
        <FolderOpen size={16} className="text-[#13ecc8]" />
      ) : (
        <Folder size={16} className="text-[#13ecc8]" />
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
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const renderTree = (items, depth = 0) => {
    return items
      .filter(item => showHidden || !item.hidden)
      .filter(item =>
        !searchQuery ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(item => {
        const isExpanded = expandedFolders.has(item.id);
        const isSelected = currentFileId === item.id;

        return (
          <div key={item.id}>
            <div
              className={`
                flex items-center gap-2 px-2 py-1.5 rounded transition-colors cursor-pointer group
                ${isSelected ? 'bg-[#13ecc8]/10 text-white' : 'text-gray-400 hover:bg-white/5'}
              `}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              onClick={() => {
                if (item.type === 'folder') toggleFolder(item.id);
                else setActiveFile(item.id);
              }}
            >
              {item.type === 'folder' && (
                <span className="w-4">
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </span>
              )}
              <span className="w-5 flex items-center justify-center">
                {getFileIcon(item)}
              </span>
              <span className={`flex-1 text-[11px] truncate ${item.hidden ? 'opacity-50 italic' : ''}`}>
                {item.name}
              </span>
            </div>

            {item.type === 'folder' && isExpanded && item.children && (
              renderTree(item.children, depth + 1)
            )}
          </div>
        );
      });
  };

  return (
    <div className="w-64 bg-[#0d1117] border-r border-white/10 flex flex-col h-full">
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Folder size={16} className="text-[#13ecc8]" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Explorador</h3>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowHidden(!showHidden)} className="p-1 hover:bg-white/10 rounded">
              {showHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <RefreshCw size={14} className="text-gray-500 cursor-pointer hover:text-white" />
          </div>
        </div>

        <div className="relative mb-2">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar archivos..."
            className="w-full bg-[#192233] border border-white/5 rounded px-6 py-1 text-[10px] text-white placeholder-gray-600 focus:outline-none focus:border-[#13ecc8]/30"
          />
        </div>

        <div className="flex gap-1">
           <button onClick={() => setViewMode('tree')} className={`flex-1 py-1 text-[8px] font-bold rounded ${viewMode === 'tree' ? 'bg-[#13ecc8] text-[#10221f]' : 'bg-[#192233] text-gray-400'}`}>ÁRBOL</button>
           <button onClick={() => setViewMode('list')} className={`flex-1 py-1 text-[8px] font-bold rounded ${viewMode === 'list' ? 'bg-[#13ecc8] text-[#10221f]' : 'bg-[#192233] text-gray-400'}`}>LISTA</button>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-white/5">
        <select
          value={currentProjectId}
          onChange={(e) => setCurrentProject(e.target.value)}
          className="w-full bg-transparent text-[10px] text-gray-400 outline-none cursor-pointer"
        >
          {projects.map(project => (
            <option key={project.id} value={project.id} className="bg-[#0d1117]">{project.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {renderTree([projectStructure])}
      </div>

      <div className="p-3 border-t border-white/10 grid grid-cols-2 gap-2">
        <button onClick={() => createFile('nuevo.js')} className="flex items-center justify-center gap-1 py-1.5 bg-[#192233] rounded text-[9px] font-bold text-gray-300 hover:text-white border border-white/5 transition-colors">
          <FilePlus size={12} /> ARCHIVO
        </button>
        <button onClick={() => createFolder('carpeta')} className="flex items-center justify-center gap-1 py-1.5 bg-[#192233] rounded text-[9px] font-bold text-gray-300 hover:text-white border border-white/5 transition-colors">
          <FolderPlus size={12} /> CARPETA
        </button>
      </div>
    </div>
  );
};

export default FileExplorer;
