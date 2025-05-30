import React, { useState, useEffect } from 'react';
import { FaUsers, FaCar, FaRoute, FaClipboardList, FaSync, FaCheck } from 'react-icons/fa';
import adminService from '../services/adminService';

const AdminTest = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testAdminAPI = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🧪 Test des APIs admin...');
      
      // Test des statistiques
      const statsResult = await adminService.getDashboardStats();
      console.log('📊 Statistiques:', statsResult);
      
      if (statsResult.success) {
        setStats(statsResult.data);
        setMessage('✅ APIs admin fonctionnelles !');
      } else {
        setMessage('❌ Erreur: ' + statsResult.message);
      }
      
      // Test des utilisateurs
      const usersResult = await adminService.getUsers();
      console.log('👥 Utilisateurs:', usersResult);
      
      if (usersResult.success) {
        setUsers(usersResult.data.slice(0, 5)); // Premiers 5 utilisateurs
      }
      
    } catch (error) {
      console.error('💥 Erreur test:', error);
      setMessage('❌ Erreur de connexion: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAdminAPI();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Test Dashboard Admin</h1>
          <button
            onClick={testAdminAPI}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            <span>Tester APIs</span>
          </button>
        </div>

        {/* Message de statut */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Statistiques */}
        {stats && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaUsers className="text-blue-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Utilisateurs</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total_users}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaRoute className="text-green-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Trajets</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total_trajets}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaCar className="text-purple-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Véhicules en attente</p>
                    <p className="text-xl font-bold text-gray-900">{stats.pending_vehicles}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaClipboardList className="text-orange-500 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Réservations</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total_reservations}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Utilisateurs */}
        {users.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Derniers utilisateurs</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div className="flex items-center">
                      <img
                        src={user.photo_url || '/default-avatar.png'}
                        alt=""
                        className="w-8 h-8 rounded-full border border-gray-200"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user.prenom} {user.nom}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'conducteur' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                      {user.badge_verifie && (
                        <FaCheck className="text-green-500 text-sm" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Instructions de test :</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Connectez-vous avec un compte admin</li>
            <li>2. Cliquez sur "Tester APIs" pour vérifier les connexions</li>
            <li>3. Vérifiez que les statistiques s'affichent</li>
            <li>4. Allez sur <code>/admin</code> pour le dashboard complet</li>
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
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;
