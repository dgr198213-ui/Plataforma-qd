import { Code, Plus } from 'lucide-react';

const SnippetsPanel = () => {
  const snippets = [
    { title: 'React Functional Component', language: 'jsx' },
    { title: 'useEffect Hook', language: 'javascript' },
    { title: 'Tailwind Grid Layout', language: 'html' }
  ];

  return (
    <div className="w-64 bg-[#0d1117] border-l border-white/10 flex flex-col">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-[#13ecc8]" />
          <h3 className="text-sm font-bold">SNIPPETS</h3>
        </div>
        <button className="p-1 hover:bg-white/10 rounded"><Plus size={14} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {snippets.map((snippet, idx) => (
          <div key={idx} className="p-2 hover:bg-white/5 rounded cursor-pointer mb-1 group">
            <div className="text-xs font-medium text-gray-300 group-hover:text-white">{snippet.title}</div>
            <div className="text-[10px] text-gray-500">{snippet.language}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnippetsPanel;
