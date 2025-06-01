import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import tripService from '../services/tripService';
import { useAuth } from '../contexts/AuthContext';

const ReservationsDebugTest = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState({});

  const testReservationsLoad = async () => {
    setLoading(true);
    setError('');
    setDebugInfo({});

    try {
      console.log('🔍 Test de chargement des réservations...');
      console.log('👤 Utilisateur connecté:', user);

      // Test de la méthode getMyReservations
      const result = await tripService.getMyReservations();
      console.log('📋 Résultat complet:', result);

      setDebugInfo({
        success: result.success,
        message: result.message,
        dataType: typeof result.data,
        dataLength: Array.isArray(result.data) ? result.data.length : 'Non array',
        reservationsType: typeof result.reservations,
        reservationsLength: Array.isArray(result.reservations) ? result.reservations.length : 'Non array',
        rawData: result
      });

      if (result.success) {
        const reservationsData = result.data || result.reservations || [];
        setReservations(reservationsData);
        console.log('✅ Réservations définies:', reservationsData);
      } else {
        setError(result.message || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      setError(`Erreur: ${error.message}`);
      setDebugInfo({
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      testReservationsLoad();
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🔍 Test Debug - Chargement des Réservations
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
            </div>
          ) : (
            <p className="text-red-600">Aucun utilisateur connecté</p>
          )}
        </div>

        {/* Bouton de test */}
        <div className="mb-6">
          <button
            onClick={testReservationsLoad}
            disabled={loading || !user}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
            <span>{loading ? 'Test en cours...' : 'Tester le chargement'}</span>
          </button>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FaTimesCircle className="text-red-500" />
              <h3 className="font-medium text-red-900">Erreur</h3>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Informations de debug */}
        {Object.keys(debugInfo).length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">🔧 Informations de Debug</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Success:</strong> 
                  <span className={debugInfo.success ? 'text-green-600' : 'text-red-600'}>
                    {debugInfo.success ? ' ✅ true' : ' ❌ false'}
                  </span>
                </div>
                <div>
                  <strong>Message:</strong> {debugInfo.message || 'Aucun'}
                </div>
                <div>
                  <strong>Type data:</strong> {debugInfo.dataType}
                </div>
                <div>
                  <strong>Longueur data:</strong> {debugInfo.dataLength}
                </div>
                <div>
                  <strong>Type reservations:</strong> {debugInfo.reservationsType}
                </div>
                <div>
                  <strong>Longueur reservations:</strong> {debugInfo.reservationsLength}
                </div>
              </div>
              
              {debugInfo.rawData && (
                <div className="mt-4">
                  <strong>Données brutes:</strong>
                  <pre className="mt-2 p-3 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                    {JSON.stringify(debugInfo.rawData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Résultats */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">📋 Réservations chargées</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-2xl text-indigo-600" />
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : reservations.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <FaCheckCircle />
                <span>{reservations.length} réservation(s) trouvée(s)</span>
              </div>
              
              {reservations.map((reservation, index) => (
                <div key={reservation.id || index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>ID:</strong> {reservation.id || 'Non défini'}
                    </div>
                    <div>
                      <strong>Statut:</strong> {reservation.statut || 'Non défini'}
                    </div>
                    <div>
                      <strong>Places:</strong> {reservation.nombre_places || 'Non défini'}
                    </div>
                    <div>
                      <strong>Trajet ID:</strong> {reservation.trajet_id || reservation.trip_id || 'Non défini'}
                    </div>
                  </div>
                  
                  {reservation.trajet && (
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <strong>Trajet:</strong> {reservation.trajet.ville_depart} → {reservation.trajet.ville_arrivee}
                    </div>
                  )}
                  
                  <details className="mt-3">
                    <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                      Voir données complètes
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                      {JSON.stringify(reservation, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-yellow-600">
              <FaExclamationTriangle />
              <span>Aucune réservation trouvée</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-900 mb-2">📝 Instructions</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>1. Connectez-vous comme voyageur (test@voyageur.com)</li>
            <li>2. Assurez-vous d'avoir des réservations en base de données</li>
            <li>3. Cliquez sur "Tester le chargement" pour voir les détails</li>
            <li>4. Vérifiez les informations de debug pour diagnostiquer les problèmes</li>
          </ul>
        </div>

        {/* Liens utiles */}
        <div className="mt-6 flex space-x-3">
          <a
            href="/profile"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Aller au profil
          </a>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReservationsDebugTest;
