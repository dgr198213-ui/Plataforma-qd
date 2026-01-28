/**
 * TEST SUITE para ClawdbotGateway
 *
 * Ejecutar con: npm test
 * O con Vitest: npx vitest run
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ClawdbotGateway } from '../services/ClawdbotGateway';

// Mock WebSocket
global.WebSocket = class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url) {
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.();
    }, 10);
  }

  send(data) {
    this.lastSent = data;
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  }
};

describe('ClawdbotGateway', () => {
  let gateway;

  beforeEach(() => {
    gateway = new ClawdbotGateway({
      host: 'ws://localhost:18789',
      reconnectInterval: 1000,
      maxReconnectAttempts: 3
    });
  });

  afterEach(() => {
    gateway.disconnect();
  });

  describe('Connection', () => {
    it('should connect successfully', async () => {
      await gateway.connect();
      expect(gateway.isConnected).toBe(true);
      expect(gateway.sessionId).toBeTruthy();
    });

    it('should emit connected event', async () => {
      const handler = vi.fn();
      gateway.on('connected', handler);

      await gateway.connect();

      expect(handler).toHaveBeenCalledWith({
        sessionId: expect.any(String)
      });
    });

    it('should send handshake after connection', async () => {
      await gateway.connect();

      const sent = JSON.parse(gateway.ws.lastSent);
      expect(sent.type).toBe('handshake');
      expect(sent.client).toBe('howard-os');
    });
  });

  describe('Risk Assessment', () => {
    it('should classify delete operations as critical', () => {
      const risk = gateway.assessRisk('delete all files in /tmp');
      expect(risk).toBe('critical');
    });

    it('should classify git push as high risk', () => {
      const risk = gateway.assessRisk('git push origin main');
      expect(risk).toBe('high');
    });

    it('should classify read operations as low risk', () => {
      const risk = gateway.assessRisk('read the contents of README.md');
      expect(risk).toBe('low');
    });

    it('should handle multiple risk keywords', () => {
      const risk = gateway.assessRisk('sudo rm -rf /var and delete database');
      expect(risk).toBe('critical');
    });
  });

  describe('Approval Assessment', () => {
    it('should require approval for git push', () => {
      const needsApproval = gateway.assessRequiresApproval('git push origin main');
      expect(needsApproval).toBe(true);
    });

    it('should require approval for npm publish', () => {
      const needsApproval = gateway.assessRequiresApproval('npm publish to registry');
      expect(needsApproval).toBe(true);
    });

    it('should not require approval for safe operations', () => {
      const needsApproval = gateway.assessRequiresApproval('create a new React component');
      expect(needsApproval).toBe(false);
    });

    it('should require approval for delete operations', () => {
      const needsApproval = gateway.assessRequiresApproval('delete old log files');
      expect(needsApproval).toBe(true);
    });
  });

  describe('Task Sending', () => {
    beforeEach(async () => {
      await gateway.connect();
    });

    it('should send task with correct structure', async () => {
      const taskPromise = gateway.sendTask({
        instruction: 'test task',
        context: { test: true }
      });

      const sent = JSON.parse(gateway.ws.lastSent);

      expect(sent.type).toBe('task');
      expect(sent.taskId).toBeTruthy();
      expect(sent.payload.instruction).toBe('test task');
      expect(sent.payload.context.test).toBe(true);
      expect(sent.payload.riskLevel).toBeDefined();
    });

    it('should track pending tasks', async () => {
      gateway.sendTask({ instruction: 'test' });
      expect(gateway.pendingTasks.size).toBe(1);
    });

    it('should resolve when task completes', async () => {
      const taskPromise = gateway.sendTask({ instruction: 'test' });

      // Simular respuesta del servidor
      setTimeout(() => {
        const sent = JSON.parse(gateway.ws.lastSent);
        gateway.handleMessage({
          type: 'task-completed',
          taskId: sent.taskId,
          result: { success: true }
        });
      }, 50);

      const result = await taskPromise;
      expect(result.success).toBe(true);
      expect(result.result.success).toBe(true);
    });

    it('should reject when task fails', async () => {
      const taskPromise = gateway.sendTask({ instruction: 'test' });

      setTimeout(() => {
        const sent = JSON.parse(gateway.ws.lastSent);
        gateway.handleMessage({
          type: 'task-failed',
          taskId: sent.taskId,
          error: 'Test error'
        });
      }, 50);

      await expect(taskPromise).rejects.toThrow('Test error');
    });
  });

  describe('Event System', () => {
    it('should register and trigger event listeners', () => {
      const handler = vi.fn();
      gateway.on('test-event', handler);

      gateway.emit('test-event', { data: 'test' });

      expect(handler).toHaveBeenCalledWith({ data: 'test' });
    });

    it('should remove event listeners', () => {
      const handler = vi.fn();
      gateway.on('test-event', handler);
      gateway.off('test-event', handler);

      gateway.emit('test-event', { data: 'test' });

      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners for same event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      gateway.on('test-event', handler1);
      gateway.on('test-event', handler2);

      gateway.emit('test-event', { data: 'test' });

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });

  describe('Statistics', () => {
    beforeEach(async () => {
      await gateway.connect();
    });

    it('should track completed tasks', async () => {
      const taskPromise = gateway.sendTask({ instruction: 'test' });

      setTimeout(() => {
        const sent = JSON.parse(gateway.ws.lastSent);
        gateway.handleMessage({
          type: 'task-completed',
          taskId: sent.taskId,
          result: {}
        });
      }, 50);

      await taskPromise;

      const stats = gateway.getStats();
      expect(stats.tasksCompleted).toBe(1);
    });

    it('should track failed tasks', async () => {
      const taskPromise = gateway.sendTask({ instruction: 'test' });

      setTimeout(() => {
        const sent = JSON.parse(gateway.ws.lastSent);
        gateway.handleMessage({
          type: 'task-failed',
          taskId: sent.taskId,
          error: 'error'
        });
      }, 50);

      await taskPromise.catch(() => {});

      const stats = gateway.getStats();
      expect(stats.tasksFailed).toBe(1);
    });

    it('should calculate average response time', async () => {
      const task1 = gateway.sendTask({ instruction: 'test1' });

      setTimeout(() => {
        const sent = JSON.parse(gateway.ws.lastSent);
        gateway.handleMessage({
          type: 'task-completed',
          taskId: sent.taskId,
          result: {}
        });
      }, 100);

      await task1;

      const stats = gateway.getStats();
      expect(stats.averageResponseTime).toBeGreaterThan(0);
    });
  });

  describe('Approval Flow', () => {
    beforeEach(async () => {
      await gateway.connect();
    });

    it('should emit approval-required event', () => {
      return new Promise((resolve) => {
        gateway.on('approval-required', (approval) => {
          expect(approval.taskId).toBeTruthy();
          expect(approval.action).toBe('dangerous operation');
          expect(typeof approval.approve).toBe('function');
          expect(typeof approval.reject).toBe('function');
          resolve();
        });

        gateway.handleMessage({
          type: 'task-approval-required',
          taskId: 'test-123',
          action: 'dangerous operation',
          reason: 'high risk'
        });
      });
    });

    it('should send approval response when approved', () => {
      gateway.approveTask('test-123');

      const sent = JSON.parse(gateway.ws.lastSent);
      expect(sent.type).toBe('approval-response');
      expect(sent.taskId).toBe('test-123');
      expect(sent.approved).toBe(true);
    });

    it('should send rejection response when rejected', () => {
      gateway.rejectTask('test-123');

      const sent = JSON.parse(gateway.ws.lastSent);
      expect(sent.type).toBe('approval-response');
      expect(sent.taskId).toBe('test-123');
      expect(sent.approved).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should throw when sending task without connection', async () => {
      await expect(
        gateway.sendTask({ instruction: 'test' })
      ).rejects.toThrow('Not connected');
    });

    it('should handle malformed messages gracefully', async () => {
      await gateway.connect();

      // No debería crashear
      gateway.handleMessage({ type: 'unknown', data: 'bad' });

      expect(gateway.isConnected).toBe(true);
    });
  });
});
