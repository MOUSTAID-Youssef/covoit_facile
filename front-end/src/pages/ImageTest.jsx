import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ImageTest = () => {
  const { user } = useAuth();
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImageData();
  }, []);

  const fetchImageData = async () => {
    try {
      const response = await fetch('http://localhost:8000/debug-images');
      const data = await response.json();
      setImageData(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const testImageLoad = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const [imageTests, setImageTests] = useState({});

  const runImageTests = async () => {
    if (!imageData?.users_with_photos) return;

    const tests = {};
    for (const userData of imageData.users_with_photos) {
      if (userData.photo_url_computed) {
        tests[userData.user_id] = await testImageLoad(userData.photo_url_computed);
      }
    }
    setImageTests(tests);
  };

  useEffect(() => {
    if (imageData) {
      runImageTests();
    }
  }, [imageData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test d'Affichage des Images</h1>
        
        {/* Informations utilisateur actuel */}
        {user && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Utilisateur Connecté</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Photo profil DB:</strong> {user.photo_profil || 'Aucune'}</p>
                <p><strong>Photo URL:</strong> {user.photo_url || 'Aucune'}</p>
              </div>
              <div className="text-center">
                <p className="mb-2"><strong>Image actuelle:</strong></p>
                <img
                  src={user.photo_url || '/images/default-avatar.svg'}
                  alt="Photo de profil"
                  className="w-24 h-24 rounded-full border-2 border-gray-200 mx-auto"
                  onError={(e) => {
                    console.log('Erreur de chargement image:', e.target.src);
                    e.target.src = '/images/default-avatar.svg';
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Informations de debug */}
        {imageData && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Informations de Stockage</h2>
              <div className="text-sm space-y-1">
                <p><strong>Storage Path:</strong> {imageData.storage_path}</p>
                <p><strong>Public Storage Path:</strong> {imageData.public_storage_path}</p>
                <p><strong>Storage Link Exists:</strong> {imageData.storage_link_exists ? '✅ Oui' : '❌ Non'}</p>
                <p><strong>Fichiers trouvés:</strong> {imageData.all_files_in_storage?.length || 0}</p>
              </div>
            </div>

            {/* Liste des fichiers */}
            {imageData.all_files_in_storage && imageData.all_files_in_storage.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Fichiers dans le stockage</h3>
                <ul className="text-sm space-y-1">
                  {imageData.all_files_in_storage.map((file, index) => (
                    <li key={index} className="text-green-700">📁 {file}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Utilisateurs avec photos */}
            {imageData.users_with_photos && imageData.users_with_photos.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Utilisateurs avec Photos</h3>
                <div className="space-y-4">
                  {imageData.users_with_photos.map((userData, index) => (
                    <div key={index} className="p-3 bg-white border border-yellow-300 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-sm space-y-1">
                          <p><strong>Email:</strong> {userData.email}</p>
                          <p><strong>Photo DB:</strong> {userData.photo_profil}</p>
                          <p><strong>URL Calculée:</strong> {userData.photo_url_computed}</p>
                          <p><strong>Fichier Existe:</strong> {userData.file_exists ? '✅ Oui' : '❌ Non'}</p>
                          <p><strong>Test Chargement:</strong> {
                            imageTests[userData.user_id] !== undefined 
                              ? (imageTests[userData.user_id] ? '✅ OK' : '❌ Échec')
                              : '⏳ En cours...'
                          }</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm mb-2"><strong>Aperçu:</strong></p>
                          <img
                            src={userData.photo_url_computed}
                            alt={`Photo de ${userData.email}`}
                            className="w-20 h-20 rounded-full border-2 border-gray-200 mx-auto"
                            onError={(e) => {
                              console.log('Erreur de chargement pour:', userData.email, e.target.src);
                              e.target.src = '/images/default-avatar.svg';
                            }}
                            onLoad={() => {
                              console.log('Image chargée avec succès pour:', userData.email);
                            }}
                          />
                          <div className="mt-2">
                            <a
                              href={userData.photo_url_computed}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Ouvrir dans un nouvel onglet
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test des URLs directes */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Test des URLs Directes</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p><strong>Image par défaut:</strong></p>
                  <img
                    src="/images/default-avatar.svg"
                    alt="Avatar par défaut"
                    className="w-16 h-16 rounded-full border-2 border-gray-200 inline-block ml-2"
                  />
                  <a
                    href="/images/default-avatar.svg"
                    target="_blank"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    Tester le lien
                  </a>
                </div>
                
                {imageData.all_files_in_storage && imageData.all_files_in_storage[0] && (
                  <div>
                    <p><strong>Premier fichier trouvé:</strong></p>
                    <img
                      src={`/storage/profiles/${imageData.all_files_in_storage[0].split('\\').pop().split('/').pop()}`}
                      alt="Test direct"
                      className="w-16 h-16 rounded-full border-2 border-gray-200 inline-block ml-2"
                      onError={(e) => {
                        console.log('Erreur test direct:', e.target.src);
                      }}
                    />
                    <a
                      href={`/storage/profiles/${imageData.all_files_in_storage[0].split('\\').pop().split('/').pop()}`}
                      target="_blank"
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      Tester le lien direct
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={fetchImageData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mr-4"
          >
            Actualiser les données
          </button>
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

export default ImageTest;
