import React, { useState } from 'react';
import { FaUsers, FaCar, FaRoute, FaClipboardList, FaSpinner, FaCheck, FaTimes, FaPlay } from 'react-icons/fa';
import adminService from '../services/adminService';

const AdminAPITest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedUserId, setSelectedUserId] = useState('');

  const testAPI = async (apiName, apiCall) => {
    setLoading(prev => ({ ...prev, [apiName]: true }));
    try {
      const result = await apiCall();
      setResults(prev => ({ ...prev, [apiName]: result }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [apiName]: { 
          success: false, 
          message: error.message,
          error: true 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [apiName]: false }));
    }
  };

  const testAllAPIs = async () => {
    await Promise.all([
      testAPI('stats', () => adminService.getDashboardStats()),
      testAPI('users', () => adminService.getUsers()),
      testAPI('trips', () => adminService.getTrips()),
      testAPI('vehicles', () => adminService.getVehicles()),
      testAPI('reservations', () => adminService.getReservations())
    ]);
  };

  const testUserUpdate = async () => {
    if (!selectedUserId) {
      alert('Veuillez sélectionner un utilisateur');
      return;
    }
    
    await testAPI('userUpdate', () => 
      adminService.updateUser(selectedUserId, { badge_verifie: true })
    );
  };

  const testUserBlock = async () => {
    if (!selectedUserId) {
      alert('Veuillez sélectionner un utilisateur');
      return;
    }
    
    await testAPI('userBlock', () => 
      adminService.blockUser(selectedUserId)
    );
  };

  const getStatusIcon = (result) => {
    if (!result) return <FaSpinner className="animate-spin text-gray-400" />;
    if (result.error) return <FaTimes className="text-red-500" />;
    if (result.success) return <FaCheck className="text-green-500" />;
    return <FaTimes className="text-red-500" />;
  };

  const getStatusText = (result) => {
    if (!result) return 'Non testé';
    if (result.error) return 'Erreur';
    if (result.success) return 'Succès';
    return 'Échec';
  };

  const apis = [
    { key: 'stats', name: 'Statistiques Dashboard', icon: FaUsers },
    { key: 'users', name: 'Liste des Utilisateurs', icon: FaUsers },
    { key: 'trips', name: 'Liste des Trajets', icon: FaRoute },
    { key: 'vehicles', name: 'Liste des Véhicules', icon: FaCar },
    { key: 'reservations', name: 'Liste des Réservations', icon: FaClipboardList }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Test APIs Admin - Interactivité Base de Données</h1>
          <button
            onClick={testAllAPIs}
            disabled={Object.values(loading).some(l => l)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <FaPlay />
            <span>Tester Toutes les APIs</span>
          </button>
        </div>

        {/* Statut des APIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {apis.map((api) => {
            const Icon = api.icon;
            const result = results[api.key];
            const isLoading = loading[api.key];
            
            return (
              <div key={api.key} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="text-indigo-500" />
                    <span className="font-medium text-gray-900">{api.name}</span>
                  </div>
                  {isLoading ? (
                    <FaSpinner className="animate-spin text-blue-500" />
                  ) : (
                    getStatusIcon(result)
                  )}
                </div>
                <p className="text-sm text-gray-600">{getStatusText(result)}</p>
                {result && result.success && (
                  <p className="text-xs text-green-600 mt-1">
                    {result.data ? 
                      (Array.isArray(result.data) ? `${result.data.length} éléments` : 'Données chargées') :
                      'Succès'
                    }
                  </p>
                )}
                {result && result.error && (
                  <p className="text-xs text-red-600 mt-1">{result.message}</p>
                )}
                <button
                  onClick={() => testAPI(api.key, () => {
                    switch(api.key) {
                      case 'stats': return adminService.getDashboardStats();
                      case 'users': return adminService.getUsers();
                      case 'trips': return adminService.getTrips();
                      case 'vehicles': return adminService.getVehicles();
                      case 'reservations': return adminService.getReservations();
                      default: return Promise.resolve({ success: false });
                    }
                  })}
                  disabled={isLoading}
                  className="mt-2 text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 disabled:opacity-50"
                >
                  Tester
                </button>
              </div>
            );
          })}
        </div>

        {/* Tests d'actions utilisateur */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-3">Tests d'Actions Utilisateur</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Utilisateur à tester:
              </label>
              <input
                type="number"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                placeholder="Ex: 1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={testUserUpdate}
                disabled={loading.userUpdate || !selectedUserId}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading.userUpdate ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                <span>Vérifier Utilisateur</span>
              </button>
              
              <button
                onClick={testUserBlock}
                disabled={loading.userBlock || !selectedUserId}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading.userBlock ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                <span>Bloquer Utilisateur</span>
              </button>
            </div>
            
            <div className="text-sm">
              <div className="mb-2">
                <span className="font-medium">Vérification: </span>
                <span className={results.userUpdate?.success ? 'text-green-600' : 'text-gray-500'}>
                  {results.userUpdate?.success ? 'Succès' : 'Non testé'}
                </span>
              </div>
              <div>
                <span className="font-medium">Blocage: </span>
                <span className={results.userBlock?.success ? 'text-green-600' : 'text-gray-500'}>
                  {results.userBlock?.success ? 'Succès' : 'Non testé'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Données des utilisateurs */}
        {results.users && results.users.success && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Utilisateurs de la Base de Données</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.users.data.slice(0, 10).map((user) => (
                  <div key={user.id} className="bg-white p-3 rounded border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.prenom} {user.nom} (ID: {user.id})
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          {user.role} • {user.statut} • 
                          {user.badge_verifie ? ' Vérifié' : ' Non vérifié'}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedUserId(user.id.toString())}
                        className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                      >
                        Sélectionner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">Instructions de test :</h3>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Cliquez sur "Tester Toutes les APIs" pour vérifier la connectivité</li>
            <li>2. Vérifiez que toutes les APIs retournent des données réelles</li>
            <li>3. Sélectionnez un utilisateur et testez les actions de modification</li>
            <li>4. Allez sur <code>/admin</code> pour utiliser le dashboard complet</li>
            <li>5. Toutes les données doivent être synchronisées avec la base de données</li>
          </ol>
        </div>

        {/* Liens rapides */}
        <div className="mt-6 flex space-x-4">
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Dashboard Admin Complet
          </a>
          <a
            href="/test-admin"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Test Admin Simple
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminAPITest;
