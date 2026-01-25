import { useState, useEffect, useRef } from 'react';
import {
  RefreshCw, Maximize2, Minimize2, ExternalLink,
  Smartphone, Tablet, Monitor, Eye, Download
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const LivePreview = () => {
  const { getCurrentFile } = useCodeStore();
  const currentFile = getCurrentFile();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('desktop');
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const refreshTimeoutRef = useRef(null);

  const generatePreviewHTML = () => {
    if (!currentFile) return '';

    if (currentFile.language === 'html') {
      return currentFile.content;
    }

    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; padding: 20px; background: #0d1117; color: white; }
        pre { background: #192233; padding: 10px; border-radius: 4px; overflow: auto; }
    </style>
</head>
<body>
    <h3>Console Output:</h3>
    <pre id="console"></pre>
    <script>
        const consoleLog = document.getElementById('console');
        const originalLog = console.log;
        console.log = (...args) => {
            originalLog(...args);
            consoleLog.textContent += args.join(' ') + '\\n';
        };
        try {
            ${currentFile.content}
        } catch (err) {
            console.error(err);
            consoleLog.innerHTML += '<span style="color: #ff6b6b">Error: ' + err.message + '</span>\\n';
        }
    </script>
</body>
</html>`;
  };

  const refreshPreview = () => {
    setIsRefreshing(true);
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const html = generatePreviewHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    // Debounce preview refresh
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(refreshPreview, 1000);

    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, [currentFile?.content, currentFile?.language]);

  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'mobile': return { width: '375px', height: '667px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      default: return { width: '100%', height: '100%' };
    }
  };

  const viewport = getViewportDimensions();

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-l border-white/10">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <Eye size={14} /> VISTA PREVIA
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-[#13ecc8] text-[#10221f]' : 'hover:bg-white/5'}`}><Smartphone size={14} /></button>
          <button onClick={() => setViewMode('tablet')} className={`p-1.5 rounded ${viewMode === 'tablet' ? 'bg-[#13ecc8] text-[#10221f]' : 'hover:bg-white/5'}`}><Tablet size={14} /></button>
          <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-[#13ecc8] text-[#10221f]' : 'hover:bg-white/5'}`}><Monitor size={14} /></button>
          <button onClick={refreshPreview} className="p-1.5 hover:bg-white/10 rounded ml-2" title="Refrescar manual">
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-[#192233] p-4 flex items-center justify-center overflow-hidden relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <RefreshCw size={24} className="animate-spin text-[#13ecc8]" />
          </div>
        )}
        <div
          className="bg-white rounded shadow-2xl overflow-hidden transition-all duration-300"
          style={{ width: viewport.width, height: viewport.height }}
        >
          <iframe src={previewUrl} className="w-full h-full border-0" title="preview" sandbox="allow-scripts allow-same-origin" />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
