import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useCodeStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isSyncing: false,
  error: null,

  // Obtener todos los proyectos
  fetchProjects: async () => {
    try {
      set({ isSyncing: true, error: null });
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      set({ projects: data || [], isSyncing: false });
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      set({ error: error.message, isSyncing: false });
    }
  },

  // Crear un nuevo proyecto
  createRemoteProject: async (name, description = '') => {
    try {
      set({ isSyncing: true, error: null });

      const { data, error } = await supabase
        .from('projects')
        .insert([{ name, description }])
        .select()
        .single();

      if (error) throw error;

      const { projects } = get();
      set({ 
        projects: [data, ...projects],
        currentProject: data,
        isSyncing: false 
      });

      return { success: true, project: data };
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      set({ error: error.message, isSyncing: false });
      return { success: false, error: error.message };
    }
  },

  // Actualizar un proyecto
  updateProject: async (id, updates) => {
    try {
      set({ isSyncing: true, error: null });

      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const { projects } = get();
      set({ 
        projects: projects.map(p => p.id === id ? data : p),
        isSyncing: false 
      });

      return { success: true, project: data };
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      set({ error: error.message, isSyncing: false });
      return { success: false, error: error.message };
    }
  },

  // Eliminar un proyecto
  deleteProject: async (id) => {
    try {
      set({ isSyncing: true, error: null });

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { projects } = get();
      set({ 
        projects: projects.filter(p => p.id !== id),
        currentProject: null,
        isSyncing: false 
      });

      return { success: true };
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      set({ error: error.message, isSyncing: false });
      return { success: false, error: error.message };
    }
  },

  // Establecer el proyecto actual
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  // Limpiar errores
  clearError: () => set({ error: null }),
}));
