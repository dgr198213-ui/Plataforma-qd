import { useState } from 'react';
import { ArrowLeft, Upload, Code, Download, Eye } from 'lucide-react';

const ProjectsManager = ({ onBack }) => {
  const [projects] = useState([
    { id: 1, name: 'Landing Page Startup', files: 12, size: '2.4 MB' },
    { id: 2, name: 'API Backend Node', files: 34, size: '8.1 MB' },
  ]);

  return (
    <div className="min-h-screen bg-[#10221f] text-white pb-24">
      <div className="sticky top-0 bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Proyectos</h2>
        <Upload size={24} className="text-[#13ecc8]" />
      </div>

      <div className="p-4 space-y-3">
        {projects.map(project => (
          <div key={project.id} className="bg-[#192233] rounded-xl p-4 border border-white/5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#13ecc8]/10 flex items-center justify-center">
                <Code className="text-[#13ecc8]" size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white mb-1">{project.name}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{project.files} archivos</span>
                  <span>•</span>
                  <span>{project.size}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-[#13ecc8]/10 text-[#13ecc8] px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <Download size={16} />
                Descargar
              </button>
              <button className="flex-1 bg-white/5 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <Eye size={16} />
                Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;
