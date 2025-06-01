import React, { useState, useEffect } from 'react';
import {
  FaRoute, FaSearch, FaEye, FaTrash, FaTimes, FaSpinner, FaMapMarkerAlt,
  FaCalendarAlt, FaClock, FaEuroSign, FaUsers, FaCar, FaUser, FaPhone,
  FaEnvelope, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaCheck
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const TripsManagementImproved = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [trips, searchTerm]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const result = await adminService.getTrips();
      if (result.success) {
        setTrips(result.data || []);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors du chargement des trajets');
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = trips;

    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.ville_depart?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.ville_arrivee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.conducteur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.conducteur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.conducteur?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTrips(filtered);
  };

  const getUserPhotoUrl = (photoPath) => {
    if (!photoPath) return '/images/default-avatar.svg';
    if (photoPath.startsWith('http')) return photoPath;
    if (photoPath.startsWith('/')) return photoPath;
    return `http://localhost:8000/storage/${photoPath}`;
  };

  const openModal = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTrip(null);
  };

  const openDeleteModal = (trip) => {
    setTripToDelete(trip);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTripToDelete(null);
  };

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;

    setDeleting(true);
    try {
      const result = await adminService.deleteTrip(tripToDelete.id);
      if (result.success) {
        setSuccessMessage(`Trajet ${tripToDelete.ville_depart} → ${tripToDelete.ville_arrivee} supprimé avec succès`);
        loadTrips();
        closeDeleteModal();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la suppression du trajet');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelTrip = async (tripId) => {
    setCanceling(true);
    try {
      const result = await adminService.cancelTrip(tripId);
      if (result.success) {
        setSuccessMessage('Trajet annulé avec succès');
        loadTrips();
        closeModal();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.message || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      setErrorMessage('Erreur lors de l\'annulation du trajet');
    } finally {
      setCanceling(false);
    }
  };

  const handleReactivateTrip = async (tripId) => {
    setReactivating(true);
    try {
      const result = await adminService.reactivateTrip(tripId);
      if (result.success) {
        setSuccessMessage('Trajet réactivé avec succès');
        loadTrips();
        closeModal();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.message || 'Erreur lors de la réactivation');
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la réactivation du trajet');
    } finally {
      setReactivating(false);
    }
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

  const getTripStatus = (trip) => {
    if (trip.statut === 'annule') {
      return {
        label: 'Annulé',
        color: 'bg-red-100 text-red-800',
        icon: FaTimesCircle
      };
    } else if (trip.statut === 'termine') {
      return {
        label: 'Terminé',
        color: 'bg-gray-100 text-gray-800',
        icon: FaCheckCircle
      };
    } else {
      return {
        label: 'Actif',
        color: 'bg-green-100 text-green-800',
        icon: FaCheckCircle
      };
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Trajets</h1>
          <p className="text-gray-600 mt-1">
            Gestion des trajets avec photos réelles et actions fonctionnelles
          </p>
        </div>
        <button
          onClick={loadTrips}
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
            placeholder="Rechercher par ville, conducteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Liste des trajets */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
              {filteredTrips.map((trip) => {
                const status = getTripStatus(trip);
                const StatusIcon = status.icon;
                
                return (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <FaRoute className="text-indigo-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {trip.ville_depart} → {trip.ville_arrivee}
                          </div>
                          <div className="text-sm text-gray-500">ID: {trip.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getUserPhotoUrl(trip.conducteur?.photo_profil)}
                          alt={`${trip.conducteur?.prenom} ${trip.conducteur?.nom}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.svg';
                          }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {trip.conducteur?.prenom} {trip.conducteur?.nom}
                          </div>
                          <div className="text-sm text-gray-500">{trip.conducteur?.email}</div>
                          {trip.conducteur?.telephone && (
                            <div className="mt-1 flex items-center space-x-1">
                              <span className="text-green-500">📞</span>
                              <a
                                href={`tel:${trip.conducteur.telephone}`}
                                className="text-green-600 hover:text-green-800 font-medium text-xs"
                                title={`Appeler ${trip.conducteur.prenom}`}
                              >
                                {trip.conducteur.telephone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {formatDate(trip.date_depart)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaClock className="mr-2 text-gray-400" />
                          {formatTime(trip.heure_depart)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaEuroSign className="mr-2 text-gray-400" />
                          {trip.prix} DH
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaUsers className="mr-2 text-gray-400" />
                          {trip.places_disponibles} places
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(trip)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                        >
                          <FaEye />
                          <span>Consulter</span>
                        </button>
                        <button
                          onClick={() => openDeleteModal(trip)}
                          className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        >
                          <FaTrash />
                          <span>Supprimer</span>
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
          <div className="text-center py-12">
            <FaRoute className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun trajet trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showModal && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails du trajet #{selectedTrip.id}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Informations du trajet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Départ</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTrip.ville_depart}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Arrivée</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTrip.ville_arrivee}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedTrip.date_depart)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Heure</label>
                    <p className="mt-1 text-sm text-gray-900">{formatTime(selectedTrip.heure_depart)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTrip.prix} DH</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Places disponibles</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTrip.places_disponibles}</p>
                  </div>
                </div>

                {/* Informations du conducteur */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Conducteur</h3>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={getUserPhotoUrl(selectedTrip.conducteur?.photo_profil)}
                      alt={`${selectedTrip.conducteur?.prenom} ${selectedTrip.conducteur?.nom}`}
                      className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/default-avatar.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {selectedTrip.conducteur?.prenom} {selectedTrip.conducteur?.nom}
                      </h4>
                      <p className="text-sm text-gray-600">{selectedTrip.conducteur?.email}</p>
                      {selectedTrip.conducteur?.telephone && (
                        <p className="text-sm text-gray-600">{selectedTrip.conducteur?.telephone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  {selectedTrip.statut === 'actif' && (
                    <button
                      onClick={() => handleCancelTrip(selectedTrip.id)}
                      disabled={canceling}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                    >
                      {canceling ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                      <span>Annuler le trajet</span>
                    </button>
                  )}

                  {selectedTrip.statut === 'annule' && (
                    <button
                      onClick={() => handleReactivateTrip(selectedTrip.id)}
                      disabled={reactivating}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {reactivating ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                      <span>Réactiver le trajet</span>
                    </button>
                  )}

                  <button
                    onClick={() => openDeleteModal(selectedTrip)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <FaTrash />
                    <span>Supprimer</span>
                  </button>

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
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && tripToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Confirmer la suppression
                </h2>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FaRoute className="text-2xl text-indigo-500" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {tripToDelete.ville_depart} → {tripToDelete.ville_arrivee}
                    </h3>
                    <p className="text-gray-600">{formatDate(tripToDelete.date_depart)}</p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaExclamationTriangle className="text-red-500" />
                    <h4 className="font-medium text-red-900">Attention !</h4>
                  </div>
                  <p className="text-sm text-red-700">
                    Cette action est irréversible. Le trajet et toutes les réservations associées 
                    seront définitivement supprimés.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteTrip}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Suppression...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      <span>Supprimer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsManagementImproved;
