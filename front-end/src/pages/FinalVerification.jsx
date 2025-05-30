import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, FaTimes, FaSpinner, FaChartBar, FaUsers, FaCar, 
  FaRoute, FaClipboardList, FaDatabase, FaEye, FaSync
} from 'react-icons/fa';
import adminService from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';

const FinalVerification = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminService.getDashboardStats();
      if (result.success && result.stats) {
        setStats(result.stats);
      } else {
        setError('Erreur lors du chargement des statistiques');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const verificationItems = [
    {
      id: 'auth',
      title: 'Authentification Admin',
      description: 'Vérifier que l\'utilisateur est connecté comme admin',
      status: user?.role === 'admin' ? 'success' : 'error',
      details: user?.role === 'admin' ? 
        `✅ Connecté comme ${user.prenom} ${user.nom} (${user.role})` :
        `❌ Rôle actuel: ${user?.role || 'non connecté'}`
    },
    {
      id: 'api',
      title: 'API Statistiques',
      description: 'Vérifier que l\'API /admin/stats répond correctement',
      status: stats ? 'success' : (error ? 'error' : 'loading'),
      details: stats ? 
        '✅ API répond avec des données valides' :
        (error ? `❌ Erreur: ${error}` : '⏳ Chargement...')
    },
    {
      id: 'data',
      title: 'Données Non-Zéro',
      description: 'Vérifier que les statistiques ne sont pas toutes à zéro',
      status: stats ? (
        Object.values(stats).some(val => typeof val === 'number' && val > 0) ? 'success' : 'warning'
      ) : 'loading',
      details: stats ? (
        Object.values(stats).some(val => typeof val === 'number' && val > 0) ?
        '✅ Des données non-zéro sont présentes' :
        '⚠️ Toutes les statistiques sont à zéro'
      ) : '⏳ En attente des données...'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'warning':
        return <FaSpinner className="text-yellow-500" />;
      case 'error':
        return <FaTimes className="text-red-500" />;
      case 'loading':
        return <FaSpinner className="animate-spin text-blue-500" />;
      default:
        return <FaSpinner className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'loading':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const allSuccess = verificationItems.every(item => item.status === 'success');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaDatabase className="text-2xl text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vérification Finale</h1>
              <p className="text-gray-600">Diagnostic complet du problème des statistiques</p>
            </div>
          </div>
          <button
            onClick={loadStats}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            <span>Recharger</span>
          </button>
        </div>

        {/* Résumé global */}
        <div className={`mb-6 p-4 rounded-lg border-2 ${
          allSuccess ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-3">
            {allSuccess ? (
              <FaCheckCircle className="text-green-500 text-2xl" />
            ) : (
              <FaSpinner className="text-yellow-500 text-2xl" />
            )}
            <div>
              <h2 className={`text-lg font-semibold ${
                allSuccess ? 'text-green-900' : 'text-yellow-900'
              }`}>
                {allSuccess ? '🎉 Problème résolu !' : '🔍 Diagnostic en cours...'}
              </h2>
              <p className={`text-sm ${
                allSuccess ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {allSuccess ? 
                  'Toutes les vérifications sont passées avec succès' :
                  'Certaines vérifications nécessitent votre attention'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Tests de vérification */}
        <div className="space-y-4 mb-6">
          {verificationItems.map((item) => (
            <div key={item.id} className={`border rounded-lg p-4 ${getStatusColor(item.status)}`}>
              <div className="flex items-center space-x-3">
                {getStatusIcon(item.status)}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm mt-1">{item.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistiques actuelles */}
        {stats && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Statistiques Actuelles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats).map(([key, value]) => {
                if (typeof value === 'object') return null;
                
                const isZero = value === 0;
                return (
                  <div key={key} className={`p-4 rounded-lg border ${
                    isZero ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className={`text-2xl font-bold ${
                      isZero ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {value}
                    </div>
                    {isZero && (
                      <div className="text-xs text-red-600 mt-1">⚠️ Zéro</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Solutions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">🔧 Solutions appliquées :</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✅ Correction de AdminDashboard.jsx : utilisation de result.stats au lieu de result.data</li>
            <li>✅ Ajout de total_vehicules dans l'API /admin/stats</li>
            <li>✅ Amélioration de la gestion d'erreurs avec logs détaillés</li>
            <li>✅ Correction des tableaux : suppression des scrollers verticaux</li>
            <li>✅ Ajout de données de test dans la base de données</li>
          </ul>
        </div>

        {/* Liens rapides */}
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaChartBar className="mr-2" />
            Dashboard Admin
          </a>
          <a
            href="/stats-test"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaEye className="mr-2" />
            Test API Simple
          </a>
          <a
            href="/test-database-connection"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FaDatabase className="mr-2" />
            Test Base de Données
          </a>
          <a
            href="/test-dashboard-functionality"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <FaUsers className="mr-2" />
            Test Fonctionnalités
          </a>
        </div>

        {/* Instructions finales */}
        {allSuccess && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-900 mb-2">🎉 Problème résolu !</h3>
            <p className="text-sm text-green-700">
              Les statistiques du dashboard admin affichent maintenant les vraies données de la base de données. 
              Vous pouvez retourner au dashboard admin pour voir les statistiques correctes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalVerification;
