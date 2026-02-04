/**
 * Servicio de Interconexión MCP para Plataforma-qd
 * Conecta el IDE con el Agente y Howard OS
 */

const AGENT_URL = import.meta.env.VITE_AGENT_URL || 'http://localhost:3001';

export const mcpService = {
  /**
   * Consulta la base de conocimiento de Howard OS
   */
  async queryArchitecture(query: string) {
    try {
      const response = await fetch(`${AGENT_URL}/api/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `Consulta Howard OS: ${query}` }
          ],
          use_mcp: true,
          mcp_scope: 'howard-os'
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error consultando Howard OS:', error);
      throw error;
    }
  },

  /**
   * Sincroniza una solución validada en el IDE con el Agente
   */
  async syncSolution(solution: any) {
    try {
      const response = await fetch(`${AGENT_URL}/api/agent/sync-solution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solution)
      });
      return await response.json();
    } catch (error) {
      console.error('Error sincronizando solución:', error);
      throw error;
    }
  }
};
