import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaUser, FaCar } from 'react-icons/fa';
import reservationService from '../services/reservationService';
import tripService from '../services/tripService';
import { useAuth } from '../contexts/AuthContext';

const ReservationDebugTest = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState({});

  const loadTrips = async () => {
    try {
      setLoading(true);
      const result = await tripService.getAllTrips();
      if (result.success) {
        setTrips(result.data || []);
        console.log('🚗 Trajets chargés:', result.data);
      } else {
        setError('Erreur lors du chargement des trajets');
      }
    } catch (error) {
      console.error('❌ Erreur chargement trajets:', error);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const testReservation = async (trip) => {
    setLoading(true);
    setError('');
    setSuccess('');
    setDebugInfo({});

    try {
      console.log('🔍 Test de réservation pour le trajet:', trip);
      console.log('👤 Utilisateur connecté:', user);

      const reservationData = {
        trajet_id: trip.id,
        nombre_places: 1,
        message: 'Test de réservation depuis debug'
      };

      console.log('📋 Données de réservation:', reservationData);

      setDebugInfo({
        user: user,
        trip: trip,
        reservationData: reservationData,
        userRole: user?.role,
        isVoyageur: user?.role === 'voyageur'
      });

      // Test avec le service principal
      console.log('🎫 Tentative avec reservationService.createReservation...');
      const result = await reservationService.createReservation(reservationData);
      
      console.log('📤 Résultat de la réservation:', result);

      if (result.success) {
        setSuccess('Réservation créée avec succès !');
        setDebugInfo(prev => ({
          ...prev,
          result: result,
          success: true
        }));
      } else {
        setError(result.message || 'Erreur lors de la réservation');
        setDebugInfo(prev => ({
          ...prev,
          result: result,
          success: false,
          errors: result.errors
        }));

        // Test avec fetch direct si échec
        console.log('🔄 Tentative avec fetch direct...');
        const directResult = await reservationService.createReservationDirect(reservationData);
        console.log('📤 Résultat fetch direct:', directResult);
        
        setDebugInfo(prev => ({
          ...prev,
          directResult: directResult
        }));

        if (directResult.success) {
          setSuccess('Réservation créée avec fetch direct !');
          setError('');
        }
      }
    } catch (error) {
      console.error('💥 Erreur lors du test:', error);
      setError(`Erreur: ${error.message}`);
      setDebugInfo(prev => ({
        ...prev,
        error: error.message,
        stack: error.stack
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🔍 Test Debug - Réservation de Trajets
        </h1>

        {/* Informations utilisateur */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-blue-900 mb-2">👤 Utilisateur connecté</h2>
          {user ? (
            <div className="text-sm text-blue-700">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nom:</strong> {user.prenom} {user.nom}</p>
              <p><strong>Rôle:</strong> {user.role}</p>
              <p><strong>Peut réserver:</strong> {user.role === 'voyageur' ? '✅ Oui' : '❌ Non (doit être voyageur)'}</p>
            </div>
          ) : (
            <p className="text-red-600">Aucun utilisateur connecté</p>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FaTimesCircle className="text-red-500" />
              <h3 className="font-medium text-red-900">Erreur</h3>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FaCheckCircle className="text-green-500" />
              <h3 className="font-medium text-green-900">Succès</h3>
            </div>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Informations de debug */}
        {Object.keys(debugInfo).length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">🔧 Informations de Debug</h3>
            <details className="mb-3">
              <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                Voir données complètes
              </summary>
              <pre className="mt-2 p-3 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Liste des trajets */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">🚗 Trajets disponibles pour test</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-2xl text-indigo-600" />
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : trips.length > 0 ? (
            <div className="space-y-4">
              {trips.slice(0, 5).map((trip) => (
                <div key={trip.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {trip.ville_depart} → {trip.ville_arrivee}
                        </h4>
                        <span className="text-lg font-bold text-indigo-600">
                          {trip.prix} MAD
                        </span>
                        <span className="text-sm text-gray-500">
                          {trip.places_disponibles} places
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p><strong>Date:</strong> {trip.date_depart} à {trip.heure_depart}</p>
                        <p><strong>Conducteur:</strong> {trip.conducteur?.prenom} {trip.conducteur?.nom}</p>
                        <p><strong>ID Trajet:</strong> {trip.id}</p>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <button
                        onClick={() => testReservation(trip)}
                        disabled={loading || !user || user.role !== 'voyageur' || trip.places_disponibles === 0}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                        <span>Tester Réservation</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-yellow-600">
              <FaTimesCircle />
              <span>Aucun trajet trouvé</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-900 mb-2">📝 Instructions</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>1. Connectez-vous comme voyageur (test@voyageur.com)</li>
            <li>2. Sélectionnez un trajet avec des places disponibles</li>
            <li>3. Cliquez sur "Tester Réservation" pour diagnostiquer</li>
            <li>4. Vérifiez les logs dans la console et les informations de debug</li>
            <li>5. Comparez avec le comportement normal de l'application</li>
          </ul>
        </div>

        {/* Liens utiles */}
        <div className="mt-6 flex space-x-3">
          <a
            href="/trips"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaCar className="mr-2" />
            Liste Trajets
          </a>
          <a
            href="/my-reservations"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaCheckCircle className="mr-2" />
            Mes Réservations
          </a>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <FaUser className="mr-2" />
            Se connecter
          </a>
        </div>

        {/* Identifiants de test */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">🔑 Identifiants de Test :</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Voyageur :</strong> test@voyageur.com • <strong>Mot de passe :</strong> password</p>
            <p><strong>Conducteur :</strong> test@conducteur.com • <strong>Mot de passe :</strong> password</p>
            <p><strong>Admin :</strong> admin@covoitfacile.com • <strong>Mot de passe :</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDebugTest;
