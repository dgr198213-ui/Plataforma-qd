/**
 * AITaskRunner - Versión Integrada con credentialsStore
 *
 * Reutiliza el sistema de credenciales cifradas de Howard OS
 * para obtener la API key de Claude de forma segura.
 */

import { useState, useEffect } from 'react';
import { Bot, Play, CheckCircle, XCircle, Loader2, AlertTriangle, Key, ArrowLeft } from 'lucide-react';
import { useCredentialsStore } from '../../../store/credentialsStore';

export function AITaskRunner({ onBack }) {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState(null);

  // Obtener credenciales del store
  const credentials = useCredentialsStore(state => state.credentials);
  const getCredentialValue = useCredentialsStore(state => state.getCredentialValue);
  const loadCredentials = useCredentialsStore(state => state.loadCredentials);
  const isLoaded = useCredentialsStore(state => state.isLoaded);

  // Asegurar que las credenciales estén cargadas
  useEffect(() => {
    if (!isLoaded) {
      loadCredentials();
    }
  }, [isLoaded, loadCredentials]);

  // Buscar API key de Anthropic en las credenciales guardadas
  useEffect(() => {
    // Intenta obtener de credenciales guardadas
    const anthropicCred = credentials.find(
      c => c.name?.toLowerCase().includes('anthropic') ||
           c.name?.toLowerCase().includes('claude')
    );

    if (anthropicCred) {
      const key = getCredentialValue(anthropicCred.id, 'apiKey') ||
                  getCredentialValue(anthropicCred.id, 'token') ||
                  getCredentialValue(anthropicCred.id, 'key');
      setApiKey(key);
    } else {
      // Fallback a variable de entorno
      const envKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      setApiKey(envKey);
    }
  }, [credentials, getCredentialValue]);

  // Lista de tareas predefinidas
  const quickTasks = [
    {
      id: 'analyze-project',
      title: 'Analizar Estructura',
      prompt: 'Analiza la estructura de archivos de este proyecto React y sugiere mejoras organizacionales considerando las mejores prácticas.',
      icon: '📊',
      riskLevel: 'low',
      category: 'analysis'
    },
    {
      id: 'generate-readme',
      title: 'Generar README',
      prompt: 'Genera un README.md profesional y completo para un componente React, incluyendo ejemplos de uso, props, tipos TypeScript y mejores prácticas.',
      icon: '📝',
      riskLevel: 'low',
      category: 'documentation'
    },
    {
      id: 'code-review',
      title: 'Code Review',
      prompt: 'Revisa el código proporcionado y sugiere mejoras específicas en: rendimiento, legibilidad, seguridad, accesibilidad y mejores prácticas de React/JavaScript moderno.',
      icon: '🔍',
      riskLevel: 'low',
      category: 'review'
    },
    {
      id: 'generate-tests',
      title: 'Generar Tests',
      prompt: 'Genera tests unitarios completos usando Vitest y React Testing Library, cubriendo casos principales, edge cases y tests de integración relevantes.',
      icon: '🧪',
      riskLevel: 'medium',
      category: 'testing'
    },
    {
      id: 'refactor-typescript',
      title: 'Migrar a TypeScript',
      prompt: 'Convierte el código JavaScript proporcionado a TypeScript, añadiendo tipos apropiados, interfaces y tipos de utilidad cuando sea necesario.',
      icon: '🔷',
      riskLevel: 'medium',
      category: 'refactor'
    },
    {
      id: 'optimize-bundle',
      title: 'Optimizar Bundle',
      prompt: 'Analiza las importaciones y el código proporcionado, sugiere optimizaciones específicas para reducir el tamaño del bundle: lazy loading, tree shaking, code splitting, etc.',
      icon: '⚡',
      riskLevel: 'low',
      category: 'optimization'
    },
    {
      id: 'security-audit',
      title: 'Auditoría de Seguridad',
      prompt: 'Realiza una auditoría de seguridad del código, identificando vulnerabilidades potenciales, validaciones faltantes y mejores prácticas de seguridad.',
      icon: '🔐',
      riskLevel: 'low',
      category: 'security'
    },
    {
      id: 'accessibility',
      title: 'Accesibilidad (a11y)',
      prompt: 'Revisa el código y sugiere mejoras de accesibilidad: atributos ARIA, navegación por teclado, contraste de colores, lectores de pantalla.',
      icon: '♿',
      riskLevel: 'low',
      category: 'accessibility'
    },
    {
      id: 'performance',
      title: 'Optimización de Rendimiento',
      prompt: 'Analiza el código y sugiere optimizaciones de rendimiento: memoización, callbacks, reducción de re-renders, optimización de loops y operaciones costosas.',
      icon: '🚀',
      riskLevel: 'low',
      category: 'performance'
    }
  ];

  const executeTask = async (taskPrompt, customTask = false) => {
    if (!apiKey) {
      alert('⚠️ No se encontró API key de Anthropic.\n\nVe al módulo de Credenciales y añade tu API key de Claude/Anthropic.');
      return;
    }

    const taskId = Date.now();
    const newTask = {
      id: taskId,
      prompt: taskPrompt,
      status: 'running',
      result: null,
      startTime: Date.now()
    };

    setTasks(prev => [newTask, ...prev]);
    setIsProcessing(true);
    if (customTask) setCurrentTask('');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: taskPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.content[0].text;

      setTasks(prev => prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: 'completed',
              result,
              endTime: Date.now(),
              duration: Date.now() - task.startTime
            }
          : task
      ));

    } catch (error) {
      console.error('Task execution error:', error);

      setTasks(prev => prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: 'failed',
              error: error.message,
              endTime: Date.now()
            }
          : task
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickTask = (task) => {
    executeTask(task.prompt);
  };

  const handleCustomTask = () => {
    if (!currentTask.trim()) return;
    executeTask(currentTask, true);
  };

  // Agrupar tareas por categoría
  const tasksByCategory = quickTasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {});

  const categoryLabels = {
    analysis: '📊 Análisis',
    documentation: '📝 Documentación',
    review: '🔍 Revisión',
    testing: '🧪 Testing',
    refactor: '🔄 Refactorización',
    optimization: '⚡ Optimización',
    security: '🔐 Seguridad',
    accessibility: '♿ Accesibilidad',
    performance: '🚀 Rendimiento'
  };

  return (
    <div className="ai-task-runner h-full flex flex-col bg-[#10221f] text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-[#10221f]/90 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <Bot className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold">AI Task Runner</h1>
              <p className="text-sm text-gray-400">
                Automatización inteligente con Claude API
              </p>
            </div>
          </div>

          {/* API Status */}
          <div className="flex items-center gap-2">
            {apiKey ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/20 border border-green-700/50 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">API Conectada</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-900/20 border border-red-700/50 rounded-full">
                <Key className="w-3 h-3 text-red-400" />
                <span className="text-xs text-red-400">API No Configurada</span>
              </div>
            )}
          </div>
        </div>

        {/* Warning si no hay API key */}
        {!apiKey && (
          <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-400 font-semibold mb-1">
                API Key de Anthropic no encontrada
              </p>
              <p className="text-gray-300">
                Ve al módulo <strong>Credenciales</strong> y añade tu API key de Claude/Anthropic
                para habilitar todas las funcionalidades.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Tasks by Category */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">🚀 Tareas Disponibles</h2>

          <div className="space-y-6">
            {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  {categoryLabels[category]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryTasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => handleQuickTask(task)}
                      disabled={isProcessing || !apiKey}
                      className={`
                        p-4 rounded-xl border text-left transition-all
                        hover:scale-[1.02] active:scale-95
                        disabled:opacity-50 disabled:cursor-not-allowed
                        bg-[#192233] border-white/5 hover:border-[#13ecc8]/30
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{task.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm mb-1 text-white">
                            {task.title}
                          </div>
                          <div className="text-xs text-gray-400 line-clamp-2">
                            {task.prompt.slice(0, 80)}...
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Task Input */}
        <div className="p-6 border-t border-white/5 bg-[#192233]/30">
          <h2 className="text-lg font-semibold mb-4">✍️ Tarea Personalizada</h2>

          <div className="flex gap-3">
            <textarea
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleCustomTask();
                }
              }}
              placeholder="Describe la tarea que quieres que Claude ejecute... (Ctrl+Enter para ejecutar)"
              disabled={isProcessing || !apiKey}
              rows={3}
              className="flex-1 px-4 py-3 bg-[#0d1117] border border-white/10 rounded-xl
                       focus:outline-none focus:border-[#13ecc8]/50 resize-none
                       disabled:opacity-50 text-sm"
            />

            <button
              onClick={handleCustomTask}
              disabled={!currentTask.trim() || isProcessing || !apiKey}
              className="px-6 py-3 bg-[#13ecc8] text-[#10221f] hover:bg-[#0fc9a8] rounded-xl
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all flex items-center gap-2 self-end font-bold shadow-lg shadow-[#13ecc8]/10"
            >
              <Play className="w-5 h-5" />
              Ejecutar
            </button>
          </div>

          <div className="mt-2 text-[10px] text-gray-500 font-medium uppercase tracking-widest">
            💡 Tip: Presiona <kbd className="px-2 py-1 bg-white/5 rounded">Ctrl+Enter</kbd> para ejecutar
          </div>
        </div>

        {/* Results */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
            <span>📋 Historial de Tareas</span>
            <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-400">{tasks.length}</span>
          </h2>

          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-[#192233]/20 rounded-2xl border border-dashed border-white/5">
              <Bot className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">No hay tareas ejecutadas</p>
              <p className="text-xs uppercase tracking-widest">Selecciona una tarea o escribe una personalizada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskResultCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskResultCard({ task }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const statusConfig = {
    running: {
      icon: <Loader2 className="w-5 h-5 text-[#13ecc8] animate-spin" />,
      bgColor: 'bg-[#13ecc8]/5',
      borderColor: 'border-[#13ecc8]/20',
      label: 'Ejecutando...'
    },
    completed: {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      bgColor: 'bg-emerald-500/5',
      borderColor: 'border-emerald-500/20',
      label: 'Completada'
    },
    failed: {
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      bgColor: 'bg-red-500/5',
      borderColor: 'border-red-500/20',
      label: 'Error'
    }
  };

  const config = statusConfig[task.status];

  return (
    <div className={`rounded-xl border ${config.bgColor} ${config.borderColor} overflow-hidden transition-all shadow-sm`}>
      <div
        className="p-4 flex items-start gap-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mt-0.5">{config.icon}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">{config.label}</span>
            {task.duration && (
              <span className="text-[10px] text-gray-500 font-bold">
                • {(task.duration / 1000).toFixed(1)}s
              </span>
            )}
          </div>

          <div className="text-sm text-white/80 line-clamp-2 font-medium">
            {task.prompt}
          </div>
        </div>

        <button className="text-gray-500 hover:text-white transition-colors p-1">
          {isExpanded ? <Bot size={16} className="rotate-180 transition-transform" /> : <Bot size={16} />}
        </button>
      </div>

      {isExpanded && (task.result || task.error) && (
        <div className="px-4 pb-4 animate-fadeIn">
          <div className="p-4 bg-[#0d1117] rounded-xl border border-white/5 max-h-96 overflow-y-auto custom-scrollbar shadow-inner">
            {task.status === 'completed' ? (
              <pre className="text-xs whitespace-pre-wrap text-gray-300 font-mono leading-relaxed">
                {task.result}
              </pre>
            ) : (
              <div className="text-xs text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {task.error}
              </div>
            )}
          </div>

          {task.status === 'completed' && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(task.result);
                  alert('✅ Resultado copiado al portapapeles');
                }}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-300 transition-colors"
              >
                📋 Copiar Resultado
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const blob = new Blob([task.result], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `task-${task.id}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-300 transition-colors"
              >
                💾 Descargar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AITaskRunner;
