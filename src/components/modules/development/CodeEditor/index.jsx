import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft, Play, Save, Terminal, X, Settings,
  Maximize2, Minimize2, Copy, Check
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useCodeStore } from '../../../../store/codeStore';

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
    currentFile,
    updateFileContent,
    loadFiles,
    saveToLocalStorage
  } = useCodeStore();

  const [code, setCode] = useState(currentFile?.content || '');
  const [terminal, setTerminal] = useState('> Sistema listo. Presiona Run para ejecutar código.\n');
  const [showTerminal, setShowTerminal] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme] = useState('vs-dark');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const editorRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    if (currentFile) {
      setCode(currentFile.content);
      setLanguage(currentFile.language || 'javascript');
    }
  }, [currentFile]);

  const handleSave = useCallback(() => {
    if (currentFile) {
      updateFileContent(currentFile.id, code);
      saveToLocalStorage();
      setTerminal(prev => prev + `> 💾 Guardado: ${currentFile.name}\n`);
    }
  }, [code, currentFile, updateFileContent, saveToLocalStorage]);

  const runCode = useCallback(async () => {
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

      if (language === 'javascript') {
        eval(code);
        setTerminal(prev => prev + (logs.length > 0 ? logs.join('\n') + '\n' : '') + '> ✓ Ejecución completada\n');
      } else {
        setTerminal(prev => prev + `> ⚠️ Ejecución no soportada para ${language}\n`);
      }
      console.log = originalLog;
    } catch (error) {
      setTerminal(prev => prev + `> ✗ Error: ${error.message}\n`);
    } finally {
      setIsExecuting(false);
    }
  }, [code, language]);

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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, runCode]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} bg-[#10221f] text-white flex flex-col overflow-hidden pb-24`}>
      <div className="bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <button onClick={onBack} className="text-white hover:text-[#13ecc8]">
              <ArrowLeft size={24} />
            </button>
          )}
          <h2 className="text-lg font-bold">Editor de Código</h2>
        </div>

        <div className="flex items-center gap-2">
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
            <label className="text-sm text-gray-400">Lenguaje:</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-[#0d1117] border border-white/10 rounded-lg px-2 py-1 text-sm">
              {Object.entries(LANGUAGES).map(([key, lang]) => <option key={key} value={key}>{lang.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Tamaño:</label>
            <input type="range" min="10" max="24" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-24" />
          </div>
        </div>
      )}

      <div className="flex-1 bg-[#0d1117] overflow-hidden">
        <Editor
          height="100%"
          language={LANGUAGES[language]?.monaco || 'javascript'}
          value={code}
          onChange={(v) => setCode(v || '')}
          onMount={handleEditorDidMount}
          theme={theme}
          options={{ fontSize, minimap: { enabled: false }, automaticLayout: true }}
        />
      </div>

      {showTerminal && (
        <div className="h-48 bg-black border-t border-white/10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-white/5">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-[#13ecc8]" />
              <span className="text-sm font-bold">Terminal</span>
            </div>
            <button onClick={() => setShowTerminal(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
          </div>
          <div className="flex-1 p-4 font-mono text-xs text-green-400 overflow-auto">
            <pre>{terminal}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
