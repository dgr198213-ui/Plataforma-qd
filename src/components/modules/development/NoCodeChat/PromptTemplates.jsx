import { Zap, Shield, Layout, Database, Smartphone } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'login-form',
    label: '🔐 Formulario de Login',
    icon: <Shield size={18} />,
    prompt: 'Crea un formulario de login con email y contraseña, validación y manejo de errores utilizando Tailwind CSS'
  },
  {
    id: 'api-integration',
    label: '🌐 Integración API',
    icon: <Database size={18} />,
    prompt: 'Genera código para consumir una API REST con fetch, incluyendo manejo de estados de carga (loading) y errores'
  },
  {
    id: 'state-management',
    label: '📦 Estado Global',
    icon: <Zap size={18} />,
    prompt: 'Configura un store de Zustand con persistencia y acciones CRUD para una lista de tareas'
  },
  {
    id: 'responsive-navbar',
    label: '📱 Navbar Responsive',
    icon: <Smartphone size={18} />,
    prompt: 'Crea un componente de navegación responsive con menú hamburguesa para dispositivos móviles'
  },
  {
    id: 'data-table',
    label: '📊 Tabla de Datos',
    icon: <Layout size={18} />,
    prompt: 'Crea una tabla de datos interactiva con búsqueda, filtrado y paginación'
  }
];

export default function PromptTemplates({ onSelect }) {
  return (
    <div className="p-4">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Atajos de Desarrollo</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.prompt)}
            className="group p-4 text-left bg-[#192233] border border-white/5 rounded-2xl hover:border-[#13ecc8]/30 hover:bg-[#13ecc8]/5 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-gray-400 group-hover:text-[#13ecc8] transition-colors">
                {template.icon}
              </div>
              <div className="font-bold text-sm text-white group-hover:text-[#13ecc8] transition-colors">
                {template.label}
              </div>
            </div>
            <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {template.prompt}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
