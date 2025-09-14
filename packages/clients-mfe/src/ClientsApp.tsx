/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';
import { useClients } from './hooks/useClient';
import ClientModal from './components/ClientModal';
import Sidebar from './components/Sidebar';
import SelectedClients from './components/SelectedClients';
import Header from './components/Header';
import ClientGrid from './components/ClientGrid';
import ContentHeader from './components/ContentHeader';
import Pagination from './components/Pagination';
import ErrorBoundary from './components/ErrorBoundary';
import type { Client, CreateClientRequest, UpdateClientRequest } from './types/Client';
import { getUserName } from './utils/helpers';
import { VIEW_TYPES, MODAL_MODES } from './constants';
import './index.css';

interface ClientsListProps {
  clients: Client[];
  onDeleteClient: (id: number) => void;
  onCreateClient: () => void;
  onEditClient: (client: Client) => void;
  onAddToSelected: (client: Client) => void;
  onNavigateToSelected: () => void;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onMenuClick: () => void;
}

const ClientsList: React.FC<ClientsListProps> = ({
  clients,
  onDeleteClient,
  onCreateClient,
  onEditClient,
  onAddToSelected,
  onNavigateToSelected,
  isLoading,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onMenuClick
}) => {
  const userName = getUserName();

  const handleEdit = (client: Client) => {
    onEditClient(client);
  };

  const handleDelete = (client: Client) => {
    onDeleteClient(client.id);
  };

  const handleAdd = (client: Client) => {
    onAddToSelected(client);
  };

  return (
    <div className='clients-app'>
      <Header 
        onMenuClick={onMenuClick}
        onNavigateToSelected={onNavigateToSelected}
        userName={userName}
      />

      <div className="main-content">
        <ContentHeader 
          clientsCount={clients.length}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
        />

        <ClientGrid
          clients={clients}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddToSelected={handleAdd}
        />

        <button 
          className="create-client-btn"
          onClick={onCreateClient}
        >
          Criar cliente
        </button>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

const ClientsApp: React.FC = () => {
  const {
    clients,
    isLoading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    createClient,
    updateClient,
    deleteClient,
    goToPage,
    changeItemsPerPage,
    refreshClients,
  } = useClients();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: typeof MODAL_MODES[keyof typeof MODAL_MODES];
    client?: Client;
  }>({
    isOpen: false,
    mode: MODAL_MODES.ADD
  });

  const [modalLoading, setModalLoading] = useState(false);

  const [activeSidebarItem, setActiveSidebarItem] = useState('clients');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [currentView, setCurrentView] = useState<'clients' | 'selected'>('clients');

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleSidebarItemClick = (item: string) => {
    setActiveSidebarItem(item);
    switch (item) {
      case 'home':
        // Handle home navigation
        console.log('Navigate to home');
        break;
      case 'clients':
        setCurrentView('clients');
        break;
      case 'selected-clients':
        setCurrentView('selected');
        break;
      case 'logout':
        // Handle logout
        console.log('Logout');
        localStorage.removeItem('username');
        window.location.href = '/auth';
        break;
    }
  };

  // Selected clients handlers
  const handleAddToSelected = (client: Client) => {
    setSelectedClients(prev => {
      if (prev.find(c => c.id === client.id)) {
        return prev; // Already selected
      }
      return [...prev, client];
    });
  };

  const handleRemoveFromSelected = (clientId: number) => {
    setSelectedClients(prev => prev.filter(c => c.id !== clientId));
  };

  const handleClearAllSelected = () => {
    setSelectedClients([]);
  };

  const handleOpenModal = (mode: 'add' | 'edit' | 'delete', client?: Client) => {
    setModalState({ isOpen: true, mode, client });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: 'add' });
  };

  const handleSaveClient = async (data: CreateClientRequest | UpdateClientRequest) => {
    setModalLoading(true);
    try {
      console.log('HandleSaveClient called with:', { mode: modalState.mode, data, client: modalState.client });
      
      if (modalState.mode === 'add') {
        const result = await createClient(data as CreateClientRequest);
        console.log('Client created successfully:', result);
      } else if (modalState.mode === 'edit' && modalState.client) {
        console.log('Updating client with ID:', modalState.client.id);
        const result = await updateClient(modalState.client.id, data as UpdateClientRequest);
        console.log('Client updated successfully:', result);
      }
      
      console.log('Closing modal after successful operation');
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      // Don't close modal on error so user can retry
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClient = async (id: number) => {
    setModalLoading(true);
    try {
      await deleteClient(id);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    } finally {
      setModalLoading(false);
    }
  };

  console.log('ClientsApp render:', { clients, isLoading, error });

  if (error) {
    return (
      <div>
        {isSidebarOpen && <div className="sidebar-overlay" onClick={handleSidebarClose} />}
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          activeItem={activeSidebarItem}
          onItemClick={handleSidebarItemClick}
        />
        <div style={{ padding: '20px', color: 'red' }}>
          <h3>Erro ao carregar clientes:</h3>
          <p>{error}</p>
          <button onClick={() => refreshClients()}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={handleSidebarClose} />}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        activeItem={activeSidebarItem}
        onItemClick={handleSidebarItemClick}
      />
      
      {currentView === 'clients' ? (
        <ClientsList
          clients={clients}
          onDeleteClient={(id) => handleOpenModal('delete', clients.find(c => c.id === id))}
          onCreateClient={() => handleOpenModal('add')}
          onEditClient={(client) => handleOpenModal('edit', client)}
          onAddToSelected={handleAddToSelected}
          onNavigateToSelected={() => setCurrentView('selected')}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
          onItemsPerPageChange={changeItemsPerPage}
          onMenuClick={handleMenuClick}
        />
      ) : (
        <SelectedClients
          selectedClients={selectedClients}
          onRemoveClient={handleRemoveFromSelected}
          onClearAllClients={handleClearAllSelected}
          onMenuClick={handleMenuClick}
          onNavigateToClients={() => setCurrentView('clients')}
        />
      )}
      
      <ClientModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        mode={modalState.mode}
        client={modalState.client}
        onSave={handleSaveClient}
        onDelete={handleDeleteClient}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default ClientsApp;