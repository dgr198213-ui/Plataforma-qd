// connectors/SupabaseConnector.jsx
import { createClient } from '@supabase/supabase-js';
import { BaseConnector } from '../types/connector.interface';

export class SupabaseConnector extends BaseConnector {
  constructor(config) {
    super({ ...config, type: 'supabase' });
    this.client = null;
  }

  async connect() {
    try {
      this.client = createClient(
        this.credentials.url,
        this.credentials.anonKey
      );

      // Test de conexión simple
      const { error } = await this.client.from('_rpc').select('*').limit(1).maybeSingle();

      // Nota: '_rpc' es solo para probar, fallará si no existe pero si hay error de auth es lo que importa
      if (error && error.code === 'PGRST301') { // JWT expired or invalid
        throw error;
      }

      this.isActive = true;
      return { success: true, message: 'Conectado a Supabase' };
    } catch (error) {
      this.isActive = false;
      throw new Error(`Supabase: ${error.message}`);
    }
  }

  async test() {
    return this.connect();
  }
}
