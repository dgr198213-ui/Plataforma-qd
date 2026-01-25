import { useState, useEffect, useRef } from 'react';
import {
  Search, FileText, Save, Play, Download, GitBranch,
  Settings, Terminal, Users, Code, Maximize2, RefreshCw
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const COMMANDS = [
  { id: 'save', name: 'Guardar Archivo', icon: Save, shortcut: 'Cmd+S', action: 'save' },
  { id: 'saveall', name: 'Guardar Todo', icon: Save, shortcut: 'Cmd+Shift+S', action: 'saveAll' },
  { id: 'run', name: 'Ejecutar Código', icon: Play, shortcut: 'F5', action: 'run' },
  { id: 'download', name: 'Descargar Archivo', icon: Download, action: 'download' },
  { id: 'git', name: 'Abrir Panel Git', icon: GitBranch, action: 'openGit' },
  { id: 'collab', name: 'Abrir Colaboración', icon: Users, action: 'openCollab' },
  { id: 'snippets', name: 'Abrir Snippets', icon: Code, action: 'openSnippets' },
  { id: 'terminal', name: 'Toggle Terminal', icon: Terminal, shortcut: 'Cmd+J', action: 'toggleTerminal' },
  { id: 'fullscreen', name: 'Pantalla Completa', icon: Maximize2, action: 'fullscreen' },
  { id: 'settings', name: 'Configuración', icon: Settings, action: 'settings' },
  { id: 'newfile', name: 'Nuevo Archivo', icon: FileText, shortcut: 'Cmd+N', action: 'newFile' },
  { id: 'refresh', name: 'Recargar Preview', icon: RefreshCw, action: 'refresh' }
];

const CommandPalette = ({ onClose, onSelectFile }) => {
  const { files, createFile, saveAllFiles } = useCodeStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Combinar comandos con archivos
  const fileCommands = files.map(file => ({
    id: `file-${file.id}`,
    name: `Abrir: ${file.name}`,
    icon: FileText,
    action: 'openFile',
    fileId: file.id,
    type: 'file'
  }));

  const allItems = [...COMMANDS, ...fileCommands];

  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (filteredItems.length === 0) break;
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          executeCommand(filteredItems[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const executeCommand = (item) => {
    switch (item.action) {
      case 'save':
        // Implementar guardado
        break;
      case 'saveAll':
        saveAllFiles();
        break;
      case 'run':
        // Implementar ejecución
        break;
      case 'openFile':
        onSelectFile(item.fileId);
        break;
      case 'newFile':
        createFile('nuevo-archivo.js', 'javascript');
        break;
      // Otros comandos...
      default:
        console.log('Command:', item.action);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#192233] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar comandos, archivos..."
            className="flex-1 bg-transparent text-white text-lg focus:outline-none placeholder-gray-500"
          />
          <kbd className="px-2 py-1 bg-[#0d1117] border border-white/10 rounded text-xs text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No se encontraron resultados</p>
            </div>
          ) : (
            <div className="p-2">
              {/* Commands Section */}
              {filteredItems.some(item => !item.type) && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-xs text-gray-400 font-bold">COMANDOS</div>
                  {filteredItems
                    .filter(item => !item.type)
                    .map((item) => {
                      const Icon = item.icon;
                      const globalIdx = filteredItems.indexOf(item);
                      return (
                        <button
                          key={item.id}
                          onClick={() => executeCommand(item)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                            ${globalIdx === selectedIndex ? 'bg-[#13ecc8] text-[#10221f]' : 'hover:bg-white/5'}
                          `}
                        >
                          <Icon size={18} />
                          <span className="flex-1 font-medium">{item.name}</span>
                          {item.shortcut && (
                            <kbd className={`
                              px-2 py-0.5 rounded text-xs
                              ${globalIdx === selectedIndex
                                ? 'bg-[#10221f]/20 text-[#10221f]'
                                : 'bg-[#0d1117] border border-white/10 text-gray-400'
                              }
                            `}>
                              {item.shortcut}
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                </div>
              )}

              {/* Files Section */}
              {filteredItems.some(item => item.type === 'file') && (
                <div>
                  <div className="px-3 py-1 text-xs text-gray-400 font-bold">ARCHIVOS</div>
                  {filteredItems
                    .filter(item => item.type === 'file')
                    .map((item) => {
                      const Icon = item.icon;
                      const globalIdx = filteredItems.indexOf(item);
                      return (
                        <button
                          key={item.id}
                          onClick={() => executeCommand(item)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                            ${globalIdx === selectedIndex ? 'bg-[#13ecc8] text-[#10221f]' : 'hover:bg-white/5'}
                          `}
                        >
                          <Icon size={18} />
                          <span className="flex-1">{item.name}</span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-[#0d1117] text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>↑↓ Navegar</span>
            <span>↵ Seleccionar</span>
            <span>ESC Cerrar</span>
          </div>
          <span>{filteredItems.length} resultados</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
