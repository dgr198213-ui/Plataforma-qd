// ConnectorDashboard.jsx
import { useState } from 'react';
import { Github, Plus, X, ArrowLeft, Link2, Globe, Database, Shield } from 'lucide-react';
import { useConnectorsStore } from './store/connectorsStore';
import { GitHubConnector } from './connectors/GitHubConnector';

export default function ConnectorDashboard({ onBack }) {
  const [showAddConnector, setShowAddConnector] = useState(false);
  const { connectors, addConnector, removeConnector } = useConnectorsStore();

  const handleAddGitHub = async (token) => {
    if (!token) return;

    const connector = new GitHubConnector({
      id: `github_${Date.now()}`,
      name: 'GitHub Main',
      credentials: { token }
    });

    try {
      const result = await connector.connect();
      addConnector(connector);
      setShowAddConnector(false);
      // Podríamos usar un sistema de notificaciones global aquí
      alert(`✅ Conectado como ${result.user}`);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#10221f] text-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-[#10221f]/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Link2 size={20} className="text-orange-500" />
            </div>
            <h1 className="text-sm font-bold uppercase tracking-widest">Conectores</h1>
          </div>
        </div>

        <button
          onClick={() => setShowAddConnector(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#13ecc8] text-[#10221f] rounded-xl font-bold text-xs hover:scale-105 transition-all shadow-lg shadow-[#13ecc8]/10"
        >
          <Plus size={16} />
          Añadir Integración
        </button>
      </header>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {connectors.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
              <Link2 size={40} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">No hay conectores activos</h2>
              <p className="text-gray-500 max-w-md">
                Vincula servicios externos como GitHub, bases de datos o webhooks para potenciar tu flujo de desarrollo.
              </p>
            </div>
            <button
              onClick={() => setShowAddConnector(true)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
            >
              Configurar mi primer conector
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectors.map(connector => (
              <div
                key={connector.id}
                className="group relative bg-[#192233] border border-white/5 rounded-2xl p-5 hover:border-[#13ecc8]/30 transition-all shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center">
                      {connector.type === 'github' && <Github size={24} className="text-white" />}
                      {connector.type === 'api' && <Globe size={24} className="text-blue-400" />}
                      {connector.type === 'supabase' && <Database size={24} className="text-emerald-400" />}
                      {connector.type === 'webhook' && <Link2 size={24} className="text-orange-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{connector.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-gray-400 font-bold uppercase tracking-tighter">
                          {connector.type}
                        </span>
                        {connector.isActive ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Activo
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Error
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeConnector(connector.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar conexión"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-bold transition-all"
                    onClick={() => connector.connect().then(() => alert('Test exitoso')).catch(e => alert(e.message))}
                  >
                    Probar Conexión
                  </button>
                  <button className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-bold transition-all">
                    Configurar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de añadir */}
      {showAddConnector && (
        <AddConnectorModal
          onClose={() => setShowAddConnector(false)}
          onAddGitHub={handleAddGitHub}
        />
      )}
    </div>
  );
}

function AddConnectorModal({ onClose, onAddGitHub }) {
  const [token, setToken] = useState('');
  const [step, setStep] = useState('select'); // 'select' | 'github'

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-[#192233] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="font-bold flex items-center gap-2">
            <Plus size={18} className="text-[#13ecc8]" />
            Añadir Conector
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'select' ? (
            <div className="space-y-3">
              <button
                onClick={() => setStep('github')}
                className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-[#13ecc8]/50 hover:bg-[#13ecc8]/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center">
                  <Github size={24} />
                </div>
                <div>
                  <h4 className="font-bold">GitHub</h4>
                  <p className="text-xs text-gray-500 mt-1">Clona repositorios y publica cambios.</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl opacity-50 cursor-not-allowed text-left">
                <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center">
                  <Database size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Supabase (Próximamente)</h4>
                  <p className="text-xs text-gray-500 mt-1">Sincroniza datos y autenticación.</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl opacity-50 cursor-not-allowed text-left">
                <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="font-bold">REST API (Próximamente)</h4>
                  <p className="text-xs text-gray-500 mt-1">Conecta con cualquier servicio HTTP.</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-[#13ecc8]/5 p-4 rounded-2xl border border-[#13ecc8]/10 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-[#13ecc8] shrink-0">
                  <Shield size={20} />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Para conectar con GitHub necesitas crear un <strong className="text-white">Personal Access Token (classic)</strong> con permisos <code className="bg-black/40 px-1 rounded text-[#13ecc8]">repo</code>.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                  GitHub Access Token
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#13ecc8]/50 transition-all font-mono"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={() => onAddGitHub(token)}
                  disabled={!token}
                  className="flex-[2] py-4 bg-[#13ecc8] text-[#10221f] rounded-2xl font-bold transition-all shadow-lg shadow-[#13ecc8]/20 disabled:opacity-50"
                >
                  Confirmar Conexión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
