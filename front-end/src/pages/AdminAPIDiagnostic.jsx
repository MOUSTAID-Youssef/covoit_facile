import React, { useState } from 'react';
import { 
  FaCheckCircle, FaTimes, FaSpinner, FaExclamationTriangle, 
  FaDatabase, FaServer, FaWifi, FaCode
} from 'react-icons/fa';
import adminService from '../services/adminService';
import apiClient from '../config/axios';

const AdminAPIDiagnostic = () => {
  const [tests, setTests] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);

  const updateTest = (testName, status, data = null, error = null) => {
    setTests(prev => ({
      ...prev,
      [testName]: { status, data, error, timestamp: new Date().toLocaleTimeString() }
    }));
  };

  const testServerConnection = async () => {
    try {
      updateTest('server', 'loading');
      const response = await fetch('http://localhost:8000/api/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        updateTest('server', 'success', data);
        setServerInfo(data);
      } else {
        updateTest('server', 'error', null, `HTTP ${response.status}`);
      }
    } catch (error) {
      updateTest('server', 'error', null, error.message);
    }
  };

  const testAuthToken = async () => {
    try {
      updateTest('auth', 'loading');
      const token = localStorage.getItem('token');
      
      if (!token) {
        updateTest('auth', 'error', null, 'Aucun token trouvé');
        return;
      }

      const response = await apiClient.get('/user');
      updateTest('auth', 'success', response.data);
    } catch (error) {
      updateTest('auth', 'error', null, error.response?.data?.message || error.message);
    }
  };

  const testAdminStats = async () => {
    try {
      updateTest('stats', 'loading');
      const result = await adminService.getDashboardStats();
      
      if (result.success) {
        updateTest('stats', 'success', result.stats);
      } else {
        updateTest('stats', 'error', null, result.message);
      }
    } catch (error) {
      updateTest('stats', 'error', null, error.message);
    }
  };

  const testDirectAPI = async () => {
    try {
      updateTest('direct', 'loading');
      const response = await apiClient.get('/admin/stats');
      updateTest('direct', 'success', response.data);
    } catch (error) {
      updateTest('direct', 'error', null, error.response?.data?.message || error.message);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTests({});
    
    await testServerConnection();
    await testAuthToken();
    await testAdminStats();
    await testDirectAPI();
    
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'loading': return <FaSpinner className="animate-spin text-blue-500" />;
      case 'success': return <FaCheckCircle className="text-green-500" />;
      case 'error': return <FaTimes className="text-red-500" />;
      default: return <FaExclamationTriangle className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'loading': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaDatabase className="text-4xl text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Diagnostic API Admin</h1>
          </div>
          <p className="text-lg text-gray-600">
            Diagnostic complet de l'API pour résoudre l'erreur de chargement des statistiques
          </p>
        </div>

        {/* Bouton de test */}
        <div className="text-center mb-8">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FaDatabase />
            <span>{loading ? 'Tests en cours...' : 'Lancer tous les tests'}</span>
          </button>
        </div>

        {/* Résultats des tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Test connexion serveur */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(tests.server?.status)}`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(tests.server?.status)}
              <h3 className="font-semibold text-gray-900">1. Connexion Serveur</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Test de connexion au serveur Laravel</p>
            
            {tests.server?.status === 'success' && (
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-green-700">✅ Serveur accessible</p>
                {tests.server.data && (
                  <pre className="text-xs text-gray-600 mt-2">
                    {JSON.stringify(tests.server.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
            
            {tests.server?.status === 'error' && (
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-red-700">❌ {tests.server.error}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Vérifiez que le serveur Laravel est démarré sur http://localhost:8000
                </p>
              </div>
            )}
          </div>

          {/* Test authentification */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(tests.auth?.status)}`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(tests.auth?.status)}
              <h3 className="font-semibold text-gray-900">2. Authentification</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Vérification du token d'authentification</p>
            
            {tests.auth?.status === 'success' && (
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-green-700">✅ Token valide</p>
                {tests.auth.data?.user && (
                  <p className="text-xs text-gray-600 mt-1">
                    Connecté comme: {tests.auth.data.user.prenom} ({tests.auth.data.user.role})
                  </p>
                )}
              </div>
            )}
            
            {tests.auth?.status === 'error' && (
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-red-700">❌ {tests.auth.error}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Connectez-vous comme admin pour accéder aux statistiques
                </p>
              </div>
            )}
          </div>

          {/* Test service admin */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(tests.stats?.status)}`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(tests.stats?.status)}
              <h3 className="font-semibold text-gray-900">3. Service Admin</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Test via adminService.getDashboardStats()</p>
            
            {tests.stats?.status === 'success' && (
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-green-700">✅ Service fonctionnel</p>
                {tests.stats.data && (
                  <div className="text-xs text-gray-600 mt-2">
                    <p>Utilisateurs: {tests.stats.data.total_users}</p>
                    <p>Trajets: {tests.stats.data.total_trajets}</p>
                    <p>Véhicules: {tests.stats.data.total_vehicules}</p>
                  </div>
                )}
              </div>
            )}
            
            {tests.stats?.status === 'error' && (
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-red-700">❌ {tests.stats.error}</p>
              </div>
            )}
          </div>

          {/* Test API directe */}
          <div className={`p-6 rounded-lg border-2 ${getStatusColor(tests.direct?.status)}`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(tests.direct?.status)}
              <h3 className="font-semibold text-gray-900">4. API Directe</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Test direct de l'endpoint /admin/stats</p>
            
            {tests.direct?.status === 'success' && (
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-green-700">✅ API accessible</p>
                {tests.direct.data && (
                  <pre className="text-xs text-gray-600 mt-2 max-h-20 overflow-y-auto">
                    {JSON.stringify(tests.direct.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
            
            {tests.direct?.status === 'error' && (
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-red-700">❌ {tests.direct.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Informations système */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">ℹ️ Informations Système</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>URL API:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}</p>
              <p><strong>Token présent:</strong> {localStorage.getItem('token') ? '✅ Oui' : '❌ Non'}</p>
            </div>
            <div>
              <p><strong>Navigateur:</strong> {navigator.userAgent.split(' ')[0]}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Solutions suggérées */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-4">💡 Solutions Suggérées</h3>
          <div className="space-y-3 text-sm text-yellow-800">
            <div className="flex items-start space-x-2">
              <span className="font-bold">1.</span>
              <span>Vérifiez que le serveur Laravel est démarré : <code className="bg-yellow-100 px-1 rounded">php artisan serve</code></span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-bold">2.</span>
              <span>Connectez-vous comme admin avec : admin@covoitfacile.com / admin123</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-bold">3.</span>
              <span>Vérifiez que la route /admin/stats existe dans le backend</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-bold">4.</span>
              <span>Vérifiez les permissions admin dans le middleware</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAPIDiagnostic;
