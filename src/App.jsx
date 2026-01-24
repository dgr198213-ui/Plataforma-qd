import React, { useState, useEffect } from 'react';
import { Camera, Shield, Radar, Code, Folder, Home, Settings, Construction, ArrowLeft, Play, Upload, ChevronRight, Search, Bell, Menu, Zap, TrendingUp, CheckCircle, AlertTriangle, Plus, Key, Github, GitBranch, Database, Cloud, Link2, Terminal, MessageSquare, FileText, Download, Trash2, Eye, Send, X, Save, ExternalLink } from 'lucide-react';

// Configuración de módulos del sistema
const MODULES = {
  DASHBOARD: 'dashboard',
  CREDENTIALS: 'credentials',
  CODE_EDITOR: 'code_editor',
  NO_CODE_CHAT: 'no_code_chat',
  CONNECTORS: 'connectors',
  PROJECTS: 'projects',
  BIAS_FIREWALL: 'bias_firewall',
  HYPE_DETECTOR: 'hype_detector',
  SOLVEIT: 'solveit'
};

// Componente de tarjeta de módulo
const ModuleCard = ({ icon, title, description, color, onClick }) => {
  const colors = {
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    teal: 'text-[#13ecc8] bg-[#13ecc8]/10 border-[#13ecc8]/20',
    cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-[#192233] rounded-xl p-4 border border-white/5 hover:border-[#13ecc8]/30 transition-all text-left"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center \${colors[color]}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white mb-1">{title}</h4>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
        <ChevronRight className="text-gray-600" size={20} />
      </div>
    </button>
  );
};

// Dashboard Principal
const Dashboard = ({ onNavigate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#10221f] text-white pb-24">
      <div className="sticky top-0 z-10 bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#13ecc8]/10 rounded-xl flex items-center justify-center">
              <Shield className="text-[#13ecc8]" size={24} />
            </div>
            <div>
              <div className="text-xs text-[#13ecc8] font-bold">HOWARD OS</div>
              <div className="text-sm text-white/60">{currentTime.toLocaleTimeString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#13ecc8]/10 px-3 py-1 rounded-full border border-[#13ecc8]/20">
            <div className="w-2 h-2 rounded-full bg-[#13ecc8] animate-pulse"></div>
            <span className="text-xs text-[#13ecc8] font-bold">SISTEMA ACTIVO</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#13ecc8]" size={20} />
          <input
            type="text"
            placeholder="Buscar herramientas, proyectos, comandos..."
            className="w-full bg-[#192233] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#13ecc8]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 mb-6">
        <div className="bg-[#192233] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-emerald-500" size={18} />
            <span className="text-xs text-gray-400">Bias Firewall</span>
          </div>
          <div className="text-2xl font-bold text-white">98%</div>
          <div className="text-xs text-emerald-500">Safe</div>
        </div>
        <div className="bg-[#192233] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Folder className="text-[#13ecc8]" size={18} />
            <span className="text-xs text-gray-400">Proyectos</span>
          </div>
          <div className="text-2xl font-bold text-white">12</div>
          <div className="text-xs text-[#13ecc8]">Activos</div>
        </div>
      </div>

      <div className="px-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Desarrollo & Herramientas</h3>
        <div className="space-y-3">
          <ModuleCard
            icon={<Key size={24} />}
            title="Credenciales"
            description="Gestiona APIs, tokens y accesos"
            color="purple"
            onClick={() => onNavigate(MODULES.CREDENTIALS)}
          />
          <ModuleCard
            icon={<Code size={24} />}
            title="Editor de Código"
            description="IDE completo con terminal integrada"
            color="cyan"
            onClick={() => onNavigate(MODULES.CODE_EDITOR)}
          />
          <ModuleCard
            icon={<MessageSquare size={24} />}
            title="No-Code Chat"
            description="Desarrollo por conversación con IA"
            color="teal"
            onClick={() => onNavigate(MODULES.NO_CODE_CHAT)}
          />
          <ModuleCard
            icon={<Link2 size={24} />}
            title="Conectores"
            description="Integra GitHub, APIs y servicios"
            color="orange"
            onClick={() => onNavigate(MODULES.CONNECTORS)}
          />
          <ModuleCard
            icon={<Folder size={24} />}
            title="Proyectos & Documentos"
            description="Gestión completa de archivos"
            color="teal"
            onClick={() => onNavigate(MODULES.PROJECTS)}
          />
        </div>

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">Análisis & Auditoría</h3>
        <div className="space-y-3">
          <ModuleCard
            icon={<Shield size={24} />}
            title="Bias Firewall"
            description="Auditoría de sesgos en tiempo real"
            color="emerald"
            onClick={() => onNavigate(MODULES.BIAS_FIREWALL)}
          />
          <ModuleCard
            icon={<Radar size={24} />}
            title="Hype Detector"
            description="Filtra ruido de señal en noticias"
            color="teal"
            onClick={() => onNavigate(MODULES.HYPE_DETECTOR)}
          />
          <ModuleCard
            icon={<Zap size={24} />}
            title="SolveIt Iterator"
            description="Gestión iterativa pragmática"
            color="orange"
            onClick={() => onNavigate(MODULES.SOLVEIT)}
          />
        </div>
      </div>
    </div>
  );
};

// Panel de Credenciales
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
                <div className={`w-10 h-10 rounded-lg \${cred.configured ? 'bg-emerald-500/10' : 'bg-gray-500/10'} flex items-center justify-center`}>
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
                  placeholder={`Ingresa tu \${cred.name} token`}
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

// Editor de Código
const CodeEditor = ({ onBack }) => {
  const [code, setCode] = useState(`// Bienvenido al Editor Howard OS
function saludar(nombre) {
  console.log(\\\`Hola, \\\${nombre}!\\\`);
}

saludar("Desarrollador");`);
  const [terminal, setTerminal] = useState('> Sistema listo\\n');
  const [showTerminal, setShowTerminal] = useState(true);

  const runCode = () => {
    setTerminal(prev => prev + '\\n> Ejecutando código...\\n> ✓ Compilación exitosa\\n');
  };

  return (
    <div className="min-h-screen bg-[#10221f] text-white pb-24 flex flex-col">
      <div className="sticky top-0 bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Editor de Código</h2>
        <button onClick={runCode} className="bg-[#13ecc8] text-[#10221f] px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
          <Play size={16} /> Run
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] border-b border-white/5 overflow-x-auto">
          <div className="flex items-center gap-2 bg-[#192233] px-3 py-1 rounded-t-lg border-b-2 border-[#13ecc8]">
            <Code size={14} className="text-[#13ecc8]" />
            <span className="text-sm">main.js</span>
          </div>
        </div>

        <div className="flex-1 bg-[#0d1117] p-4 font-mono text-sm overflow-auto">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-transparent text-white resize-none focus:outline-none"
            spellCheck={false}
          />
        </div>

        {showTerminal && (
          <div className="h-48 bg-black border-t border-white/10">
            <div className="flex items-center justify-between px-4 py-2 bg-[#0d1117] border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-[#13ecc8]" />
                <span className="text-sm font-bold">Terminal</span>
              </div>
              <button onClick={() => setShowTerminal(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 font-mono text-xs text-green-400 overflow-auto h-[calc(100%-40px)]">
              <pre>{terminal}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// No-Code Chat
const NoCodeChat = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Describe lo que quieres crear y yo me encargo del código.' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '✨ He generado el código. ¿Quieres que añada algo más?'
      }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#10221f] text-white pb-24 flex flex-col">
      <div className="sticky top-0 bg-[#10221f]/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10">
        <button onClick={onBack} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">No-Code Chat</h2>
        <div className="w-6" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl p-3 \${
              msg.role === 'user'
                ? 'bg-[#13ecc8] text-[#10221f]'
                : 'bg-[#192233] border border-white/5'
            }`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#192233] border border-white/5 rounded-xl p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0d1117] border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Describe lo que quieres crear..."
            className="flex-1 bg-[#192233] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#13ecc8]/50"
          />
          <button
            onClick={sendMessage}
            className="bg-[#13ecc8] text-[#10221f] p-3 rounded-xl"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Conectores
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
                <div className={`w-10 h-10 rounded-lg \${conn.connected ? 'bg-[#13ecc8]/10' : 'bg-gray-500/10'} flex items-center justify-center`}>
                  <Github className={conn.connected ? 'text-[#13ecc8]' : 'text-gray-500'} size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{conn.name}</h4>
                  <p className="text-xs text-gray-400">
                    {conn.connected ? `\${conn.count} repos` : 'No conectado'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleConnection(conn.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold \${
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

// Gestión de Proyectos
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

// Bottom Navigation
const BottomNav = ({ currentModule, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0d1816] border-t border-white/5 pb-6 pt-2 z-50">
      <div className="flex justify-around items-center px-2">
        <button
          onClick={() => onNavigate(MODULES.DASHBOARD)}
          className={`flex flex-col items-center gap-1 p-2 \${
            currentModule === MODULES.DASHBOARD ? 'text-[#13ecc8]' : 'text-gray-400'
          }`}
        >
          <Home size={24} />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button
          onClick={() => onNavigate(MODULES.PROJECTS)}
          className={`flex flex-col items-center gap-1 p-2 \${
            currentModule === MODULES.PROJECTS ? 'text-[#13ecc8]' : 'text-gray-400'
          }`}
        >
          <Folder size={24} />
          <span className="text-xs font-medium">Projects</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
          <Construction size={24} />
          <span className="text-xs font-medium">Tools</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
          <Settings size={24} />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
};

// Main App
export default function HowardOS() {
  const [currentModule, setCurrentModule] = useState(MODULES.DASHBOARD);

  const renderModule = () => {
    switch (currentModule) {
      case MODULES.DASHBOARD:
        return <Dashboard onNavigate={setCurrentModule} />;
      case MODULES.CREDENTIALS:
        return <CredentialsPanel onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.CODE_EDITOR:
        return <CodeEditor onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.NO_CODE_CHAT:
        return <NoCodeChat onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.CONNECTORS:
        return <Connectors onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      case MODULES.PROJECTS:
        return <ProjectsManager onBack={() => setCurrentModule(MODULES.DASHBOARD)} />;
      default:
        return <Dashboard onNavigate={setCurrentModule} />;
    }
  };

  return (
    <div className="bg-[#10221f] min-h-screen">
      {renderModule()}
      <BottomNav currentModule={currentModule} onNavigate={setCurrentModule} />
    </div>
  );
}
