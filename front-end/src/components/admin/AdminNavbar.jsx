import React, { useState } from 'react';
import { FaBars, FaBell, FaUser, FaSearch, FaChevronDown } from 'react-icons/fa';

const AdminNavbar = ({ onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, message: 'Nouveau trajet créé', time: '5 min' },
    { id: 2, message: 'Utilisateur inscrit', time: '10 min' },
    { id: 3, message: 'Réservation confirmée', time: '15 min' }
  ];

  return (
    <nav className="admin-navbar">
      <div className="navbar-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <h1 className="page-title">Administration CovoitFacile</h1>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Notifications */}
        <div className="navbar-item dropdown">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu notifications-dropdown">
              <div className="dropdown-header">
                <h6>Notifications</h6>
              </div>
              <div className="dropdown-body">
                {notifications.map(notification => (
                  <div key={notification.id} className="notification-item">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <a href="#" className="view-all-link">Voir toutes les notifications</a>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="navbar-item dropdown">
          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="profile-avatar">
              <FaUser />
            </div>
            <span className="profile-name">Admin</span>
            <FaChevronDown className="dropdown-arrow" />
          </button>

          {showProfile && (
            <div className="dropdown-menu profile-dropdown">
              <div className="dropdown-header">
                <div className="profile-info">
                  <div className="profile-avatar large">
                    <FaUser />
                  </div>
                  <div className="profile-details">
                    <h6>Administrateur</h6>
                    <p>admin@covoitfacile.com</p>
                  </div>
                </div>
              </div>
              <div className="dropdown-body">
                <a href="#" className="dropdown-item">Mon Profil</a>
                <a href="#" className="dropdown-item">Paramètres</a>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item text-danger">Déconnexion</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
