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
  // State
  files: [defaultFile],
  currentFile: defaultFile,
  activeFileId: defaultFile.id,
  activeFile: defaultFile.id, // LivePreview uses this as ID
  unsavedFiles: [],
  projects: [{ id: 'proj-1', name: 'Proyecto Howard' }],
  currentProjectId: 'proj-1',
  currentProject: { id: 'proj-1', name: 'Proyecto Howard' },
  settings: { theme: 'vs-dark', fontSize: 14 },

  // Actions
  loadFiles: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const files = JSON.parse(saved);
        if (files && files.length > 0) {
          set({
            files,
            currentFile: files[0],
            activeFileId: files[0].id,
            activeFile: files[0].id
          });
        }
      } catch (e) {
        console.error("Error loading files from localStorage", e);
      }
    }
  },

  saveToLocalStorage: () => {
    const { files } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  },

  setActiveFile: (id) => {
    const file = get().files.find(f => f.id === id);
    if (file) {
      set({ activeFileId: id, activeFile: id, currentFile: file });
    }
  },

  switchFile: (id) => get().setActiveFile(id),

  closeFile: (id) => {
    set(state => {
      const newFiles = state.files.filter(f => f.id !== id);
      let nextActiveId = state.activeFileId;
      if (state.activeFileId === id) {
        nextActiveId = newFiles.length > 0 ? newFiles[0].id : null;
      }
      const nextActiveFile = nextActiveId ? newFiles.find(f => f.id === nextActiveId) : null;

      return {
        files: newFiles,
        activeFileId: nextActiveId,
        activeFile: nextActiveId,
        currentFile: nextActiveFile,
        unsavedFiles: state.unsavedFiles.filter(fid => fid !== id)
      };
    });
    get().saveToLocalStorage();
  },

  saveFile: (id, content) => {
    if (content !== undefined) {
      get().updateFileContent(id, content);
    }
    get().saveToLocalStorage();
    set(state => ({
      unsavedFiles: state.unsavedFiles.filter(fid => fid !== id)
    }));
  },

  createFile: (name, language = 'javascript') => {
    const newFile = {
      id: `file-${Date.now()}`,
      name,
      language,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isNew: true
    };
    set(state => ({
      files: [...state.files, newFile],
      currentFile: newFile,
      activeFileId: newFile.id,
      activeFile: newFile.id
    }));
    get().saveToLocalStorage();
  },

  createFolder: (name) => {
    console.log('Folder creation not implemented in this mock:', name);
  },

  deleteFile: (id) => {
    get().closeFile(id);
  },

  deleteFolder: (id) => {
    console.log('Folder deletion not implemented in this mock:', id);
  },

  setCurrentProject: (id) => {
    const project = get().projects.find(p => p.id === id);
    if (project) {
      set({ currentProjectId: id, currentProject: project });
    }
  },

  updateFileContent: (fileId, content) => {
    set(state => {
      const isAlreadyUnsaved = state.unsavedFiles.includes(fileId);
      const newUnsavedFiles = isAlreadyUnsaved ? state.unsavedFiles : [...state.unsavedFiles, fileId];

      return {
        files: state.files.map(f =>
          f.id === fileId ? { ...f, content, updatedAt: Date.now() } : f
        ),
        currentFile: state.currentFile?.id === fileId
          ? { ...state.currentFile, content, updatedAt: Date.now() }
          : state.currentFile,
        unsavedFiles: newUnsavedFiles
      };
    });
  }
}));
