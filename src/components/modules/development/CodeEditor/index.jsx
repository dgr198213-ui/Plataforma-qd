import { useState, useEffect } from 'react';
import {
  FileTabs, FileExplorer, LivePreview, GitPanel,
  CollaborationPanel, SnippetsPanel, CommandPalette,
  MonacoEditor, Terminal, StatusBar, Header
} from './components';
import { useCodeStore } from '../../../../store/codeStore';

const CodeEditor = ({ onBack }) => {
  const { loadFiles } = useCodeStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-[60]' : 'h-screen'} flex flex-col bg-[#0d1117] text-white overflow-hidden`}>
      {/* Barra superior */}
      <Header
        onBack={onBack}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
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
        <div className="flex flex-col border-l border-white/10 overflow-y-auto">
          <CollaborationPanel />
          <SnippetsPanel />
          <GitPanel />
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
