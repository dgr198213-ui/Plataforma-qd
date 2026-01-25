import { Code, Plus } from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const SnippetsPanel = () => {
  const { getAllSnippets, getCurrentFile, updateFileContent } = useCodeStore();
  const snippets = getAllSnippets();

  const handleApplySnippet = (code) => {
    const currentFile = getCurrentFile();
    if (currentFile) {
      updateFileContent(currentFile.id, currentFile.content + '\n' + code);
    }
  };

  return (
    <div className="w-80 bg-[#0d1117] border-l border-white/10 flex flex-col">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-[#13ecc8]" />
          <h3 className="text-sm font-bold">SNIPPETS</h3>
        </div>
        <button className="p-1 hover:bg-white/10 rounded"><Plus size={14} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {snippets.map((snippet) => (
          <div
            key={snippet.id}
            onClick={() => handleApplySnippet(snippet.code)}
            className="p-2 hover:bg-white/5 rounded cursor-pointer mb-1 group border-b border-white/5 pb-2"
          >
            <div className="text-xs font-bold text-[#13ecc8] group-hover:text-[#0fc9a8]">{snippet.name}</div>
            <div className="text-[10px] text-gray-500 mt-1">{snippet.language} • {snippet.category}</div>
            <pre className="text-[9px] text-gray-400 mt-2 bg-black/30 p-1 rounded overflow-hidden truncate">
              {snippet.code.substring(0, 50)}...
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnippetsPanel;
