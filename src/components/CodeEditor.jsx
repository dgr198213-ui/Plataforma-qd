import { useState } from 'react';
import { ArrowLeft, Play, Code, Terminal, X } from 'lucide-react';

const CodeEditor = ({ onBack }) => {
  const [code, setCode] = useState(`// Bienvenido al Editor Howard OS
function saludar(nombre) {
  console.log(\`Hola, \${nombre}!\`);
}

saludar("Desarrollador");`);
  const [terminal, setTerminal] = useState('> Sistema listo\n');
  const [showTerminal, setShowTerminal] = useState(true);

  const runCode = () => {
    setTerminal(prev => prev + '\n> Ejecutando código...\n> ✓ Compilación exitosa\n');
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

export default CodeEditor;
