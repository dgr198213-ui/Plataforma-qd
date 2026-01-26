import { useState } from 'react';
import {
  GitBranch, GitCommit,
  RefreshCw, Plus, X,
  Clock, User,
  ChevronDown, ChevronRight,
  Settings
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const GitPanel = () => {
  const {
    getUnsavedFiles,
    gitStatus,
    gitChanges,
    gitCommits,
    gitBranches,
    stageFile,
    stageAll,
    unstageAll,
    commitChanges,
    checkoutBranch,
    createBranch
  } = useCodeStore();

  const unsavedFiles = getUnsavedFiles();

  const [selectedView, setSelectedView] = useState('changes'); // 'changes' | 'history' | 'branches' | 'remote'
  const [expandedSections, setExpandedSections] = useState({
    staged: true,
    unstaged: true,
    untracked: true
  });

  const [commitMessage, setCommitMessage] = useState('');
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    commitChanges(commitMessage);
    setCommitMessage('');
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
      createBranch(branchName);
    }
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
    <div className="w-80 bg-[#0d1117] flex flex-col h-full border-l border-white/10">
      {/* Header */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-[#13ecc8]" />
            <h3 className="text-sm font-bold text-white">CONTROL GIT</h3>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-white/10 rounded transition-colors" title="Refrescar">
              <RefreshCw size={14} className="text-gray-400" />
            </button>
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <Settings size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Branch info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-[#13ecc8]/20 text-[#13ecc8] rounded text-[10px] font-bold">
              {gitStatus.branch}
            </div>
          </div>

          <div className="flex gap-1">
            <button
              onClick={handlePull}
              disabled={isPulling}
              className="px-2 py-1 bg-[#192233] text-white rounded text-[10px] font-bold hover:bg-[#192233]/80 disabled:opacity-50"
            >
              {isPulling ? '...' : 'PULL'}
            </button>
            <button
              onClick={handlePush}
              disabled={isPushing}
              className="px-2 py-1 bg-[#13ecc8] text-[#10221f] rounded text-[10px] font-bold hover:bg-[#0fc9a8] disabled:opacity-50"
            >
              {isPushing ? '...' : 'PUSH'}
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
                flex-1 px-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors
                ${selectedView === tab
                  ? 'text-[#13ecc8] border-b-2 border-[#13ecc8]'
                  : 'text-gray-500 hover:text-white'
                }
              `}
            >
              {tab}
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
              <div className="bg-[#192233] rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-green-500">{gitChanges.filter(c => c.staged).length}</div>
                <div className="text-[8px] text-gray-400 uppercase">Staged</div>
              </div>
              <div className="bg-[#192233] rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-yellow-500">{gitChanges.filter(c => !c.staged).length + unsavedFiles.length}</div>
                <div className="text-[8px] text-gray-400 uppercase">Changes</div>
              </div>
              <div className="bg-[#192233] rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-blue-500">0</div>
                <div className="text-[8px] text-gray-400 uppercase">Untracked</div>
              </div>
            </div>

            {/* Staged Changes */}
            <div className="mb-4">
              <div
                className="flex items-center gap-2 mb-2 cursor-pointer"
                onClick={() => toggleSection('staged')}
              >
                {expandedSections.staged ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <span className="text-[10px] font-bold text-green-500">STAGED CHANGES</span>
                <span className="text-[10px] text-gray-500">({gitChanges.filter(c => c.staged).length})</span>
              </div>

              {expandedSections.staged && (
                <div className="space-y-1 ml-4">
                  {gitChanges
                    .filter(change => change.staged)
                    .map((change, index) => (
                      <div key={index} className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded">
                        <span className="text-[10px]">{getStatusIcon(change.status)}</span>
                        <span className="flex-1 text-[11px] text-gray-300 truncate">{change.file}</span>
                        <button onClick={() => stageFile(change.file)} className="p-1 hover:bg-white/10 rounded">
                          <X size={12} className="text-gray-500" />
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
                {expandedSections.unstaged ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <span className="text-[10px] font-bold text-yellow-500">MODIFIED FILES</span>
                <span className="text-[10px] text-gray-500">({gitChanges.filter(c => !c.staged).length + unsavedFiles.length})</span>
              </div>

              {expandedSections.unstaged && (
                <div className="space-y-1 ml-4">
                  {/* Virtual changes from store */}
                  {unsavedFiles.map(file => (
                    <div key={file.id} className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded group">
                      <span className="text-[10px]">🟡</span>
                      <span className="flex-1 text-[11px] text-gray-300 truncate">{file.name}</span>
                      <Plus size={12} className="text-gray-500 cursor-pointer opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
                  {/* Hardcoded changes */}
                  {gitChanges
                    .filter(change => !change.staged)
                    .map((change, index) => (
                      <div key={index} className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded">
                        <span className="text-[10px]">{getStatusIcon(change.status)}</span>
                        <span className="flex-1 text-[11px] text-gray-300 truncate">{change.file}</span>
                        <button onClick={() => stageFile(change.file)} className="p-1 hover:bg-white/10 rounded">
                          <Plus size={12} className="text-gray-500" />
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
                className="w-full bg-[#192233] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#13ecc8]/50 resize-none"
                rows={3}
              />

              <div className="flex gap-2 mt-2">
                <button onClick={stageAll} className="flex-1 px-3 py-1.5 bg-[#192233] text-white rounded text-[10px] font-bold hover:bg-[#192233]/80">STAGE ALL</button>
                <button onClick={unstageAll} className="flex-1 px-3 py-1.5 bg-[#192233] text-white rounded text-[10px] font-bold hover:bg-[#192233]/80">UNSTAGE ALL</button>
              </div>

              <button
                onClick={handleCommit}
                disabled={gitChanges.filter(c => c.staged).length === 0 || !commitMessage.trim()}
                className="w-full mt-2 px-3 py-2 bg-[#13ecc8] text-[#10221f] rounded-lg text-xs font-bold hover:bg-[#0fc9a8] disabled:opacity-50"
              >
                COMMIT ({gitChanges.filter(c => c.staged).length})
              </button>
            </div>
          </div>
        )}

        {selectedView === 'history' && (
          <div className="p-3">
            <div className="space-y-3">
              {gitCommits.map((commit, index) => (
                <div key={index} className="bg-[#192233] rounded-lg p-3 border border-white/5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <GitCommit size={12} className="text-gray-500" />
                        <code className="text-[10px] text-gray-500 font-mono">{commit.hash}</code>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1">{commit.message}</h4>
                      <div className="flex items-center gap-3 text-[9px] text-gray-500">
                        <span className="flex items-center gap-1"><User size={10} /> {commit.author}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {commit.date}</span>
                      </div>
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
              className="w-full mb-3 px-3 py-2 bg-[#192233] text-white rounded-lg text-xs font-bold hover:bg-[#192233]/80 flex items-center justify-center gap-2 border border-white/5"
            >
              <Plus size={14} /> NUEVA RAMA
            </button>

            <div className="space-y-2">
              {gitBranches.map((branch, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center justify-between p-3 rounded-lg cursor-pointer border
                    ${branch.current ? 'bg-[#13ecc8]/10 border-[#13ecc8]/30' : 'bg-[#192233] border-white/5 hover:border-white/10'}
                  `}
                  onClick={() => !branch.current && checkoutBranch(branch.name)}
                >
                  <div className="flex items-center gap-2">
                    <GitBranch size={14} className={branch.current ? 'text-[#13ecc8]' : 'text-gray-500'} />
                    <div>
                      <div className="text-xs font-bold text-white">{branch.name}</div>
                      <div className="text-[9px] text-gray-500">Last: {branch.lastCommit}</div>
                    </div>
                  </div>
                  {branch.current && <div className="text-[8px] bg-[#13ecc8] text-[#10221f] px-1.5 py-0.5 rounded font-bold uppercase">Actual</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitPanel;
