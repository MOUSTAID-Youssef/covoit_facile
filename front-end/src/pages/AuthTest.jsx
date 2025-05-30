import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthTest = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleTestLogout = async () => {
    console.log('🧪 TEST: Début de la déconnexion...');
    console.log('👤 Utilisateur avant déconnexion:', user);
    console.log('🔐 État authentifié avant:', isAuthenticated);
    
    await logout();
    
    console.log('👤 Utilisateur après déconnexion:', user);
    console.log('🔐 État authentifié après:', isAuthenticated);
    
    // Attendre un peu pour voir les changements
    setTimeout(() => {
      console.log('⏰ Après 1 seconde:');
      console.log('👤 Utilisateur:', user);
      console.log('🔐 État authentifié:', isAuthenticated);
      navigate('/');
    }, 1000);
  };

  const checkLocalStorage = () => {
    console.log('💾 LocalStorage:');
    console.log('Token:', localStorage.getItem('auth_token'));
    console.log('User:', localStorage.getItem('user'));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test d'Authentification</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">État actuel:</h3>
            <p><strong>Authentifié:</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Utilisateur:</strong> {user ? `${user.prenom} ${user.nom} (${user.role})` : 'Aucun'}</p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleTestLogout}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              🚪 Test Déconnexion
            </button>
            
            <button
              onClick={checkLocalStorage}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              💾 Vérifier LocalStorage
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              🏠 Retour Accueil
            </button>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">Instructions:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Ouvrez la console du navigateur (F12)</li>
              <li>2. Cliquez sur "Test Déconnexion"</li>
              <li>3. Observez les logs dans la console</li>
              <li>4. Vérifiez si l'état change</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
