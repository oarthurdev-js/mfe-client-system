import React from 'react';

interface ContentHeaderProps {
  clientsCount: number;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [8, 16, 24, 32];

const ContentHeader: React.FC<ContentHeaderProps> = ({
  clientsCount,
  itemsPerPage,
  onItemsPerPageChange
}) => {
  return (
    <div className="content-header">
      <span className="clients-count">
        {clientsCount} {clientsCount === 1 ? 'cliente encontrado' : 'clientes encontrados'}
      </span>
      
      <div className="clients-per-page">
        <label htmlFor="itemsPerPage">Clientes por página: </label>
        <select 
          id="itemsPerPage"
          value={itemsPerPage} 
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="items-per-page-select"
          aria-label="Selecionar número de clientes por página"
        >
          {ITEMS_PER_PAGE_OPTIONS.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ContentHeader;