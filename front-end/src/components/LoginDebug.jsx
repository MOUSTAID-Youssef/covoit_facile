import React, { useState } from 'react';
import authService from '../services/authService';

function LoginDebug() {
  const [email, setEmail] = useState('admin@covoitfacile.ma');
  const [password, setPassword] = useState('password');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    console.log('🚀 Début du test de connexion');
    
    try {
      const loginResult = await authService.login({ email, password });
      console.log('📊 Résultat de la connexion:', loginResult);
      setResult(loginResult);
    } catch (error) {
      console.error('💥 Erreur lors du test:', error);
      setResult({
        success: false,
        message: 'Erreur lors du test: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🔗 Test direct de l\'API');
      
      const response = await fetch('http://localhost:8000/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('📊 Réponse API directe:', data);
      setResult(data);
    } catch (error) {
      console.error('💥 Erreur API directe:', error);
      setResult({
        success: false,
        message: 'Erreur API directe: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const checkDatabase = async () => {
    try {
      const response = await fetch('http://localhost:8000/check-db');
      const data = await response.json();
      console.log('🗄️ État de la base de données:', data);
      alert('Vérifiez la console pour voir l\'état de la base de données');
    } catch (error) {
      console.error('💥 Erreur vérification DB:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Debug Authentification</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Test...' : 'Test avec AuthService'}
          </button>
          
          <button
            type="button"
            onClick={testDirectAPI}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Test API Direct
          </button>
          
          <button
            type="button"
            onClick={checkDatabase}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Vérifier DB
          </button>
        </div>
      </form>

      {result && (
        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h3 className="font-bold mb-2">
            {result.success ? '✅ Succès' : '❌ Échec'}
          </h3>
          
          <div className="text-sm space-y-2">
            <p><strong>Message:</strong> {result.message}</p>
            
            {result.user && (
              <div>
                <strong>Utilisateur:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
                  {JSON.stringify(result.user, null, 2)}
                </pre>
              </div>
            )}
            
            {result.token && (
              <p><strong>Token:</strong> {result.token.substring(0, 20)}...</p>
            )}
            
            {result.errors && Object.keys(result.errors).length > 0 && (
              <div>
                <strong>Erreurs:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
                  {JSON.stringify(result.errors, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold mb-2">Instructions:</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Ouvrez la console du navigateur (F12)</li>
          <li>Cliquez sur "Vérifier DB" pour voir l'état de la base</li>
          <li>Testez avec "Test API Direct" pour vérifier le backend</li>
          <li>Testez avec "Test avec AuthService" pour vérifier le frontend</li>
          <li>Regardez les logs dans la console pour diagnostiquer</li>
        </ol>
      </div>
    </div>
  );
}

export default LoginDebug;
