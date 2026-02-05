import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Play, CheckCircle2, Clock, AlertCircle, Terminal } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useCodeStore } from '../../../store/codeStore';

const AITaskRunner = ({ onBack }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { currentProject } = useCodeStore();

  const AGENT_URL = 'https://mi-agente-qode-ia.vercel.app/api/agent';

  const runTask = async (taskName, description) => {
    if (loading || !currentProject) return;
    
    setLoading(true);
    const newTask = {
      id: Date.now(),
      name: taskName,
      status: 'running',
      startTime: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);

    try {
      const response = await fetch(AGENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `EJECUTA TAREA: ${taskName}. DESCRIPCIÓN: ${description}. PROYECTO: ${currentProject.name}`,
          projectId: currentProject.id,
          sessionId: `task-${Date.now()}`
        })
      });

      const data = await response.json();
      
      setTasks(prev => prev.map(t => 
        t.id === newTask.id 
          ? { ...t, status: 'completed', result: data.response, endTime: new Date().toISOString() } 
          : t
      ));
    } catch (error) {
      setTasks(prev => prev.map(t => 
        t.id === newTask.id 
          ? { ...t, status: 'error', error: error.message } 
          : t
      ));
    } finally {
      setLoading(false);
    }
  };

  const presetTasks = [
    { name: 'Auditoría de Seguridad', desc: 'Escanea el proyecto en busca de vulnerabilidades y claves expuestas.' },
    { name: 'Optimización de Código', desc: 'Busca patrones ineficientes y sugiere mejoras de rendimiento.' },
    { name: 'Generación de Documentación', desc: 'Analiza el código y genera un README.md detallado.' },
    { name: 'Sincronización MCP', desc: 'Sincroniza el estado actual del proyecto con la base de conocimiento.' }
  ];

  return (
    <div className="min-h-screen bg-[#10221f] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-[#13ecc8] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al Dashboard</span>
          </button>
          {currentProject && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#13ecc8]/10 border border-[#13ecc8]/20 rounded-lg">
              <span className="text-xs text-gray-400">Proyecto Activo:</span>
              <span className="text-sm font-bold text-[#13ecc8]">{currentProject.name}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preset Tasks */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Tareas Disponibles</h3>
            {presetTasks.map((task) => (
              <div 
                key={task.name}
                className="bg-[#192233] border border-white/5 rounded-xl p-5 hover:border-[#13ecc8]/30 transition-all group"
              >
                <h4 className="font-bold text-white mb-2 flex items-center justify-between">
                  {task.name}
                  <button 
                    onClick={() => runTask(task.name, task.desc)}
                    disabled={loading || !currentProject}
                    className="p-2 bg-[#13ecc8]/10 text-[#13ecc8] rounded-lg hover:bg-[#13ecc8] hover:text-black transition-all disabled:opacity-30"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">{task.desc}</p>
              </div>
            ))}
            {!currentProject && (
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-400">
                ⚠️ Selecciona un proyecto en Howard OS para habilitar la ejecución de tareas.
              </div>
            )}
          </div>

          {/* Execution History */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Historial de Ejecución</h3>
            <div className="bg-[#0d1117] border border-white/10 rounded-2xl min-h-[500px] flex flex-col overflow-hidden">
              {tasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                  <Terminal size={48} className="mb-4" />
                  <p className="text-sm">No hay tareas ejecutadas recientemente.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <div className="p-4 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-3">
                          {task.status === 'running' && <Clock className="text-blue-400 animate-spin" size={18} />}
                          {task.status === 'completed' && <CheckCircle2 className="text-[#13ecc8]" size={18} />}
                          {task.status === 'error' && <AlertCircle className="text-red-400" size={18} />}
                          <span className="font-bold text-sm">{task.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">
                          {new Date(task.startTime).toLocaleTimeString()}
                        </span>
                      </div>
                      {task.result && (
                        <div className="p-4 bg-black/40">
                          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                            {task.result}
                          </pre>
                        </div>
                      )}
                      {task.error && (
                        <div className="p-4 bg-red-500/5 text-red-400 text-xs font-mono">
                          Error: {task.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITaskRunner;
