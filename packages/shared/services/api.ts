import axios, { type AxiosResponse } from 'axios';
import type { Client, ClientsResponse, CreateClientRequest, UpdateClientRequest } from '../src/types/Client';

const API_BASE_URL = 'https://boasorte.teddybackoffice.com.br';

// Configurar instância do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para logs
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class ApiService {
  // Buscar clientes com paginação
  async getClients(page = 1, limit = 16): Promise<ClientsResponse> {
    try {
      const response: AxiosResponse<ClientsResponse> = await apiClient.get(
        `/users?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw this.handleError(error);
    }
  }

  // Buscar cliente por ID
  async getClientById(id: number): Promise<Client> {
    try {
      const response: AxiosResponse<Client> = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw this.handleError(error);
    }
  }

  // Criar novo cliente
  async createClient(client: CreateClientRequest): Promise<Client> {
    try {
      const response: AxiosResponse<Client> = await apiClient.post('/users', client);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw this.handleError(error);
    }
  }

  // Atualizar cliente
  async updateClient(id: number, client: UpdateClientRequest): Promise<Client> {
    console.log('API updateClient called with:', { id, client });
    try {
      const response: AxiosResponse<Client> = await apiClient.patch(`/users/${id}`, client);
      console.log('API updateClient successful response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      console.error('Request details:', { id, client });
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      throw this.handleError(error);
    }
  }

  // Deletar cliente
  async deleteClient(id: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw this.handleError(error);
    }
  }

  // Tratamento de erros centralizado
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Erro da API
        const message = error.response.data?.message || error.response.data?.error || 'Erro na API';
        return new Error(`${message} (${error.response.status})`);
      } else if (error.request) {
        // Erro de rede
        return new Error('Erro de conexão. Verifique sua internet.');
      }
    }
    
    return new Error('Erro interno da aplicação');
  }
}

export const apiService = new ApiService();