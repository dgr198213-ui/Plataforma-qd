import { create } from 'zustand';

export const useConnectorsStore = create((set, get) => ({
  connectors: [],

  addConnector: (connector) => {
    set(state => ({
      connectors: [...state.connectors, connector]
    }));
  },

  removeConnector: (id) => {
    set(state => ({
      connectors: state.connectors.filter(c => c.id !== id)
    }));
  },

  getConnector: (id) => {
    return get().connectors.find(c => c.id === id);
  },

  getConnectorsByType: (type) => {
    return get().connectors.filter(c => c.type === type);
  }
}));
