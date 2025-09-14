import React from 'react';
import ClientCard from './ClientCard';
import type { Client } from '../types/Client';

interface ClientGridProps {
  clients: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onAddToSelected: (client: Client) => void;
}

const ClientGrid: React.FC<ClientGridProps> = ({
  clients,
  isLoading,
  onEdit,
  onDelete,
  onAddToSelected
}) => {
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Carregando...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum cliente encontrado.</p>
      </div>
    );
  }

  return (
    <div className="clients-grid">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddToSelected={onAddToSelected}
        />
      ))}
    </div>
  );
};

export default ClientGrid;