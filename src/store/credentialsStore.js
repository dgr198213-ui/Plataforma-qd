import { create } from 'zustand';
import { SecureStorage } from '../services/SecureStorage';

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

  loadCredentials: () => {
    const saved = SecureStorage.load();
    if (saved) {
      set({ credentials: saved, isLoaded: true });
    } else {
      set({ isLoaded: true });
    }
  },

  updateCredential: (id, value) => {
    const updated = get().credentials.map(cred =>
      cred.id === id
        ? { ...cred, value, configured: Boolean(value) }
        : cred
    );
    set({ credentials: updated });
    SecureStorage.save(updated);
  },

  getCredential: (id) => {
    return get().credentials.find(cred => cred.id === id)?.value || null;
  },

  addCredential: (newCred) => {
    const updated = [...get().credentials, {
      id: `custom-${Date.now()}`,
      ...newCred,
      configured: Boolean(newCred.password || newCred.value)
    }];
    set({ credentials: updated });
    SecureStorage.save(updated);
  },

  clearAll: () => {
    set({ credentials: DEFAULT_CREDENTIALS });
    SecureStorage.clear();
  }
}));
