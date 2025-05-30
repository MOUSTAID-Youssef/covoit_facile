import { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
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

  useEffect(() => {
    loadTrips();
  }, []);

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
        setTrips(data.trips || []);
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
    // Recharger les trajets pour mettre à jour les places disponibles
    loadTrips();

    // Effacer le message après 5 secondes
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
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
      {successMessage && (
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

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trajets disponibles (Simple)</h2>
        <p className="text-gray-600">{trips.length} trajet{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}</p>
      </div>

      {trips.map(trip => (
        <div key={trip.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-lg font-semibold text-gray-900">
                  {trip.ville_depart} → {trip.ville_arrivee}
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {trip.prix} MAD
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Date:</span> {trip.date_depart}
                </div>
                <div>
                  <span className="font-medium">Heure:</span> {trip.heure_depart}
                </div>
                <div>
                  <span className="font-medium">Places:</span> {trip.places_disponibles} disponibles
                </div>
              </div>

              {trip.conducteur && (
                <div className="mt-3 flex items-center space-x-3">
                  <img
                    src={trip.conducteur.photo_url || '/images/default-avatar.svg'}
                    alt={`${trip.conducteur.prenom} ${trip.conducteur.nom}`}
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {trip.conducteur.prenom} {trip.conducteur.nom}
                    </span>
                    {trip.conducteur.badge_verifie && (
                      <span className="ml-2 text-green-600 text-xs">✓ Vérifié</span>
                    )}
                  </div>
                </div>
              )}

              {trip.vehicule && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Véhicule:</span> {trip.vehicule.marque} {trip.vehicule.modele}
                  {trip.vehicule.couleur && ` (${trip.vehicule.couleur})`}
                </div>
              )}

              {trip.description && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Description:</span> {trip.description}
                </div>
              )}
            </div>

            <div className="ml-6">
              <button
                onClick={() => handleReservation(trip)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={trip.places_disponibles === 0}
              >
                {trip.places_disponibles === 0 ? 'Complet' : 'Réserver'}
              </button>
            </div>
          </div>
        </div>
      ))}

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
