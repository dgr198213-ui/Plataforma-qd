// connectors/RestAPIConnector.jsx
import { BaseConnector } from '../types/connector.interface';

export class RestAPIConnector extends BaseConnector {
  constructor(config) {
    super({ ...config, type: 'api' });
  }

  async connect() {
    try {
      const response = await fetch(`${this.credentials.baseUrl}${this.credentials.testEndpoint || ''}`, {
        headers: this.credentials.headers
      });

      if (!response.ok) throw new Error(`API returned ${response.status}`);

      this.isActive = true;
      return { success: true };
    } catch (error) {
      this.isActive = false;
      throw error;
    }
  }

  async fetchData(endpoint, params = {}) {
    const url = new URL(`${this.credentials.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      headers: this.credentials.headers
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  }

  async test() {
    return this.connect();
  }
}
