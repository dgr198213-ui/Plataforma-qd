import { useState, useEffect } from 'react';
import {
  GitBranch, GitCommit, GitPullRequest, GitMerge,
  RefreshCw, Plus, Trash2, Check, X, Copy, ExternalLink,
  AlertCircle, Clock, User, MessageSquare, Hash,
  ChevronDown, ChevronRight, GitCompare, History,
  Download, Upload, Settings
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const GitPanel = ({ onClose }) => {
  const { currentProject, files } = useCodeStore();

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
      author: 'dgr198213-ui',
      message: 'feat: agregar sistema de colaboración en tiempo real',
      date: '2026-01-25 14:30:22',
      filesChanged: 5
    },
    {
      hash: 'e5f6g7h8',
      author: 'dgr198213-ui',
      message: 'fix: corregir errores en el editor de código',
      date: '2026-01-24 11:15:45',
      filesChanged: 3
    }
  ]);

  const [changes, setChanges] = useState([
    { file: 'src/modules/development/CodeEditor.jsx', status: 'modified', staged: true },
    { file: 'src/core/store/codeStore.js', status: 'modified', staged: true },
    { file: 'public/index.html', status: 'modified', staged: false },
    { file: 'package.json', status: 'modified', staged: false }
  ]);

  const [selectedView, setSelectedView] = useState('changes');
  const [expandedSections, setExpandedSections] = useState({
    staged: true,
    unstaged: true,
    untracked: true
  });

  const [commitMessage, setCommitMessage] = useState('');
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const handleStageFile = (fileName) => {
    setChanges(prev => prev.map(change => change.file === fileName ? { ...change, staged: !change.staged } : change));
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    const newCommit = {
      hash: Math.random().toString(36).substring(2, 10),
      author: 'dgr198213-ui',
      message: commitMessage,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      filesChanged: changes.filter(c => c.staged).length
    };
    setCommits([newCommit, ...commits]);
    setChanges(changes.filter(c => !c.staged));
    setCommitMessage('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'added': return '🟢';
      case 'modified': return '🟡';
      case 'deleted': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="w-80 bg-[#0d1117] border-l border-white/10 flex flex-col h-full">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-[#13ecc8]" />
          <h3 className="text-sm font-bold">CONTROL GIT</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors"><X size={16} /></button>
      </div>

      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-[#13ecc8]/20 text-[#13ecc8] rounded text-xs font-bold">{status.branch}</div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => { setIsPulling(true); setTimeout(() => setIsPulling(false), 1000); }} disabled={isPulling} className="px-2 py-1 bg-[#192233] rounded text-xs hover:bg-[#192233]/80 disabled:opacity-50">{isPulling ? '...' : 'Pull'}</button>
          <button onClick={() => { setIsPushing(true); setTimeout(() => setIsPushing(false), 1000); }} disabled={isPushing} className="px-2 py-1 bg-[#13ecc8] text-[#10221f] rounded text-xs font-bold hover:bg-[#0fc9a8] disabled:opacity-50">{isPushing ? '...' : 'Push'}</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setExpandedSections({ ...expandedSections, staged: !expandedSections.staged })}>
              {expandedSections.staged ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span className="text-xs font-bold text-green-500">STAGED CHANGES ({changes.filter(c => c.staged).length})</span>
            </div>
            {expandedSections.staged && (
              <div className="space-y-1 ml-6">
                {changes.filter(c => c.staged).map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-1 hover:bg-white/5 rounded">
                    <span>{getStatusIcon(c.status)}</span>
                    <span className="flex-1 text-xs truncate">{c.file}</span>
                    <button onClick={() => handleStageFile(c.file)}><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Mensaje de commit..."
              className="w-full bg-[#192233] border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[#13ecc8]/50 resize-none"
              rows={3}
            />
            <button
              onClick={handleCommit}
              disabled={!commitMessage.trim() || changes.filter(c => c.staged).length === 0}
              className="w-full mt-2 px-3 py-2 bg-[#13ecc8] text-[#10221f] rounded-lg text-sm font-bold hover:bg-[#0fc9a8] disabled:opacity-50"
            >
              Commit Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitPanel;
