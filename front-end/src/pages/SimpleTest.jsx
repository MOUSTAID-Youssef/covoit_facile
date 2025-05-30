import React, { useState } from 'react';

const SimpleTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔍 Test simple de l\'API trips');
      
      // Test 1: API directe sans axios
      const response = await fetch('http://localhost:8000/api/trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('📡 Status:', response.status);
      console.log('📡 Headers:', response.headers);
      
      const data = await response.json();
      console.log('📡 Data:', data);
      
      setResult({
        success: response.ok,
        status: response.status,
        data: data,
        message: response.ok ? 'API accessible' : 'Erreur API'
      });
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        success: false,
        message: 'Erreur: ' + error.message,
        error: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testBackend = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔍 Test backend debug');
      
      const response = await fetch('http://localhost:8000/debug-trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('📡 Debug data:', data);
      
      setResult({
        success: response.ok,
        status: response.status,
        data: data,
        message: response.ok ? 'Backend accessible' : 'Erreur backend'
      });
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        success: false,
        message: 'Erreur: ' + error.message,
        error: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testAxios = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔍 Test avec axios');
      
      // Import dynamique d'axios
      const axios = (await import('axios')).default;
      
      const response = await axios.get('http://localhost:8000/api/trips', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('📡 Axios response:', response.data);
      
      setResult({
        success: true,
        status: response.status,
        data: response.data,
        message: 'Axios fonctionne'
      });
      
    } catch (error) {
      console.error('❌ Erreur axios:', error);
      setResult({
        success: false,
        message: 'Erreur axios: ' + (error.response?.data?.message || error.message),
        error: error.toString(),
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Simple des Trajets</h1>
        
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={testAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test API Direct'}
          </button>
          
          <button
            onClick={testBackend}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test Backend Debug'}
          </button>
          
          <button
            onClick={testAxios}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test Axios'}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Succès' : '❌ Échec'}
            </h3>
            <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message}
            </p>
            
            {result.status && (
              <p className="text-sm mt-1 text-gray-600">
                <strong>Status HTTP:</strong> {result.status}
              </p>
            )}
            
            {result.data && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-900 mb-2">Données reçues :</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
            
            {result.error && (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-900 mb-2">Erreur détaillée :</p>
                <pre className="text-xs bg-red-100 p-2 rounded overflow-auto">
                  {result.error}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions de test :</h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li><strong>Test API Direct</strong> : Teste l'API /trips avec fetch natif</li>
            <li><strong>Test Backend Debug</strong> : Teste la route /debug-trips pour voir les données brutes</li>
            <li><strong>Test Axios</strong> : Teste avec la librairie axios utilisée par l'app</li>
          </ol>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">URLs à tester manuellement :</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              <a 
                href="http://localhost:8000/api/trips" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                http://localhost:8000/api/trips
              </a>
            </li>
            <li>
              <a 
                href="http://localhost:8000/debug-trips" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                http://localhost:8000/debug-trips
              </a>
            </li>
            <li>
              <a 
                href="http://localhost:8000/check-db" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                http://localhost:8000/check-db
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;
