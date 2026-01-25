import { useState, useMemo } from 'react';
import {
  Folder, FolderOpen, ChevronRight, ChevronDown,
  Search, Eye, EyeOff, FolderPlus, FilePlus, RefreshCw, Trash2
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const FileExplorer = () => {
  const {
    files = [],
    createFile,
    currentFileId,
    setActiveFile,
    deleteFile
  } = useCodeStore();

  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [searchQuery, setSearchQuery] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  const projectStructure = useMemo(() => {
    const children = files.map(file => ({
      id: file.id,
      name: file.name,
      type: 'file',
      language: file.language,
      hidden: file.name?.startsWith('.'),
      saved: file.saved
    }));

    return {
      id: 'root',
      name: 'Proyecto Howard',
      type: 'folder',
      children: children
    };
  }, [files]);

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
      'typescript': '📘',
      'html': '🌐',
      'css': '🎨',
      'json': '📋',
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
              {item.type === 'file' && !item.saved && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#13ecc8]" />
              )}
              {item.type === 'file' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteFile(item.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-500 rounded transition-all"
                >
                  <Trash2 size={12} />
                </button>
              )}
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
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {renderTree([projectStructure])}
      </div>

      <div className="p-3 border-t border-white/10 grid grid-cols-1 gap-2">
        <button 
          onClick={() => {
            const name = prompt('Nombre del archivo:');
            if (name) createFile(name);
          }} 
          className="flex items-center justify-center gap-1 py-1.5 bg-[#192233] rounded text-[9px] font-bold text-gray-300 hover:text-white border border-white/5 transition-colors"
        >
          <FilePlus size={12} /> NUEVO ARCHIVO
        </button>
      </div>
    </div>
  );
};

export default FileExplorer;
