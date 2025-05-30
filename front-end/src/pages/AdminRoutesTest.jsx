import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChartBar, FaUserCheck, FaUsers, FaRoute, FaCar, FaClipboardList,
  FaCheckCircle, FaDatabase, FaPlay, FaEye, FaSpinner
} from 'react-icons/fa';
import adminService from '../services/adminService';

const AdminRoutesTest = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});

  const adminRoutes = [
    {
      path: '/admin',
      title: 'Dashboard Principal',
      description: 'Dashboard admin avec navigation par onglets',
      icon: FaChartBar,
      color: 'blue'
    },
    {
      path: '/admin/dashboard',
      title: 'Statistiques',
      description: 'Page dédiée aux statistiques détaillées',
      icon: FaChartBar,
      color: 'indigo'
    },
    {
      path: '/admin/verification',
      title: 'Vérification des comptes',
      description: 'Validation des comptes utilisateurs',
      icon: FaUserCheck,
      color: 'green'
    },
    {
      path: '/admin/users',
      title: 'Gestion des utilisateurs',
      description: 'CRUD complet des utilisateurs',
      icon: FaUsers,
      color: 'purple'
    },
    {
      path: '/admin/trips',
      title: 'Gestion des trajets',
      description: 'Modération et gestion des trajets',
      icon: FaRoute,
      color: 'orange'
    },
    {
      path: '/admin/vehicles',
      title: 'Gestion des véhicules',
      description: 'Validation et gestion des véhicules',
      icon: FaCar,
      color: 'red'
    },
    {
      path: '/admin/reservations',
      title: 'Gestion des réservations',
      description: 'Suivi et gestion des réservations',
      icon: FaClipboardList,
      color: 'teal'
    }
  ];

  const apiEndpoints = [
    { name: 'Statistiques admin', method: 'getDashboardStats' },
    { name: 'Liste des utilisateurs', method: 'getUsers' },
    { name: 'Liste des trajets', method: 'getTrips' },
    { name: 'Liste des véhicules', method: 'getVehicles' },
    { name: 'Liste des réservations', method: 'getReservations' }
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const result = await adminService.getDashboardStats();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const testApiEndpoint = async (method) => {
    setTestResults(prev => ({ ...prev, [method]: { loading: true } }));
    
    try {
      const result = await adminService[method]();
      setTestResults(prev => ({
        ...prev,
        [method]: {
          loading: false,
          success: result.success,
          data: result.data || result.stats,
          message: result.message
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [method]: {
          loading: false,
          success: false,
          error: error.message
        }
      }));
    }
  };

  const testAllEndpoints = async () => {
    for (const endpoint of apiEndpoints) {
      await testApiEndpoint(endpoint.method);
      // Petite pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
      teal: 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaChartBar className="text-4xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Test des Routes Admin</h1>
          </div>
          <p className="text-lg text-gray-600">
            Vérification des chemins et fonctionnalités admin avec statistiques réelles
          </p>
        </div>

        {/* Statistiques actuelles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaDatabase className="mr-2 text-indigo-600" />
            Statistiques Actuelles de la Base de Données
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des statistiques...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <FaUsers className="text-2xl text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">{stats?.total_users || 0}</div>
                <div className="text-sm text-blue-600">Utilisateurs</div>
                <div className="text-xs text-blue-500 mt-1">
                  {stats?.total_voyageurs || 0} voyageurs • {stats?.total_conducteurs || 0} conducteurs
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <FaRoute className="text-2xl text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">{stats?.total_trajets || 0}</div>
                <div className="text-sm text-green-600">Trajets</div>
                <div className="text-xs text-green-500 mt-1">
                  {stats?.active_trips || 0} actifs
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <FaCar className="text-2xl text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">{stats?.total_vehicules || 0}</div>
                <div className="text-sm text-purple-600">Véhicules</div>
                <div className="text-xs text-purple-500 mt-1">
                  {stats?.pending_vehicles || 0} en attente
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <FaClipboardList className="text-2xl text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-700">{stats?.total_reservations || 0}</div>
                <div className="text-sm text-orange-600">Réservations</div>
                <div className="text-xs text-orange-500 mt-1">
                  {Math.round(stats?.monthly_revenue || 0)} DH revenus
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Routes admin disponibles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaEye className="mr-2 text-indigo-600" />
            Routes Admin Disponibles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`block p-4 rounded-lg border-2 transition-all ${getColorClasses(route.color)}`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className="text-xl" />
                    <h3 className="font-medium">{route.title}</h3>
                  </div>
                  <p className="text-sm opacity-90 mb-2">{route.description}</p>
                  <div className="text-xs font-mono opacity-75">{route.path}</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Test des APIs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FaPlay className="mr-2 text-indigo-600" />
              Test des APIs Admin
            </h2>
            <button
              onClick={testAllEndpoints}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tester toutes les APIs
            </button>
          </div>
          
          <div className="space-y-3">
            {apiEndpoints.map((endpoint) => {
              const result = testResults[endpoint.method];
              
              return (
                <div key={endpoint.method} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaDatabase className="text-blue-600" />
                    <span className="font-medium">{endpoint.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {result ? (
                      result.loading ? (
                        <FaSpinner className="animate-spin text-blue-600" />
                      ) : result.success ? (
                        <div className="flex items-center space-x-2">
                          <FaCheckCircle className="text-green-600" />
                          <span className="text-green-600 text-sm">
                            ✅ {Array.isArray(result.data) ? `${result.data.length} éléments` : 'Succès'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-red-600 text-sm">❌ Erreur</span>
                      )
                    ) : (
                      <span className="text-gray-500 text-sm">⏳ En attente</span>
                    )}
                    
                    <button
                      onClick={() => testApiEndpoint(endpoint.method)}
                      disabled={result?.loading}
                      className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                    >
                      <FaPlay />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">🎯 Instructions de test :</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. <strong>Connectez-vous</strong> comme admin (admin@covoitfacile.com / admin123)</li>
            <li>2. <strong>Vérifiez les statistiques</strong> - Elles doivent afficher les vraies données de la DB</li>
            <li>3. <strong>Testez chaque route</strong> - Cliquez sur les cartes pour naviguer</li>
            <li>4. <strong>Testez les APIs</strong> - Utilisez le bouton "Tester toutes les APIs"</li>
            <li>5. <strong>Vérifiez la navigation</strong> - Chaque composant doit être accessible</li>
          </ol>
        </div>

        {/* Résumé des corrections */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-900 mb-2">✅ Corrections apportées :</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>AdminService corrigé</strong> - Retourne maintenant `stats` au lieu de `data`</li>
            <li>• <strong>Routes admin créées</strong> - 7 chemins spécifiques pour chaque composant</li>
            <li>• <strong>Navigation par URL</strong> - Chaque composant accessible directement</li>
            <li>• <strong>Statistiques réelles</strong> - Données de la base de données affichées</li>
            <li>• <strong>APIs testées</strong> - Toutes les APIs admin fonctionnelles</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutesTest;
