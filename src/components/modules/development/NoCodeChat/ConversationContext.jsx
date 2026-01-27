import { Info, FileText, Package, Cpu } from 'lucide-react';

export default function ConversationContext({ project }) {
  if (!project) return null;

  return (
    <div className="bg-[#192233]/50 border-y border-white/5 p-4 flex gap-6 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <Info size={14} />
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contexto Activo:</span>
      </div>

      <div className="flex items-center gap-2 whitespace-nowrap">
        <FileText size={14} className="text-blue-400" />
        <span className="text-xs text-white/80">{project.files?.length || 0} Archivos</span>
      </div>

      <div className="flex items-center gap-2 whitespace-nowrap">
        <Package size={14} className="text-purple-400" />
        <span className="text-xs text-white/80">React + Tailwind</span>
      </div>

      <div className="flex items-center gap-2 whitespace-nowrap">
        <Cpu size={14} className="text-orange-400" />
        <span className="text-xs text-white/80">Claude 3.5 Sonnet</span>
      </div>
    </div>
  );
}
