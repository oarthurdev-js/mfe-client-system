/* eslint-disable */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import type { Client } from '../types/Client';
import { getImageUrl, getIconUrl } from '../utils/helpers';
import './SelectedClients.css';

interface SelectedClientsProps {
  selectedClients: Client[];
  onRemoveClient: (clientId: number) => void;
  onClearAllClients: () => void;
  onMenuClick: () => void;
  onNavigateToClients?: () => void;
}

const SelectedClients: React.FC<SelectedClientsProps> = ({
  selectedClients,
  onRemoveClient,
  onClearAllClients,
  onMenuClick,
  onNavigateToClients
}) => {
  return (
    <div className='clients-app'>
      <div className='header'>
        <div className='header-left'>
          <div className='menu-icon' onClick={onMenuClick}>
            <img src={getIconUrl('menu-hamburguer.png')} alt="menu" style={{ width: '17px', height: '17px' }}/>
          </div>
          <div className='logo'>
            <a href="/clients">
            <img 
                src={getImageUrl('logo_teddy.webp')} 
                alt="Teddy" 
                style={{ maxHeight: '40px', maxWidth: '120px' }}
                />
            </a>
          </div>
        </div>
        <nav className='nav-menu'>
          <a href='#' className='nav-item' onClick={(e) => { e.preventDefault(); onNavigateToClients && onNavigateToClients(); }}>Clientes</a>
          <a href="#" className='nav-item active'>Clientes selecionados</a>
          <a href="#" className='nav-item'>Sair</a>
        </nav>
        <div className='user-info'>
          <span>Olá, <span style={{ fontWeight: 'bold' }}>{localStorage.getItem('userName')}</span></span>
        </div>
      </div>

      <div className="main-content">
        <div className="selected-header">
          <h2 className="selected-title">Clientes selecionados:</h2>
        </div>

        {selectedClients.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum cliente selecionado ainda.</p>
          </div>
        ) : (
          <>
            <div className="clients-grid">
              {selectedClients.map((client) => (
                <div key={client.id} className="client-card">
                  <h3 className="client-name">{client.name}</h3>
                  <div className="client-info">
                    <span className="client-salary">
                      Salário: R${client.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="client-company">
                      Empresa: R${client.companyValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="client-actions-selected">
                    <button 
                      className="action-btn-exclude"
                      onClick={() => onRemoveClient(client.id)}
                      title="Remover cliente"
                    >
                      <img src={getIconUrl('minus.png')} alt="remover" style={{ width: '17px', height: '17px' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="create-client-btn"
              onClick={onClearAllClients}
            >
              Limpar clientes selecionados
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectedClients;