import {
  ArrowLeft, Settings, Save,
  Maximize2, Minimize2, Play, Share2
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const Header = ({ onBack, isFullscreen, toggleFullscreen, onRun, onSave, isExecuting }) => {
  const { getCurrentFile, currentProject } = useCodeStore();
  const currentFile = getCurrentFile();

  return (
    <div className="bg-[#10221f]/95 backdrop-blur-md border-b border-white/10 p-3 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        {!isFullscreen && (
          <button onClick={onBack} className="text-gray-400 hover:text-[#13ecc8] transition-colors">
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="flex flex-col">
          <h2 className="text-sm font-bold tracking-tight">HOWARD OS EDITOR</h2>
          <span className="text-[10px] text-gray-500 font-mono">
            {currentFile ? `${currentProject?.name || 'Local'} / ${currentFile.name}` : 'No file open'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all" title="Settings">
          <Settings size={18} />
        </button>
        <button onClick={onSave} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all" title="Save (Ctrl+S)">
          <Save size={18} />
        </button>
        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all" title="Share Project">
          <Share2 size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1"></div>
        <button onClick={toggleFullscreen} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        <button
          onClick={onRun}
          disabled={isExecuting}
          className="bg-[#13ecc8] text-[#10221f] px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#0fc9a8] transition-all shadow-[0_0_15px_rgba(19,236,200,0.3)] disabled:opacity-50"
        >
          <Play size={14} fill="currentColor" className={isExecuting ? 'animate-pulse' : ''} /> {isExecuting ? '...' : 'RUN'}
        </button>
      </div>
    </div>
  );
};

export default Header;
