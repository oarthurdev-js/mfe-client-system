import { useState, useEffect } from 'react';
import { apiService } from '../shared/services/api';
import type { Client, CreateClientRequest, UpdateClientRequest } from '../types/Client';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);

  const loadClients = async (page = currentPage, limit = itemsPerPage) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getClients(page, limit);
      setClients(response.clients);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async (clientData: CreateClientRequest) => {
    try {
      const newClient = await apiService.createClient(clientData);
      // Recarregar a lista para garantir consistência
      await loadClients(currentPage, itemsPerPage);
      return newClient;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const updateClient = async (id: number, clientData: UpdateClientRequest) => {
    console.log('useClient.updateClient called with:', { id, clientData });
    try {
      const updatedClient = await apiService.updateClient(id, clientData);
      console.log('API updateClient response:', updatedClient);
      
      // Atualizar localmente
      setClients(prev => {
        const newClients = prev.map(client => client.id === id ? updatedClient : client);
        console.log('Local clients state updated:', newClients);
        return newClients;
      });
      
      return updatedClient;
    } catch (error: any) {
      console.error('Error in useClient.updateClient:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteClient = async (id: number) => {
    try {
      await apiService.deleteClient(id);
      // Remover localmente
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => setError(null);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      loadClients(page, itemsPerPage);
    }
  };

  const changeItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    loadClients(1, newItemsPerPage);
  };

  useEffect(() => {
    loadClients();
  }, []); // Carregar apenas na primeira vez

  return {
    clients,
    isLoading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
    clearError,
    goToPage,
    changeItemsPerPage,
    refreshClients: () => loadClients(currentPage, itemsPerPage),
  };
};