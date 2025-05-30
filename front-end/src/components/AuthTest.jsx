import React, { useState } from 'react';
import authService from '../services/authService';

function AuthTest() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testAccounts = [
    { email: 'admin@covoitfacile.ma', password: 'password', role: 'admin' },
    { email: 'test@admin.com', password: 'password', role: 'admin' },
    { email: 'test@conducteur.com', password: 'password', role: 'conducteur' },
    { email: 'test@voyageur.com', password: 'password', role: 'voyageur' },
    { email: 'ahmed@test.com', password: 'password', role: 'conducteur' },
    { email: 'fatima@test.com', password: 'password', role: 'voyageur' },
  ];

  const testLogin = async (account) => {
    try {
      const result = await authService.login({
        email: account.email,
        password: account.password
      });

      if (result.success) {
        // Déconnexion immédiate pour le test
        await authService.logout();
        return {
          email: account.email,
          status: 'success',
          message: 'Connexion réussie',
          user: result.user
        };
      } else {
        return {
          email: account.email,
          status: 'error',
          message: result.message,
          errors: result.errors
        };
      }
    } catch (error) {
      return {
        email: account.email,
        status: 'error',
        message: error.message
      };
    }
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);
    
    const testResults = [];
    
    for (const account of testAccounts) {
      const result = await testLogin(account);
      testResults.push(result);
      setResults([...testResults]);
    }
    
    setLoading(false);
  };

  const testRegister = async () => {
    const testUser = {
      prenom: 'Test',
      nom: 'Inscription',
      email: `test.${Date.now()}@example.com`,
      password: 'password123',
      password_confirmation: 'password123',
      role: 'voyageur',
      genre: 'homme',
      date_naissance: '1990-01-01'
    };

    try {
      const result = await authService.register(testUser);
      
      if (result.success) {
        await authService.logout();
        setResults(prev => [...prev, {
          email: testUser.email,
          status: 'success',
          message: 'Inscription réussie',
          user: result.user
        }]);
      } else {
        setResults(prev => [...prev, {
          email: testUser.email,
          status: 'error',
          message: result.message,
          errors: result.errors
        }]);
      }
    } catch (error) {
      setResults(prev => [...prev, {
        email: testUser.email,
        status: 'error',
        message: error.message
      }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Test d'Authentification</h2>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={runTests}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Test en cours...' : 'Tester les connexions'}
        </button>
        
        <button
          onClick={testRegister}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Tester l'inscription
        </button>
        
        <button
          onClick={() => setResults([])}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Effacer
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.status === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{result.email}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  result.status === 'success' 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {result.status === 'success' ? '✅ Succès' : '❌ Échec'}
                </span>
              </div>
              {result.user && (
                <span className="text-sm text-gray-600">
                  {result.user.prenom} {result.user.nom} ({result.user.role})
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-700 mt-2">{result.message}</p>
            
            {result.errors && Object.keys(result.errors).length > 0 && (
              <div className="mt-2 text-sm text-red-600">
                {Object.entries(result.errors).map(([field, messages]) => (
                  <div key={field}>
                    <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">
          Cliquez sur "Tester les connexions" pour commencer les tests
        </div>
      )}
    </div>
  );
}

export default AuthTest;
