import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const renderPageButton = (page: number, isActive: boolean = false) => (
    <button
      key={page}
      className={`page-btn ${isActive ? 'active' : ''}`}
      onClick={() => onPageChange(page)}
      aria-label={`Ir para página ${page}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {page}
    </button>
  );

  const renderEllipsis = (key: string) => (
    <span key={key} className="page-btn ellipsis" aria-hidden="true">
      ...
    </span>
  );

  return (
    <div className="pagination" role="navigation" aria-label="Paginação">
      {/* First page */}
      {renderPageButton(1, currentPage === 1)}

      {/* Left ellipsis */}
      {currentPage > 3 && renderEllipsis('left-ellipsis')}

      {/* Middle pages */}
      {Array.from({ length: 3 }, (_, i) => {
        const page = currentPage - 1 + i;
        if (page > 1 && page < totalPages) {
          return renderPageButton(page, page === currentPage);
        }
        return null;
      }).filter(Boolean)}

      {/* Right ellipsis */}
      {currentPage < totalPages - 2 && renderEllipsis('right-ellipsis')}

      {/* Last page */}
      {totalPages > 1 && renderPageButton(totalPages, currentPage === totalPages)}
    </div>
  );
};

export default Pagination;