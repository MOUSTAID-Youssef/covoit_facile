import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import tripService from '../services/tripService';

const TripTest = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [myTrips, setMyTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [testTripData, setTestTripData] = useState({
    ville_depart: 'Casablanca',
    ville_arrivee: 'Rabat',
    date_depart: '2024-12-25',
    heure_depart: '09:00',
    prix: 50,
    places_disponibles: 3,
    description: 'Trajet de test'
  });

  useEffect(() => {
    if (user) {
      loadAllTrips();
      if (user.role === 'conducteur') {
        loadMyTrips();
      }
    }
  }, [user]);

  const loadAllTrips = async () => {
    setLoading(true);
    try {
      console.log('🔍 Test GET /api/trips');
      const response = await tripService.getTrips();
      console.log('📥 Résultat:', response);
      
      setTrips(response.trips || []);
      setResult({
        type: 'get_all',
        success: response.success,
        message: response.success ? `${response.trips?.length || 0} trajets chargés` : response.message,
        data: response.trips
      });
    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        type: 'get_all',
        success: false,
        message: 'Erreur: ' + error.message,
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMyTrips = async () => {
    setLoading(true);
    try {
      console.log('🔍 Test GET /api/my-trips');
      const response = await tripService.getMyTrips();
      console.log('📥 Résultat:', response);
      
      setMyTrips(response.trips || []);
      setResult({
        type: 'get_my',
        success: response.success,
        message: response.success ? `${response.trips?.length || 0} de mes trajets chargés` : response.message,
        data: response.trips
      });
    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        type: 'get_my',
        success: false,
        message: 'Erreur: ' + error.message,
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  const testCreateTrip = async () => {
    setLoading(true);
    try {
      console.log('🔍 Test POST /api/trips avec:', testTripData);
      const response = await tripService.createTrip(testTripData);
      console.log('📤 Résultat:', response);
      
      setResult({
        type: 'create',
        success: response.success,
        message: response.success ? 'Trajet créé avec succès' : response.message,
        data: response.data,
        errors: response.errors
      });

      if (response.success) {
        // Recharger les trajets
        loadAllTrips();
        if (user.role === 'conducteur') {
          loadMyTrips();
        }
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        type: 'create',
        success: false,
        message: 'Erreur: ' + error.message,
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    try {
      console.log('🔗 Test direct de l\'API trips');
      const response = await fetch('http://localhost:8000/api/trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('📡 Réponse directe API:', data);
      
      setResult({
        type: 'direct',
        success: response.ok,
        message: response.ok ? 'API accessible' : 'Erreur API',
        data: data,
        status: response.status
      });
    } catch (error) {
      console.error('❌ Erreur API directe:', error);
      setResult({
        type: 'direct',
        success: false,
        message: 'Erreur: ' + error.message,
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestTripData(prev => ({
      ...prev,
      [name]: name === 'prix' || name === 'places_disponibles' ? Number(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test des Trajets</h1>
        
        {/* Informations utilisateur */}
        {user && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Utilisateur Connecté</h2>
            <div className="text-sm space-y-1">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rôle:</strong> {user.role}</p>
              <p><strong>Token présent:</strong> {localStorage.getItem('token') ? '✅ Oui' : '❌ Non'}</p>
            </div>
          </div>
        )}

        {/* Formulaire de test pour création */}
        {user?.role === 'conducteur' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Test Création de Trajet</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville de départ</label>
                <input
                  type="text"
                  name="ville_depart"
                  value={testTripData.ville_depart}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville d'arrivée</label>
                <input
                  type="text"
                  name="ville_arrivee"
                  value={testTripData.ville_arrivee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date_depart"
                  value={testTripData.date_depart}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <input
                  type="time"
                  name="heure_depart"
                  value={testTripData.heure_depart}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                <input
                  type="number"
                  name="prix"
                  value={testTripData.prix}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Places</label>
                <input
                  type="number"
                  name="places_disponibles"
                  value={testTripData.places_disponibles}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={testTripData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="2"
              />
            </div>
          </div>
        )}

        {/* Boutons de test */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={loadAllTrips}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test GET Tous les Trajets'}
          </button>
          
          {user?.role === 'conducteur' && (
            <>
              <button
                onClick={loadMyTrips}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Test en cours...' : 'Test GET Mes Trajets'}
              </button>
              <button
                onClick={testCreateTrip}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Test en cours...' : 'Test CREATE Trajet'}
              </button>
            </>
          )}
          
          <button
            onClick={testDirectAPI}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test API Direct'}
          </button>
        </div>

        {/* Résultats */}
        {result && (
          <div className={`p-4 rounded-md mb-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Succès' : '❌ Échec'} - Test {result.type.toUpperCase()}
            </h3>
            <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message}
            </p>
            
            {result.status && (
              <p className="text-sm mt-1 text-gray-600">
                <strong>Status HTTP:</strong> {result.status}
              </p>
            )}
            
            {result.data && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-900 mb-2">Données reçues :</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
            
            {result.errors && (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-900 mb-2">Erreurs :</p>
                <pre className="text-xs bg-red-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result.errors, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Affichage des trajets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tous les trajets */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Tous les Trajets ({trips.length})</h3>
            <div className="space-y-2 max-h-60 overflow-auto">
              {trips.map((trip, index) => (
                <div key={index} className="p-2 bg-white border border-yellow-300 rounded text-sm">
                  <p><strong>{trip.ville_depart} → {trip.ville_arrivee}</strong></p>
                  <p>{trip.date_depart} à {trip.heure_depart} - {trip.prix} MAD</p>
                  <p>Conducteur: {trip.conducteur?.prenom} {trip.conducteur?.nom}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mes trajets (si conducteur) */}
          {user?.role === 'conducteur' && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Mes Trajets ({myTrips.length})</h3>
              <div className="space-y-2 max-h-60 overflow-auto">
                {myTrips.map((trip, index) => (
                  <div key={index} className="p-2 bg-white border border-purple-300 rounded text-sm">
                    <p><strong>{trip.ville_depart} → {trip.ville_arrivee}</strong></p>
                    <p>{trip.date_depart} à {trip.heure_depart} - {trip.prix} MAD</p>
                    <p>Places: {trip.places_disponibles}/{trip.places_totales}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default TripTest;
