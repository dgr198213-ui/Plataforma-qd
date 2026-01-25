import { useState } from 'react';
import { X, Plus, Trash2, Copy, Check, Code, Search } from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const SnippetsPanel = ({ onClose }) => {
  const { addSnippet, deleteSnippet, getAllSnippets } = useCodeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSnippet, setNewSnippet] = useState({
    name: '',
    language: 'javascript',
    code: '',
    category: 'custom'
  });
  const [copiedId, setCopiedId] = useState(null);

  // Combinar snippets predeterminados con los del usuario
  const allSnippets = getAllSnippets ? getAllSnippets() : [];

  const filteredSnippets = allSnippets.filter(snippet => {
    const matchesSearch = snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || snippet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(allSnippets.map(s => s.category))];

  const handleCopySnippet = (snippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSnippet = () => {
    if (!newSnippet.name.trim() || !newSnippet.code.trim()) {
      alert('Completa todos los campos');
      return;
    }

    addSnippet(newSnippet);
    setNewSnippet({ name: '', language: 'javascript', code: '', category: 'custom' });
    setShowCreateForm(false);
  };

  const handleDeleteSnippet = (snippetId) => {
    if (confirm('¿Eliminar este snippet?')) {
      deleteSnippet(snippetId);
    }
  };

  return (
    <div className="w-96 bg-[#0d1117] border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-[#13ecc8]" />
          <h3 className="text-sm font-bold">Snippets</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Nuevo snippet"
          >
            <Plus size={16} />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Create Snippet Form */}
      {showCreateForm && (
        <div className="p-3 border-b border-white/10 bg-[#192233] space-y-3">
          <input
            type="text"
            value={newSnippet.name}
            onChange={(e) => setNewSnippet({ ...newSnippet, name: e.target.value })}
            placeholder="Nombre del snippet"
            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#13ecc8]/50"
          />

          <div className="flex gap-2">
            <select
              value={newSnippet.language}
              onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
              className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#13ecc8]/50"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>

            <select
              value={newSnippet.category}
              onChange={(e) => setNewSnippet({ ...newSnippet, category: e.target.value })}
              className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#13ecc8]/50"
            >
              <option value="custom">Custom</option>
              <option value="react">React</option>
              <option value="backend">Backend</option>
              <option value="utils">Utils</option>
            </select>
          </div>

          <textarea
            value={newSnippet.code}
            onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
            placeholder="Código del snippet..."
            className="w-full bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#13ecc8]/50 font-mono resize-none"
            rows={6}
          />

          <div className="flex gap-2">
            <button
              onClick={handleCreateSnippet}
              className="flex-1 bg-[#13ecc8] text-[#10221f] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0fc9a8] transition-colors"
            >
              Crear
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="p-3 border-b border-white/10">
        <div className="relative mb-3">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar snippets..."
            className="w-full bg-[#192233] border border-white/10 rounded-lg px-7 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#13ecc8]/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#13ecc8] text-[#10221f]'
                  : 'bg-[#192233] text-gray-400 hover:bg-[#192233]/70'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Snippets List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredSnippets.length === 0 ? (
          <div className="text-center py-8">
            <Code size={32} className="text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No hay snippets</p>
          </div>
        ) : (
          filteredSnippets.map(snippet => (
            <div
              key={snippet.id}
              className="bg-[#192233] rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white mb-1">{snippet.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded">
                      {snippet.language}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded">
                      {snippet.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopySnippet(snippet)}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    title="Copiar código"
                  >
                    {copiedId === snippet.id ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  {snippet.category === 'custom' && (
                    <button
                      onClick={() => handleDeleteSnippet(snippet.id)}
                      className="p-1.5 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <pre className="text-xs text-gray-300 bg-[#0d1117] rounded p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
                <code>{snippet.code}</code>
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SnippetsPanel;
