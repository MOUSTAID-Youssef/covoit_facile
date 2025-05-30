import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaUserCheck, FaUserTimes } from 'react-icons/fa';

const UsersManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Ahmed Benali',
      email: 'ahmed.benali@email.com',
      phone: '+212 6 12 34 56 78',
      role: 'conducteur',
      status: 'active',
      verified: true,
      joinDate: '2024-01-15',
      tripsCount: 12
    },
    {
      id: 2,
      name: 'Fatima Zahra',
      email: 'fatima.zahra@email.com',
      phone: '+212 6 87 65 43 21',
      role: 'voyageur',
      status: 'active',
      verified: true,
      joinDate: '2024-02-20',
      tripsCount: 8
    },
    {
      id: 3,
      name: 'Omar Tazi',
      email: 'omar.tazi@email.com',
      phone: '+212 6 11 22 33 44',
      role: 'conducteur',
      status: 'suspended',
      verified: false,
      joinDate: '2024-03-10',
      tripsCount: 3
    },
    {
      id: 4,
      name: 'Youssef Alami',
      email: 'youssef.alami@email.com',
      phone: '+212 6 55 66 77 88',
      role: 'voyageur',
      status: 'active',
      verified: true,
      joinDate: '2024-04-05',
      tripsCount: 15
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { class: 'badge-success', text: 'Actif' },
      suspended: { class: 'badge-danger', text: 'Suspendu' },
      pending: { class: 'badge-warning', text: 'En attente' }
    };
    return statusMap[status] || { class: 'badge-secondary', text: status };
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      conducteur: { class: 'badge-primary', text: 'Conducteur' },
      voyageur: { class: 'badge-info', text: 'Voyageur' },
      admin: { class: 'badge-dark', text: 'Admin' }
    };
    return roleMap[role] || { class: 'badge-secondary', text: role };
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="users-management-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Gestion des Utilisateurs</h1>
          <p className="page-subtitle">Gérez tous les utilisateurs de la plateforme</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">
            <FaPlus className="btn-icon" />
            Nouvel Utilisateur
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-value">2,847</div>
          <div className="stat-label">Total Utilisateurs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">1,234</div>
          <div className="stat-label">Conducteurs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">1,613</div>
          <div className="stat-label">Voyageurs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">156</div>
          <div className="stat-label">Nouveaux ce mois</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="search-filter">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="role-filter">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les rôles</option>
              <option value="conducteur">Conducteur</option>
              <option value="voyageur">Voyageur</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="status-filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-section">
        <div className="table-card">
          <div className="table-header">
            <h5 className="table-title">Liste des Utilisateurs ({filteredUsers.length})</h5>
          </div>
          
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Contact</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Vérifié</th>
                  <th>Trajets</th>
                  <th>Inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const statusBadge = getStatusBadge(user.status);
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.name.charAt(0)}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{user.name}</div>
                            <div className="user-id">ID: #{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="user-email">{user.email}</div>
                          <div className="user-phone">{user.phone}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${roleBadge.class}`}>
                          {roleBadge.text}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td>
                        {user.verified ? (
                          <FaUserCheck className="verified-icon" />
                        ) : (
                          <FaUserTimes className="unverified-icon" />
                        )}
                      </td>
                      <td>
                        <span className="trips-count">{user.tripsCount}</span>
                      </td>
                      <td>{user.joinDate}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-action btn-view" title="Voir">
                            <FaEye />
                          </button>
                          <button className="btn-action btn-edit" title="Modifier">
                            <FaEdit />
                          </button>
                          <button className="btn-action btn-delete" title="Supprimer">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <p>Aucun utilisateur trouvé pour les critères sélectionnés.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
