import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL o Anon Key no encontradas en las variables de entorno. La persistencia en la nube estará desactivada.');
}

// Inicialización segura de Supabase
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: { message: 'Supabase no configurado' } }),
        insert: () => Promise.resolve({ data: [], error: { message: 'Supabase no configurado' } }),
        update: () => Promise.resolve({ data: [], error: { message: 'Supabase no configurado' } }),
        delete: () => Promise.resolve({ data: [], error: { message: 'Supabase no configurado' } }),
        eq: () => ({ eq: () => {} })
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    };
