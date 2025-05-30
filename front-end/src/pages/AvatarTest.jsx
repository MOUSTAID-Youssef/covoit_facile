import React from 'react';
import { FaUser, FaCheck, FaTimes } from 'react-icons/fa';
import Avatar from '../components/Avatar';

const AvatarTest = () => {
  const testCases = [
    {
      title: 'Avatar par défaut (aucune source)',
      src: null,
      expected: 'Doit afficher /images/default-avatar.svg'
    },
    {
      title: 'Avatar par défaut (source vide)',
      src: '',
      expected: 'Doit afficher /images/default-avatar.svg'
    },
    {
      title: 'Avatar par défaut (source undefined)',
      src: undefined,
      expected: 'Doit afficher /images/default-avatar.svg'
    },
    {
      title: 'Image SVG par défaut directe',
      src: '/images/default-avatar.svg',
      expected: 'Doit afficher le SVG par défaut'
    },
    {
      title: 'Image du storage Laravel',
      src: 'profiles/profile_1_1748601614.png',
      expected: 'Doit afficher depuis http://localhost:8000/storage/'
    },
    {
      title: 'URL complète',
      src: 'http://localhost:8000/storage/profiles/profile_1_1748601614.png',
      expected: 'Doit afficher l\'URL telle quelle'
    },
    {
      title: 'Image inexistante (test fallback)',
      src: 'profiles/inexistante.jpg',
      expected: 'Doit basculer vers l\'avatar par défaut'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test des Avatars</h1>
          <p className="text-gray-600">Vérification du composant Avatar et des images par défaut</p>
        </div>

        {/* Test de l'image par défaut directe */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Image par défaut directe</h2>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img 
              src="/images/default-avatar.svg" 
              alt="Avatar par défaut" 
              className="w-16 h-16 rounded-full border-2 border-gray-200"
            />
            <div>
              <p className="font-medium">Image SVG par défaut</p>
              <p className="text-sm text-gray-600">URL: /images/default-avatar.svg</p>
            </div>
          </div>
        </div>

        {/* Tests du composant Avatar */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tests du composant Avatar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testCases.map((test, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4 mb-3">
                  <Avatar
                    src={test.src}
                    alt={test.title}
                    size="lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{test.title}</h3>
                    <p className="text-xs text-gray-500 break-all">
                      Source: {test.src || 'null/undefined'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{test.expected}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Test des différentes tailles */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tailles d'avatars</h2>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Avatar src={null} size="xs" />
              <p className="text-xs mt-1">xs</p>
            </div>
            <div className="text-center">
              <Avatar src={null} size="sm" />
              <p className="text-xs mt-1">sm</p>
            </div>
            <div className="text-center">
              <Avatar src={null} size="md" />
              <p className="text-xs mt-1">md</p>
            </div>
            <div className="text-center">
              <Avatar src={null} size="lg" />
              <p className="text-xs mt-1">lg</p>
            </div>
            <div className="text-center">
              <Avatar src={null} size="xl" />
              <p className="text-xs mt-1">xl</p>
            </div>
            <div className="text-center">
              <Avatar src={null} size="2xl" />
              <p className="text-xs mt-1">2xl</p>
            </div>
          </div>
        </div>

        {/* Test avec images réelles */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images réelles du storage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'profiles/profile_1_1748601614.png',
              'profiles/profile_2_1748607255.jpg',
              'profiles/profile_11_1748607529.png'
            ].map((imagePath, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg text-center">
                <Avatar
                  src={imagePath}
                  alt={`Profile ${index + 1}`}
                  size="xl"
                  className="mx-auto mb-2"
                />
                <p className="text-sm font-medium">Profile {index + 1}</p>
                <p className="text-xs text-gray-500 break-all">{imagePath}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Informations techniques */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Informations techniques :</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Composant Avatar :</strong> /src/components/Avatar.jsx</p>
            <p><strong>Image par défaut :</strong> /images/default-avatar.svg</p>
            <p><strong>Storage Laravel :</strong> http://localhost:8000/storage/</p>
            <p><strong>Fallback automatique :</strong> En cas d'erreur de chargement</p>
          </div>
          
          <div className="mt-3">
            <h4 className="font-medium text-blue-900 mb-1">Logique du composant :</h4>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Si src est null/undefined/vide → avatar par défaut</li>
              <li>• Si src commence par http → utiliser tel quel</li>
              <li>• Si src commence par / → chemin relatif</li>
              <li>• Sinon → ajouter préfixe storage Laravel</li>
              <li>• onError → basculer vers avatar par défaut</li>
            </ul>
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
          <a
            href="/test-admin-images"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaCheck className="mr-2" />
            Test Images Admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default AvatarTest;
