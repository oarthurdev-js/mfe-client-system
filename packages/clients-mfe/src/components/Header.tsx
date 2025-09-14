import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
  onNavigateToSelected: () => void;
  userName: string;
}

// Helper function to get the correct image URL for federation
const getImageUrl = () => {
  const baseUrl = window.location.port === '5173' 
    ? 'http://localhost:5175' // When accessed via shell
    : ''; // When accessed directly
  return `${baseUrl}/logo_teddy.webp`;
};

// Helper function to get icon URLs
const getIconUrl = (iconName: string) => {
  const baseUrl = window.location.port === '5173' 
    ? 'http://localhost:5175' // When accessed via shell
    : ''; // When accessed directly
  return `${baseUrl}/${iconName}`;
};

const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  onNavigateToSelected, 
  userName 
}) => {
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '/auth';
  };

  return (
    <div className='header'>
      <div className='header-left'>
        <div className='menu-icon' onClick={onMenuClick}>
          <img 
            src={getIconUrl('menu-hamburguer.png')} 
            alt="menu" 
            style={{ width: '17px', height: '17px' }}
          />
        </div>
        <div className='logo'>
          <a href="/clients">
            <img 
              src={getImageUrl()} 
              alt="Teddy" 
              style={{ maxHeight: '40px', maxWidth: '120px' }}
            />
          </a>
        </div>
      </div>
      
      <nav className='nav-menu'>
        <a href='/clients' className='nav-item active'>
          Clientes
        </a>
        <a 
          className='nav-item' 
          onClick={(e) => { 
            e.preventDefault(); 
            onNavigateToSelected(); 
          }}
        >
          Clientes selecionados
        </a>
        <a 
          href='/auth' 
          className='nav-item' 
          onClick={handleLogout}
        >
          Sair
        </a>
      </nav>
      
      <div className='user-info'>
        <span>
          Olá, <span style={{ fontWeight: 'bold' }}>{userName}</span>
        </span>
      </div>
    </div>
  );
};

export default Header;