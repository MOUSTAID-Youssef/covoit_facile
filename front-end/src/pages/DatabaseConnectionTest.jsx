import React, { useState, useEffect } from 'react';
import { 
  FaDatabase, FaUsers, FaCar, FaRoute, FaClipboardList, FaCheckCircle, 
  FaTimes, FaSpinner, FaChartBar, FaEye, FaSync
} from 'react-icons/fa';
import adminService from '../services/adminService';

const DatabaseConnectionTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});
  const [allData, setAllData] = useState({});

  const databaseTests = [
    {
      id: 'stats',
      name: 'Statistiques Dashboard',
      description: 'Vérifier que les statistiques sont calculées depuis la base de données',
      apiCall: () => adminService.getDashboardStats(),
      expectedFields: ['total_users', 'total_voyageurs', 'total_conducteurs', 'total_trajets', 'total_vehicules', 'total_reservations', 'co2_economise'],
      icon: FaChartBar,
      color: 'blue'
    },
    {
      id: 'users',
      name: 'Gestion des Utilisateurs',
      description: 'Vérifier que la liste des utilisateurs vient de la base avec relations',
      apiCall: () => adminService.getUsers(),
      expectedFields: ['id', 'prenom', 'nom', 'email', 'role', 'statut', 'photo_url', 'vehicules_count', 'trajets_count'],
      icon: FaUsers,
      color: 'indigo'
    },
    {
      id: 'trips',
      name: 'Gestion des Trajets',
      description: 'Vérifier que les trajets incluent les données conducteur et réservations',
      apiCall: () => adminService.getTrips(),
      expectedFields: ['id', 'ville_depart', 'ville_arrivee', 'conducteur', 'reservations_count', 'prix', 'statut'],
      icon: FaRoute,
      color: 'purple'
    },
    {
      id: 'vehicles',
      name: 'Gestion des Véhicules',
      description: 'Vérifier que les véhicules incluent les données propriétaire',
      apiCall: () => adminService.getVehicles(),
      expectedFields: ['id', 'marque', 'modele', 'user', 'statut_verification', 'nombre_places'],
      icon: FaCar,
      color: 'green'
    },
    {
      id: 'reservations',
      name: 'Gestion des Réservations',
      description: 'Vérifier que les réservations incluent voyageur et trajet',
      apiCall: () => adminService.getReservations(),
      expectedFields: ['id', 'voyageur', 'trajet', 'statut', 'nombre_places'],
      icon: FaClipboardList,
      color: 'teal'
    }
  ];

  const testAPI = async (test) => {
    setLoading(prev => ({ ...prev, [test.id]: true }));
    try {
      const result = await test.apiCall();
      
      if (result.success) {
        const data = result.data || result.stats || result.users || result.trips || result.vehicles || result.reservations;
        const hasExpectedFields = test.expectedFields.every(field => {
          if (Array.isArray(data) && data.length > 0) {
            return data[0].hasOwnProperty(field);
          } else if (typeof data === 'object' && data !== null) {
            return data.hasOwnProperty(field);
          }
          return false;
        });

        setTestResults(prev => ({
          ...prev,
          [test.id]: {
            success: true,
            hasData: Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0,
            dataCount: Array.isArray(data) ? data.length : Object.keys(data).length,
            hasExpectedFields,
            missingFields: test.expectedFields.filter(field => {
              if (Array.isArray(data) && data.length > 0) {
                return !data[0].hasOwnProperty(field);
              } else if (typeof data === 'object' && data !== null) {
                return !data.hasOwnProperty(field);
              }
              return true;
            })
          }
        }));

        setAllData(prev => ({ ...prev, [test.id]: data }));
      } else {
        setTestResults(prev => ({
          ...prev,
          [test.id]: { success: false, error: result.message || 'Erreur inconnue' }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [test.id]: { success: false, error: error.message }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [test.id]: false }));
    }
  };

  const testAllAPIs = async () => {
    for (const test of databaseTests) {
      await testAPI(test);
    }
  };

  useEffect(() => {
    testAllAPIs();
  }, []);

  const getStatusIcon = (result) => {
    if (!result) return <FaSpinner className="animate-spin text-gray-400" />;
    if (result.success && result.hasData && result.hasExpectedFields) {
      return <FaCheckCircle className="text-green-500" />;
    } else if (result.success && result.hasData) {
      return <FaCheckCircle className="text-yellow-500" />;
    } else {
      return <FaTimes className="text-red-500" />;
    }
  };

  const getStatusText = (result) => {
    if (!result) return 'Test en cours...';
    if (result.success && result.hasData && result.hasExpectedFields) {
      return 'Parfait';
    } else if (result.success && result.hasData) {
      return 'Données OK, champs manquants';
    } else if (result.success) {
      return 'Pas de données';
    } else {
      return 'Erreur';
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      teal: 'bg-teal-50 border-teal-200 text-teal-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaDatabase className="text-2xl text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test Connexion Base de Données</h1>
              <p className="text-gray-600">Vérification que tous les composants utilisent des données réelles</p>
            </div>
          </div>
          <button
            onClick={testAllAPIs}
            disabled={Object.values(loading).some(l => l)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <FaSync className={Object.values(loading).some(l => l) ? 'animate-spin' : ''} />
            <span>Retester Tout</span>
          </button>
        </div>

        {/* Résumé global */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {Object.values(testResults).filter(r => r?.success && r?.hasData && r?.hasExpectedFields).length}
            </div>
            <div className="text-sm font-medium text-green-800">APIs Parfaites</div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {Object.values(testResults).filter(r => r?.success && r?.hasData && !r?.hasExpectedFields).length}
            </div>
            <div className="text-sm font-medium text-yellow-800">Données OK, Champs Manquants</div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-700">
              {Object.values(testResults).filter(r => !r?.success || !r?.hasData).length}
            </div>
            <div className="text-sm font-medium text-red-800">Erreurs ou Pas de Données</div>
          </div>
        </div>

        {/* Tests détaillés */}
        <div className="space-y-4">
          {databaseTests.map((test) => {
            const result = testResults[test.id];
            const isLoading = loading[test.id];
            const Icon = test.icon;
            
            return (
              <div key={test.id} className={`border rounded-lg p-4 ${getColorClasses(test.color)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon className="text-xl" />
                    <div>
                      <h3 className="font-medium text-gray-900">{test.name}</h3>
                      <p className="text-sm text-gray-600">{test.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {isLoading ? (
                      <FaSpinner className="animate-spin text-blue-500" />
                    ) : (
                      getStatusIcon(result)
                    )}
                    <span className="text-sm font-medium">{getStatusText(result)}</span>
                    <button
                      onClick={() => testAPI(test)}
                      disabled={isLoading}
                      className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75 disabled:opacity-50"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
                
                {result && (
                  <div className="space-y-2 text-sm">
                    {result.success ? (
                      <>
                        <p><strong>✅ Connexion API:</strong> Réussie</p>
                        <p><strong>📊 Données:</strong> {result.hasData ? `${result.dataCount} éléments` : 'Aucune donnée'}</p>
                        <p><strong>🔧 Champs requis:</strong> {result.hasExpectedFields ? 'Tous présents' : `${result.missingFields?.length || 0} manquants`}</p>
                        {result.missingFields && result.missingFields.length > 0 && (
                          <p><strong>❌ Champs manquants:</strong> {result.missingFields.join(', ')}</p>
                        )}
                      </>
                    ) : (
                      <p><strong>❌ Erreur:</strong> {result.error}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Aperçu des données */}
        {Object.keys(allData).length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu des Données</h2>
            <div className="space-y-4">
              {Object.entries(allData).map(([key, data]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2 capitalize">{key}</h3>
                  <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                    {JSON.stringify(Array.isArray(data) ? data.slice(0, 2) : data, null, 2)}
                  </pre>
                  {Array.isArray(data) && data.length > 2 && (
                    <p className="text-xs text-gray-500 mt-2">... et {data.length - 2} autres éléments</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Vérifications effectuées :</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Connexion API:</strong> Vérifier que l'API répond correctement</li>
            <li>• <strong>Présence de données:</strong> S'assurer qu'il y a des données réelles</li>
            <li>• <strong>Structure des données:</strong> Vérifier que tous les champs requis sont présents</li>
            <li>• <strong>Relations:</strong> S'assurer que les relations entre tables sont chargées</li>
          </ul>
        </div>

        {/* Liens rapides */}
        <div className="mt-6 flex space-x-4">
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaUsers className="mr-2" />
            Dashboard Admin
          </a>
          <a
            href="/test-dashboard-functionality"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaCheckCircle className="mr-2" />
            Test Fonctionnalités
          </a>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConnectionTest;
