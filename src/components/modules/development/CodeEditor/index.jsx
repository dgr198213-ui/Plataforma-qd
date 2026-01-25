import { useState, useEffect } from 'react';
import {
  FileTabs, FileExplorer, LivePreview, GitPanel,
  CollaborationPanel, SnippetsPanel, CommandPalette,
  MonacoEditor, Terminal, StatusBar, Header
} from './components';
import { useCodeStore } from '../../../../store/codeStore';

const CodeEditor = ({ onBack }) => {
  const {
    loadFiles,
    getCurrentFile,
    appendTerminalOutput,
    saveFile
  } = useCodeStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('git'); // 'git', 'collab', 'snippets'
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const runCode = async () => {
    const currentFile = getCurrentFile();
    if (!currentFile) return;

    setIsExecuting(true);
    appendTerminalOutput(`\n> Ejecutando ${currentFile.name}...\n`);

    try {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      if (currentFile.language === 'javascript' || currentFile.language === 'jsx') {
        eval(currentFile.content);
        appendTerminalOutput(logs.length > 0 ? logs.join('\n') + '\n' : '');
        appendTerminalOutput('> ✓ Ejecución completada con éxito\n');
      } else {
        appendTerminalOutput(`> ⚠️ Ejecución no soportada directamente para el lenguaje: ${currentFile.language}\n`);
      }
      console.log = originalLog;
    } catch (error) {
      appendTerminalOutput(`> ✗ Error de ejecución: ${error.message}\n`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSave = () => {
    const currentFile = getCurrentFile();
    if (currentFile) {
      saveFile(currentFile.id);
      appendTerminalOutput(`> 💾 Archivo guardado: ${currentFile.name}\n`);
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-[60]' : 'h-screen'} flex flex-col bg-[#0d1117] text-white overflow-hidden`}>
      {/* Barra superior */}
      <Header
        onBack={onBack}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        onRun={runCode}
        onSave={handleSave}
        isExecuting={isExecuting}
      />

      {/* Layout principal */}
      <div className="flex-1 flex overflow-hidden pb-6"> {/* pb-6 to account for StatusBar */}
        {/* Panel izquierdo - Explorador */}
        <FileExplorer />

        {/* Área central - Editor y Previa */}
        <div className="flex-1 flex flex-col min-w-0">
          <FileTabs />
          <div className="flex-1 flex min-h-0">
            <MonacoEditor />
            <LivePreview />
          </div>
          <Terminal />
        </div>

        {/* Paneles derechos */}
        <div className="flex flex-col border-l border-white/10 overflow-y-auto bg-[#0d1117]">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActivePanel('git')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${activePanel === 'git' ? 'text-[#13ecc8] border-b border-[#13ecc8]' : 'text-gray-500 hover:text-white'}`}
            >
              Git
            </button>
            <button
              onClick={() => setActivePanel('collab')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${activePanel === 'collab' ? 'text-[#13ecc8] border-b border-[#13ecc8]' : 'text-gray-500 hover:text-white'}`}
            >
              Collab
            </button>
            <button
              onClick={() => setActivePanel('snippets')}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${activePanel === 'snippets' ? 'text-[#13ecc8] border-b border-[#13ecc8]' : 'text-gray-500 hover:text-white'}`}
            >
              Snippets
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activePanel === 'git' && <GitPanel />}
            {activePanel === 'collab' && <CollaborationPanel />}
            {activePanel === 'snippets' && <SnippetsPanel />}
          </div>
        </div>
      </div>

      {/* Barra de estado */}
      <StatusBar />

      {/* Comandos */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default CodeEditor;
