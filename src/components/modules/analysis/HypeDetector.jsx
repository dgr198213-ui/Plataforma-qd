import { ArrowLeft, Radar, Search, TrendingUp, Zap } from 'lucide-react';

const HypeDetector = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#10221f] text-white pb-24">
      <div className="sticky top-0 bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Hype Detector</h2>
        <Radar size={24} className="text-[#13ecc8] animate-pulse" />
      </div>

      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#13ecc8]" size={20} />
          <input
            type="text"
            placeholder="Analizar URL o noticia..."
            className="w-full bg-[#192233] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#13ecc8]/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#192233] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 uppercase font-bold mb-1">Señal</span>
            <span className="text-2xl font-bold text-[#13ecc8]">8.4</span>
          </div>
          <div className="bg-[#192233] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 uppercase font-bold mb-1">Ruido</span>
            <span className="text-2xl font-bold text-orange-500">2.1</span>
          </div>
        </div>

        <div className="bg-[#192233] rounded-xl border border-white/5 p-4">
          <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
            <TrendingUp size={16} /> Tendencias de Sustancia
          </h4>
          <div className="space-y-4">
            {[
              { label: 'LLM Agents', val: 85, color: 'bg-[#13ecc8]' },
              { label: 'Web3 Gaming', val: 15, color: 'bg-orange-500' },
              { label: 'Edge Computing', val: 65, color: 'bg-blue-500' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{item.label}</span>
                  <span className="font-bold">{item.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-400 uppercase">Alertas de Humo</h4>
          {[1, 2].map(i => (
            <div key={i} className="bg-[#192233] p-3 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={14} className="text-orange-500" />
                <span className="text-xs font-bold">Marketing Agresivo Detectado</span>
              </div>
              <p className="text-[11px] text-gray-400">La noticia contiene términos hiperbólicos sin respaldo técnico evidente.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HypeDetector;
