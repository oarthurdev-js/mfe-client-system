import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Client, CreateClientRequest, UpdateClientRequest } from '../types/Client';
import { apiService } from '../../../shared/services/api';

// State interface
interface ClientsState {
  clients: Client[];
  selectedClients: Client[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  currentView: 'clients' | 'selected';
  isSidebarOpen: boolean;
  activeSidebarItem: string;
}

// Action types
type ClientsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CLIENTS'; payload: { clients: Client[]; totalPages: number; currentPage: number } }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: number }
  | { type: 'ADD_TO_SELECTED'; payload: Client }
  | { type: 'REMOVE_FROM_SELECTED'; payload: number }
  | { type: 'CLEAR_SELECTED' }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_ITEMS_PER_PAGE'; payload: number }
  | { type: 'SET_CURRENT_VIEW'; payload: 'clients' | 'selected' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_ACTIVE_SIDEBAR_ITEM'; payload: string };

// Initial state
const initialState: ClientsState = {
  clients: [],
  selectedClients: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 16,
  currentView: 'clients',
  isSidebarOpen: false,
  activeSidebarItem: 'clients'
};

// Reducer
const clientsReducer = (state: ClientsState, action: ClientsAction): ClientsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_CLIENTS':
      return {
        ...state,
        clients: action.payload.clients,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        isLoading: false,
        error: null
      };
    
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload]
      };
    
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        )
      };
    
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
        selectedClients: state.selectedClients.filter(client => client.id !== action.payload)
      };
    
    case 'ADD_TO_SELECTED':
      if (state.selectedClients.find(c => c.id === action.payload.id)) {
        return state; // Already selected
      }
      return {
        ...state,
        selectedClients: [...state.selectedClients, action.payload]
      };
    
    case 'REMOVE_FROM_SELECTED':
      return {
        ...state,
        selectedClients: state.selectedClients.filter(client => client.id !== action.payload)
      };
    
    case 'CLEAR_SELECTED':
      return {
        ...state,
        selectedClients: []
      };
    
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    
    case 'SET_ITEMS_PER_PAGE':
      return { ...state, itemsPerPage: action.payload, currentPage: 1 };
    
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SET_SIDEBAR_OPEN':
      return { ...state, isSidebarOpen: action.payload };
    
    case 'SET_ACTIVE_SIDEBAR_ITEM':
      return { ...state, activeSidebarItem: action.payload };
    
    default:
      return state;
  }
};

// Context interface
interface ClientsContextType {
  state: ClientsState;
  actions: {
    loadClients: (page?: number, limit?: number) => Promise<void>;
    createClient: (clientData: CreateClientRequest) => Promise<void>;
    updateClient: (id: number, clientData: UpdateClientRequest) => Promise<void>;
    deleteClient: (id: number) => Promise<void>;
    addToSelected: (client: Client) => void;
    removeFromSelected: (clientId: number) => void;
    clearSelected: () => void;
    goToPage: (page: number) => void;
    changeItemsPerPage: (itemsPerPage: number) => void;
    setCurrentView: (view: 'clients' | 'selected') => void;
    setSidebarOpen: (open: boolean) => void;
    setActiveSidebarItem: (item: string) => void;
    clearError: () => void;
    refreshClients: () => Promise<void>;
  };
}

// Create context
const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

// Provider component
interface ClientsProviderProps {
  children: ReactNode;
}

export const ClientsProvider: React.FC<ClientsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(clientsReducer, initialState);

  // Load clients
  const loadClients = async (page = state.currentPage, limit = state.itemsPerPage) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await apiService.getClients(page, limit);
      dispatch({
        type: 'SET_CLIENTS',
        payload: {
          clients: response.clients,
          totalPages: response.totalPages,
          currentPage: response.currentPage
        }
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Create client
  const createClient = async (clientData: CreateClientRequest) => {
    try {
      await apiService.createClient(clientData);
      // Reload clients to ensure consistency
      await loadClients(state.currentPage, state.itemsPerPage);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Update client
  const updateClient = async (id: number, clientData: UpdateClientRequest) => {
    try {
      const updatedClient = await apiService.updateClient(id, clientData);
      dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Delete client
  const deleteClient = async (id: number) => {
    try {
      await apiService.deleteClient(id);
      dispatch({ type: 'DELETE_CLIENT', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Selected clients actions
  const addToSelected = (client: Client) => {
    dispatch({ type: 'ADD_TO_SELECTED', payload: client });
  };

  const removeFromSelected = (clientId: number) => {
    dispatch({ type: 'REMOVE_FROM_SELECTED', payload: clientId });
  };

  const clearSelected = () => {
    dispatch({ type: 'CLEAR_SELECTED' });
  };

  // Pagination actions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= state.totalPages && page !== state.currentPage) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
      loadClients(page, state.itemsPerPage);
    }
  };

  const changeItemsPerPage = (itemsPerPage: number) => {
    dispatch({ type: 'SET_ITEMS_PER_PAGE', payload: itemsPerPage });
    loadClients(1, itemsPerPage);
  };

  // UI actions
  const setCurrentView = (view: 'clients' | 'selected') => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  };

  const setSidebarOpen = (open: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
  };

  const setActiveSidebarItem = (item: string) => {
    dispatch({ type: 'SET_ACTIVE_SIDEBAR_ITEM', payload: item });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const refreshClients = () => {
    return loadClients(state.currentPage, state.itemsPerPage);
  };

  // Load initial data
  useEffect(() => {
    loadClients();
  }, []);

  const contextValue: ClientsContextType = {
    state,
    actions: {
      loadClients,
      createClient,
      updateClient,
      deleteClient,
      addToSelected,
      removeFromSelected,
      clearSelected,
      goToPage,
      changeItemsPerPage,
      setCurrentView,
      setSidebarOpen,
      setActiveSidebarItem,
      clearError,
      refreshClients
    }
  };

  return (
    <ClientsContext.Provider value={contextValue}>
      {children}
    </ClientsContext.Provider>
  );
};

// Custom hook to use the context
export const useClientsContext = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClientsContext must be used within a ClientsProvider');
  }
  return context;
};