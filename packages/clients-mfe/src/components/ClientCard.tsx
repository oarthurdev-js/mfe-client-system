import React from 'react';
import type { Client } from '../types/Client';
import { getIconUrl } from '../utils/helpers';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onAddToSelected: (client: Client) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onEdit,
  onDelete,
  onAddToSelected
}) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  return (
    <div className="client-card">
      <h3 className="client-name">{client.name}</h3>
      <div className="client-info">
        <span className="client-salary">
          Salário: R${formatCurrency(client.salary)}
        </span>
        <span className="client-company">
          Empresa: R${formatCurrency(client.companyValuation)}
        </span>
      </div>
      <div className="client-actions">
        <button 
          className="action-btn"
          onClick={() => onAddToSelected(client)}
          title="Adicionar aos selecionados"
          aria-label={`Adicionar ${client.name} aos selecionados`}
        >
          <img 
            src={getIconUrl('plus.png')} 
            alt="adicionar" 
            style={{ width: '17px', height: '17px' }} 
          />
        </button>
        <button 
          className="action-btn"
          onClick={() => onEdit(client)}
          title="Editar cliente"
          aria-label={`Editar ${client.name}`}
        >
          <img 
            src={getIconUrl('pencil.png')} 
            alt="editar" 
            style={{ width: '17px', height: '17px' }} 
          />
        </button>
        <button 
          className="action-btn"
          onClick={() => onDelete(client)}
          title="Deletar cliente"
          aria-label={`Deletar ${client.name}`}
        >
          <img 
            src={getIconUrl('trash.png')} 
            alt="deletar" 
            style={{ width: '17px', height: '17px' }} 
          />
        </button>
      </div>
    </div>
  );
};

export default ClientCard;