import React, { useState, useEffect } from 'react';
import {
  FaRoute, FaSearch, FaFilter, FaEdit, FaTrash, FaEye, FaMapMarkerAlt,
  FaCalendarAlt, FaClock, FaEuroSign, FaUsers, FaSpinner, FaCheck, FaTimes,
  FaExclamationTriangle, FaDownload, FaSort, FaCar
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const TripsManagement = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const result = await adminService.getTrips();
      if (result.success) {
        setTrips(result.data);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors du chargement des trajets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) return;

    setActionLoading(true);
    try {
      const result = await adminService.deleteTrip(tripId);
      if (result.success) {
        setSuccessMessage(result.message);
        loadTrips();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTripStatus = async (tripId, newStatus) => {
    setActionLoading(true);
    try {
      const result = await adminService.updateTrip(tripId, { statut: newStatus });
      if (result.success) {
        setSuccessMessage(`Trajet ${newStatus} avec succès`);
        loadTrips();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la mise à jour');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.ville_depart?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.ville_arrivee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.conducteur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.conducteur?.nom?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || trip.statut === filterStatus;

    const today = new Date();
    const tripDate = new Date(trip.date_depart);
    const matchesDate = filterDate === 'all' ||
                       (filterDate === 'today' && tripDate.toDateString() === today.toDateString()) ||
                       (filterDate === 'upcoming' && tripDate > today) ||
                       (filterDate === 'past' && tripDate < today);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'actif': { color: 'bg-green-100 text-green-800', icon: FaCheck, label: 'Actif' },
      'complet': { color: 'bg-blue-100 text-blue-800', icon: FaUsers, label: 'Complet' },
      'annule': { color: 'bg-red-100 text-red-800', icon: FaTimes, label: 'Annulé' },
      'termine': { color: 'bg-gray-100 text-gray-800', icon: FaCheck, label: 'Terminé' }
    };

    const config = statusConfig[status] || statusConfig['actif'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="mr-1" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
        <span className="ml-2 text-gray-600">Chargement des trajets...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gestion des trajets</h1>
          <p className="text-gray-600 text-sm">{trips.length} trajets au total</p>
        </div>
        <button
          onClick={loadTrips}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <FaSpinner className={loading ? 'animate-spin' : ''} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
          <button onClick={() => setSuccessMessage('')} className="float-right">×</button>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
          <button onClick={() => setErrorMessage('')} className="float-right">×</button>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un trajet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="complet">Complets</option>
            <option value="annule">Annulés</option>
            <option value="termine">Terminés</option>
          </select>

          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="upcoming">À venir</option>
            <option value="past">Passés</option>
          </select>

          <button
            onClick={loadTrips}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaSort />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Table des trajets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trajet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conducteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix & Places
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-indigo-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {trip.ville_depart} → {trip.ville_arrivee}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trip.reservations_count || 0} réservation(s)
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={trip.conducteur?.photo_url ? `http://localhost:8000/storage/${trip.conducteur.photo_url}` : '/images/default-avatar.svg'}
                        alt=""
                        className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.svg';
                        }}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {trip.conducteur?.prenom} {trip.conducteur?.nom}
                        </div>
                        <div className="text-sm text-gray-500">{trip.conducteur?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(trip.date_depart).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaClock className="mr-1" />
                          {trip.heure_depart}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 flex items-center">
                        {trip.prix} MAD
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaUsers className="mr-1" />
                        {trip.places_disponibles}/{trip.places_totales || trip.places_disponibles}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(trip.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedTrip(trip)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Voir détails"
                      >
                        <FaEye />
                      </button>

                      {trip.statut === 'actif' && (
                        <button
                          onClick={() => handleUpdateTripStatus(trip.id, 'annule')}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Annuler"
                        >
                          <FaTimes />
                        </button>
                      )}

                      {trip.statut === 'annule' && (
                        <button
                          onClick={() => handleUpdateTripStatus(trip.id, 'actif')}
                          disabled={actionLoading}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Réactiver"
                        >
                          <FaCheck />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <FaRoute className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">Aucun trajet trouvé</p>
        </div>
      )}
    </div>
  );
};

export default TripsManagement;
