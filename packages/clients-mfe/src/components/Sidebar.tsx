import React from 'react';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowLeftIcon
} from '@mui/icons-material';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const getImageUrl = () => {
  // Always use the current MFE's public URL
  const baseUrl = window.location.port === '5173' 
    ? 'http://localhost:5175' // When accessed via shell
    : ''; // When accessed directly
  return `${baseUrl}/logo_teddy.webp`;
};

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen,
  onClose,
  activeItem = 'clients', 
  onItemClick 
}) => {
  const handleItemClick = (item: string) => {
    if (onItemClick) {
      onItemClick(item);
    }
    onClose(); // Close sidebar after clicking an item
  };

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <HomeIcon />,
      href: '/clients'
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: <PeopleIcon />,
      href: '/clients'
    },
    {
      id: 'selected-clients',
      label: 'Clientes selecionados',
      icon: <PersonAddIcon />,
      href: '/selected-clients'
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay/Backdrop */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={getImageUrl()} alt="Teddy" className="sidebar-logo-img" />
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <div style={{backgroundColor: "#fff", width: "30px", height: "30px", borderRadius: "50%"}}>
            <ArrowLeftIcon style={{ width: 16, height: 16, color: '#000', fontSize: '16px', marginTop: "7px" }} />
            </div>
          </button>
        </div>
        
        {/* Menu Items */}
        <nav className="menu-sidebar">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`menu-sidebar-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item.id);
                window.location.href = item.href;
              }}
            >
              <span className="icon-sidebar">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className='sidebar-footer' />
      </div>
    </>
  );
};

export default Sidebar;