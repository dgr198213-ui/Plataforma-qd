import { useState, useEffect } from 'react';
import { 
  FileTabs, FileExplorer, LivePreview, GitPanel, 
  CollaborationPanel, SnippetsPanel, CommandPalette, 
  MonacoEditor, Terminal, StatusBar, Header 
} from './components';
import GlobalSearch from './components/GlobalSearch';
import DiffViewer from './components/DiffViewer';
import Minimap from './components/Minimap';
import { useCodeStore } from '../../../../store/codeStore';

const CodeEditor = ({ onBack }) => {
  const {
    getCurrentFile,
    appendTerminalOutput,
    saveFile,
    currentFileId,
    updateFileContent
  } = useCodeStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('git'); // 'git', 'collab', 'snippets'
  const [isExecuting, setIsExecuting] = useState(false);

  const currentFile = getCurrentFile();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const runCode = async () => {
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
        // eslint-disable-next-line no-eval
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
    if (currentFileId) {
      saveFile(currentFileId);
      appendTerminalOutput(`> 💾 Archivo guardado: ${currentFile?.name}\n`);
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
      <div className="flex-1 flex overflow-hidden pb-6">
        {/* Panel izquierdo - Explorador */}
        <FileExplorer />

        {/* Área central - Editor y Previa */}
        <div className="flex-1 flex flex-col min-w-0">
          <FileTabs />
          <div className="flex-1 flex min-h-0 relative">
            <div className="flex-1 flex flex-col relative">
              <MonacoEditor 
                file={currentFile}
                onChange={(content) => updateFileContent(currentFileId, content)}
              />
              
              {/* Botones de acción rápida flotantes */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                <button 
                  onClick={() => setIsDiffOpen(!isDiffOpen)}
                  className={`p-2 rounded-full border transition-all ${isDiffOpen ? 'bg-[#13ecc8] text-[#10221f] border-[#13ecc8]' : 'bg-[#192233] text-gray-400 border-white/10 hover:border-[#13ecc8]'}`}
                  title="Comparar cambios"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3 21 8 16 13"/><path d="M21 8H9a5 5 0 0 0 0 10h9"/><path d="m8 21-5-5 5-5"/><path d="M3 16h12a5 5 0 0 0 0-10H5"/></svg>
                </button>
              </div>
            </div>

            {/* Minimap Lateral */}
            {currentFile && (
              <Minimap 
                code={currentFile.content} 
                activeLineNumber={1} 
                onLineClick={(line) => console.log('Ir a línea:', line)} 
              />
            )}

            {/* Panel de Previa */}
            <LivePreview />

            {/* Panel de Diff (Overlay lateral) */}
            {isDiffOpen && currentFile && (
              <div className="absolute inset-y-0 right-0 w-1/2 z-20 shadow-2xl">
                <DiffViewer 
                  original={currentFile.originalContent}
                  modified={currentFile.content}
                  fileName={currentFile.name}
                  onClose={() => setIsDiffOpen(false)}
                />
              </div>
            )}
          </div>
          <Terminal />
        </div>

        {/* Paneles derechos */}
        <div className="flex flex-col border-l border-white/10 overflow-y-auto bg-[#0d1117] w-64">
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

      {/* Modales de Herramientas */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <GlobalSearch 
        isOpen={isGlobalSearchOpen} 
        onClose={() => setIsGlobalSearchOpen(false)} 
      />
    </div>
  );
};

export default CodeEditor;
