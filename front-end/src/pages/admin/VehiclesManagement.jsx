import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaCar } from 'react-icons/fa';

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      color: 'Blanc',
      licensePlate: '123456-A-78',
      owner: 'Ahmed Benali',
      ownerId: 1,
      seats: 5,
      status: 'active',
      verified: true
    },
    {
      id: 2,
      brand: 'Renault',
      model: 'Clio',
      year: 2019,
      color: 'Rouge',
      licensePlate: '789012-B-34',
      owner: 'Fatima Zahra',
      ownerId: 2,
      seats: 5,
      status: 'active',
      verified: true
    },
    {
      id: 3,
      brand: 'Peugeot',
      model: '208',
      year: 2021,
      color: 'Noir',
      licensePlate: '345678-C-90',
      owner: 'Omar Tazi',
      ownerId: 3,
      seats: 5,
      status: 'pending',
      verified: false
    },
    {
      id: 4,
      brand: 'Dacia',
      model: 'Logan',
      year: 2018,
      color: 'Gris',
      licensePlate: '901234-D-56',
      owner: 'Youssef Alami',
      ownerId: 4,
      seats: 5,
      status: 'suspended',
      verified: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { class: 'badge-success', text: 'Actif' },
      pending: { class: 'badge-warning', text: 'En attente' },
      suspended: { class: 'badge-danger', text: 'Suspendu' }
    };
    return statusMap[status] || { class: 'badge-secondary', text: status };
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="vehicles-management-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Gestion des Véhicules</h1>
          <p className="page-subtitle">Gérez tous les véhicules enregistrés sur la plateforme</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">
            <FaPlus className="btn-icon" />
            Nouveau Véhicule
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="vehicles-stats">
        <div className="stat-card">
          <div className="stat-value">1,234</div>
          <div className="stat-label">Total Véhicules</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">1,156</div>
          <div className="stat-label">Véhicules Actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">45</div>
          <div className="stat-label">En Attente</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">33</div>
          <div className="stat-label">Suspendus</div>
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
                placeholder="Rechercher par marque, modèle, plaque ou propriétaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="status-filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="vehicles-table-section">
        <div className="table-card">
          <div className="table-header">
            <h5 className="table-title">Liste des Véhicules ({filteredVehicles.length})</h5>
          </div>
          
          <div className="table-responsive">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Véhicule</th>
                  <th>Plaque d'immatriculation</th>
                  <th>Propriétaire</th>
                  <th>Places</th>
                  <th>Statut</th>
                  <th>Vérifié</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map(vehicle => {
                  const statusBadge = getStatusBadge(vehicle.status);
                  return (
                    <tr key={vehicle.id}>
                      <td>
                        <div className="vehicle-info">
                          <div className="vehicle-icon">
                            <FaCar />
                          </div>
                          <div className="vehicle-details">
                            <div className="vehicle-name">
                              {vehicle.brand} {vehicle.model}
                            </div>
                            <div className="vehicle-year-color">
                              {vehicle.year} • {vehicle.color}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="license-plate">{vehicle.licensePlate}</span>
                      </td>
                      <td>
                        <div className="owner-info">
                          <div className="owner-name">{vehicle.owner}</div>
                          <div className="owner-id">ID: #{vehicle.ownerId}</div>
                        </div>
                      </td>
                      <td>
                        <span className="seats-count">{vehicle.seats} places</span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td>
                        {vehicle.verified ? (
                          <span className="verified-badge">✓ Vérifié</span>
                        ) : (
                          <span className="unverified-badge">⚠ Non vérifié</span>
                        )}
                      </td>
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
          
          {filteredVehicles.length === 0 && (
            <div className="empty-state">
              <p>Aucun véhicule trouvé pour les critères sélectionnés.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiclesManagement;
