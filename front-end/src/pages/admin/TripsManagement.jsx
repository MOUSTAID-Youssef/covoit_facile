import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaFilter, FaSearch } from 'react-icons/fa';

const TripsManagement = () => {
  const [trips, setTrips] = useState([
    {
      id: 1,
      departure: 'Casablanca',
      destination: 'Rabat',
      date: '2025-06-01',
      time: '08:00',
      driver: 'Ahmed Benali',
      passengers: 2,
      maxPassengers: 4,
      price: 50,
      status: 'active'
    },
    {
      id: 2,
      departure: 'Rabat',
      destination: 'Fès',
      date: '2025-06-02',
      time: '14:30',
      driver: 'Fatima Zahra',
      passengers: 3,
      maxPassengers: 3,
      price: 80,
      status: 'full'
    },
    {
      id: 3,
      departure: 'Casablanca',
      destination: 'Marrakech',
      date: '2025-06-03',
      time: '09:15',
      driver: 'Omar Tazi',
      passengers: 1,
      maxPassengers: 4,
      price: 120,
      status: 'active'
    },
    {
      id: 4,
      departure: 'Agadir',
      destination: 'Casablanca',
      date: '2025-05-30',
      time: '16:00',
      driver: 'Youssef Alami',
      passengers: 0,
      maxPassengers: 3,
      price: 150,
      status: 'completed'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { class: 'badge-success', text: 'Actif' },
      full: { class: 'badge-warning', text: 'Complet' },
      completed: { class: 'badge-secondary', text: 'Terminé' },
      cancelled: { class: 'badge-danger', text: 'Annulé' }
    };
    return statusMap[status] || { class: 'badge-secondary', text: status };
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="trips-management-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Gestion des Trajets</h1>
          <p className="page-subtitle">Gérez tous les trajets de la plateforme</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">
            <FaPlus className="btn-icon" />
            Nouveau Trajet
          </button>
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
                placeholder="Rechercher par ville ou conducteur..."
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
              <option value="full">Complet</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="trips-table-section">
        <div className="table-card">
          <div className="table-header">
            <h5 className="table-title">Liste des Trajets ({filteredTrips.length})</h5>
          </div>
          
          <div className="table-responsive">
            <table className="trips-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Trajet</th>
                  <th>Date & Heure</th>
                  <th>Conducteur</th>
                  <th>Passagers</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map(trip => {
                  const statusBadge = getStatusBadge(trip.status);
                  return (
                    <tr key={trip.id}>
                      <td>#{trip.id}</td>
                      <td>
                        <div className="trip-route">
                          <span className="departure">{trip.departure}</span>
                          <span className="route-arrow">→</span>
                          <span className="destination">{trip.destination}</span>
                        </div>
                      </td>
                      <td>
                        <div className="trip-datetime">
                          <div className="trip-date">{trip.date}</div>
                          <div className="trip-time">{trip.time}</div>
                        </div>
                      </td>
                      <td>{trip.driver}</td>
                      <td>
                        <span className="passengers-count">
                          {trip.passengers}/{trip.maxPassengers}
                        </span>
                      </td>
                      <td>
                        <span className="trip-price">{trip.price} MAD</span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
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
          
          {filteredTrips.length === 0 && (
            <div className="empty-state">
              <p>Aucun trajet trouvé pour les critères sélectionnés.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripsManagement;
