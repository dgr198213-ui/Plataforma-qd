// connectors/WebhookConnector.jsx
import { BaseConnector } from '../types/connector.interface';

export class WebhookConnector extends BaseConnector {
  constructor(config) {
    super({ ...config, type: 'webhook' });
  }

  async connect() {
    this.isActive = true;
    return { success: true, message: 'Webhook configurado' };
  }

  async pushData(data) {
    if (!this.isActive) throw new Error('Webhook not active');

    const response = await fetch(this.credentials.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.credentials.headers
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async test() {
    return this.pushData({ test: true, timestamp: Date.now() });
  }
}
