import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

const ProfileTest = () => {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [testData, setTestData] = useState({
    prenom: 'Test',
    nom: 'Utilisateur',
    email: 'test@example.com',
    genre: 'homme',
    date_naissance: '1990-01-01'
  });

  useEffect(() => {
    if (authUser) {
      setTestData({
        prenom: authUser.prenom || 'Test',
        nom: authUser.nom || 'Utilisateur',
        email: authUser.email || 'test@example.com',
        genre: authUser.genre || 'homme',
        date_naissance: authUser.date_naissance || '1990-01-01'
      });
    }
  }, [authUser]);

  const testGetProfile = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔍 Test GET /api/profile');
      const response = await userService.getProfile();
      console.log('📥 Résultat:', response);
      
      setProfileData(response.data);
      setResult({
        type: 'get',
        success: response.success,
        message: response.success ? 'Profil chargé avec succès' : response.message,
        data: response.data
      });
    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        type: 'get',
        success: false,
        message: 'Erreur: ' + error.message,
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  const testUpdateProfile = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔄 Test PUT /api/profile avec:', testData);
      const response = await userService.updateProfile(testData);
      console.log('📤 Résultat:', response);
      
      if (response.success) {
        setProfileData(response.data);
      }
      
      setResult({
        type: 'update',
        success: response.success,
        message: response.success ? 'Profil mis à jour avec succès' : response.message,
        data: response.data,
        errors: response.errors
      });
    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        type: 'update',
        success: false,
        message: 'Erreur: ' + error.message,
        data: null
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
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8000/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('📡 Réponse directe API:', data);
      
      setResult({
        type: 'direct',
        success: response.ok,
        message: response.ok ? 'API accessible' : 'Erreur API',
        data: data,
        status: response.status
      });
    } catch (error) {
      console.error('❌ Erreur API directe:', error);
      setResult({
        type: 'direct',
        success: false,
        message: 'Erreur: ' + error.message,
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test du Profil Utilisateur</h1>
        
        {/* Informations utilisateur connecté */}
        {authUser && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Utilisateur Connecté</h2>
            <div className="text-sm space-y-1">
              <p><strong>ID:</strong> {authUser.id}</p>
              <p><strong>Email:</strong> {authUser.email}</p>
              <p><strong>Nom:</strong> {authUser.prenom} {authUser.nom}</p>
              <p><strong>Token présent:</strong> {localStorage.getItem('token') ? '✅ Oui' : '❌ Non'}</p>
            </div>
          </div>
        )}

        {/* Formulaire de test */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Données de Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={testData.prenom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="nom"
                value={testData.nom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={testData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select
                name="genre"
                value={testData.genre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionner</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                name="date_naissance"
                value={testData.date_naissance}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Boutons de test */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={testGetProfile}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test GET Profile'}
          </button>
          <button
            onClick={testUpdateProfile}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test UPDATE Profile'}
          </button>
          <button
            onClick={testDirectAPI}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test API Direct'}
          </button>
        </div>

        {/* Résultats */}
        {result && (
          <div className={`p-4 rounded-md mb-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Succès' : '❌ Échec'} - Test {result.type.toUpperCase()}
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
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
            
            {result.errors && (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-900 mb-2">Erreurs :</p>
                <pre className="text-xs bg-red-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result.errors, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Données du profil actuel */}
        {profileData && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Profil Actuel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Prénom:</strong> {profileData.prenom || 'Non défini'}</p>
                <p><strong>Nom:</strong> {profileData.nom || 'Non défini'}</p>
                <p><strong>Email:</strong> {profileData.email || 'Non défini'}</p>
              </div>
              <div>
                <p><strong>Genre:</strong> {profileData.genre || 'Non défini'}</p>
                <p><strong>Date de naissance:</strong> {profileData.date_naissance || 'Non défini'}</p>
                <p><strong>Photo URL:</strong> {profileData.photo_url || 'Non défini'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/profile"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Retour au profil
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileTest;
