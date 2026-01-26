import { useRef, useEffect } from 'react';

const Minimap = ({ code, activeLineNumber, onLineClick }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !code) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lines = code.split('\n');
    
    // Configurar tamaño basado en el contenedor
    const width = 80;
    const height = Math.min(lines.length * 2, 800);
    canvas.width = width;
    canvas.height = height;
    
    // Fondo
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, width, height);
    
    // Dibujar líneas
    lines.forEach((line, idx) => {
      const y = (idx / lines.length) * height;
      const lineHeight = Math.max(1, height / lines.length);
      
      // Color basado en la indentación y longitud
      const trimmed = line.trim();
      if (trimmed.length > 0) {
        const indent = line.length - trimmed.length;
        const intensity = Math.min(trimmed.length / 50, 1);
        
        ctx.fillStyle = `rgba(19, 236, 200, ${0.2 + intensity * 0.3})`;
        ctx.fillRect(indent * 2, y, Math.min(trimmed.length, width - indent * 2), lineHeight);
      }
    });
    
    // Highlight línea activa
    if (activeLineNumber) {
      const y = ((activeLineNumber - 1) / lines.length) * height;
      const lineHeight = Math.max(2, height / lines.length);
      
      ctx.fillStyle = 'rgba(19, 236, 200, 0.2)';
      ctx.fillRect(0, y - 2, width, lineHeight + 4);
      ctx.strokeStyle = '#13ecc8';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, y - 2, width, lineHeight + 4);
    }
    
  }, [code, activeLineNumber]);
  
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const totalLines = code.split('\n').length;
    const lineNumber = Math.floor((y / rect.height) * totalLines) + 1;
    
    onLineClick?.(lineNumber);
  };
  
  return (
    <div className="w-20 bg-[#0d1117] border-l border-white/5 overflow-hidden hidden md:block select-none">
      <div className="p-2 border-b border-white/5 bg-[#192233]">
        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter text-center">Map</div>
      </div>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full cursor-pointer hover:opacity-80 transition-opacity"
        title="Navegación rápida"
      />
    </div>
  );
};

export default Minimap;
