import React, { useState, useEffect } from 'react';
import { FaImage, FaCheck, FaTimes, FaSpinner, FaUser } from 'react-icons/fa';
import Avatar from '../components/Avatar';
import adminService from '../services/adminService';

const AdminImageTest = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageTests, setImageTests] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getUsers();
      if (result.success) {
        setUsers(result.data.slice(0, 10)); // Prendre seulement 10 utilisateurs pour le test
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const testImageLoad = (userId, success) => {
    setImageTests(prev => ({
      ...prev,
      [userId]: success
    }));
  };

  const imagePaths = [
    { label: 'Avatar par défaut', path: '/images/default-avatar.png' },
    { label: 'Storage - Profile 1', path: 'profiles/profile_1_1748601614.png' },
    { label: 'Storage - Profile 2', path: 'profiles/profile_2_1748607255.jpg' },
    { label: 'URL complète', path: 'http://localhost:8000/storage/profiles/profile_1_1748601614.png' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test des Images - Dashboard Admin</h1>
            <p className="text-gray-600 mt-1">Vérification du chargement des avatars et images</p>
          </div>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <FaSpinner className={loading ? 'animate-spin' : ''} />
            <span>Recharger</span>
          </button>
        </div>

        {/* Test des chemins d'images */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test des chemins d'images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imagePaths.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar
                    src={item.path}
                    alt={item.label}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.label}</h3>
                    <p className="text-xs text-gray-500 break-all">{item.path}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test avec les vrais utilisateurs */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs réels de la base de données</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-2xl text-indigo-600 mr-2" />
              <span>Chargement des utilisateurs...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar
                      src={user.photo_url}
                      alt={`${user.prenom} ${user.nom}`}
                      size="lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{user.prenom} {user.nom}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">ID: {user.id}</p>
                    </div>
                    <div className="text-right">
                      {imageTests[user.id] === true && <FaCheck className="text-green-500" />}
                      {imageTests[user.id] === false && <FaTimes className="text-red-500" />}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs">
                      <span className="font-medium">Photo URL:</span>
                      <p className="text-gray-600 break-all">{user.photo_url || 'Aucune'}</p>
                    </div>
                    
                    {user.photo_url && (
                      <div className="flex space-x-2">
                        <img
                          src={`http://localhost:8000/storage/${user.photo_url}`}
                          alt="Test direct"
                          className="w-8 h-8 rounded border"
                          onLoad={() => testImageLoad(user.id, true)}
                          onError={() => testImageLoad(user.id, false)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations de débogage */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Informations de débogage :</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Backend URL:</strong> http://localhost:8000</p>
            <p><strong>Storage URL:</strong> http://localhost:8000/storage/</p>
            <p><strong>Frontend URL:</strong> http://localhost:5175</p>
            <p><strong>Images par défaut:</strong> /images/default-avatar.png</p>
          </div>
        </div>

        {/* Liens rapides */}
        <div className="mt-6 flex space-x-4">
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaUser className="mr-2" />
            Dashboard Admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminImageTest;
