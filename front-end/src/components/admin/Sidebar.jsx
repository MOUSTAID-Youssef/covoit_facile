import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaCar, 
  FaUsers, 
  FaRoute, 
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Tableau de bord',
      icon: FaTachometerAlt
    },
    {
      path: '/admin/trips',
      name: 'Gestion des trajets',
      icon: FaRoute
    },
    {
      path: '/admin/users',
      name: 'Utilisateurs',
      icon: FaUsers
    },
    {
      path: '/admin/vehicles',
      name: 'Véhicules',
      icon: FaCar
    },
    {
      path: '/admin/analytics',
      name: 'Statistiques',
      icon: FaChartBar
    },
    {
      path: '/admin/settings',
      name: 'Paramètres',
      icon: FaCog
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <FaCar className="brand-icon" />
            <span className="brand-text">CovoitFacile</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <IconComponent className="nav-icon" />
                    <span className="nav-text">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button className="logout-btn">
            <FaSignOutAlt className="logout-icon" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
