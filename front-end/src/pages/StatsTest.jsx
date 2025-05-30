import React, { useState } from 'react';
import { FaPlay, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import AdminStats from './admin/AdminStats';

const StatsTest = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testStats = () => {
    setLoading(true);
    setError(null);
    
    // Simuler des données de test
    setTimeout(() => {
      const testData = {
        total_users: 150,
        total_voyageurs: 95,
        total_conducteurs: 55,
        total_trajets: 78,
        total_vehicules: 42,
        total_reservations: 234,
        pending_accounts: 12,
        active_users: 138,
        monthly_revenue: 15750,
        monthly_stats: [
          { month: 'Oct 2024', users: 25, trips: 15 },
          { month: 'Nov 2024', users: 32, trips: 18 },
          { month: 'Dec 2024', users: 28, trips: 22 },
          { month: 'Jan 2025', users: 35, trips: 25 },
          { month: 'Feb 2025', users: 30, trips: 20 },
          { month: 'Mar 2025', users: 40, trips: 28 }
        ]
      };
      
      setStats(testData);
      setLoading(false);
    }, 1000);
  };

  const clearStats = () => {
    setStats(null);
    setError(null);
  };

  const testError = () => {
    setLoading(true);
    setError(null);
    setStats(null);
    
    setTimeout(() => {
      setError('Erreur de test simulée');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test des Statistiques</h1>
            <p className="text-gray-600 mt-1">Test du composant AdminStats avec données simulées</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={testStats}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaPlay />}
              <span>Charger données test</span>
            </button>
            <button
              onClick={testError}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <FaTimes />
              <span>Tester erreur</span>
            </button>
            <button
              onClick={clearStats}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <span>Effacer</span>
            </button>
          </div>
        </div>

        {/* État actuel */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">État actuel :</h3>
          <div className="text-sm text-blue-700">
            {loading && (
              <div className="flex items-center space-x-2">
                <FaSpinner className="animate-spin" />
                <span>Chargement en cours...</span>
              </div>
            )}
            {!loading && !stats && !error && (
              <div className="flex items-center space-x-2">
                <FaTimes className="text-gray-500" />
                <span>Aucune donnée chargée</span>
              </div>
            )}
            {!loading && stats && (
              <div className="flex items-center space-x-2">
                <FaCheck className="text-green-500" />
                <span>Données chargées avec succès</span>
              </div>
            )}
            {!loading && error && (
              <div className="flex items-center space-x-2">
                <FaTimes className="text-red-500" />
                <span>Erreur : {error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Données actuelles */}
        {stats && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Données chargées :</h3>
            <pre className="text-xs text-gray-700 overflow-auto">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">Instructions :</h3>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. <strong>Charger données test</strong> - Simule des statistiques réelles</li>
            <li>2. <strong>Tester erreur</strong> - Simule une erreur de chargement</li>
            <li>3. <strong>Effacer</strong> - Remet à zéro pour tester l'état vide</li>
            <li>4. <strong>Observer</strong> - Le composant AdminStats ci-dessous</li>
          </ol>
        </div>
      </div>

      {/* Composant AdminStats */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Composant AdminStats :</h2>
        <AdminStats 
          stats={stats} 
          onRefresh={() => {
            console.log('Refresh demandé');
            testStats();
          }} 
        />
      </div>
    </div>
  );
};

export default StatsTest;
