import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaUser, FaImage } from 'react-icons/fa';
import adminService from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';

const ReservationsPhotosDebugTest = () => {
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
      console.log('🔍 Test de chargement des réservations admin...');
      console.log('👤 Utilisateur connecté:', user);

      // Test de la méthode getReservations
      const result = await adminService.getReservations();
      console.log('📋 Résultat complet:', result);

      setDebugInfo({
        success: result.success,
        message: result.message,
        dataType: typeof result.data,
        dataLength: Array.isArray(result.data) ? result.data.length : 'Non array',
        rawData: result
      });

      if (result.success) {
        const reservationsData = result.data || [];
        setReservations(reservationsData);
        console.log('✅ Réservations définies:', reservationsData);
        
        // Analyser les photos
        reservationsData.forEach((reservation, index) => {
          console.log(`📋 Réservation ${index + 1}:`, {
            id: reservation.id,
            voyageur: {
              nom: `${reservation.voyageur?.prenom} ${reservation.voyageur?.nom}`,
              photo_profil: reservation.voyageur?.photo_profil,
              telephone: reservation.voyageur?.telephone
            },
            conducteur: {
              nom: `${reservation.trajet?.conducteur?.prenom} ${reservation.trajet?.conducteur?.nom}`,
              photo_profil: reservation.trajet?.conducteur?.photo_profil,
              telephone: reservation.trajet?.conducteur?.telephone
            }
          });
        });
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

  const getUserPhotoUrl = (photoPath) => {
    if (!photoPath) return '/images/default-avatar.svg';
    if (photoPath.startsWith('http')) return photoPath;
    if (photoPath.startsWith('/')) return photoPath;
    return `http://localhost:8000/storage/${photoPath}`;
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      testReservationsLoad();
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🔍 Test Debug - Photos Réservations Admin
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
            disabled={loading || !user || user.role !== 'admin'}
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
              </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Voyageur */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-3">
                        <FaUser className="inline mr-2" />
                        Voyageur
                      </h4>
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={getUserPhotoUrl(reservation.voyageur?.photo_profil)}
                          alt={`${reservation.voyageur?.prenom} ${reservation.voyageur?.nom}`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.svg';
                          }}
                        />
                        <div>
                          <p className="font-medium text-blue-900">
                            {reservation.voyageur?.prenom} {reservation.voyageur?.nom}
                          </p>
                          <p className="text-sm text-blue-700">{reservation.voyageur?.email}</p>
                          {reservation.voyageur?.telephone && (
                            <p className="text-sm text-blue-700">📞 {reservation.voyageur?.telephone}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
                        <strong>Photo path:</strong> {reservation.voyageur?.photo_profil || 'null'}
                      </div>
                    </div>

                    {/* Conducteur */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-3">
                        <FaUser className="inline mr-2" />
                        Conducteur
                      </h4>
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={getUserPhotoUrl(reservation.trajet?.conducteur?.photo_profil)}
                          alt={`${reservation.trajet?.conducteur?.prenom} ${reservation.trajet?.conducteur?.nom}`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.svg';
                          }}
                        />
                        <div>
                          <p className="font-medium text-green-900">
                            {reservation.trajet?.conducteur?.prenom} {reservation.trajet?.conducteur?.nom}
                          </p>
                          <p className="text-sm text-green-700">{reservation.trajet?.conducteur?.email}</p>
                          {reservation.trajet?.conducteur?.telephone && (
                            <p className="text-sm text-green-700">📞 {reservation.trajet?.conducteur?.telephone}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
                        <strong>Photo path:</strong> {reservation.trajet?.conducteur?.photo_profil || 'null'}
                      </div>
                    </div>
                  </div>

                  {/* Détails réservation */}
                  <div className="mt-4 p-3 bg-gray-100 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>ID:</strong> {reservation.id}
                      </div>
                      <div>
                        <strong>Statut:</strong> {reservation.statut}
                      </div>
                      <div>
                        <strong>Places:</strong> {reservation.nombre_places}
                      </div>
                      <div>
                        <strong>Trajet:</strong> {reservation.trajet?.ville_depart} → {reservation.trajet?.ville_arrivee}
                      </div>
                    </div>
                  </div>

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
              <FaTimesCircle />
              <span>Aucune réservation trouvée</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-900 mb-2">📝 Instructions</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>1. Connectez-vous comme admin (admin@covoitfacile.com)</li>
            <li>2. Assurez-vous d'avoir des réservations en base de données</li>
            <li>3. Cliquez sur "Tester le chargement" pour voir les détails</li>
            <li>4. Vérifiez les chemins des photos dans les données</li>
            <li>5. Comparez avec l'affichage dans la gestion des réservations</li>
          </ul>
        </div>

        {/* Liens utiles */}
        <div className="mt-6 flex space-x-3">
          <a
            href="/admin/reservations"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Gestion Réservations
          </a>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Se connecter admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPhotosDebugTest;
