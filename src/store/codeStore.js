import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '../lib/supabase';

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
        projects: [],
        currentProjectId: null,

        // ADDITIONAL STATE
        isLoaded: false,
        isSyncing: false,
        snippets: [],

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

        // ==================== ACCIONES SUPABASE ====================
        
        fetchProjects: async () => {
          set({ isSyncing: true });
          const { data, error } = await supabase.from('projects').select('*');
          if (!error && data) {
            set({ projects: data, isSyncing: false });
            if (data.length > 0 && !get().currentProjectId) {
              get().setCurrentProject(data[0].id);
            }
          } else {
            set({ isSyncing: false });
          }
        },

        setCurrentProject: async (projectId) => {
          set({ currentProjectId: projectId, isSyncing: true });
          const { data, error } = await supabase
            .from('files')
            .select('*')
            .eq('project_id', projectId);
          
          if (!error && data) {
            const formattedFiles = data.map(f => ({
              id: f.id,
              name: f.name,
              path: f.path,
              language: f.language,
              content: f.content,
              originalContent: f.content,
              saved: true,
              updatedAt: new Date(f.updated_at).getTime()
            }));
            set({ 
              files: formattedFiles.length > 0 ? formattedFiles : DEFAULT_FILES,
              openFiles: formattedFiles.length > 0 ? [formattedFiles[0].id] : ['main-js'],
              currentFileId: formattedFiles.length > 0 ? formattedFiles[0].id : 'main-js',
              isSyncing: false 
            });
          } else {
            set({ isSyncing: false });
          }
        },

        createRemoteProject: async (name, description = '') => {
          const { data, error } = await supabase
            .from('projects')
            .insert([{ name, description }])
            .select();
          
          if (!error && data) {
            set((state) => { state.projects.push(data[0]); });
            return data[0].id;
          }
          return null;
        },

        // ==================== ACCIONES LOCALES (IMMER) ====================
        setHasHydrated: (state) => {
          set({ isLoaded: state });
        },

        createFile: async (name, language = 'javascript', content = '') => {
          const projectId = get().currentProjectId;
          let newFileId = `file-${Date.now()}`;

          if (projectId) {
            const { data, error } = await supabase
              .from('files')
              .insert([{ 
                project_id: projectId, 
                name, 
                language, 
                content,
                path: `/${name}`
              }])
              .select();
            
            if (!error && data) {
              newFileId = data[0].id;
            }
          }

          const newFile = {
            id: newFileId,
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
            state.openFiles.push(newFileId);
            state.currentFileId = newFileId;
          }, false, 'createFile');
          
          return newFileId;
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

        saveFile: async (id) => {
          const file = get().files.find(f => f.id === id);
          if (!file) return;

          if (get().currentProjectId && !id.startsWith('file-')) {
            await supabase
              .from('files')
              .update({ content: file.content, updated_at: new Date().toISOString() })
              .eq('id', id);
          }

          set((state) => {
            const f = state.files.find(f => f.id === id);
            if (f) {
              f.originalContent = f.content;
              f.saved = true;
              f.updatedAt = Date.now();
            }
          }, false, 'saveFile');
        },

        deleteFile: async (id) => {
          if (get().currentProjectId && !id.startsWith('file-')) {
            await supabase.from('files').delete().eq('id', id);
          }

          set((state) => {
            state.files = state.files.filter(f => f.id !== id);
            state.openFiles = state.openFiles.filter(fid => fid !== id);
            if (state.currentFileId === id) {
              state.currentFileId = state.openFiles[0] || null;
            }
          }, false, 'deleteFile');
        },

        // GIT ACTIONS (Simplificadas para el ejemplo)
        stageFile: (fileName) => {
          set((state) => {
            const change = state.gitChanges.find(c => c.file === fileName);
            if (change) change.staged = !change.staged;
            else state.gitChanges.push({ file: fileName, status: 'modified', staged: true });
          }, false, 'stageFile');
        },

        commitChanges: (message) => {
          set((state) => {
            state.gitCommits.unshift({
              hash: Math.random().toString(36).substring(2, 9),
              message,
              author: 'Usuario Howard',
              date: new Date().toLocaleString()
            });
            state.gitChanges = [];
            state.files.forEach(f => {
              f.originalContent = f.content;
              f.saved = true;
            });
          }, false, 'commitChanges');
        },

        appendTerminalOutput: (text) => {
          set((state) => { state.terminalOutput += text; }, false, 'appendTerminalOutput');
        },

        clearTerminal: () => {
          set((state) => { state.terminalOutput = '> Terminal limpia.\n'; }, false, 'clearTerminal');
        }
      })),
      {
        name: 'howard-os-storage',
        partialize: (state) => ({
          settings: state.settings,
          currentProjectId: state.currentProjectId
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated?.(true);
          if (state?.currentProjectId) {
            state.fetchProjects();
          }
        }
      }
    ),
    { name: 'HowardOS-CodeStore' }
  )
);
