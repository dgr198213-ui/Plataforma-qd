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
    settings
  } = useCodeStore();

  const currentFile = getCurrentFile();
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value) => {
    if (currentFile) {
      updateFileContent(currentFile.id, value || '');
    }
  };

  return (
    <div className="flex-1 bg-[#0d1117] overflow-hidden h-full">
      <Editor
        height="100%"
        language={LANGUAGES[currentFile?.language] || 'javascript'}
        value={currentFile?.content || ''}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={settings?.theme || 'vs-dark'}
        options={{
          fontSize: settings?.fontSize || 14,
          minimap: { enabled: false },
          automaticLayout: true,
          padding: { top: 16 },
          fontFamily: "'Fira Code', 'Courier New', monospace",
          fontLigatures: true
        }}
      />
    </div>
  );
};

export default MonacoEditor;
