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
        gitBranches: [
          { name: 'main', current: true, lastCommit: 'abc123' }
        ],
        projects: [
          { id: 1, name: 'Landing Page Startup', files: 12, size: '2.4 MB' },
          { id: 2, name: 'API Backend Node', files: 34, size: '8.1 MB' },
        ],
        currentProjectId: 1,

        // ADDITIONAL STATE
        isLoaded: false,
        snippets: [
          {
            id: 'snip-1',
            name: 'React Function Component',
            language: 'javascript',
            category: 'UI',
            code: 'const Component = () => {\n  return <div>Component</div>;\n};'
          }
        ],

        // ==================== GETTERS ====================
        getCurrentFile: () => {
          const state = get();
          return state.files.find(f => f.id === state.currentFileId) || null;
        },

        getUnsavedFiles: () => {
          const state = get();
          return state.files.filter(f => !f.saved).map(f => ({
            id: f.id,
            name: f.name
          }));
        },

        getAllSnippets: () => get().snippets || [],

        // ==================== ACCIONES (IMMER) ====================
        setHasHydrated: (state) => {
          set({ isLoaded: state });
        },

        // GIT ACTIONS
        stageFile: (fileName) => {
          set((state) => {
            const change = state.gitChanges.find(c => c.file === fileName);
            if (change) {
              change.staged = !change.staged;
            } else {
              // Si no existe en gitChanges pero está en unsavedFiles, lo añadimos
              state.gitChanges.push({ file: fileName, status: 'modified', staged: true });
            }
          }, false, 'stageFile');
        },

        stageAll: () => {
          set((state) => {
            state.gitChanges.forEach(c => c.staged = true);
            // También podríamos añadir archivos no guardados aquí si quisiéramos ser exhaustivos
          }, false, 'stageAll');
        },

        unstageAll: () => {
          set((state) => {
            state.gitChanges.forEach(c => c.staged = false);
          }, false, 'unstageAll');
        },

        commitChanges: (message) => {
          set((state) => {
            const staged = state.gitChanges.filter(c => c.staged);
            if (staged.length > 0 || state.getUnsavedFiles().length > 0) {
              state.gitCommits.unshift({
                hash: Math.random().toString(36).substring(2, 9),
                message,
                author: 'Usuario Howard',
                date: new Date().toLocaleString()
              });
              state.gitChanges = state.gitChanges.filter(c => !c.staged);
              // Al hacer commit, marcamos archivos como guardados (originalContent = content)
              state.files.forEach(f => {
                if (!f.saved) {
                  f.originalContent = f.content;
                  f.saved = true;
                }
              });
            }
          }, false, 'commitChanges');
        },

        checkoutBranch: (branchName) => {
          set((state) => {
            state.gitBranches.forEach(b => b.current = b.name === branchName);
            state.gitStatus.branch = branchName;
          }, false, 'checkoutBranch');
        },

        createBranch: (name) => {
          set((state) => {
            if (!state.gitBranches.find(b => b.name === name)) {
              state.gitBranches.push({ name, current: false, lastCommit: 'new' });
            }
          }, false, 'createBranch');
        },

        
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
          gitCommits: state.gitCommits,
          gitBranches: state.gitBranches,
          snippets: state.snippets,
          projects: state.projects,
          currentProjectId: state.currentProjectId
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated?.(true);
        }
      }
    ),
    { name: 'HowardOS-CodeStore' }
  )
);
