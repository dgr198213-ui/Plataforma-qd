import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_FILES = [
  {
    id: 'main-js',
    name: 'main.js',
    path: '/main.js',
    language: 'javascript',
    content: `// Bienvenido al Editor Howard OS
// Atajos: Cmd+S (guardar), F5 (ejecutar), Cmd+P (buscar archivos)

function saludar(nombre) {
  console.log(\`Hola, \${nombre}!\`);
  return \`Bienvenido, \${nombre}\`;
}

const resultado = saludar("Desarrollador");
console.log(resultado);`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    saved: true
  }
];

const DEFAULT_SNIPPETS = [
  {
    id: 'snippet-default-1',
    name: 'React Component',
    language: 'javascript',
    code: `import React from 'react';

const ComponentName = () => {
  return (
    <div>
      {/* Tu código aquí */}
    </div>
  );
};

export default ComponentName;`,
    category: 'react',
    createdAt: Date.now()
  },
  {
    id: 'snippet-default-2',
    name: 'Async Function',
    language: 'javascript',
    code: `async function fetchData() {
  try {
    const response = await fetch('url');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
    category: 'javascript',
    createdAt: Date.now()
  },
  {
    id: 'snippet-default-3',
    name: 'useState Hook',
    language: 'javascript',
    code: `const [state, setState] = useState(initialValue);`,
    category: 'react',
    createdAt: Date.now()
  },
  {
    id: 'snippet-default-4',
    name: 'useEffect Hook',
    language: 'javascript',
    code: `useEffect(() => {
  // Efecto secundario

  return () => {
    // Cleanup
  };
}, [dependencies]);`,
    category: 'react',
    createdAt: Date.now()
  }
];

export const useCodeStore = create(
  persist(
    (set, get) => ({
      // ==================== ESTADO ====================
      files: DEFAULT_FILES,
      openFiles: ['main-js'],
      currentFileId: 'main-js',
      snippets: [],
      gitStatus: null,
      collaborators: [],
      isLoaded: false,

      // ==================== GETTERS ====================
      getCurrentFile: () => {
        const { files, currentFileId } = get();
        return files.find(f => f.id === currentFileId) || null;
      },

      getOpenFiles: () => {
        const { files, openFiles } = get();
        return openFiles.map(id => files.find(f => f.id === id)).filter(Boolean);
      },

      getFileById: (id) => {
        return get().files.find(f => f.id === id) || null;
      },

      getAllSnippets: () => {
        return [...DEFAULT_SNIPPETS, ...get().snippets];
      },

      // ==================== ARCHIVOS ====================
      createFile: (name, language = 'javascript', path = null, content = '') => {
        const newFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          path: path || `/${name}`,
          language,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          saved: true
        };

        set(state => ({
          files: [...state.files, newFile],
          openFiles: [...state.openFiles, newFile.id],
          currentFileId: newFile.id
        }));

        return newFile.id;
      },

      updateFileContent: (fileId, content) => {
        set(state => ({
          files: state.files.map(f =>
            f.id === fileId
              ? { ...f, content, updatedAt: Date.now(), saved: false }
              : f
          )
        }));
      },

      saveFile: (fileId) => {
        set(state => ({
          files: state.files.map(f =>
            f.id === fileId ? { ...f, saved: true, updatedAt: Date.now() } : f
          )
        }));
      },

      saveAllFiles: () => {
        set(state => ({
          files: state.files.map(f => ({ ...f, saved: true, updatedAt: Date.now() }))
        }));
      },

      deleteFile: (fileId) => {
        set(state => {
          const newFiles = state.files.filter(f => f.id !== fileId);
          const newOpenFiles = state.openFiles.filter(id => id !== fileId);

          // Si se elimina el archivo actual, cambiar al primero disponible
          let newCurrentId = state.currentFileId;
          if (state.currentFileId === fileId) {
            newCurrentId = newOpenFiles[0] || newFiles[0]?.id || null;
          }

          return {
            files: newFiles,
            openFiles: newOpenFiles,
            currentFileId: newCurrentId
          };
        });
      },

      renameFile: (fileId, newName) => {
        // Detectar lenguaje por extensión
        const getLanguageFromName = (name) => {
          if (name.endsWith('.py')) return 'python';
          if (name.endsWith('.html')) return 'html';
          if (name.endsWith('.css')) return 'css';
          if (name.endsWith('.json')) return 'json';
          if (name.endsWith('.ts')) return 'typescript';
          if (name.endsWith('.tsx')) return 'typescript';
          if (name.endsWith('.jsx')) return 'javascript';
          return 'javascript';
        };

        set(state => ({
          files: state.files.map(f =>
            f.id === fileId
              ? {
                  ...f,
                  name: newName,
                  path: `/${newName}`,
                  language: getLanguageFromName(newName),
                  updatedAt: Date.now()
                }
              : f
          )
        }));
      },

      duplicateFile: (fileId) => {
        const file = get().getFileById(fileId);
        if (!file) return null;

        const newName = `${file.name.split('.')[0]}-copy.${file.name.split('.')[1] || 'js'}`;
        return get().createFile(newName, file.language, null, file.content);
      },

      // ==================== PESTAÑAS ====================
      openFile: (fileId) => {
        set(state => ({
          openFiles: state.openFiles.includes(fileId)
            ? state.openFiles
            : [...state.openFiles, fileId],
          currentFileId: fileId
        }));
      },

      closeFile: (fileId) => {
        set(state => {
          const newOpenFiles = state.openFiles.filter(id => id !== fileId);

          // Si se cierra el archivo actual, cambiar al último abierto de la lista de pestañas
          let newCurrentId = state.currentFileId;
          if (state.currentFileId === fileId) {
            newCurrentId = newOpenFiles.length > 0
              ? newOpenFiles[newOpenFiles.length - 1]
              : null;
          }

          return {
            openFiles: newOpenFiles,
            currentFileId: newCurrentId
          };
        });
      },

      switchFile: (fileId) => {
        const file = get().getFileById(fileId);
        if (file) {
          get().openFile(fileId);
        }
      },

      closeAllFiles: () => {
        set({ openFiles: [], currentFileId: null });
      },

      closeOtherFiles: (fileId) => {
        set({ openFiles: [fileId], currentFileId: fileId });
      },

      // ==================== SNIPPETS ====================
      addSnippet: (snippet) => {
        const newSnippet = {
          id: `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...snippet,
          createdAt: Date.now()
        };

        set(state => ({
          snippets: [...state.snippets, newSnippet]
        }));

        return newSnippet.id;
      },

      updateSnippet: (snippetId, updates) => {
        set(state => ({
          snippets: state.snippets.map(s =>
            s.id === snippetId ? { ...s, ...updates } : s
          )
        }));
      },

      deleteSnippet: (snippetId) => {
        set(state => ({
          snippets: state.snippets.filter(s => s.id !== snippetId)
        }));
      },

      getSnippetsByCategory: (category) => {
        const allSnippets = get().getAllSnippets();
        return category === 'all'
          ? allSnippets
          : allSnippets.filter(s => s.category === category);
      },

      // ==================== GIT ====================
      setGitStatus: (status) => {
        set({ gitStatus: status });
      },

      updateGitStatus: (updates) => {
        set(state => ({
          gitStatus: state.gitStatus ? { ...state.gitStatus, ...updates } : updates
        }));
      },

      // ==================== COLABORACIÓN ====================
      addCollaborator: (collaborator) => {
        const newCollaborator = {
          id: collaborator.id || `user-${Date.now()}`,
          name: collaborator.name,
          email: collaborator.email || '',
          color: collaborator.color || '#13ecc8',
          cursor: collaborator.cursor || null,
          joinedAt: Date.now()
        };

        set(state => ({
          collaborators: [...state.collaborators, newCollaborator]
        }));

        return newCollaborator.id;
      },

      removeCollaborator: (userId) => {
        set(state => ({
          collaborators: state.collaborators.filter(c => c.id !== userId)
        }));
      },

      updateCollaboratorCursor: (userId, cursor) => {
        set(state => ({
          collaborators: state.collaborators.map(c =>
            c.id === userId ? { ...c, cursor } : c
          )
        }));
      },

      clearAllCollaborators: () => {
        set({ collaborators: [] });
      },

      // ==================== UTILIDADES ====================
      getUnsavedFiles: () => {
        const { files } = get();
        return files.filter(f => !f.saved);
      },

      hasUnsavedChanges: () => {
        const { files } = get();
        return files.some(f => !f.saved);
      },

      exportProject: () => {
        const { files, snippets } = get();
        return {
          files,
          snippets,
          exportedAt: Date.now(),
          version: '1.0.0'
        };
      },

      importProject: (data) => {
        if (data.files) {
          set({ files: data.files });
        }
        if (data.snippets) {
          set({ snippets: data.snippets });
        }
      },

      resetStore: () => {
        set({
          files: DEFAULT_FILES,
          openFiles: ['main-js'],
          currentFileId: 'main-js',
          snippets: [],
          gitStatus: null,
          collaborators: []
        });
      }
    }),
    {
      name: 'howard-code-storage',
      partialize: (state) => ({
        files: state.files,
        snippets: state.snippets,
        openFiles: state.openFiles,
        currentFileId: state.currentFileId
      })
    }
  )
);
