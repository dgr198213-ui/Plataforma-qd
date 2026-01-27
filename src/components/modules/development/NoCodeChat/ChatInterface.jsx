import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowLeft, Terminal, Bot } from 'lucide-react';
import { useChatStore } from './store/chatStore';
import { useCodeStore } from '../../../../store/codeStore';
import { useCredentialsStore } from '../../../../store/credentialsStore';
import MessageList from './MessageList';
import CodePreview from './CodePreview';
import PromptTemplates from './PromptTemplates';
import ConversationContext from './ConversationContext';

export default function ChatInterface({ onBack }) {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(null);

  const { activeConversation, createConversation, addMessage, conversations } = useChatStore();
  const { currentProjectId, projects, files } = useCodeStore();

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const currentProject = projects.find(p => p.id === currentProjectId);
  const conversation = conversations[activeConversation];

  // Inicializar conversación si no existe
  useEffect(() => {
    if (!activeConversation) {
      createConversation(currentProjectId || 'default');
    }
  }, [activeConversation, createConversation, currentProjectId]);

  // Scroll al final al recibir mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages]);

  // Generar código con IA
  const handleSend = async (customPrompt) => {
    const prompt = typeof customPrompt === 'string' ? customPrompt : input;
    if (!prompt.trim() || isGenerating) return;

    const userMessage = prompt.trim();
    setInput('');
    setIsGenerating(true);

    // 1. Añadir mensaje del usuario
    addMessage(activeConversation, {
      role: 'user',
      content: userMessage
    });

    try {
      const apiKey = getAPIKey();
      if (!apiKey) {
        throw new Error('Anthropic API Key no configurada. Por favor, añádela en el panel de Credenciales.');
      }

      // 2. Preparar contexto del proyecto
      const context = buildProjectContext(currentProject, files, conversation);

      // 3. Llamar a la IA (Anthropic API)
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 4096,
          messages: [
            ...formatConversationHistory(conversation),
            { role: 'user', content: userMessage }
          ],
          system: `Eres un asistente de desarrollo experto integrado en Howard OS.
Tu objetivo es ayudar al usuario a generar código funcional y limpio.
Contexto actual del proyecto:
${context}

REGLAS:
1. Responde con una explicación breve seguida del código.
2. Usa bloques de código con lenguaje especificado (ej: \`\`\`javascript).
3. Enfócate en soluciones pragmáticas y modernas.
4. Si el usuario pide algo que requiere múltiples archivos, propón una estructura clara.`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error en la API de Anthropic');
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;

      // 4. Extraer código del markdown
      const codeMatch = aiResponse.match(/```(?:\w+)?\n([\s\S]+?)```/);
      const extractedCode = codeMatch ? codeMatch[1] : null;

      // 5. Añadir respuesta de IA
      addMessage(activeConversation, {
        role: 'assistant',
        content: aiResponse,
        code: extractedCode
      });

      // 6. Mostrar preview si hay código
      if (extractedCode) {
        setShowPreview({
          id: conversation.messages[conversation.messages.length - 1]?.id || `msg_${Date.now()}`,
          code: extractedCode
        });
      }

    } catch (error) {
      console.error('Chat Error:', error);
      addMessage(activeConversation, {
        role: 'assistant',
        content: `❌ Error: ${error.message}`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#10221f] text-white overflow-hidden">
      {/* Panel de chat principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#10221f]/80 backdrop-blur-md flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#13ecc8]/10 flex items-center justify-center">
                <Bot size={20} className="text-[#13ecc8]" />
              </div>
              <div>
                <h1 className="text-sm font-bold">No-Code Chat</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#13ecc8] animate-pulse"></span>
                  <span className="text-[10px] text-[#13ecc8] font-bold tracking-widest uppercase">Claude 3.5 Sonnet</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#192233] border border-white/5 rounded-full">
              <Terminal size={12} className="text-gray-500" />
              <span className="text-[10px] font-bold text-gray-400">
                {currentProject?.name || 'Local Session'}
              </span>
            </div>
          </div>
        </header>

        {/* Context Bar */}
        <ConversationContext project={{ ...currentProject, files }} />

        {/* Historial de Mensajes */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
        >
          {conversation?.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8 py-12">
              <div className="w-20 h-20 rounded-3xl bg-[#13ecc8]/5 flex items-center justify-center border border-[#13ecc8]/10">
                <Sparkles size={40} className="text-[#13ecc8]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">¿Qué vamos a construir hoy?</h2>
                <p className="text-gray-400 leading-relaxed">
                  Describe tu idea en lenguaje natural. Howard AI generará el código,
                  lo configurará en tu proyecto y te ayudará a iterar hasta que sea perfecto.
                </p>
              </div>
              <PromptTemplates onSelect={handleSend} />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              <MessageList
                messages={conversation?.messages || []}
                onShowCode={(msg) => setShowPreview(msg)}
              />
            </div>
          )}
          {isGenerating && (
            <div className="max-w-4xl mx-auto w-full flex justify-start">
              <div className="bg-[#192233] border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#13ecc8] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#13ecc8] rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                  <div className="w-2 h-2 bg-[#13ecc8] rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                </div>
                <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">Howard está pensando...</span>
              </div>
            </div>
          )}
        </div>

        {/* Area de Input */}
        <div className="p-4 bg-[#10221f] border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2 bg-[#192233] border border-white/10 rounded-2xl p-2 focus-within:border-[#13ecc8]/50 transition-all shadow-xl">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe un componente, una función o una integración..."
                className="flex-1 bg-transparent border-none resize-none py-3 px-4 text-sm text-white focus:outline-none min-h-[44px] max-h-40 custom-scrollbar"
                rows={1}
                disabled={isGenerating}
              />
              <button
                onClick={handleSend}
                disabled={isGenerating || !input.trim()}
                className={`p-3 rounded-xl transition-all ${
                  isGenerating || !input.trim()
                    ? 'bg-white/5 text-gray-600'
                    : 'bg-[#13ecc8] text-[#10221f] shadow-lg shadow-[#13ecc8]/20 hover:scale-105 active:scale-95'
                }`}
              >
                {isGenerating ? (
                  <Sparkles className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <div className="flex justify-between px-2 mt-2">
              <p className="text-[10px] text-gray-500 font-medium">
                Presiona <kbd className="bg-white/5 px-1 rounded">Enter</kbd> para enviar
              </p>
              <button
                onClick={() => setInput('')}
                className="text-[10px] text-gray-500 hover:text-white transition-colors"
              >
                Limpiar chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Lateral de Vista Previa */}
      {showPreview && (
        <CodePreview
          message={showPreview}
          onClose={() => setShowPreview(null)}
          onApply={(targetFile) => {
            useChatStore.getState().applyCode(
              activeConversation,
              showPreview.id,
              targetFile
            );
            setShowPreview(null);
          }}
        />
      )}
    </div>
  );
}

// Helpers
function buildProjectContext(project, files, conversation) {
  return `
Proyecto: ${project?.name || 'Local Session'}
Framework Detectado: ${detectFramework(files)}
Archivos en el proyecto:
${files.map(f => `- ${f.path} (${f.language})`).join('\n')}

Historial: La conversación tiene ${conversation?.messages.length || 0} mensajes previos.
  `.trim();
}

function detectFramework(files) {
  const hasReact = files?.some(f =>
    f.content?.includes('import React') || f.content?.includes('from "react"') || f.path.endsWith('.jsx')
  );
  return hasReact ? 'React (Vite)' : 'Vanilla JavaScript';
}

function formatConversationHistory(conversation) {
  return (conversation?.messages || [])
    .slice(-6) // Solo últimos 6 mensajes para ahorrar tokens
    .map(m => ({
      role: m.role,
      content: m.content
    }));
}

function getAPIKey() {
  const credentials = useCredentialsStore.getState().credentials;
  return credentials.find(c => c.name === 'Anthropic API')?.value || '';
}
