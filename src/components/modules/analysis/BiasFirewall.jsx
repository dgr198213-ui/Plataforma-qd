import { ArrowLeft, Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const BiasFirewall = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#10221f] text-white pb-24">
      <div className="sticky top-0 bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Bias Firewall</h2>
        <Shield size={24} className="text-emerald-500" />
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-500/30">
            <span className="text-3xl font-bold text-emerald-500">98%</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Estado: Seguro</h3>
          <p className="text-sm text-gray-400">Nivel de sesgo detectado extremadamente bajo</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#192233] p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-emerald-500">
              <CheckCircle size={18} />
              <span className="text-xs font-bold uppercase">Género</span>
            </div>
            <div className="text-2xl font-bold">99.2%</div>
            <div className="text-[10px] text-gray-500 mt-1">Neutralidad Confirmada</div>
          </div>
          <div className="bg-[#192233] p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-orange-500">
              <AlertTriangle size={18} />
              <span className="text-xs font-bold uppercase">Eticidad</span>
            </div>
            <div className="text-2xl font-bold">94.5%</div>
            <div className="text-[10px] text-gray-500 mt-1">2 Alertas menores</div>
          </div>
        </div>

        <div className="bg-[#192233] rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h4 className="font-bold text-sm">Monitoreo en Tiempo Real</h4>
            <TrendingUp size={16} className="text-[#13ecc8]" />
          </div>
          <div className="p-4 h-40 flex items-end gap-1">
            {[40, 70, 45, 90, 65, 80, 30, 95, 70, 85, 60, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-emerald-500/40 rounded-t-sm hover:bg-[#13ecc8] transition-colors cursor-pointer group relative"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#10221f] text-[10px] font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiasFirewall;
