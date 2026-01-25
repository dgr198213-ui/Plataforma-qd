import { useState, useEffect, useRef, useCallback } from 'react';
import {
  RefreshCw, Maximize2, Minimize2, ExternalLink,
  Smartphone, Tablet, Monitor, Eye, EyeOff,
  Download, Copy, RotateCw
} from 'lucide-react';
import { useCodeStore } from '../../../../../store/codeStore';

const LivePreview = () => {
  const { activeFile, files } = useCodeStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('desktop'); // 'mobile' | 'tablet' | 'desktop'
  const [showCode, setShowCode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const refreshTimeoutRef = useRef(null);

  const activeFileObject = activeFile
    ? files.find(f => f.id === activeFile)
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
        .error {
            color: #ff6b6b;
            padding: 10px;
            background: rgba(255, 107, 107, 0.1);
            border-radius: 4px;
            margin: 10px 0;
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
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = function(...args) {
            originalLog.apply(console, args);
            window.parent.postMessage({ type: 'CONSOLE_LOG', args: args.map(arg => String(arg)) }, '*');
        };

        console.error = function(...args) {
            originalError.apply(console, args);
            window.parent.postMessage({ type: 'CONSOLE_ERROR', args: args.map(arg => String(arg)) }, '*');
        };

        console.warn = function(...args) {
            originalWarn.apply(console, args);
            window.parent.postMessage({ type: 'CONSOLE_WARN', args: args.map(arg => String(arg)) }, '*');
        };

        // Capturar errores no atrapados
        window.addEventListener('error', (event) => {
            window.parent.postMessage({
                type: 'RUNTIME_ERROR',
                error: event.error?.message || event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
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
      } else if (event.data.type === 'CONSOLE_ERROR') {
        console.error('[Preview Error]:', ...event.data.args);
        setError(event.data.args.join(' '));
      } else if (event.data.type === 'RUNTIME_ERROR') {
        console.error('[Runtime Error]:', event.data.error);
        setError(`${event.data.error} at ${event.data.filename}:${event.data.lineno}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleFullscreen = () => {
    if (!iframeRef.current) return;

    if (!isFullscreen) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
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

  const copyPreviewUrl = () => {
    if (previewUrl) {
      navigator.clipboard.writeText(previewUrl);
    }
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
    <div className="flex flex-col h-full bg-[#0d1117]">
      {/* Header de controles */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-[#13ecc8]" />
          <h3 className="text-sm font-bold">VISTA PREVIA</h3>
          {activeFileObject && (
            <span className="text-xs text-gray-400 ml-2">
              {activeFileObject.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Selector de vista */}
          <div className="flex bg-[#192233] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-[#13ecc8] text-[#10221f]' : 'hover:bg-white/5'}`}
              title="Vista móvil"
            >
              <Smartphone size={14} />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-1.5 rounded ${viewMode === 'tablet' ? 'bg-[#13ecc8] text-[#10221f]' : 'hover:bg-white/5'}`}
              title="Vista tablet"
            >
              <Tablet size={14} />
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-[#13ecc8] text-[#10221f]' : 'hover:bg-white/5'}`}
              title="Vista desktop"
            >
              <Monitor size={14} />
            </button>
          </div>

          {/* Botones de acción */}
          <button
            onClick={refreshPreview}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
            title="Recargar vista previa"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleFullscreen}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <button
            onClick={downloadPreview}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Descargar HTML"
          >
            <Download size={14} />
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title={showCode ? "Ocultar código" : "Mostrar código"}
          >
            {showCode ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* Indicador de vista actual */}
      {viewMode !== 'desktop' && (
        <div className="px-3 py-1 bg-[#192233] text-center">
          <span className="text-xs text-gray-400">
            Vista: {viewport.name} ({viewport.width} × {viewport.height})
          </span>
        </div>
      )}

      {/* Área de vista previa */}
      <div className="flex-1 relative overflow-hidden">
        {error && (
          <div className="absolute top-2 left-2 right-2 z-10">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <span>⚠️</span>
                <span className="flex-1">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-xs px-2 py-1 hover:bg-red-500/20 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenedor del iframe con dimensiones específicas */}
        <div
          className={`
            w-full h-full flex items-center justify-center
            ${viewMode !== 'desktop' ? 'p-4' : ''}
          `}
          style={{
            backgroundColor: viewMode !== 'desktop' ? '#192233' : 'transparent'
          }}
        >
          <div
            className={`
              relative bg-white shadow-2xl overflow-hidden
              ${viewMode !== 'desktop' ? 'border-8 border-gray-800 rounded-3xl' : 'w-full h-full'}
            `}
            style={{
              width: viewport.width,
              height: viewport.height,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            {/* Indicador de carga */}
            {isRefreshing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-2">
                  <RotateCw size={24} className="animate-spin text-[#13ecc8]" />
                  <span className="text-xs text-white">Actualizando vista previa...</span>
                </div>
              </div>
            )}

            {/* Iframe de vista previa */}
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title="Live Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
              allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"
            />
          </div>
        </div>
      </div>

      {/* Barra de estado */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <button
            onClick={copyPreviewUrl}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Copy size={12} />
            Copiar URL
          </button>
          <button
            onClick={() => window.open(previewUrl, '_blank')}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ExternalLink size={12} />
            Abrir en nueva pestaña
          </button>
        </div>

        <div className="flex items-center gap-2">
          {previewUrl && (
            <span className="text-green-500">●</span>
          )}
          <span>
            {previewUrl ? 'Vista previa activa' : 'Esperando contenido...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
