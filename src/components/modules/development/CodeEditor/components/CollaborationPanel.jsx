import { Users, MessageSquare } from 'lucide-react';

const CollaborationPanel = () => {
  return (
    <div className="w-64 bg-[#0d1117] border-l border-white/10 flex flex-col">
      <div className="p-3 border-b border-white/10 flex items-center gap-2">
        <Users size={16} className="text-[#13ecc8]" />
        <h3 className="text-sm font-bold">COLABORACIÓN</h3>
      </div>
      <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
        <Users size={32} className="text-gray-600 mb-2" />
        <p className="text-xs text-gray-500">No hay otros colaboradores activos en este momento.</p>
        <button className="mt-4 px-4 py-2 bg-[#192233] text-white text-xs rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
          <MessageSquare size={14} />
          Invitar Colaborador
        </button>
      </div>
    </div>
  );
};

export default CollaborationPanel;
