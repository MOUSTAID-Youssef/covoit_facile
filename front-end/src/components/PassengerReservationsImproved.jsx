import React, { useState, useEffect } from 'react';
import {
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope,
  FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle,
  FaCar, FaUsers, FaEuroSign, FaTimes
} from 'react-icons/fa';
import tripService from '../services/tripService';

const PassengerReservationsImproved = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [cancelingReservation, setCancelingReservation] = useState(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Chargement des réservations...');
      const result = await tripService.getMyReservations();
      console.log('📋 Résultat getMyReservations:', result);

      if (result.success) {
        const reservationsData = result.data || result.reservations || [];

        // Filtrer les réservations pour trajets expirés (les supprimer de la liste)
        const now = new Date();
        const activeReservations = reservationsData.filter(reservation => {
          const trip = reservation.trajet || reservation.trip || {};
          const tripDate = new Date(trip.date_depart);
          return tripDate >= now; // Garder seulement les réservations pour trajets futurs
        });

        console.log(`🗓️ Réservations filtrées: ${reservationsData.length} total, ${activeReservations.length} actives`);
        console.log('✅ Réservations chargées:', activeReservations);
        setReservations(activeReservations);
      } else {
        console.error('❌ Erreur service:', result.message);
        setError(result.message || 'Erreur lors du chargement des réservations');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des réservations:', error);
      setError('Erreur de connexion lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const getDriverPhotoUrl = (photoPath) => {
    if (!photoPath) return '/images/default-avatar.svg';
    
    // Si c'est déjà une URL complète
    if (photoPath.startsWith('http')) return photoPath;
    
    // Si c'est un chemin relatif qui commence par /
    if (photoPath.startsWith('/')) return photoPath;
    
    // Sinon, construire l'URL avec le storage Laravel
    return `http://localhost:8000/storage/${photoPath}`;
  };

  const getReservationStatus = (reservation) => {
    const trip = reservation.trajet || reservation.trip || {};
    const tripDate = new Date(trip.date_depart);
    const now = new Date();

    // Vérifier si le trajet est expiré
    if (tripDate < now) {
      return {
        label: 'Expiré',
        color: 'text-gray-600 bg-gray-50 border-gray-200',
        icon: FaTimesCircle
      };
    }

    if (reservation.statut === 'confirmee' || reservation.statut === 'accepte') {
      return {
        label: 'Acceptée',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: FaCheckCircle
      };
    } else if (reservation.statut === 'refuse' || reservation.statut === 'annulee') {
      return {
        label: 'Refusée',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: FaTimesCircle
      };
    } else {
      return {
        label: 'En attente',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: FaExclamationTriangle
      };
    }
  };

  const cancelReservation = async (reservationId) => {
    setCancelingReservation(reservationId);
    try {
      const result = await tripService.cancelReservation(reservationId);
      if (result.success) {
        setSuccessMessage('Réservation annulée avec succès');
        loadReservations(); // Recharger les réservations
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setError(result.message || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      setError('Erreur lors de l\'annulation de la réservation');
    } finally {
      setCancelingReservation(null);
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
      return timeString.substring(0, 5); // Format HH:MM
    } catch (error) {
      return 'Heure invalide';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
        <span className="ml-2 text-gray-600">Chargement de vos réservations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FaExclamationTriangle className="mx-auto text-4xl text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={loadReservations}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FaSpinner className="mr-2" />
          Réessayer
        </button>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
        <p className="text-gray-500">Vous n'avez pas encore effectué de réservation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Mes Réservations ({reservations.length})
        </h3>
        <button
          onClick={loadReservations}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FaSpinner className="mr-2" />
          Actualiser
        </button>
      </div>

      {/* Messages de succès */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <FaCheckCircle className="text-green-500" />
            <span className="font-medium text-green-900">Succès</span>
          </div>
          <p className="text-sm text-green-700 mt-1">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage('')}
            className="mt-2 text-xs text-green-600 hover:text-green-800"
          >
            Fermer
          </button>
        </div>
      )}

      <div className="grid gap-6">
        {reservations.map((reservation) => {
          const trip = reservation.trajet || reservation.trip || {};
          const driver = trip.conducteur || trip.driver || trip.user || {};
          const status = getReservationStatus(reservation);
          const StatusIcon = status.icon;

          return (
            <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Header avec statut */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-indigo-500" />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {trip.ville_depart || 'Départ non défini'} → {trip.ville_arrivee || 'Arrivée non définie'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Réservation #{reservation.id}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                    <StatusIcon className="mr-1" />
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Informations du trajet */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900 mb-3">Détails du trajet</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FaMapMarkerAlt className="text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Départ</p>
                          <p className="text-sm text-gray-600">{trip.ville_depart || 'Non défini'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <FaMapMarkerAlt className="text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Arrivée</p>
                          <p className="text-sm text-gray-600">{trip.ville_arrivee || 'Non définie'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <FaCalendarAlt className="text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Date</p>
                          <p className="text-sm text-gray-600">{formatDate(trip.date_depart)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <FaClock className="text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Heure</p>
                          <p className="text-sm text-gray-600">{formatTime(trip.heure_depart)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <FaEuroSign className="text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Prix</p>
                          <p className="text-sm text-gray-600">{trip.prix} DH</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <FaUsers className="text-orange-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Places réservées</p>
                          <p className="text-sm text-gray-600">{reservation.nombre_places} place(s)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations du conducteur */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900 mb-3">Conducteur</h5>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={getDriverPhotoUrl(driver.photo_profil)}
                        alt={`${driver.prenom} ${driver.nom}`}
                        className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.svg';
                        }}
                      />
                      <div className="flex-1">
                        <h6 className="font-medium text-gray-900">
                          {driver.prenom || 'Prénom'} {driver.nom || 'Nom'}
                        </h6>
                        <p className="text-sm text-gray-600">{driver.email || 'Email non disponible'}</p>
                        {driver.telephone && (
                          <p className="text-sm text-gray-600">{driver.telephone}</p>
                        )}
                        
                        {/* Statut de vérification du conducteur */}
                        <div className="mt-2">
                          {driver.cin_path && driver.badge_verifie === true ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FaCheckCircle className="mr-1" />
                              Vérifié
                            </span>
                          ) : driver.cin_path && !driver.badge_verifie ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <FaClock className="mr-1" />
                              En attente
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <FaTimesCircle className="mr-1" />
                              Non vérifié
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Informations du véhicule */}
                    {trip.vehicule && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaCar className="text-blue-600" />
                          <h6 className="font-medium text-blue-900">Véhicule</h6>
                        </div>
                        <p className="text-sm text-blue-700">
                          {trip.vehicule.marque} {trip.vehicule.modele}
                        </p>
                        <p className="text-sm text-blue-600">
                          {trip.vehicule.couleur} • {trip.vehicule.annee}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Réservé le {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    
                    <div className="flex space-x-3">
                      {/* Bouton d'annulation - seulement pour les réservations en attente ou acceptées et non expirées */}
                      {(reservation.statut === 'en_attente' || reservation.statut === 'accepte' || reservation.statut === 'confirmee') &&
                       new Date(trip.date_depart) > new Date() && (
                        <button
                          onClick={() => cancelReservation(reservation.id)}
                          disabled={cancelingReservation === reservation.id}
                          className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                        >
                          {cancelingReservation === reservation.id ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <FaTimes className="mr-2" />
                          )}
                          Annuler
                        </button>
                      )}

                      {driver.telephone && (
                        <a
                          href={`tel:${driver.telephone}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <FaPhone className="mr-2" />
                          Appeler
                        </a>
                      )}

                      <a
                        href={`mailto:${driver.email}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FaEnvelope className="mr-2" />
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PassengerReservationsImproved;
