import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TripCard from './TripCard';
import { FaSpinner } from 'react-icons/fa';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);

      console.log('🔄 Trips component - Chargement des trajets...');

      const response = await fetch('http://localhost:8000/api/trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Prendre seulement les 3 premiers trajets pour l'affichage sur la page d'accueil
          const limitedTrips = (data.trips || []).slice(0, 3).map(trip => ({
            id: trip.id,
            departure: trip.ville_depart,
            destination: trip.ville_arrivee,
            date: `${trip.date_depart} - ${trip.heure_depart}`,
            price: trip.prix,
            seats: trip.places_disponibles,
            driver: `${trip.conducteur?.prenom} ${trip.conducteur?.nom}`,
            driverPhoto: trip.conducteur?.photo_url || '/images/default-avatar.svg',
            verified: trip.conducteur?.badge_verifie
          }));
          setTrips(limitedTrips);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des trajets:', error);
      // En cas d'erreur, garder un tableau vide
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Trajets Disponibles</h2>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des trajets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Trajets Disponibles</h2>
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Aucun trajet disponible pour le moment</p>
            <p className="text-gray-500">Revenez plus tard ou créez votre propre trajet !</p>
          </div>
        )}
        <div className="text-center mt-8">
          <Link
            to="/search"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Voir plus de trajets →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Trips;