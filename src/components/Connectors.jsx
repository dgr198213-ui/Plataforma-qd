import { useState } from 'react';
import { ArrowLeft, Github } from 'lucide-react';

const Connectors = ({ onBack }) => {
  const [connectors, setConnectors] = useState([
    { id: 1, name: 'GitHub', icon: 'github', connected: true, count: 24 },
    { id: 2, name: 'GitLab', icon: 'gitlab', connected: false, count: 0 },
    { id: 3, name: 'Vercel', icon: 'vercel', connected: true, count: 8 },
  ]);

  const toggleConnection = (id) => {
    setConnectors(prev => prev.map(conn =>
      conn.id === id ? { ...conn, connected: !conn.connected } : conn
    ));
  };

  return (
    <div className="min-h-screen bg-[#10221f] text-white pb-24">
      <div className="sticky top-0 bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Conectores</h2>
        <div className="w-6" />
      </div>

      <div className="p-4 space-y-4">
        {connectors.map(conn => (
          <div key={conn.id} className="bg-[#192233] rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${conn.connected ? 'bg-[#13ecc8]/10' : 'bg-gray-500/10'} flex items-center justify-center`}>
                  <Github className={conn.connected ? 'text-[#13ecc8]' : 'text-gray-500'} size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{conn.name}</h4>
                  <p className="text-xs text-gray-400">
                    {conn.connected ? `${conn.count} repos` : 'No conectado'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleConnection(conn.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  conn.connected
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                    : 'bg-[#13ecc8] text-[#10221f]'
                }`}
              >
                {conn.connected ? 'Desconectar' : 'Conectar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connectors;
