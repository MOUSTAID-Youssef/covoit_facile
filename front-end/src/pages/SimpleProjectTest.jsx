import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheckCircle, FaCode, FaDatabase, FaReact, FaLaravel, 
  FaUsers, FaCar, FaRoute, FaClipboardList, FaPlay, FaEye
} from 'react-icons/fa';
import apiService from '../services/api';

const SimpleProjectTest = () => {
  const [apiTests, setApiTests] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoints = [
    { name: 'Statistiques publiques', endpoint: 'getPublicStats', icon: FaDatabase },
    { name: 'Témoignages', endpoint: 'getTestimonials', icon: FaUsers },
  ];

  const runApiTest = async (endpoint) => {
    setLoading(true);
    try {
      const result = await apiService[endpoint]();
      setApiTests(prev => ({
        ...prev,
        [endpoint]: {
          success: result.success,
          data: result.data,
          error: result.success ? null : result.message
        }
      }));
    } catch (error) {
      setApiTests(prev => ({
        ...prev,
        [endpoint]: {
          success: false,
          error: error.message
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    for (const test of testEndpoints) {
      await runApiTest(test.endpoint);
    }
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const projectStructure = [
    {
      category: 'Backend Laravel',
      icon: FaLaravel,
      color: 'red',
      items: [
        { name: 'Routes API simplifiées', file: 'routes/api_simple.php', status: 'done' },
        { name: 'AuthController', file: 'app/Http/Controllers/AuthController.php', status: 'done' },
        { name: 'UserController', file: 'app/Http/Controllers/UserController.php', status: 'done' },
        { name: 'TripController', file: 'app/Http/Controllers/TripController.php', status: 'done' },
        { name: 'AdminController', file: 'app/Http/Controllers/AdminController.php', status: 'done' },
        { name: 'AdminMiddleware', file: 'app/Http/Middleware/AdminMiddleware.php', status: 'done' }
      ]
    },
    {
      category: 'Frontend React',
      icon: FaReact,
      color: 'blue',
      items: [
        { name: 'App simple', file: 'src/App_Simple.jsx', status: 'done' },
        { name: 'Service API', file: 'src/services/api.js', status: 'done' },
        { name: 'AuthContext simple', file: 'src/contexts/AuthContext_Simple.jsx', status: 'done' },
        { name: 'Navbar simple', file: 'src/components/simple/Navbar.jsx', status: 'done' },
        { name: 'ProtectedRoute', file: 'src/components/simple/ProtectedRoute.jsx', status: 'done' },
        { name: 'Home simple', file: 'src/pages/simple/Home.jsx', status: 'done' },
        { name: 'Login simple', file: 'src/pages/simple/Login.jsx', status: 'done' },
        { name: 'AdminDashboard simple', file: 'src/pages/simple/AdminDashboard.jsx', status: 'done' }
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-50 border-red-200 text-red-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaCode className="text-4xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Projet CovoitFacile Simplifié</h1>
          </div>
          <p className="text-lg text-gray-600">
            Structure simple et code clair pour une meilleure maintenabilité
          </p>
        </div>

        {/* Résumé */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">14</div>
            <div className="text-sm font-medium text-green-800">Fichiers créés</div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">6</div>
            <div className="text-sm font-medium text-blue-800">Contrôleurs</div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">8</div>
            <div className="text-sm font-medium text-purple-800">Composants React</div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">100%</div>
            <div className="text-sm font-medium text-orange-800">Simplifié</div>
          </div>
        </div>

        {/* Structure du projet */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaCode className="mr-2 text-indigo-600" />
            Structure du Projet
          </h2>
          
          <div className="space-y-6">
            {projectStructure.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.category} className={`border rounded-lg p-4 ${getColorClasses(section.color)}`}>
                  <h3 className="font-medium text-lg mb-3 flex items-center">
                    <Icon className="mr-2" />
                    {section.category}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.items.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="font-medium">{item.name}</span>
                          <div className="text-xs opacity-75">{item.file}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tests API */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaDatabase className="mr-2 text-indigo-600" />
            Tests API
          </h2>
          
          <div className="space-y-3">
            {testEndpoints.map((test) => {
              const Icon = test.icon;
              const result = apiTests[test.endpoint];
              
              return (
                <div key={test.endpoint} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="text-blue-600" />
                    <span className="font-medium">{test.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {result ? (
                      result.success ? (
                        <span className="text-green-600 text-sm">✅ Succès</span>
                      ) : (
                        <span className="text-red-600 text-sm">❌ Erreur</span>
                      )
                    ) : (
                      <span className="text-gray-500 text-sm">⏳ En attente</span>
                    )}
                    
                    <button
                      onClick={() => runApiTest(test.endpoint)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <FaPlay />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fonctionnalités principales */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fonctionnalités Principales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <FaUsers className="mr-2 text-blue-600" />
                Authentification
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Inscription/Connexion simplifiée</li>
                <li>• Gestion des rôles (admin, conducteur, voyageur)</li>
                <li>• Protection des routes</li>
                <li>• Middleware admin</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <FaRoute className="mr-2 text-green-600" />
                Gestion des Trajets
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Création de trajets</li>
                <li>• Réservation de places</li>
                <li>• Gestion des conducteurs</li>
                <li>• Suivi des réservations</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <FaCar className="mr-2 text-purple-600" />
                Gestion des Véhicules
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ajout de véhicules</li>
                <li>• Vérification admin</li>
                <li>• Gestion des propriétaires</li>
                <li>• Statuts de validation</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <FaClipboardList className="mr-2 text-orange-600" />
                Dashboard Admin
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Statistiques en temps réel</li>
                <li>• Gestion des utilisateurs</li>
                <li>• Modération des trajets</li>
                <li>• Validation des véhicules</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">🚀 Instructions de déploiement :</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Remplacer le contenu de <code>routes/api.php</code> par <code>routes/api_simple.php</code></li>
            <li>2. Utiliser les nouveaux contrôleurs dans <code>app/Http/Controllers/</code></li>
            <li>3. Remplacer <code>src/App.jsx</code> par <code>src/App_Simple.jsx</code></li>
            <li>4. Utiliser le nouveau service API <code>src/services/api.js</code></li>
            <li>5. Tester avec les comptes par défaut</li>
          </ol>
        </div>

        {/* Comptes de test */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">🔑 Comptes de test :</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Admin :</span> admin@covoitfacile.com / admin123
            </div>
            <div>
              <span className="font-medium">Conducteur :</span> conducteur@test.com / password
            </div>
            <div>
              <span className="font-medium">Voyageur :</span> voyageur@test.com / password
            </div>
          </div>
        </div>

        {/* Liens rapides */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaEye className="mr-2" />
            Voir l'accueil
          </Link>
          
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaUsers className="mr-2" />
            Se connecter
          </Link>
          
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FaClipboardList className="mr-2" />
            Dashboard Admin
          </Link>
          
          <button
            onClick={runAllTests}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            <FaPlay className="mr-2" />
            Tester les APIs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleProjectTest;
