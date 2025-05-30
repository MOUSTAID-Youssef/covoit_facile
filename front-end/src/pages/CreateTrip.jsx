import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaMoneyBillWave, FaUsers, FaSpinner } from 'react-icons/fa';
import tripService from '../services/tripService';
import { useAuth } from '../contexts/AuthContext';

function CreateTrip() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
    'Meknès', 'Oujda', 'Tétouan', 'Safi', 'El Jadida', 'Nador'
  ];

  const [tripData, setTripData] = useState({
    departure: '',
    destination: '',
    date: '',
    time: '',
    price: '',
    seats: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Vérifier que l'utilisateur est connecté et est conducteur
      if (!user) {
        setErrors({ general: 'Vous devez être connecté pour créer un trajet' });
        return;
      }

      if (user.role !== 'conducteur') {
        setErrors({ general: 'Seuls les conducteurs peuvent créer des trajets' });
        return;
      }

      // Préparer les données pour l'API
      const apiData = {
        ville_depart: tripData.departure,
        ville_arrivee: tripData.destination,
        date_depart: tripData.date,
        heure_depart: tripData.time,
        prix: parseFloat(tripData.price),
        places_disponibles: parseInt(tripData.seats),
        description: tripData.description || null
      };

      console.log('🚗 Création du trajet avec les données:', apiData);

      // Utiliser fetch direct comme pour les autres appels qui fonctionnent
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

      const response = await fetch('http://localhost:8000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur HTTP:', response.status, errorData);
        setErrors(errorData.errors || { general: errorData.message || 'Erreur lors de la création du trajet' });
        return;
      }

      const result = await response.json();
      console.log('📤 Réponse de création:', result);

      if (result.success) {
        setSuccessMessage('Trajet créé avec succès !');
        console.log('✅ Trajet créé:', result.data);

        // Réinitialiser le formulaire
        setTripData({
          departure: '',
          destination: '',
          date: '',
          time: '',
          price: '',
          seats: '',
          description: ''
        });

        // Rediriger vers la page de recherche après 2 secondes pour voir le trajet
        setTimeout(() => {
          navigate('/search');
        }, 2000);
      } else {
        console.error('❌ Erreur lors de la création:', result);
        setErrors(result.errors || { general: result.message || 'Erreur lors de la création du trajet' });
      }
    } catch (error) {
      console.error('💥 Exception lors de la création:', error);
      setErrors({ general: 'Erreur lors de la création du trajet' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDc5LCA3MCwgMjI5LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-0 relative z-10">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Proposer un trajet
        </h2>

        <form onSubmit={handleSubmit} className="bg-white/90 shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-6 backdrop-blur-xl border border-white/20">
          {/* Messages d'erreur et de succès */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{errors.general}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="departure">
                <FaMapMarkerAlt className="text-indigo-600" />
                Ville de départ
              </label>
              <select
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base transition-all duration-300 hover:border-indigo-300 bg-white/80"
                id="departure"
                value={tripData.departure}
                onChange={(e) => setTripData({...tripData, departure: e.target.value})}
                required
              >
                <option value="">Sélectionnez une ville</option>
                {moroccanCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="destination">
                <FaMapMarkerAlt className="text-purple-600" />
                Ville d'arrivée
              </label>
              <select
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base transition-all duration-300 hover:border-indigo-300 bg-white/80"
                id="destination"
                value={tripData.destination}
                onChange={(e) => setTripData({...tripData, destination: e.target.value})}
                required
              >
                <option value="">Sélectionnez une ville</option>
                {moroccanCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="date">
                <FaCalendarAlt className="text-indigo-600" />
                Date
              </label>
              <input
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base transition-all duration-300 hover:border-indigo-300 bg-white/80"
                id="date"
                type="date"
                value={tripData.date}
                onChange={(e) => setTripData({...tripData, date: e.target.value})}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="time">
                <FaClock className="text-indigo-600" />
                Heure
              </label>
              <input
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base transition-all duration-300 hover:border-indigo-300 bg-white/80"
                id="time"
                type="time"
                value={tripData.time}
                onChange={(e) => setTripData({...tripData, time: e.target.value})}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="price">
                <FaMoneyBillWave className="text-indigo-600" />
                Prix par personne (MAD)
              </label>
              <input
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base transition-all duration-300 hover:border-indigo-300 bg-white/80"
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex: 200"
                value={tripData.price}
                onChange={(e) => setTripData({...tripData, price: e.target.value})}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="seats">
                <FaUsers className="text-indigo-600" />
                Nombre de places disponibles
              </label>
              <input
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base transition-all duration-300 hover:border-indigo-300 bg-white/80"
                id="seats"
                type="number"
                min="1"
                max="8"
                placeholder="Ex: 3"
                value={tripData.seats}
                onChange={(e) => setTripData({...tripData, seats: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Champ description */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description (optionnel)
            </label>
            <textarea
              className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base transition-all duration-300 hover:border-indigo-300 bg-white/80"
              id="description"
              rows="3"
              placeholder="Informations supplémentaires sur le trajet..."
              value={tripData.description}
              onChange={(e) => setTripData({...tripData, description: e.target.value})}
            />
          </div>

          <div className="flex items-center justify-center mt-6">
            <button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Création en cours...
                </>
              ) : (
                'Créer le trajet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTrip;