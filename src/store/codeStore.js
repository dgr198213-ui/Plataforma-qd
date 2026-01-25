import { create } from 'zustand';

const STORAGE_KEY = 'howard_code_files';

const defaultFile = {
  id: 'main-js',
  name: 'main.js',
  language: 'javascript',
  content: `// Bienvenido al Editor Howard OS
function saludar(nombre) {
  console.log(\`Hola, \${nombre}!\`);
}

saludar("Desarrollador");`,
  createdAt: Date.now(),
  updatedAt: Date.now()
};

export const useCodeStore = create((set, get) => ({
  files: [defaultFile],
  currentFile: defaultFile,

  loadFiles: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const files = JSON.parse(saved);
      set({ files, currentFile: files[0] });
    }
  },

  saveToLocalStorage: () => {
    const { files } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  },

  createFile: (name, language = 'javascript') => {
    const newFile = {
      id: `file-${Date.now()}`,
      name,
      language,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    set(state => ({
      files: [...state.files, newFile],
      currentFile: newFile
    }));
    get().saveToLocalStorage();
  },

  updateFileContent: (fileId, content) => {
    set(state => ({
      files: state.files.map(f =>
        f.id === fileId ? { ...f, content, updatedAt: Date.now() } : f
      ),
      currentFile: state.currentFile?.id === fileId
        ? { ...state.currentFile, content, updatedAt: Date.now() }
        : state.currentFile
    }));
  },

  switchFile: (fileId) => {
    const file = get().files.find(f => f.id === fileId);
    if (file) set({ currentFile: file });
  }
}));
