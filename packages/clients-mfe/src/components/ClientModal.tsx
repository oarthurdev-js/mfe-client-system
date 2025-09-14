import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Client, CreateClientRequest, UpdateClientRequest } from '../types/Client';
import './ClientModal.css';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'delete';
  client?: Client;
  onSave: (data: CreateClientRequest | UpdateClientRequest) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  isLoading?: boolean;
}

const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  mode,
  client,
  onSave,
  onDelete,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    salary: '',
    companyValuation: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && client) {
      setFormData({
        name: client.name,
        salary: client.salary.toString(),
        companyValuation: client.companyValuation.toString()
      });
    } else if (mode === 'add') {
      setFormData({
        name: '',
        salary: '',
        companyValuation: ''
      });
    }
    setErrors({});
  }, [mode, client, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.salary || isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salário deve ser um número positivo';
    }

    if (!formData.companyValuation || isNaN(Number(formData.companyValuation)) || Number(formData.companyValuation) <= 0) {
      newErrors.companyValuation = 'Valor da empresa deve ser um número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'delete' && client && onDelete) {
      try {
        await onDelete(client.id);
        onClose();
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
      }
      return;
    }

    if (!validateForm()) return;

    try {
      const data = {
        name: formData.name.trim(),
        salary: Number(formData.salary),
        companyValuation: Number(formData.companyValuation)
      };

      console.log('ClientModal submitting data:', data);
      await onSave(data);
      console.log('ClientModal onSave completed successfully');
      // Don't close modal here - let parent handle it after successful operation
    } catch (error) {
      console.error('Erro ao salvar cliente no modal:', error);
      // Keep modal open on error so user can retry
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'add': return 'Criar cliente:';
      case 'edit': return 'Editar cliente:';
      case 'delete': return 'Excluir cliente:';
      default: return '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()}>
      <form onSubmit={handleSubmit} className="client-modal-form">
        {mode === 'delete' ? (
// Updated delete confirmation content
<div className="delete-confirmation">
  <p className="delete-message">
    Você está prestes a excluir o cliente: <strong>{client?.name}</strong>
  </p>
</div>
        ) : (
          <div className="form-fields">
            <div className="form-field">
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite o nome:"
                disabled={isLoading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-field">
              <input
                id="salary"
                type="number"
                className={`form-input ${errors.salary ? 'error' : ''}`}
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="Digite o salário:"
                min="0"
                step="0.01"
                disabled={isLoading}
              />
              {errors.salary && <span className="error-message">{errors.salary}</span>}
            </div>

            <div className="form-field">
              <input
                id="companyValuation"
                type="number"
                className={`form-input ${errors.companyValuation ? 'error' : ''}`}
                value={formData.companyValuation}
                onChange={(e) => handleInputChange('companyValuation', e.target.value)}
                placeholder="Digite o valor da empresa:"
                min="0"
                step="0.01"
                disabled={isLoading}
              />
              {errors.companyValuation && <span className="error-message">{errors.companyValuation}</span>}
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`btn-primary ${mode === 'delete' ? 'btn-danger' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : (
            mode === 'delete' ? 'Excluir' : 
            mode === 'edit' ? `Editar cliente` : 'Criar cliente'
          )}
        </button>
      </form>
    </Modal>
  );
};

export default ClientModal;