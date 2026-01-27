import { useState, useEffect } from 'react';
import { X, Check, FileCode, Copy, Terminal } from 'lucide-react';
import { useCodeStore } from '../../../../store/codeStore';

export default function CodePreview({ message, onClose, onApply }) {
  const { files } = useCodeStore();
  const [targetFile, setTargetFile] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (files.length > 0 && !targetFile) {
      setTargetFile(files[0].id);
    }
  }, [files, targetFile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!message || !message.code) return null;

  return (
    <div className="w-[450px] border-l border-white/10 bg-[#0d1117] flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FileCode size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Vista Previa del Código</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Generado por Howard AI</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-[#010409] flex items-center justify-between px-4 py-2 border-b border-white/5">
          <span className="text-[10px] font-mono text-gray-500 uppercase">JavaScript / JSX</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-[#13ecc8] transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 font-mono text-xs custom-scrollbar">
          <pre className="text-emerald-400/90 leading-relaxed">
            <code>{message.code}</code>
          </pre>
        </div>
      </div>

      <div className="p-6 border-t border-white/5 bg-[#161b22]">
        <div className="mb-4">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
            Archivo de destino
          </label>
          <div className="relative">
            <select
              value={targetFile}
              onChange={(e) => setTargetFile(e.target.value)}
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-[#13ecc8]/50 transition-colors"
            >
              {files.map(f => (
                <option key={f.id} value={f.id}>{f.path}</option>
              ))}
              <option value="new">+ Crear nuevo archivo...</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onApply(targetFile)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#13ecc8] hover:bg-[#13ecc8]/90 text-[#10221f] rounded-xl font-bold transition-all shadow-lg shadow-[#13ecc8]/10"
          >
            <Terminal size={18} />
            Aplicar al Editor
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-500 mt-4 italic">
          Esto reemplazará el contenido actual del archivo seleccionado.
        </p>
      </div>
    </div>
  );
}
