// connector.interface.js
export class BaseConnector {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type; // 'github' | 'api' | 'webhook' | 'supabase'
    this.credentials = config.credentials;
    this.isActive = false;
  }

  // Métodos obligatorios
  async connect() {
    throw new Error('connect() not implemented');
  }

  async disconnect() {
    this.isActive = false;
    return { success: true };
  }

  async test() {
    throw new Error('test() not implemented');
  }

  // Métodos opcionales
  async fetchData() {
    throw new Error('fetchData() not implemented');
  }

  async pushData() {
    throw new Error('pushData(data) not implemented');
  }

  getStatus() {
    return this.isActive;
  }
}
