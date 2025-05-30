import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner, FaExclamationTriangle, FaPlus, FaEdit, FaTrash, FaCar, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyTrips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === 'conducteur') {
      loadMyTrips();
    }
  }, [user]);

  const loadMyTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement de mes trajets...');
      
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      
      const response = await fetch('http://localhost:8000/api/my-trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Mes trajets chargés:', data);
      
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

  const deleteTrip = async (tripId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      
      const response = await fetch(`http://localhost:8000/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setTrips(trips.filter(trip => trip.id !== tripId));
        console.log('✅ Trajet supprimé');
      } else {
        console.error('❌ Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('💥 Erreur:', error);
    }
  };

  if (!user || user.role !== 'conducteur') {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Seuls les conducteurs peuvent accéder à cette page.</p>
          <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement de vos trajets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadMyTrips}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Trajets</h1>
            <p className="text-gray-600 mt-2">Gérez vos trajets en tant que conducteur</p>
          </div>
          <Link
            to="/create-trip"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <FaPlus />
            <span>Nouveau trajet</span>
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaCar className="text-6xl text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucun trajet créé</h2>
            <p className="text-gray-600 mb-6">Vous n'avez pas encore créé de trajet. Commencez dès maintenant !</p>
            <Link
              to="/create-trip"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
            >
              <FaPlus />
              <span>Créer mon premier trajet</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {trips.map(trip => (
              <div key={trip.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-indigo-500" />
                        <span>{trip.date_depart} à {trip.heure_depart}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaUsers className="text-indigo-500" />
                        <span>{trip.places_disponibles}/{trip.places_totales} places</span>
                      </div>
                      {trip.vehicule && (
                        <div className="flex items-center space-x-2">
                          <FaCar className="text-indigo-500" />
                          <span>{trip.vehicule.marque} {trip.vehicule.modele}</span>
                        </div>
                      )}
                    </div>
                    
                    {trip.description && (
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Description:</strong> {trip.description}
                      </div>
                    )}

                    {trip.reservations && trip.reservations.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Réservations:</h4>
                        <div className="space-y-1">
                          {trip.reservations.map((reservation, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                              <span>• {reservation.voyageur?.prenom} {reservation.voyageur?.nom}</span>
                              <span className="text-xs text-gray-500">({reservation.nb_places_reservees} place{reservation.nb_places_reservees > 1 ? 's' : ''})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => {/* TODO: Implémenter l'édition */}}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <FaEdit />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <FaTrash />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
