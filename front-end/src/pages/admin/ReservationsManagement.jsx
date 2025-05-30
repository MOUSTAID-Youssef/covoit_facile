import React, { useState, useEffect } from 'react';
import {
  FaClipboardList, FaSearch, FaFilter, FaEye, FaSpinner, FaMapMarkerAlt,
  FaCalendarAlt, FaClock, FaEuroSign, FaUsers, FaCheck, FaTimes,
  FaExclamationTriangle, FaDownload, FaSort, FaUser
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const ReservationsManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const result = await adminService.getReservations();
      if (result.success) {
        setReservations(result.data);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.voyageur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.voyageur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.trajet?.ville_depart?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.trajet?.ville_arrivee?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || reservation.statut === filterStatus;

    const today = new Date();
    const reservationDate = new Date(reservation.created_at);
    const matchesDate = filterDate === 'all' ||
                       (filterDate === 'today' && reservationDate.toDateString() === today.toDateString()) ||
                       (filterDate === 'week' && (today - reservationDate) / (1000 * 60 * 60 * 24) <= 7) ||
                       (filterDate === 'month' && (today - reservationDate) / (1000 * 60 * 60 * 24) <= 30);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_attente': { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, label: 'En attente' },
      'confirmee': { color: 'bg-green-100 text-green-800', icon: FaCheck, label: 'Confirmée' },
      'annulee': { color: 'bg-red-100 text-red-800', icon: FaTimes, label: 'Annulée' }
    };

    const config = statusConfig[status] || statusConfig['en_attente'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="mr-1" />
        {config.label}
      </span>
    );
  };

  const calculateTotalRevenue = () => {
    return filteredReservations
      .filter(r => r.statut === 'confirmee')
      .reduce((total, r) => total + (r.trajet?.prix * r.nombre_places || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
        <span className="ml-2 text-gray-600">Chargement des réservations...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gestion des réservations</h1>
          <p className="text-gray-600 text-sm">{reservations.length} réservations au total</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg">
            <span className="text-sm font-medium">
              Revenus: {calculateTotalRevenue().toLocaleString()} MAD
            </span>
          </div>
          <button
            onClick={loadReservations}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <FaSpinner className={loading ? 'animate-spin' : ''} />
            <span>Actualiser</span>
          </button>
        </div>
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

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FaClipboardList className="text-blue-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{reservations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FaClock className="text-yellow-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-xl font-bold text-gray-900">
                {reservations.filter(r => r.statut === 'en_attente').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FaCheck className="text-green-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Confirmées</p>
              <p className="text-xl font-bold text-gray-900">
                {reservations.filter(r => r.statut === 'confirmee').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FaTimes className="text-red-500 text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Annulées</p>
              <p className="text-xl font-bold text-gray-900">
                {reservations.filter(r => r.statut === 'annulee').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une réservation..."
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
            <option value="en_attente">En attente</option>
            <option value="confirmee">Confirmées</option>
            <option value="annulee">Annulées</option>
          </select>

          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>

          <button
            onClick={loadReservations}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaSort />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Table des réservations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voyageur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trajet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Places & Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de réservation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={reservation.voyageur?.photo_url ? `http://localhost:8000/storage/${reservation.voyageur.photo_url}` : '/images/default-avatar.svg'}
                        alt=""
                        className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.svg';
                        }}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.voyageur?.prenom} {reservation.voyageur?.nom}
                        </div>
                        <div className="text-sm text-gray-500">{reservation.voyageur?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-indigo-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.trajet?.ville_depart} → {reservation.trajet?.ville_arrivee}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(reservation.trajet?.date_depart).toLocaleDateString('fr-FR')}
                          <FaClock className="ml-2 mr-1" />
                          {reservation.trajet?.heure_depart}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaUsers className="mr-1" />
                        {reservation.nombre_places} place(s)
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FaEuroSign className="mr-1" />
                        {(reservation.trajet?.prix * reservation.nombre_places || 0).toLocaleString()} MAD
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(reservation.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                    <div className="text-xs text-gray-400">
                      {new Date(reservation.created_at).toLocaleTimeString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedReservation(reservation)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Voir détails"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <FaClipboardList className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">Aucune réservation trouvée</p>
        </div>
      )}
    </div>
  );
};

export default ReservationsManagement;
