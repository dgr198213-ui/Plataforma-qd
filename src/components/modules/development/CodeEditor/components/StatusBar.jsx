import { useCodeStore } from '../../../../../store/codeStore';
import { GitBranch, RefreshCw, Check, AlertCircle } from 'lucide-react';

const StatusBar = () => {
  const { currentFile, unsavedFiles } = useCodeStore();

  return (
    <div className="h-6 bg-[#0d1117] border-t border-white/10 px-4 flex items-center justify-between text-[10px] text-gray-400 fixed bottom-0 left-0 right-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-[#13ecc8]">
          <GitBranch size={12} />
          <span>main*</span>
        </div>
        <div className="flex items-center gap-1 hover:text-white cursor-pointer">
          <RefreshCw size={12} />
          <span>Syncing...</span>
        </div>
        {unsavedFiles.length > 0 ? (
          <div className="flex items-center gap-1 text-yellow-500">
            <AlertCircle size={12} />
            <span>{unsavedFiles.length} cambios sin guardar</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-green-500">
            <Check size={12} />
            <span>Todo guardado</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span>Ln 1, Col 1</span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span className="uppercase">{currentFile?.language || 'Plain Text'}</span>
      </div>
    </div>
  );
};

export default StatusBar;
