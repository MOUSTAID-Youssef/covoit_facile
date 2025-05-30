import React, { useState, useEffect } from 'react';
import { FaPlay, FaSpinner, FaCheckCircle, FaTimesCircle, FaDatabase } from 'react-icons/fa';

const SimpleStatsTest = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);

  const testStats = async () => {
    setLoading(true);
    setError(null);
    setRawResponse(null);

    try {
      console.log('🔄 Test des statistiques admin...');
      
      // Récupérer le token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Aucun token trouvé. Veuillez vous connecter.');
      }

      console.log('🔑 Token trouvé:', token.substring(0, 20) + '...');

      // Appel direct à l'API
      const response = await fetch('http://localhost:8000/api/admin/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Réponse HTTP:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur HTTP:', errorText);
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('📊 Données reçues:', data);
      
      setRawResponse(data);

      if (data.success && data.stats) {
        setStats(data.stats);
        console.log('✅ Statistiques extraites:', data.stats);
      } else {
        throw new Error('Format de réponse invalide: ' + JSON.stringify(data));
      }

    } catch (err) {
      console.error('❌ Erreur lors du test:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Test automatique au chargement
    testStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Simple des Statistiques</h1>
          <p className="text-gray-600">Test direct de l'API admin/stats</p>
        </div>

        {/* Bouton de test */}
        <div className="mb-6">
          <button
            onClick={testStats}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Test en cours...</span>
              </>
            ) : (
              <>
                <FaPlay />
                <span>Tester les statistiques</span>
              </>
            )}
          </button>
        </div>

        {/* Résultats */}
        <div className="space-y-6">
          {/* Statut */}
          <div className="flex items-center justify-center space-x-2">
            {loading ? (
              <div className="flex items-center space-x-2 text-blue-600">
                <FaSpinner className="animate-spin" />
                <span>Test en cours...</span>
              </div>
            ) : error ? (
              <div className="flex items-center space-x-2 text-red-600">
                <FaTimesCircle />
                <span>Erreur détectée</span>
              </div>
            ) : stats ? (
              <div className="flex items-center space-x-2 text-green-600">
                <FaCheckCircle />
                <span>Statistiques chargées avec succès</span>
              </div>
            ) : (
              <div className="text-gray-500">En attente du test...</div>
            )}
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-800 mb-2">❌ Erreur</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Statistiques */}
          {stats && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-4">✅ Statistiques récupérées</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total_users || 0}</div>
                  <div className="text-sm text-gray-600">Utilisateurs</div>
                </div>
                
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.total_trajets || 0}</div>
                  <div className="text-sm text-gray-600">Trajets</div>
                </div>
                
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.total_vehicules || 0}</div>
                  <div className="text-sm text-gray-600">Véhicules</div>
                </div>
                
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.total_reservations || 0}</div>
                  <div className="text-sm text-gray-600">Réservations</div>
                </div>
              </div>

              <div className="text-sm text-green-700">
                <p><strong>Voyageurs:</strong> {stats.total_voyageurs || 0}</p>
                <p><strong>Conducteurs:</strong> {stats.total_conducteurs || 0}</p>
                <p><strong>Trajets actifs:</strong> {stats.active_trips || 0}</p>
                <p><strong>Vérifications en attente:</strong> {stats.pending_verifications || 0}</p>
                <p><strong>Véhicules en attente:</strong> {stats.pending_vehicles || 0}</p>
              </div>
            </div>
          )}

          {/* Réponse brute */}
          {rawResponse && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">📄 Réponse brute de l'API</h3>
              <pre className="text-xs text-gray-600 overflow-x-auto bg-white p-3 rounded border">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Informations de debug */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">🔍 Informations de debug</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>URL testée:</strong> http://localhost:8000/api/admin/stats</p>
            <p><strong>Token présent:</strong> {localStorage.getItem('token') ? 'Oui' : 'Non'}</p>
            <p><strong>Utilisateur connecté:</strong> {JSON.parse(localStorage.getItem('user') || '{}')?.email || 'Aucun'}</p>
            <p><strong>Rôle:</strong> {JSON.parse(localStorage.getItem('user') || '{}')?.role || 'Aucun'}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-900 mb-2">💡 Instructions</h3>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Assurez-vous d'être connecté comme admin (admin@covoitfacile.com / admin123)</li>
            <li>2. Vérifiez que le serveur Laravel fonctionne sur http://localhost:8000</li>
            <li>3. Cliquez sur "Tester les statistiques" pour lancer le test</li>
            <li>4. Si les statistiques sont à 0, vérifiez la base de données</li>
            <li>5. Consultez les logs de la console pour plus de détails</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SimpleStatsTest;
