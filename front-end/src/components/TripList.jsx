import { useState, useEffect } from 'react';
import TripCard from './TripCard';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 TripList - Chargement des trajets...');

      // Utiliser fetch direct comme TripListSimple qui fonctionne
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
      console.error('💥 Exception lors du chargement:', error);
      setError('Erreur de connexion: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTripForCard = (trip) => {
    return {
      id: trip.id,
      departure: trip.ville_depart,
      destination: trip.ville_arrivee,
      date: trip.date_depart,
      time: trip.heure_depart,
      price: trip.prix,
      seatsAvailable: trip.places_disponibles,
      driverName: `${trip.conducteur.prenom} ${trip.conducteur.nom}`,
      driverPhoto: trip.conducteur.photo_url || '/images/default-avatar.svg',
      rating: 4.5, // À implémenter plus tard avec un système de notation
      verified: trip.conducteur.badge_verifie,
      description: trip.description,
      vehicule: trip.vehicule
    };
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Trajets disponibles</h2>
        <p className="text-gray-600">{trips.length} trajet{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}</p>
      </div>

      {trips.map(trip => (
        <TripCard key={trip.id} trip={formatTripForCard(trip)} />
      ))}
    </div>
  );
}

export default TripList;