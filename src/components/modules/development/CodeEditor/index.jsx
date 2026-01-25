import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft, Play, Save, Terminal, X, Settings,
  Maximize2, Minimize2, Copy, Check, Users, Code,
  GitBranch, Search, Eye
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useCodeStore } from '../../../../store/codeStore';
import {
  FileTabs, FileExplorer, LivePreview, GitPanel,
  CollaborationPanel, SnippetsPanel, CommandPalette
} from './components';

const LANGUAGES = {
  javascript: { name: 'JavaScript', ext: '.js', monaco: 'javascript' },
  typescript: { name: 'TypeScript', ext: '.ts', monaco: 'typescript' },
  python: { name: 'Python', ext: '.py', monaco: 'python' },
  html: { name: 'HTML', ext: '.html', monaco: 'html' },
  css: { name: 'CSS', ext: '.css', monaco: 'css' },
  json: { name: 'JSON', ext: '.json', monaco: 'json' }
};

const CodeEditor = ({ onBack }) => {
  const {
    currentFileId,
    getCurrentFile,
    updateFileContent,
    saveFile,
    switchFile
  } = useCodeStore();

  const currentFile = getCurrentFile();

  const [terminal, setTerminal] = useState('> Sistema listo. Presiona Run para ejecutar código.\n');
  const [showTerminal, setShowTerminal] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme] = useState('vs-dark');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Estados para paneles nuevos
  const [activePanel, setActivePanel] = useState(null); // 'collab' | 'snippets' | 'git' | 'preview'
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showExplorer, setShowExplorer] = useState(true);

  const editorRef = useRef(null);

  const handleSave = useCallback(() => {
    if (currentFile) {
      saveFile(currentFile.id);
      setTerminal(prev => prev + `> 💾 Guardado: ${currentFile.name}\n`);
    }
  }, [currentFile, saveFile]);

  const runCode = useCallback(async () => {
    if (!currentFile) return;
    setIsExecuting(true);
    setTerminal(prev => prev + `\n> Ejecutando código...\n`);

    try {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      if (currentFile.language === 'javascript') {
        eval(currentFile.content);
        setTerminal(prev => prev + (logs.length > 0 ? logs.join('\n') + '\n' : '') + '> ✓ Ejecución completada\n');
      } else {
        setTerminal(prev => prev + `> ⚠️ Ejecución no soportada para ${currentFile.language}\n`);
      }
      console.log = originalLog;
    } catch (error) {
      setTerminal(prev => prev + `> ✗ Error: ${error.message}\n`);
    } finally {
      setIsExecuting(false);
    }
  }, [currentFile]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'F5') {
        e.preventDefault();
        runCode();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, runCode]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCopyCode = () => {
    if (currentFile) {
      navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const togglePanel = (panel) => {
    setActivePanel(prev => prev === panel ? null : panel);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} bg-[#10221f] text-white flex flex-col overflow-hidden pb-24`}>
      {/* Header */}
      <div className="bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <button onClick={onBack} className="text-white hover:text-[#13ecc8]">
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold">Howard OS Editor</h2>
            {currentFile && <span className="text-xs text-[#13ecc8]">{currentFile.path}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowCommandPalette(true)} className="p-2 hover:bg-white/5 rounded-lg" title="Command Palette (Cmd+P)"><Search size={18} /></button>
          <button onClick={() => togglePanel('preview')} className={`p-2 rounded-lg ${activePanel === 'preview' ? 'bg-[#13ecc8]/20 text-[#13ecc8]' : 'hover:bg-white/5'}`} title="Live Preview"><Eye size={18} /></button>
          <button onClick={() => togglePanel('snippets')} className={`p-2 rounded-lg ${activePanel === 'snippets' ? 'bg-[#13ecc8]/20 text-[#13ecc8]' : 'hover:bg-white/5'}`} title="Snippets"><Code size={18} /></button>
          <button onClick={() => togglePanel('collab')} className={`p-2 rounded-lg ${activePanel === 'collab' ? 'bg-[#13ecc8]/20 text-[#13ecc8]' : 'hover:bg-white/5'}`} title="Collaboration"><Users size={18} /></button>
          <button onClick={() => togglePanel('git')} className={`p-2 rounded-lg ${activePanel === 'git' ? 'bg-[#13ecc8]/20 text-[#13ecc8]' : 'hover:bg-white/5'}`} title="Git"><GitBranch size={18} /></button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-white/5 rounded-lg"><Settings size={18} /></button>
          <button onClick={handleSave} className="p-2 hover:bg-white/5 rounded-lg"><Save size={18} /></button>
          <button onClick={handleCopyCode} className="p-2 hover:bg-white/5 rounded-lg">{copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}</button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-white/5 rounded-lg">{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
          <button onClick={runCode} disabled={isExecuting} className="bg-[#13ecc8] text-[#10221f] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0fc9a8] transition-colors disabled:opacity-50">
            <Play size={16} /> {isExecuting ? '...' : 'Run'}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="bg-[#192233] border-b border-white/5 p-4 flex gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Tamaño Fuente:</label>
            <input type="range" min="10" max="24" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-24" />
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        {showExplorer && <FileExplorer />}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <FileTabs />
          <div className="flex-1 relative">
            {currentFile ? (
              <Editor
                height="100%"
                language={LANGUAGES[currentFile.language]?.monaco || 'javascript'}
                value={currentFile.content}
                onChange={(v) => updateFileContent(currentFile.id, v || '')}
                onMount={handleEditorDidMount}
                theme={theme}
                options={{
                  fontSize,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 16 }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Selecciona un archivo para empezar a editar
              </div>
            )}
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="h-48 bg-black border-t border-white/10 flex flex-col">
              <div className="flex items-center justify-between px-4 py-1 bg-[#0d1117] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#13ecc8]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Terminal</span>
                </div>
                <button onClick={() => setShowTerminal(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
              </div>
              <div className="flex-1 p-3 font-mono text-[11px] text-green-400 overflow-auto scrollbar-thin">
                <pre>{terminal}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Panels */}
        {activePanel === 'preview' && <div className="w-1/2 min-w-[300px]"><LivePreview /></div>}
        {activePanel === 'collab' && <CollaborationPanel onClose={() => setActivePanel(null)} />}
        {activePanel === 'snippets' && <SnippetsPanel onClose={() => setActivePanel(null)} />}
        {activePanel === 'git' && <GitPanel onClose={() => setActivePanel(null)} />}
      </div>

      {/* Overlays */}
      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onSelectFile={(id) => switchFile(id)}
        />
      )}

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#0d1117] border-t border-white/10 flex items-center justify-between px-4 text-[10px] text-gray-500 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <GitBranch size={12} />
            <span>main*</span>
          </div>
          <div className="flex items-center gap-1 text-[#13ecc8]">
            <div className="w-2 h-2 rounded-full bg-[#13ecc8]" />
            <span>Conectado</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>{currentFile?.language?.toUpperCase() || 'PLAIN TEXT'}</span>
          <span>Howard OS v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
