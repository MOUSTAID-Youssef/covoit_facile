import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle, FaEdit, FaTrash, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import tripManagementService from '../services/tripManagementService';
import EditTripModal from './EditTripModal';

const DriverTripsManagement = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [editingTrip, setEditingTrip] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Chargement des trajets du conducteur...');

      // Essayer d'abord avec le service
      let result = await tripManagementService.getMyTripsWithReservations();

      // Si ça échoue, essayer avec fetch direct
      if (!result.success) {
        console.log('🔄 Tentative avec fetch direct...');
        result = await tripManagementService.getMyTripsWithReservationsDirect();
      }

      if (result.success) {
        setTrips(result.trips || []);
      } else {
        setError(result.message || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('💥 Erreur lors du chargement:', error);
      setError('Erreur de connexion: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptReservation = async (reservationId) => {
    try {
      // Essayer d'abord avec le service
      let result = await tripManagementService.acceptReservation(reservationId);

      // Si ça échoue, essayer avec fetch direct
      if (!result.success) {
        result = await tripManagementService.acceptReservationDirect(reservationId);
      }

      if (result.success) {
        setSuccessMessage(result.message || 'Réservation acceptée avec succès');
        loadTrips(); // Recharger pour mettre à jour

        // Effacer le message après 3 secondes
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(result.message || 'Erreur lors de l\'acceptation');
      }
    } catch (error) {
      console.error('💥 Erreur:', error);
      alert('Erreur lors de l\'acceptation de la réservation');
    }
  };

  const handleRejectReservation = async (reservationId) => {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette réservation ?')) {
      return;
    }

    try {
      // Essayer d'abord avec le service
      let result = await tripManagementService.rejectReservation(reservationId);

      // Si ça échoue, essayer avec fetch direct
      if (!result.success) {
        result = await tripManagementService.rejectReservationDirect(reservationId);
      }

      if (result.success) {
        setSuccessMessage(result.message || 'Réservation refusée avec succès');
        loadTrips(); // Recharger pour mettre à jour

        // Effacer le message après 3 secondes
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(result.message || 'Erreur lors du refus');
      }
    } catch (error) {
      console.error('💥 Erreur:', error);
      alert('Erreur lors du refus de la réservation');
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible.')) {
      return;
    }

    try {
      const result = await tripManagementService.deleteTrip(tripId);

      if (result.success) {
        setSuccessMessage(result.message || 'Trajet supprimé avec succès');
        setTrips(trips.filter(trip => trip.id !== tripId));

        // Effacer le message après 3 secondes
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(result.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('💥 Erreur:', error);
      alert('Erreur lors de la suppression du trajet');
    }
  };



  const handleEditTrip = (trip) => {
    setEditingTrip(trip);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (message) => {
    setSuccessMessage(message || 'Trajet modifié avec succès');
    setIsEditModalOpen(false);
    setEditingTrip(null);
    loadTrips(); // Recharger pour mettre à jour

    // Effacer le message après 3 secondes
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTrip(null);
  };

  const getStatusBadge = (statut, trip) => {
    // Vérifier si le trajet est expiré
    const tripDate = new Date(trip.date_depart);
    const now = new Date();

    if (tripDate < now) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Expiré
        </span>
      );
    }

    const badges = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'accepte': 'bg-green-100 text-green-800',
      'confirmee': 'bg-green-100 text-green-800',
      'refuse': 'bg-red-100 text-red-800',
      'annulee': 'bg-red-100 text-red-800'
    };

    const labels = {
      'en_attente': 'En attente',
      'accepte': 'Acceptée',
      'confirmee': 'Acceptée',
      'refuse': 'Refusée',
      'annulee': 'Annulée'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[statut] || 'bg-gray-100 text-gray-800'}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  const getUserPhotoUrl = (photoPath) => {
    if (!photoPath) return '/images/default-avatar.svg';
    if (photoPath.startsWith('http')) return photoPath;
    if (photoPath.startsWith('/')) return photoPath;
    return `http://localhost:8000/storage/${photoPath}`;
  };

  // Fonctions de formatage des dates et heures
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Heure non définie';
    try {
      return timeString.substring(0, 5); // Format HH:MM
    } catch (error) {
      return 'Heure invalide';
    }
  };

  const formatDateTime = (dateString, timeString) => {
    const formattedDate = formatDate(dateString);
    const formattedTime = formatTime(timeString);
    return `${formattedDate} à ${formattedTime}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos trajets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadTrips}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message de succès */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCheck className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mes Trajets</h2>
        <p className="text-gray-600">{trips.length} trajet{trips.length > 1 ? 's' : ''}</p>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaMapMarkerAlt className="text-6xl text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-4">Aucun trajet créé</h3>
          <p className="text-gray-600 mb-6">Vous n'avez pas encore créé de trajet.</p>
          <a
            href="/create"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Créer un trajet</span>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md border border-gray-200">
              {/* En-tête du trajet */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="text-xl font-bold text-gray-900">
                        {trip.ville_depart} → {trip.ville_arrivee}
                      </div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {trip.prix} MAD
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        trip.statut === 'actif' ? 'bg-green-100 text-green-800' :
                        trip.statut === 'complet' ? 'bg-blue-100 text-blue-800' :
                        trip.statut === 'annule' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.statut}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <FaCalendarAlt className="text-blue-500" />
                          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Date & Heure</span>
                        </div>
                        <div className="text-sm font-semibold text-blue-900">
                          {formatDateTime(trip.date_depart, trip.heure_depart)}
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <FaUsers className="text-green-500" />
                          <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Places</span>
                        </div>
                        <div className="text-sm font-semibold text-green-900">
                          {trip.places_disponibles}/{trip.places_totales} disponibles
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <FaUsers className="text-orange-500" />
                        <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">Réservations</span>
                      </div>
                      <div className="text-sm font-semibold text-orange-900">
                        {trip.reservations?.length || 0} réservation{(trip.reservations?.length || 0) > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditTrip(trip)}
                      className="bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 transition-colors"
                      title="Modifier le trajet"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>

              {/* Réservations (toujours visibles) */}
              <div className="border-t border-gray-200 bg-gray-50 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Réservations ({trip.reservations?.length || 0})
                </h4>

                {!trip.reservations || trip.reservations.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">Aucune réservation pour ce trajet</p>
                ) : (
                  <div className="space-y-3">
                    {trip.reservations.map(reservation => {
                      const tripDate = new Date(trip.date_depart);
                      const now = new Date();
                      const isExpired = tripDate < now;

                      return (
                        <div key={reservation.id} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={getUserPhotoUrl(reservation.voyageur?.photo_profil || reservation.voyageur?.photo_url)}
                                alt={`${reservation.voyageur?.prenom} ${reservation.voyageur?.nom}`}
                                className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
                                onError={(e) => {
                                  e.target.src = '/images/default-avatar.svg';
                                }}
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {reservation.voyageur?.prenom} {reservation.voyageur?.nom}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {reservation.nombre_places} place{reservation.nombre_places > 1 ? 's' : ''}
                                </div>
                                {reservation.voyageur?.telephone && (
                                  <div className="mt-1 flex items-center space-x-1">
                                    <span className="text-green-500">📞</span>
                                    <a
                                      href={`tel:${reservation.voyageur.telephone}`}
                                      className="text-green-600 hover:text-green-800 font-medium text-xs"
                                      title={`Appeler ${reservation.voyageur.prenom}`}
                                    >
                                      {reservation.voyageur.telephone}
                                    </a>
                                  </div>
                                )}
                                {reservation.voyageur?.email && (
                                  <div className="mt-1 flex items-center space-x-1">
                                    <span className="text-blue-500">✉️</span>
                                    <a
                                      href={`mailto:${reservation.voyageur.email}`}
                                      className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                                      title={`Envoyer un email à ${reservation.voyageur.prenom}`}
                                    >
                                      {reservation.voyageur.email}
                                    </a>
                                  </div>
                                )}
                                {reservation.message && (
                                  <div className="text-sm text-gray-500 mt-1">
                                    "{reservation.message}"
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              {getStatusBadge(reservation.statut, trip)}

                              {reservation.statut === 'en_attente' && !isExpired && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleAcceptReservation(reservation.id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-1"
                                  >
                                    <FaCheck />
                                    <span>Accepter</span>
                                  </button>
                                  <button
                                    onClick={() => handleRejectReservation(reservation.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-1"
                                  >
                                    <FaTimes />
                                    <span>Refuser</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de modification */}
      <EditTripModal
        trip={editingTrip}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default DriverTripsManagement;
