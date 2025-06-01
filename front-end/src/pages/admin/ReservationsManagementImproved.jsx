import React, { useState, useEffect } from 'react';
import {
  FaCalendarCheck, FaSearch, FaEye, FaSpinner, FaMapMarkerAlt,
  FaCalendarAlt, FaClock, FaEuroSign, FaUsers, FaUser, FaRoute,
  FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaTimes
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const ReservationsManagementImproved = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const result = await adminService.getReservations();
      console.log('📋 Réservations chargées:', result);
      if (result.success) {
        const reservationsData = result.data || [];
        console.log('📋 Données réservations:', reservationsData);
        // Vérifier les photos dans les données
        reservationsData.forEach((reservation, index) => {
          console.log(`📋 Réservation ${index}:`, {
            voyageur_photo: reservation.voyageur?.photo_profil,
            conducteur_photo: reservation.trajet?.conducteur?.photo_profil
          });
        });
        setReservations(reservationsData);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('❌ Erreur chargement réservations:', error);
      setErrorMessage('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = reservations;

    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.voyageur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.voyageur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.voyageur?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.trajet?.ville_depart?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.trajet?.ville_arrivee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.trajet?.conducteur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.trajet?.conducteur?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReservations(filtered);
  };

  const getUserPhotoUrl = (photoPath) => {
    if (!photoPath) return '/images/default-avatar.svg';
    if (photoPath.startsWith('http')) return photoPath;
    if (photoPath.startsWith('/')) return photoPath;
    return `http://localhost:8000/storage/${photoPath}`;
  };

  const openModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Heure non définie';
    try {
      return timeString.substring(0, 5);
    } catch (error) {
      return 'Heure invalide';
    }
  };

  const getReservationStatus = (reservation) => {
    if (reservation.statut === 'accepte') {
      return {
        label: 'Acceptée',
        color: 'bg-green-100 text-green-800',
        icon: FaCheckCircle
      };
    } else if (reservation.statut === 'refuse') {
      return {
        label: 'Refusée',
        color: 'bg-red-100 text-red-800',
        icon: FaTimesCircle
      };
    } else {
      return {
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: FaExclamationTriangle
      };
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Réservations</h1>
          <p className="text-gray-600 mt-1">
            Gestion des réservations avec photos réelles et bouton fonctionnel
          </p>
        </div>
        <button
          onClick={loadReservations}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FaSpinner className={loading ? 'animate-spin' : ''} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
          <button onClick={() => setSuccessMessage('')} className="float-right">×</button>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
          <button onClick={() => setErrorMessage('')} className="float-right">×</button>
        </div>
      )}

      {/* Recherche */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par voyageur, trajet, conducteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Liste des réservations */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                  Conducteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Places
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
              {filteredReservations.map((reservation) => {
                const status = getReservationStatus(reservation);
                const StatusIcon = status.icon;
                
                return (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getUserPhotoUrl(reservation.voyageur?.photo_profil)}
                          alt={`${reservation.voyageur?.prenom} ${reservation.voyageur?.nom}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.svg';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.voyageur?.prenom} {reservation.voyageur?.nom}
                          </div>
                          <div className="text-sm text-gray-500">{reservation.voyageur?.email}</div>
                          {reservation.voyageur?.telephone && (
                            <div className="text-sm text-gray-500">
                              📞 {reservation.voyageur?.telephone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <FaRoute className="text-indigo-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.trajet?.ville_depart} → {reservation.trajet?.ville_arrivee}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(reservation.trajet?.date_depart)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getUserPhotoUrl(reservation.trajet?.conducteur?.photo_profil)}
                          alt={`${reservation.trajet?.conducteur?.prenom} ${reservation.trajet?.conducteur?.nom}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.svg';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.trajet?.conducteur?.prenom} {reservation.trajet?.conducteur?.nom}
                          </div>
                          <div className="text-sm text-gray-500">{reservation.trajet?.conducteur?.email}</div>
                          {reservation.trajet?.conducteur?.telephone && (
                            <div className="text-sm text-gray-500">
                              📞 {reservation.trajet?.conducteur?.telephone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {formatTime(reservation.trajet?.heure_depart)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaUsers className="mr-2 text-gray-400" />
                          {reservation.nombre_places} place(s)
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="mr-1" />
                        {status.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(reservation)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                      >
                        <FaEye />
                        <span>Afficher</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarCheck className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails de la réservation #{selectedReservation.id}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Statut de la réservation */}
                <div className="text-center">
                  {(() => {
                    const status = getReservationStatus(selectedReservation);
                    const StatusIcon = status.icon;
                    return (
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
                        <StatusIcon className="mr-2" />
                        Réservation {status.label}
                      </span>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Informations du voyageur */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-900 mb-3">
                      <FaUser className="inline mr-2" />
                      Voyageur
                    </h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src={getUserPhotoUrl(selectedReservation.voyageur?.photo_profil)}
                        alt={`${selectedReservation.voyageur?.prenom} ${selectedReservation.voyageur?.nom}`}
                        className="w-16 h-16 rounded-full border-2 border-blue-200 object-cover"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.svg';
                        }}
                      />
                      <div>
                        <h4 className="font-medium text-blue-900">
                          {selectedReservation.voyageur?.prenom} {selectedReservation.voyageur?.nom}
                        </h4>
                        <p className="text-sm text-blue-700">{selectedReservation.voyageur?.email}</p>
                        {selectedReservation.voyageur?.telephone && (
                          <p className="text-sm text-blue-700">📞 {selectedReservation.voyageur?.telephone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informations du conducteur */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-green-900 mb-3">
                      <FaUser className="inline mr-2" />
                      Conducteur
                    </h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src={getUserPhotoUrl(selectedReservation.trajet?.conducteur?.photo_profil)}
                        alt={`${selectedReservation.trajet?.conducteur?.prenom} ${selectedReservation.trajet?.conducteur?.nom}`}
                        className="w-16 h-16 rounded-full border-2 border-green-200 object-cover"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.svg';
                        }}
                      />
                      <div>
                        <h4 className="font-medium text-green-900">
                          {selectedReservation.trajet?.conducteur?.prenom} {selectedReservation.trajet?.conducteur?.nom}
                        </h4>
                        <p className="text-sm text-green-700">{selectedReservation.trajet?.conducteur?.email}</p>
                        {selectedReservation.trajet?.conducteur?.telephone && (
                          <p className="text-sm text-green-700">📞 {selectedReservation.trajet?.conducteur?.telephone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations du trajet */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    <FaRoute className="inline mr-2" />
                    Détails du trajet
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Départ</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedReservation.trajet?.ville_depart}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Arrivée</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedReservation.trajet?.ville_arrivee}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedReservation.trajet?.date_depart)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Heure</label>
                      <p className="mt-1 text-sm text-gray-900">{formatTime(selectedReservation.trajet?.heure_depart)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prix par place</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedReservation.trajet?.prix} DH</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Places réservées</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedReservation.nombre_places} place(s)</p>
                    </div>
                  </div>
                </div>

                {/* Informations de la réservation */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-yellow-900 mb-3">
                    <FaCalendarCheck className="inline mr-2" />
                    Informations de réservation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de réservation</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedReservation.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Montant total</label>
                      <p className="mt-1 text-sm text-gray-900 font-medium">
                        {(selectedReservation.trajet?.prix || 0) * (selectedReservation.nombre_places || 1)} DH
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsManagementImproved;
