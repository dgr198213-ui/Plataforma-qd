import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCodeStore } from '../../../../../store/codeStore';

export const useChatStore = create(
  persist(
    (set, get) => ({
      conversations: {},
      activeConversation: null,

      // Crear conversación vinculada a proyecto
      createConversation: (projectId) => {
        const id = `conv_${Date.now()}`;
        set(state => ({
          conversations: {
            ...state.conversations,
            [id]: {
              id,
              projectId,
              messages: [],
              context: {
                files: [],      // Archivos relevantes
                framework: '',  // React, Vue, etc.
                dependencies: []
              },
              createdAt: new Date().toISOString()
            }
          },
          activeConversation: id
        }));
        return id;
      },

      // Añadir mensaje con código generado
      addMessage: (conversationId, message) => {
        set(state => ({
          conversations: {
            ...state.conversations,
            [conversationId]: {
              ...state.conversations[conversationId],
              messages: [
                ...state.conversations[conversationId].messages,
                {
                  id: `msg_${Date.now()}`,
                  role: message.role, // 'user' | 'assistant'
                  content: message.content,
                  code: message.code, // Código generado (opcional)
                  timestamp: new Date().toISOString(),
                  applied: false // ¿Se insertó en el editor?
                }
              ]
            }
          }
        }));
      },

      // Aplicar código al proyecto
      applyCode: (conversationId, messageId, targetFile) => {
        const message = get().conversations[conversationId].messages
          .find(m => m.id === messageId);

        if (message?.code) {
          // Integración con codeStore
          const codeStore = useCodeStore.getState();
          codeStore.updateFileContent(targetFile, message.code);

          // Marcar como aplicado
          set(state => ({
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...state.conversations[conversationId],
                messages: state.conversations[conversationId].messages.map(m =>
                  m.id === messageId ? { ...m, applied: true } : m
                )
              }
            }
          }));
        }
      }
    }),
    { name: 'chat-storage' }
  )
);
