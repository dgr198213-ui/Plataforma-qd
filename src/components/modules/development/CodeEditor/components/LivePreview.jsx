import { useState, useEffect, useRef, useCallback } from 'react';
import {
  RefreshCw, Maximize2, Minimize2, Download,
  Smartphone, Tablet, Monitor, Eye, EyeOff
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const LivePreview = () => {
  const { currentFileId, files } = useCodeStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('desktop'); // 'mobile' | 'tablet' | 'desktop'
  const [showCode, setShowCode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const refreshTimeoutRef = useRef(null);

  const activeFileObject = currentFileId
    ? files.find(f => f.id === currentFileId)
    : null;

  const activeFileContent = activeFileObject?.content || '';

  // Generar HTML completo para la vista previa
  const generatePreviewHTML = useCallback(() => {
    const isHTML = activeFileObject?.name?.endsWith('.html') ||
                   activeFileObject?.language === 'html';

    if (isHTML && activeFileContent) {
      return activeFileContent;
    }

    // Para JS/JSX, crear un HTML con el código
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview - Howard OS</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            background: #0d1117;
            color: #ffffff;
            min-height: 100vh;
        }
        .preview-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .code-output {
            background: #192233;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
        }
        .success {
            color: #13ecc8;
            padding: 10px;
            background: rgba(19, 236, 200, 0.1);
            border-radius: 4px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <h1>Vista Previa Howard OS</h1>
        <p>Archivo activo: ${activeFileObject?.name || 'Ninguno'}</p>
        <div class="code-output">
            ${activeFileContent ? activeFileContent.substring(0, 1000) + (activeFileContent.length > 1000 ? '...' : '') : '// No hay contenido para mostrar'}
        </div>
        <div class="success">
            ✅ Vista previa activa - Los cambios se actualizan automáticamente
        </div>
    </div>

    <script>
        // Capturar logs de la consola
        const originalLog = console.log;
        console.log = function(...args) {
            originalLog.apply(console, args);
            window.parent.postMessage({ type: 'CONSOLE_LOG', args: args.map(arg => String(arg)) }, '*');
        };

        // Capturar errores no atrapados
        window.addEventListener('error', (event) => {
            window.parent.postMessage({
                type: 'RUNTIME_ERROR',
                error: event.error?.message || event.message
            }, '*');
        });
    </script>
</body>
</html>
    `;
  }, [activeFileObject, activeFileContent]);

  const refreshPreview = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    setIsRefreshing(true);
    setError(null);

    // Generar blob URL para el iframe
    const html = generatePreviewHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    // Limpiar URL anterior después de un momento
    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
    }, 300);
  }, [generatePreviewHTML]);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  }, [previewUrl]);

  // Actualizar vista previa cuando cambia el contenido
  useEffect(() => {
    if (activeFileContent) {
      refreshPreview();
    }
  }, [activeFileContent, refreshPreview]);

  // Configurar comunicación con el iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'CONSOLE_LOG') {
        console.log('[Preview Log]:', ...event.data.args);
      } else if (event.data.type === 'RUNTIME_ERROR') {
        console.error('[Runtime Error]:', event.data.error);
        setError(event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleFullscreen = () => {
    if (!iframeRef.current) return;
    setIsFullscreen(!isFullscreen);
  };

  const downloadPreview = () => {
    const html = generatePreviewHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preview-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px', name: 'Mobile' };
      case 'tablet':
        return { width: '768px', height: '1024px', name: 'Tablet' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%', name: 'Desktop' };
    }
  };

  const viewport = getViewportDimensions();

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      clearPreview();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [clearPreview]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-l border-white/10">
      {/* Header de controles */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-[#13ecc8]" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Vista Previa</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#192233] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1 rounded ${viewMode === 'mobile' ? 'bg-[#13ecc8] text-[#10221f]' : 'text-gray-400 hover:bg-white/5'}`}
              title="Vista móvil"
            >
              <Smartphone size={12} />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-1 rounded ${viewMode === 'tablet' ? 'bg-[#13ecc8] text-[#10221f]' : 'text-gray-400 hover:bg-white/5'}`}
              title="Vista tablet"
            >
              <Tablet size={12} />
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1 rounded ${viewMode === 'desktop' ? 'bg-[#13ecc8] text-[#10221f]' : 'text-gray-400 hover:bg-white/5'}`}
              title="Vista desktop"
            >
              <Monitor size={12} />
            </button>
          </div>

          <button
            onClick={refreshPreview}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-white/10 rounded transition-colors disabled:opacity-50 text-gray-400"
            title="Recargar"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleFullscreen}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400"
            title="Pantalla completa"
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>

          <button
            onClick={downloadPreview}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400"
            title="Descargar HTML"
          >
            <Download size={12} />
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400"
            title={showCode ? "Ocultar código" : "Mostrar código"}
          >
            {showCode ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
        </div>
      </div>

      {/* Área de vista previa */}
      <div className="flex-1 relative overflow-hidden bg-white flex items-center justify-center">
        {error && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-xs z-10">
            Error: {error}
          </div>
        )}
        
        <div 
          className="transition-all duration-300 shadow-2xl overflow-hidden"
          style={{ 
            width: viewport.width, 
            height: viewport.height,
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          {previewUrl ? (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-none bg-white"
              title="Live Preview"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-mono bg-[#0d1117]">
              Esperando contenido...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
