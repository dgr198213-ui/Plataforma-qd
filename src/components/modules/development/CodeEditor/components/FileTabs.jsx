import { X, AlertCircle } from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const FileTabs = () => {
  const {
    files,
    currentFileId,
    switchFile,
    closeFile,
    openFiles
  } = useCodeStore();

  const getOpenFiles = () => {
    return openFiles.map(id => files.find(f => f.id === id)).filter(Boolean);
  };

  const currentOpenFiles = getOpenFiles();

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

  return (
    <div className="flex bg-[#0d1117] border-b border-white/10 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
      <div className="flex items-center pl-2">
        <span className="text-xs text-gray-500">EDITOR</span>
      </div>

      <div className="flex flex-1">
        {currentOpenFiles.map((file) => {
          const isActive = file.id === currentFileId;
          const isUnsaved = !file.saved;

          return (
            <div
              key={file.id}
              className={`
                flex items-center gap-2 px-4 py-2 border-r border-white/5 min-w-[120px] max-w-[200px]
                ${isActive
                  ? 'bg-[#192233] text-white'
                  : 'bg-[#0d1117] text-gray-400 hover:bg-white/5'
                }
                transition-colors cursor-pointer group
              `}
              onClick={() => switchFile(file.id)}
            >
              <span className="text-sm">
                {getFileIcon(file.language)}
              </span>

              <span className="flex-1 text-xs font-medium truncate">
                {file.name}
              </span>

              {isUnsaved && (
                <AlertCircle size={10} className="text-yellow-500" />
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.id);
                }}
                className={`
                  p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity
                  ${isActive ? 'hover:bg-white/20' : 'hover:bg-white/10'}
                `}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileTabs;
