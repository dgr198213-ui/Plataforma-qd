import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useCodeStore } from '../../../../../store/codeStore';

const LANGUAGES = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  html: 'html',
  css: 'css',
  json: 'json',
  jsx: 'javascript',
  tsx: 'typescript'
};

const MonacoEditor = () => {
  const {
    getCurrentFile,
    updateFileContent,
    currentFileId,
    settings
  } = useCodeStore();

  const currentFile = getCurrentFile();
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    if (currentFileId) {
      updateFileContent(currentFileId, value || '');
    }
  };

  return (
    <div className="flex-1 bg-[#0d1117] overflow-hidden h-full">
      {currentFile ? (
        <Editor
          height="100%"
          language={LANGUAGES[currentFile.language] || 'javascript'}
          value={currentFile.content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={settings?.theme || 'vs-dark'}
          options={{
            fontSize: settings?.fontSize || 14,
            minimap: { enabled: false },
            automaticLayout: true,
            padding: { top: 16 },
            fontFamily: "'Fira Code', 'Courier New', monospace",
            fontLigatures: true,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            lineNumbers: 'on',
            folding: true
          }}
        />
      ) : (
        <div className="h-full flex items-center justify-center bg-[#0d1117] text-gray-500 font-mono text-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span>Selecciona un archivo para comenzar a editar</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonacoEditor;
