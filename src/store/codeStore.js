import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * @typedef {Object} File
 * @property {string} id - ID único del archivo
 * @property {string} name - Nombre del archivo
 * @property {string} path - Ruta completa
 * @property {string} language - Lenguaje de programación
 * @property {string} content - Contenido actual
 * @property {string} originalContent - Contenido original (para diff)
 * @property {boolean} saved - Si está guardado
 * @property {number} updatedAt - Timestamp de última actualización
 */

const DEFAULT_FILES = [
  {
    id: 'main-js',
    name: 'main.js',
    path: '/main.js',
    language: 'javascript',
    content: `// Bienvenido al Editor Howard OS\n// Atajos: Ctrl+P (Comandos), Ctrl+S (Guardar)\n\nfunction saludar(nombre) {\n  console.log(\`Hola, \${nombre}!\`);\n}\n\nsaludar("Usuario");`,
    originalContent: `// Bienvenido al Editor Howard OS\n// Atajos: Ctrl+P (Comandos), Ctrl+S (Guardar)\n\nfunction saludar(nombre) {\n  console.log(\`Hola, \${nombre}!\`);\n}\n\nsaludar("Usuario");`,
    saved: true,
    updatedAt: Date.now()
  }
];

export const useCodeStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        // ==================== ESTADO ====================
        files: DEFAULT_FILES,
        openFiles: ['main-js'],
        currentFileId: 'main-js',
        terminalOutput: '> Sistema Howard OS listo.\n',
        settings: { theme: 'vs-dark', fontSize: 14, autoSave: true },
        
        // GIT STATE
        gitStatus: { branch: 'main', ahead: 0, behind: 0 },
        gitChanges: [],
        gitCommits: [],

        // ==================== GETTERS ====================
        getCurrentFile: () => {
          const state = get();
          return state.files.find(f => f.id === state.currentFileId) || null;
        },

        getUnsavedFiles: () => {
          return get().files.filter(f => !f.saved).map(f => f.id);
        },

        // ==================== ACCIONES (IMMER) ====================
        
        createFile: (name, language = 'javascript', content = '') => {
          const id = `file-${Date.now()}`;
          const newFile = {
            id,
            name,
            path: `/${name}`,
            language,
            content,
            originalContent: content,
            saved: true,
            updatedAt: Date.now()
          };

          set((state) => {
            state.files.push(newFile);
            state.openFiles.push(id);
            state.currentFileId = id;
          }, false, 'createFile');
          
          return id;
        },

        updateFileContent: (id, content) => {
          set((state) => {
            const file = state.files.find(f => f.id === id);
            if (file) {
              file.content = content;
              file.saved = content === file.originalContent;
              file.updatedAt = Date.now();
            }
          }, false, 'updateFileContent');
        },

        saveFile: (id) => {
          set((state) => {
            const file = state.files.find(f => f.id === id);
            if (file) {
              file.originalContent = file.content;
              file.saved = true;
              file.updatedAt = Date.now();
            }
          }, false, 'saveFile');
        },

        closeFile: (id) => {
          set((state) => {
            state.openFiles = state.openFiles.filter(fid => fid !== id);
            if (state.currentFileId === id) {
              state.currentFileId = state.openFiles[state.openFiles.length - 1] || null;
            }
          }, false, 'closeFile');
        },

        setActiveFile: (id) => {
          set((state) => {
            if (!state.openFiles.includes(id)) {
              state.openFiles.push(id);
            }
            state.currentFileId = id;
          }, false, 'setActiveFile');
        },

        deleteFile: (id) => {
          set((state) => {
            state.files = state.files.filter(f => f.id !== id);
            state.openFiles = state.openFiles.filter(fid => fid !== id);
            if (state.currentFileId === id) {
              state.currentFileId = state.openFiles[0] || null;
            }
          }, false, 'deleteFile');
        },

        appendTerminalOutput: (text) => {
          set((state) => {
            state.terminalOutput += text;
          }, false, 'appendTerminalOutput');
        },

        clearTerminal: () => {
          set((state) => {
            state.terminalOutput = '> Terminal limpia.\n';
          }, false, 'clearTerminal');
        }
      })),
      {
        name: 'howard-os-storage',
        partialize: (state) => ({
          files: state.files,
          settings: state.settings,
          gitCommits: state.gitCommits
        })
      }
    ),
    { name: 'HowardOS-CodeStore' }
  )
);
