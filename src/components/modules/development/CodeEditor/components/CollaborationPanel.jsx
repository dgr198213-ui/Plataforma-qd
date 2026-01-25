import { useState, useEffect } from 'react';
import { X, Users, Circle, Copy, Check, Wifi, WifiOff, Link as LinkIcon } from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const CollaborationPanel = ({ onClose }) => {
  const {
    collaborators,
    removeCollaborator
  } = useCodeStore();

  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [shareLink] = useState(`https://howard-os.app/session/${sessionId}`);
  const [copied, setCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');

  // Simular conexión WebSocket
  useEffect(() => {
    // Simular delay de conexión
    setConnectionStatus('Conectando al servidor...');

    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('Conectado');
    }, 1500);

    return () => {
      clearTimeout(connectionTimer);
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('No se pudo copiar el enlace');
    }
  };

  const handleRemoveCollaborator = (userId) => {
    if (confirm('¿Expulsar a este colaborador de la sesión?')) {
      removeCollaborator(userId);
      setConnectionStatus('Colaborador expulsado');
      setTimeout(() => setConnectionStatus('Conectado'), 2000);
    }
  };

  return (
    <div className="w-80 bg-[#0d1117] border-l border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-[#13ecc8]" />
          <h3 className="text-sm font-bold">Colaboración</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="Cerrar"
        >
          <X size={16} />
        </button>
      </div>

      {/* Connection Status */}
      <div className="px-3 py-2 border-b border-white/10 bg-[#192233]/50">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi size={14} className="text-green-500" />
          ) : (
            <WifiOff size={14} className="text-yellow-500" />
          )}
          <div className="flex items-center gap-1.5">
            <Circle
              size={6}
              fill={isConnected ? '#10b981' : '#f59e0b'}
              className={isConnected ? 'text-green-500' : 'text-yellow-500'}
            />
            <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
              {connectionStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Info Box */}
        <div className="p-3 border-b border-white/10">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2 mb-2">
              <Users size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-400 font-bold mb-1">
                  Colaboración en Tiempo Real
                </p>
                <p className="text-xs text-gray-400">
                  Edita código simultáneamente con tu equipo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Link Section */}
        <div className="p-3 border-b border-white/10">
          <label className="text-xs text-gray-400 font-bold block mb-2">
            ENLACE DE SESIÓN
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#192233] border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
                <LinkIcon size={14} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-transparent text-xs text-white truncate focus:outline-none"
                />
              </div>
              <button
                onClick={handleCopyLink}
                className="p-2 bg-[#13ecc8] text-[#10221f] rounded-lg hover:bg-[#0fc9a8] transition-colors flex-shrink-0"
                title="Copiar enlace"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Active Collaborators */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs text-gray-400 font-bold">
              COLABORADORES ACTIVOS ({collaborators.length})
            </h4>
          </div>

          {collaborators.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users size={32} className="text-gray-600" />
              </div>
              <p className="text-sm text-gray-500 mb-1">
                Sin colaboradores
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {collaborators.map(user => (
                <div key={user.id} className="bg-[#192233] rounded-lg p-3 border border-white/5 flex items-center justify-between">
                  <span className="text-sm">{user.name}</span>
                  <button onClick={() => handleRemoveCollaborator(user.id)} className="text-xs text-red-400">Expulsar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;
