/**
 * MoltbotPanel - Panel de control para Moltbot Gateway
 *
 * UI completa para gestionar tareas, ver estado y aprobar operaciones críticas
 */

import { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  Loader2,
  Shield
} from 'lucide-react';
import { ClawdbotGateway } from '../../../services/ClawdbotGateway';

export function MoltbotPanel() {
  const [gateway, setGateway] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [tasks, setTasks] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentInput, setCurrentInput] = useState('');
  const [thinkingSteps, setThinkingSteps] = useState([]);

  const taskListRef = useRef(null);

  // Inicializar conexión
  useEffect(() => {
    const gw = new ClawdbotGateway({
      host: 'ws://127.0.0.1:18789',
      reconnectInterval: 3000,
      maxReconnectAttempts: 5
    });

    // Event listeners
    gw.on('connected', () => {
      setConnectionStatus('connected');
      console.log('✅ Moltbot connected');
    });

    gw.on('disconnected', () => {
      setConnectionStatus('disconnected');
    });

    gw.on('error', (error) => {
      setConnectionStatus('error');
      console.error('Moltbot error:', error);
    });

    gw.on('task-sent', ({ taskId, instruction }) => {
      setTasks(prev => [...prev, {
        id: taskId,
        instruction,
        status: 'pending',
        timestamp: Date.now()
      }]);
    });

    gw.on('task-progress', ({ taskId, progress }) => {
      setTasks(prev => prev.map(task =>
        task.id === taskId
          ? { ...task, status: 'in-progress', progress }
          : task
      ));
    });

    gw.on('task-completed', ({ taskId, result }) => {
      setTasks(prev => prev.map(task =>
        task.id === taskId
          ? { ...task, status: 'completed', result, completedAt: Date.now() }
          : task
      ));
    });

    gw.on('task-failed', ({ taskId, error }) => {
      setTasks(prev => prev.map(task =>
        task.id === taskId
          ? { ...task, status: 'failed', error }
          : task
      ));
    });

    gw.on('approval-required', (approval) => {
      setPendingApprovals(prev => [...prev, approval]);
    });

    gw.on('thinking', ({ content }) => {
      setThinkingSteps(prev => [...prev, {
        timestamp: Date.now(),
        content
      }]);
    });

    gw.on('tool-call', ({ tool, params }) => {
      console.log(`🔧 Tool called: ${tool}`, params);
    });

    // Conectar
    gw.connect().catch(error => {
      console.error('Failed to connect to Moltbot:', error);
      setConnectionStatus('error');
    });

    setGateway(gw);

    // Stats updater
    const statsInterval = setInterval(() => {
      if (gw.isConnected) {
        setStats(gw.getStats());
      }
    }, 2000);

    return () => {
      clearInterval(statsInterval);
      gw.disconnect();
    };
  }, []);

  // Auto-scroll tasks
  useEffect(() => {
    if (taskListRef.current) {
      taskListRef.current.scrollTop = taskListRef.current.scrollHeight;
    }
  }, [tasks]);

  const handleSendTask = async () => {
    if (!currentInput.trim() || !gateway?.isConnected) return;

    const instruction = currentInput.trim();
    setCurrentInput('');

    try {
      const result = await gateway.sendTask({
        instruction,
        context: {
          workspace: 'howard-os',
          timestamp: Date.now()
        },
        priority: 'normal'
      });

      console.log('Task completed:', result);
    } catch (error) {
      console.error('Task failed:', error);
    }
  };

  const handleApprove = (approval) => {
    approval.approve();
    setPendingApprovals(prev => prev.filter(a => a.taskId !== approval.taskId));
  };

  const handleReject = (approval) => {
    approval.reject();
    setPendingApprovals(prev => prev.filter(a => a.taskId !== approval.taskId));
  };

  return (
    <div className="moltbot-panel h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold">Moltbot Gateway</h2>
          <ConnectionBadge status={connectionStatus} />
        </div>

        {stats && (
          <div className="flex items-center gap-4 text-sm">
            <StatItem
              icon={<CheckCircle className="w-4 h-4 text-green-400" />}
              label="Completed"
              value={stats.tasksCompleted}
            />
            <StatItem
              icon={<XCircle className="w-4 h-4 text-red-400" />}
              label="Failed"
              value={stats.tasksFailed}
            />
            <StatItem
              icon={<Clock className="w-4 h-4 text-blue-400" />}
              label="Avg Time"
              value={`${Math.round(stats.averageResponseTime / 1000)}s`}
            />
          </div>
        )}
      </div>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="bg-yellow-900/20 border-b border-yellow-700/50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-yellow-400">
                Pending Approvals ({pendingApprovals.length})
              </h3>
            </div>

            <div className="space-y-2">
              {pendingApprovals.map(approval => (
                <ApprovalCard
                  key={approval.taskId}
                  approval={approval}
                  onApprove={() => handleApprove(approval)}
                  onReject={() => handleReject(approval)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div
        ref={taskListRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bot className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">No tasks yet</p>
            <p className="text-sm">Send an instruction to get started</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>

      {/* Thinking Steps */}
      {thinkingSteps.length > 0 && (
        <div className="border-t border-gray-700 p-4 bg-gray-800/50 max-h-32 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-sm text-gray-400">Thinking...</span>
          </div>
          {thinkingSteps.slice(-3).map((step, idx) => (
            <div key={idx} className="text-xs text-gray-500 ml-6">
              {step.content}
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendTask()}
            placeholder="Send instruction to Moltbot..."
            disabled={connectionStatus !== 'connected'}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                     focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
          <button
            onClick={handleSendTask}
            disabled={!currentInput.trim() || connectionStatus !== 'connected'}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                     flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-componentes
function ConnectionBadge({ status }) {
  const configs = {
    connected: {
      color: 'bg-green-500',
      label: 'Connected',
      icon: null
    },
    disconnected: {
      color: 'bg-gray-500',
      label: 'Disconnected',
      icon: null
    },
    error: {
      color: 'bg-red-500',
      label: 'Error',
      icon: <AlertTriangle className="w-3 h-3" />
    }
  };

  const config = configs[status] || configs.disconnected;

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800">
      <div className={`w-2 h-2 rounded-full ${config.color} ${status === 'connected' ? 'animate-pulse' : ''}`} />
      <span className="text-xs">{config.label}</span>
      {config.icon}
    </div>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <div className="text-xs text-gray-400">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  const statusConfig = {
    pending: {
      icon: <Clock className="w-4 h-4 text-gray-400" />,
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-700'
    },
    'in-progress': {
      icon: <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />,
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-700/50'
    },
    completed: {
      icon: <CheckCircle className="w-4 h-4 text-green-400" />,
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-700/50'
    },
    failed: {
      icon: <XCircle className="w-4 h-4 text-red-400" />,
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-700/50'
    }
  };

  const config = statusConfig[task.status] || statusConfig.pending;

  return (
    <div className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium break-words">
            {task.instruction}
          </div>

          {task.progress && (
            <div className="text-xs text-gray-400 mt-1">
              {task.progress}
            </div>
          )}

          {task.result && (
            <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs font-mono text-green-400">
              {JSON.stringify(task.result, null, 2)}
            </div>
          )}

          {task.error && (
            <div className="mt-2 p-2 bg-red-900/30 rounded text-xs text-red-400">
              {task.error}
            </div>
          )}

          <div className="text-xs text-gray-500 mt-1">
            {new Date(task.timestamp).toLocaleTimeString()}
            {task.completedAt && (
              <span className="ml-2">
                • {Math.round((task.completedAt - task.timestamp) / 1000)}s
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApprovalCard({ approval, onApprove, onReject }) {
  return (
    <div className="p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm font-semibold text-yellow-400 mb-1">
            High-Risk Operation Detected
          </div>
          <div className="text-sm text-gray-300 mb-1">
            {approval.action}
          </div>
          <div className="text-xs text-gray-400">
            {approval.reason}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            Approve
          </button>
          <button
            onClick={onReject}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors flex items-center gap-1"
          >
            <XCircle className="w-3 h-3" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoltbotPanel;
