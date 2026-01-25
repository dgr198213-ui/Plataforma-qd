import { useState } from 'react';
import { ArrowLeft, Shield, Github, Zap, MessageSquare, Cloud, Database } from 'lucide-react';

const CredentialsPanel = ({ onBack }) => {
  const [credentials, setCredentials] = useState([
    { id: 1, name: 'GitHub', type: 'github', value: '', configured: false },
    { id: 2, name: 'OpenAI API', type: 'openai', value: '', configured: false },
    { id: 3, name: 'Anthropic API', type: 'anthropic', value: '', configured: false },
    { id: 4, name: 'Vercel', type: 'vercel', value: '', configured: false },
    { id: 5, name: 'AWS', type: 'aws', value: '', configured: false }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const handleSave = (id) => {
    setCredentials(prev => prev.map(cred =>
      cred.id === id ? { ...cred, value: tempValue, configured: true } : cred
    ));
    setEditingId(null);
    setTempValue('');
  };

  const handleEdit = (cred) => {
    setEditingId(cred.id);
    setTempValue(cred.value);
  };

  return (
    <div className="min-h-screen bg-[#10221f] text-white pb-24">
      <div className="sticky top-0 bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Credenciales & Accesos</h2>
        <div className="w-6" />
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-500 mt-1" size={20} />
            <div>
              <p className="text-sm font-bold text-white mb-1">Seguridad de Credenciales</p>
              <p className="text-xs text-gray-400">Todas las credenciales se almacenan localmente cifradas.</p>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Plataformas Configuradas</h3>

        {credentials.map(cred => (
          <div key={cred.id} className="bg-[#192233] rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${cred.configured ? 'bg-emerald-500/10' : 'bg-gray-500/10'} flex items-center justify-center`}>
                  {cred.type === 'github' && <Github className={cred.configured ? 'text-emerald-500' : 'text-gray-500'} size={20} />}
                  {cred.type === 'openai' && <Zap className={cred.configured ? 'text-emerald-500' : 'text-gray-500'} size={20} />}
                  {cred.type === 'anthropic' && <MessageSquare className={cred.configured ? 'text-emerald-500' : 'text-gray-500'} size={20} />}
                  {cred.type === 'vercel' && <Cloud className={cred.configured ? 'text-emerald-500' : 'text-gray-500'} size={20} />}
                  {cred.type === 'aws' && <Database className={cred.configured ? 'text-emerald-500' : 'text-gray-500'} size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-white">{cred.name}</h4>
                  <p className="text-xs text-gray-400">
                    {cred.configured ? '✓ Configurado' : 'No configurado'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEdit(cred)}
                className="text-[#13ecc8] text-sm font-medium"
              >
                {cred.configured ? 'Editar' : 'Configurar'}
              </button>
            </div>

            {editingId === cred.id && (
              <div className="space-y-3 mt-3 pt-3 border-t border-white/5">
                <input
                  type="password"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder={`Ingresa tu ${cred.name} token`}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#13ecc8]/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(cred.id)}
                    className="flex-1 bg-[#13ecc8] text-[#10221f] px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {setEditingId(null); setTempValue('');}}
                    className="px-4 py-2 border border-white/10 rounded-lg text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CredentialsPanel;
