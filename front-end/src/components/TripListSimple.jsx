import { useState, useEffect } from 'react';
import {
  FaSpinner, FaExclamationTriangle, FaMapMarkerAlt, FaCalendarAlt,
  FaClock, FaUsers, FaCar, FaRoute, FaEuroSign, FaPhone, FaCheckCircle,
  FaArrowRight, FaStar, FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import ReservationModal from './ReservationModal';

function TripListSimple() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  // Fonctions utilitaires pour le formatage
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
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

  const getDriverPhotoUrl = (photoPath) => {
    if (!photoPath) return '/images/default-avatar.svg';
    if (photoPath.startsWith('http')) return photoPath;
    if (photoPath.startsWith('/')) return photoPath;
    return `http://localhost:8000/storage/${photoPath}`;
  };

  const formatPublicationDate = (trip) => {
    // Essayer d'abord created_at, puis updated_at, puis date_depart comme fallback
    const dateToUse = trip.created_at || trip.updated_at || trip.date_depart;

    if (!dateToUse) return 'Date non disponible';

    try {
      const date = new Date(dateToUse);
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return 'Date non disponible';
      }

      // Si on utilise date_depart, indiquer que c'est la date du trajet
      if (dateToUse === trip.date_depart && !trip.created_at) {
        return `Trajet prévu le ${date.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}`;
      }

      return `Publié le ${date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}`;
    } catch (error) {
      return 'Date non disponible';
    }
  };

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 TripListSimple - Chargement des trajets...');

      // Test direct avec fetch
      const response = await fetch('http://localhost:8000/api/trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Données reçues:', data);

      if (data.success) {
        // Debug: vérifier la structure des données
        if (data.trips && data.trips.length > 0) {
          console.log('🔍 Structure du premier trajet:', data.trips[0]);
          console.log('📅 Champs de date disponibles:', {
            created_at: data.trips[0].created_at,
            updated_at: data.trips[0].updated_at,
            date_depart: data.trips[0].date_depart
          });
        }

        // Filtrer les trajets expirés (date passée)
        const now = new Date();
        const activeTrips = (data.trips || []).filter(trip => {
          const tripDate = new Date(trip.date_depart);
          return tripDate >= now; // Garder seulement les trajets futurs
        });

        console.log(`🗓️ Trajets filtrés: ${data.trips?.length || 0} total, ${activeTrips.length} actifs`);
        setTrips(activeTrips);
      } else {
        setError(data.message || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('💥 Erreur lors du chargement:', error);
      setError('Erreur de connexion: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = (trip) => {
    if (!user) {
      alert('Vous devez être connecté pour réserver un trajet');
      return;
    }

    if (user.role !== 'voyageur') {
      alert('Seuls les voyageurs peuvent réserver des trajets');
      return;
    }

    if (trip.conducteur && trip.conducteur.id === user.id) {
      alert('Vous ne pouvez pas réserver votre propre trajet');
      return;
    }

    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleReservationSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    // Recharger les trajets pour mettre à jour les places disponibles
    loadTrips();
    // Masquer le message après 10 secondes
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage('');
    }, 10000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des trajets...</p>
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

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">Aucun trajet disponible pour le moment</p>
        <p className="text-gray-500">Revenez plus tard ou créez votre propre trajet !</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Message de succès */}
      {showSuccess && successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Trajets disponibles</h2>
          <p className="text-gray-600 flex items-center space-x-2">
            <FaRoute className="text-indigo-500" />
            <span>{trips.length} trajet{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}</span>
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <FaCalendarAlt />
            <span>Date</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaClock />
            <span>Heure</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaEuroSign />
            <span>Prix</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {trips.map(trip => (
          <div key={trip.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-white">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-lg font-bold">
                      <span>{trip.ville_depart}</span>
                      <FaArrowRight className="text-sm" />
                      <span>{trip.ville_arrivee}</span>
                    </div>
                    <p className="text-indigo-100 text-sm">Trajet #{trip.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-2xl font-bold text-white flex items-center space-x-1">
                      <FaEuroSign className="text-lg" />
                      <span>{trip.prix}</span>
                      <span className="text-sm font-normal">MAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <FaCalendarAlt className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Date</p>
                    <p className="text-sm font-bold text-blue-900">{formatDate(trip.date_depart)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-500 p-2 rounded-full">
                    <FaClock className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Heure</p>
                    <p className="text-sm font-bold text-green-900">{formatTime(trip.heure_depart)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <div className="bg-orange-500 p-2 rounded-full">
                    <FaUsers className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Places</p>
                    <p className="text-sm font-bold text-orange-900">
                      {trip.places_disponibles} disponible{trip.places_disponibles > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section conducteur */}
              {trip.conducteur && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={getDriverPhotoUrl(trip.conducteur.photo_profil || trip.conducteur.photo_url)}
                        alt={`${trip.conducteur.prenom} ${trip.conducteur.nom}`}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.svg';
                        }}
                      />
                      {trip.conducteur.badge_verifie && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                          <FaCheckCircle className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {trip.conducteur.prenom} {trip.conducteur.nom}
                        </h4>
                        {trip.conducteur.badge_verifie && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FaShieldAlt className="mr-1" />
                            Vérifié
                          </span>
                        )}
                      </div>
                      {trip.conducteur.telephone && (
                        <div className="flex items-center space-x-2">
                          <FaPhone className="text-green-500 text-sm" />
                          <a
                            href={`tel:${trip.conducteur.telephone}`}
                            className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
                            title={`Appeler ${trip.conducteur.prenom}`}
                          >
                            {trip.conducteur.telephone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section véhicule améliorée */}
              {trip.vehicule && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 p-2 rounded-full">
                      <FaCar className="text-white text-sm" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-1">Véhicule</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-medium text-blue-800">
                          {trip.vehicule.marque} {trip.vehicule.modele}
                        </span>
                        {trip.vehicule.couleur && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {trip.vehicule.couleur}
                          </span>
                        )}
                        {trip.vehicule.annee && (
                          <span className="text-blue-600 text-xs">
                            {trip.vehicule.annee}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {trip.description && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-100">
                  <h4 className="font-semibold text-yellow-900 mb-2 flex items-center space-x-2">
                    <FaStar className="text-yellow-500" />
                    <span>Note du conducteur</span>
                  </h4>
                  <p className="text-yellow-800 text-sm italic">"{trip.description}"</p>
                </div>
              )}

              {/* Bouton de réservation */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  {formatPublicationDate(trip)}
                </div>
                <button
                  onClick={() => handleReservation(trip)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                    trip.places_disponibles === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                  disabled={trip.places_disponibles === 0}
                >
                  {trip.places_disponibles === 0 ? (
                    <span className="flex items-center space-x-2">
                      <FaUsers />
                      <span>Complet</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <FaCheckCircle />
                      <span>Réserver maintenant</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de réservation */}
      <ReservationModal
        trip={selectedTrip}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleReservationSuccess}
      />
    </div>
  );
}

export default TripListSimple;
