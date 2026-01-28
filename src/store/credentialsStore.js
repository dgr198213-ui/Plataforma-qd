import { create } from 'zustand';
import { SecureStorage } from '../services/SecureStorage';
import { supabase } from '../lib/supabase';
import { isUUID } from '../utils/uuid';

const DEFAULT_CREDENTIALS = [
  { id: 'github', name: 'GitHub', icon: 'Github', value: '', configured: false },
  { id: 'openai', name: 'OpenAI API', icon: 'Zap', value: '', configured: false },
  { id: 'anthropic', name: 'Anthropic API', icon: 'MessageSquare', value: '', configured: false },
  { id: 'vercel', name: 'Vercel', icon: 'Cloud', value: '', configured: false },
  { id: 'aws', name: 'AWS', icon: 'Database', value: '', configured: false }
];

export const useCredentialsStore = create((set, get) => ({
  credentials: DEFAULT_CREDENTIALS,
  isLoaded: false,
  isSyncing: false,

  loadCredentials: async () => {
    set({ isSyncing: true });
    
    try {
      // 1. Intentar cargar de Supabase
      const { data, error } = await supabase.from('credentials').select('*');

      if (!error && data && data.length > 0) {
        const formatted = data.map(c => ({
          id: c.id,
          name: c.name,
          username: c.username,
          value: SecureStorage.decrypt(c.encrypted_value), // Descifrar localmente
          category: c.category,
          notes: c.notes,
          icon: c.icon,
          configured: true
        }));
        set({ credentials: formatted, isLoaded: true, isSyncing: false });
      } else {
        // Fallback a LocalStorage si no hay en Supabase o no hay sesión
        const saved = SecureStorage.load();
        set({ credentials: saved || DEFAULT_CREDENTIALS, isLoaded: true, isSyncing: false });
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
      const saved = SecureStorage.load();
      set({ credentials: saved || DEFAULT_CREDENTIALS, isLoaded: true, isSyncing: false });
    }
  },

  updateCredential: async (id, value) => {
    const cred = get().credentials.find(c => c.id === id);
    if (!cred) return;

    const encryptedValue = SecureStorage.encrypt(value);
    const credIsUUID = isUUID(id);
    
    try {
      // Actualizar en Supabase si tiene ID de UUID (ya existe en DB)
      if (credIsUUID) {
        await supabase
          .from('credentials')
          .update({ encrypted_value: encryptedValue, updated_at: new Date().toISOString() })
          .eq('id', id);
      } else {
        // Crear en Supabase si es una de las por defecto y hay sesión activa
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from('credentials')
            .insert([{
              name: cred.name,
              icon: cred.icon,
              encrypted_value: encryptedValue,
              category: 'General'
            }])
            .select();

          if (!error && data) {
            id = data[0].id; // Actualizar ID local con el de DB
          }
        }
      }
    } catch (error) {
      console.error('Error updating credential in Supabase:', error);
    }

    const updated = get().credentials.map(c =>
      c.id === id || c.name === cred.name
        ? { ...c, id, value, configured: Boolean(value) }
        : c
    );
    
    set({ credentials: updated });
    SecureStorage.save(updated);
  },

  addCredential: async (newCred) => {
    const encryptedValue = SecureStorage.encrypt(newCred.password || newCred.value);
    
    try {
      const { data, error } = await supabase
        .from('credentials')
        .insert([{
          name: newCred.name,
          username: newCred.username,
          encrypted_value: encryptedValue,
          category: newCred.category,
          notes: newCred.notes,
          icon: newCred.icon || 'Key'
        }])
        .select();

      if (!error && data) {
        const updated = [...get().credentials, {
          ...newCred,
          id: data[0].id,
          value: newCred.password || newCred.value,
          configured: true
        }];
        set({ credentials: updated });
        SecureStorage.save(updated);
      } else {
        // Si no se puede en Supabase, guardar localmente con un ID temporal
        const tempId = `local-${Date.now()}`;
        const updated = [...get().credentials, {
          ...newCred,
          id: tempId,
          value: newCred.password || newCred.value,
          configured: true
        }];
        set({ credentials: updated });
        SecureStorage.save(updated);
      }
    } catch (error) {
      console.error('Error adding credential:', error);
    }
  },

  getCredentialValue: (id) => {
    const cred = get().credentials.find(c => c.id === id);
    if (!cred) return null;
    return cred.value;
  },

  clearAll: async () => {
    await supabase.from('credentials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    set({ credentials: DEFAULT_CREDENTIALS });
    SecureStorage.clear();
  }
}));
