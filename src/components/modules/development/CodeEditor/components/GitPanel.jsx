import { useState } from 'react';
import {
  GitBranch, GitCommit, GitPullRequest, GitMerge,
  RefreshCw, Plus, X, Copy,
  Clock, User, Hash,
  ChevronDown, ChevronRight, GitCompare,
  Settings
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const GitPanel = () => {
  const { unsavedFiles } = useCodeStore();

  const [status, setStatus] = useState({
    branch: 'main',
    ahead: 0,
    behind: 0,
    changes: {
      staged: 3,
      unstaged: 5,
      untracked: 2
    }
  });

  const [commits, setCommits] = useState([
    {
      hash: 'a1b2c3d4',
      author: 'howard-dev',
      message: 'feat: agregar sistema de colaboración en tiempo real',
      date: '2026-01-25 14:30:22',
      filesChanged: 5
    },
    {
      hash: 'e5f6g7h8',
      author: 'howard-dev',
      message: 'fix: corregir errores en el editor de código',
      date: '2026-01-24 11:15:45',
      filesChanged: 3
    }
  ]);

  const [changes, setChanges] = useState([
    { file: 'src/modules/development/CodeEditor.jsx', status: 'modified', staged: true },
    { file: 'src/core/store/codeStore.js', status: 'modified', staged: true },
    { file: 'package.json', status: 'modified', staged: false },
    { file: '.env.local', status: 'untracked', staged: false }
  ]);

  const [branches, setBranches] = useState([
    { name: 'main', current: true, lastCommit: 'Hace 2 horas' },
    { name: 'develop', current: false, lastCommit: 'Hace 1 semana' }
  ]);

  const [selectedView, setSelectedView] = useState('changes'); // 'changes' | 'history' | 'branches' | 'remote'
  const [expandedSections, setExpandedSections] = useState({
    staged: true,
    unstaged: true,
    untracked: true
  });

  const [commitMessage, setCommitMessage] = useState('');
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  // Simular fetch de estado de Git
  const fetchGitStatus = async () => {
    console.log('Fetching Git status...');
  };

  const handleStageFile = (fileName) => {
    setChanges(prev =>
      prev.map(change =>
        change.file === fileName
          ? { ...change, staged: !change.staged }
          : change
      )
    );
  };

  const handleStageAll = () => {
    setChanges(prev =>
      prev.map(change => ({ ...change, staged: true }))
    );
  };

  const handleUnstageAll = () => {
    setChanges(prev =>
      prev.map(change => ({ ...change, staged: false }))
    );
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) return;

    const stagedFiles = changes.filter(c => c.staged);
    if (stagedFiles.length === 0) return;

    const newCommit = {
      hash: Math.random().toString(36).substring(2, 10),
      author: 'howard-dev',
      message: commitMessage,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      filesChanged: stagedFiles.length
    };

    setCommits([newCommit, ...commits]);
    setCommitMessage('');
    setChanges(prev => prev.filter(c => !c.staged));

    setStatus(prev => ({
      ...prev,
      changes: {
        ...prev.changes,
        staged: 0,
        unstaged: Math.max(0, prev.changes.unstaged - stagedFiles.length)
      }
    }));
  };

  const handlePull = async () => {
    setIsPulling(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPulling(false);
  };

  const handlePush = async () => {
    setIsPushing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPushing(false);
  };

  const handleCreateBranch = () => {
    const branchName = prompt('Nombre de la nueva rama:');
    if (branchName) {
      setBranches(prev => [
        { name: branchName, current: false, lastCommit: 'Nueva' },
        ...prev
      ]);
    }
  };

  const handleCheckoutBranch = (branchName) => {
    setBranches(prev =>
      prev.map(branch => ({
        ...branch,
        current: branch.name === branchName
      }))
    );
    setStatus(prev => ({ ...prev, branch: branchName }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'added': return '🟢';
      case 'modified': return '🟡';
      case 'deleted': return '🔴';
      case 'untracked': return '🔵';
      default: return '⚪';
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="w-80 bg-[#0d1117] border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-[#13ecc8]" />
            <h3 className="text-sm font-bold">CONTROL GIT</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchGitStatus}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Refrescar"
            >
              <RefreshCw size={14} />
            </button>
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Branch info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-[#13ecc8]/20 text-[#13ecc8] rounded text-xs font-bold">
              {status.branch}
            </div>
            {status.ahead > 0 && (
              <span className="text-xs text-green-500">↑{status.ahead}</span>
            )}
            {status.behind > 0 && (
              <span className="text-xs text-red-500">↓{status.behind}</span>
            )}
          </div>

          <div className="flex gap-1">
            <button
              onClick={handlePull}
              disabled={isPulling}
              className="px-2 py-1 bg-[#192233] rounded text-xs hover:bg-[#192233]/80 disabled:opacity-50"
            >
              {isPulling ? '...' : 'Pull'}
            </button>
            <button
              onClick={handlePush}
              disabled={isPushing}
              className="px-2 py-1 bg-[#13ecc8] text-[#10221f] rounded text-xs font-bold hover:bg-[#0fc9a8] disabled:opacity-50"
            >
              {isPushing ? '...' : 'Push'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10">
          {['changes', 'history', 'branches', 'remote'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedView(tab)}
              className={`
                flex-1 px-3 py-2 text-xs font-medium transition-colors
                ${selectedView === tab
                  ? 'text-[#13ecc8] border-b-2 border-[#13ecc8]'
                  : 'text-gray-400 hover:text-white'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {selectedView === 'changes' && (
          <div className="p-3">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-[#192233] rounded-lg p-3">
                <div className="text-2xl font-bold text-green-500">{status.changes.staged}</div>
                <div className="text-xs text-gray-400">Staged</div>
              </div>
              <div className="bg-[#192233] rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-500">{status.changes.unstaged}</div>
                <div className="text-xs text-gray-400">Unstaged</div>
              </div>
              <div className="bg-[#192233] rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-500">{status.changes.untracked}</div>
                <div className="text-xs text-gray-400">Untracked</div>
              </div>
            </div>

            {/* Staged Changes */}
            <div className="mb-4">
              <div
                className="flex items-center gap-2 mb-2 cursor-pointer"
                onClick={() => toggleSection('staged')}
              >
                {expandedSections.staged ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="text-xs font-bold text-green-500">STAGED CHANGES</span>
                <span className="text-xs text-gray-500">({changes.filter(c => c.staged).length})</span>
              </div>

              {expandedSections.staged && (
                <div className="space-y-1 ml-6">
                  {changes
                    .filter(change => change.staged)
                    .map((change, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded">
                        <span>{getStatusIcon(change.status)}</span>
                        <span className="flex-1 text-xs truncate">{change.file}</span>
                        <button
                          onClick={() => handleStageFile(change.file)}
                          className="p-1 hover:bg-white/10 rounded"
                          title="Unstage file"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Unstaged Changes */}
            <div className="mb-4">
              <div
                className="flex items-center gap-2 mb-2 cursor-pointer"
                onClick={() => toggleSection('unstaged')}
              >
                {expandedSections.unstaged ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="text-xs font-bold text-yellow-500">UNSTAGED CHANGES</span>
                <span className="text-xs text-gray-500">({changes.filter(c => !c.staged && c.status !== 'untracked').length})</span>
              </div>

              {expandedSections.unstaged && (
                <div className="space-y-1 ml-6">
                  {changes
                    .filter(change => !change.staged && change.status !== 'untracked')
                    .map((change, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded">
                        <span>{getStatusIcon(change.status)}</span>
                        <span className="flex-1 text-xs truncate">{change.file}</span>
                        <button
                          onClick={() => handleStageFile(change.file)}
                          className="p-1 hover:bg-white/10 rounded"
                          title="Stage file"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Untracked Files */}
            <div className="mb-4">
              <div
                className="flex items-center gap-2 mb-2 cursor-pointer"
                onClick={() => toggleSection('untracked')}
              >
                {expandedSections.untracked ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="text-xs font-bold text-blue-500">UNTRACKED FILES</span>
                <span className="text-xs text-gray-500">({changes.filter(c => c.status === 'untracked').length})</span>
              </div>

              {expandedSections.untracked && (
                <div className="space-y-1 ml-6">
                  {changes
                    .filter(change => change.status === 'untracked')
                    .map((change, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 hover:bg-white/5 rounded">
                        <span>🆕</span>
                        <span className="flex-1 text-xs truncate">{change.file}</span>
                        <button
                          onClick={() => handleStageFile(change.file)}
                          className="p-1 hover:bg-white/10 rounded"
                          title="Add to Git"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Commit Section */}
            <div className="mt-6">
              <textarea
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Mensaje de commit..."
                className="w-full bg-[#192233] border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#13ecc8]/50 resize-none"
                rows={3}
              />

              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleStageAll}
                  className="flex-1 px-3 py-2 bg-[#192233] rounded-lg text-xs hover:bg-[#192233]/80"
                >
                  Stage All
                </button>
                <button
                  onClick={handleUnstageAll}
                  className="flex-1 px-3 py-2 bg-[#192233] rounded-lg text-xs hover:bg-[#192233]/80"
                >
                  Unstage All
                </button>
              </div>

              <button
                onClick={handleCommit}
                disabled={changes.filter(c => c.staged).length === 0 || !commitMessage.trim()}
                className="w-full mt-2 px-3 py-2 bg-[#13ecc8] text-[#10221f] rounded-lg text-sm font-bold hover:bg-[#0fc9a8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Commit Changes ({changes.filter(c => c.staged).length})
              </button>
            </div>
          </div>
        )}

        {selectedView === 'history' && (
          <div className="p-3">
            <div className="space-y-3">
              {commits.map((commit, index) => (
                <div key={index} className="bg-[#192233] rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <GitCommit size={12} className="text-gray-400" />
                        <code className="text-xs text-gray-400 font-mono">{commit.hash.substring(0, 8)}</code>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{commit.message}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <User size={10} />
                          {commit.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {commit.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash size={10} />
                          {commit.filesChanged} files
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-white/10 rounded">
                        <Copy size={12} title="Copiar hash" />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded">
                        <GitCompare size={12} title="Ver cambios" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'branches' && (
          <div className="p-3">
            <button
              onClick={handleCreateBranch}
              className="w-full mb-3 px-3 py-2 bg-[#192233] rounded-lg text-sm hover:bg-[#192233]/80 flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              Nueva Rama
            </button>

            <div className="space-y-2">
              {branches.map((branch, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center justify-between p-3 rounded-lg cursor-pointer
                    ${branch.current ? 'bg-[#13ecc8]/20 border border-[#13ecc8]/30' : 'bg-[#192233] hover:bg-[#192233]/80'}
                  `}
                  onClick={() => !branch.current && handleCheckoutBranch(branch.name)}
                >
                  <div className="flex items-center gap-2">
                    <GitBranch size={14} className={branch.current ? 'text-[#13ecc8]' : 'text-gray-400'} />
                    <div>
                      <div className="text-sm font-bold">{branch.name}</div>
                      <div className="text-xs text-gray-400">Último commit: {branch.lastCommit}</div>
                    </div>
                  </div>

                  {branch.current && (
                    <div className="px-2 py-1 bg-[#13ecc8] text-[#10221f] text-xs font-bold rounded">
                      ACTUAL
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'remote' && (
          <div className="p-3">
            <div className="bg-[#192233] rounded-lg p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <GitPullRequest size={16} className="text-[#13ecc8]" />
                <h4 className="text-sm font-bold">Repositorio Remoto</h4>
              </div>
              <div className="text-xs text-gray-400">
                <div className="mb-1">Origin: https://github.com/howard/os.git</div>
                <div className="text-green-500">✓ Conectado</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#192233] rounded-lg p-3">
                <h5 className="text-xs font-bold mb-2">PULL REQUEST</h5>
                <div className="text-xs text-gray-400 mb-2">No hay pull requests abiertos</div>
                <button className="w-full px-3 py-2 bg-[#13ecc8] text-[#10221f] rounded-lg text-xs font-bold hover:bg-[#0fc9a8]">
                  Crear Pull Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <GitMerge size={12} />
            <span>Git {status.branch}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded ${unsavedFiles.length > 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
              {unsavedFiles.length > 0 ? `${unsavedFiles.length} sin guardar` : 'Todo guardado'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitPanel;
