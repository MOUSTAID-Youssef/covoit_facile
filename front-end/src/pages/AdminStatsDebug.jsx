import React, { useState, useEffect } from 'react';
import { FaPlay, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

const AdminStatsDebug = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const tests = [
    {
      id: 'direct-api',
      name: 'Test API Direct',
      description: 'Appel direct à l\'API sans service',
      test: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      }
    },
    {
      id: 'service-test',
      name: 'Test via AdminService',
      description: 'Appel via le service adminService',
      test: async () => {
        const adminService = (await import('../services/adminService')).default;
        return await adminService.getDashboardStats();
      }
    },
    {
      id: 'auth-check',
      name: 'Vérification Auth',
      description: 'Vérifier le token et l\'utilisateur',
      test: async () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          user: user,
          isAdmin: user?.role === 'admin'
        };
      }
    },
    {
      id: 'database-count',
      name: 'Test Comptage DB',
      description: 'Vérifier les comptages de base',
      test: async () => {
        const token = localStorage.getItem('token');
        
        // Test des endpoints individuels
        const endpoints = [
          '/api/admin/users',
          '/api/admin/trips', 
          '/api/admin/vehicles',
          '/api/admin/reservations'
        ];
        
        const results = {};
        
        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(`http://localhost:8000${endpoint}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              }
            });
            
            const data = response.data;
            const key = endpoint.split('/').pop();
            results[key] = {
              success: data.success,
              count: Array.isArray(data[key]) ? data[key].length : 0,
              data: data[key]?.slice(0, 2) // Premiers éléments pour debug
            };
          } catch (error) {
            results[endpoint] = {
              success: false,
              error: error.message
            };
          }
        }
        
        return results;
      }
    }
  ];

  const runTest = async (testId) => {
    setLoading(prev => ({ ...prev, [testId]: true }));
    
    try {
      const test = tests.find(t => t.id === testId);
      const result = await test.test();
      
      setResults(prev => ({
        ...prev,
        [testId]: {
          success: true,
          data: result,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [testId]: {
          success: false,
          error: error.message,
          details: error.response?.data || error,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testId]: false }));
    }
  };

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pause entre tests
    }
  };

  useEffect(() => {
    // Lancer automatiquement le test d'auth au chargement
    runTest('auth-check');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Debug Statistiques Admin</h1>
          <p className="text-gray-600">Diagnostic des problèmes de statistiques à zéro</p>
        </div>

        <div className="mb-6">
          <button
            onClick={runAllTests}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lancer tous les tests
          </button>
        </div>

        <div className="space-y-6">
          {tests.map((test) => {
            const result = results[test.id];
            const isLoading = loading[test.id];

            return (
              <div key={test.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-600">{test.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {result && (
                      <div className="flex items-center space-x-1">
                        {result.success ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaTimesCircle className="text-red-500" />
                        )}
                        <span className="text-xs text-gray-500">{result.timestamp}</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => runTest(test.id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlay />}
                    </button>
                  </div>
                </div>

                {result && (
                  <div className="mt-3">
                    {result.success ? (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <h4 className="font-medium text-green-800 mb-2">✅ Succès</h4>
                        <pre className="text-xs text-green-700 overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <h4 className="font-medium text-red-800 mb-2">❌ Erreur</h4>
                        <p className="text-sm text-red-700 mb-2">{result.error}</p>
                        {result.details && (
                          <pre className="text-xs text-red-600 overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Informations de debug */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Informations de debug</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>URL API:</strong> http://localhost:8000/api/admin/stats</p>
            <p><strong>Token présent:</strong> {localStorage.getItem('token') ? 'Oui' : 'Non'}</p>
            <p><strong>Utilisateur:</strong> {JSON.parse(localStorage.getItem('user') || '{}')?.email || 'Non connecté'}</p>
            <p><strong>Rôle:</strong> {JSON.parse(localStorage.getItem('user') || '{}')?.role || 'Aucun'}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">🔍 Instructions de debug:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Assurez-vous d'être connecté comme admin</li>
            <li>2. Vérifiez que le serveur Laravel fonctionne sur le port 8000</li>
            <li>3. Lancez tous les tests pour identifier le problème</li>
            <li>4. Vérifiez les logs de la console du navigateur</li>
            <li>5. Vérifiez les logs du serveur Laravel</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsDebug;
