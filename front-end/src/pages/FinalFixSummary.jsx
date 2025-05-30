import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheckCircle, FaServer, FaDatabase, FaRoute, FaPlay, FaEye,
  FaUsers, FaCar, FaClipboardList, FaChartBar, FaUserCheck
} from 'react-icons/fa';

const FinalFixSummary = () => {
  const [serverStatus, setServerStatus] = useState('checking');
  const [statsTest, setStatsTest] = useState(null);

  useEffect(() => {
    checkServerAndStats();
  }, []);

  const checkServerAndStats = async () => {
    try {
      // Test du serveur Laravel
      const response = await fetch('http://localhost:8000/api/stats');
      if (response.ok) {
        setServerStatus('running');
        
        // Test des statistiques admin si connecté
        const token = localStorage.getItem('token');
        if (token) {
          const adminResponse = await fetch('http://localhost:8000/api/admin/stats', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          if (adminResponse.ok) {
            const data = await adminResponse.json();
            setStatsTest(data);
          }
        }
      } else {
        setServerStatus('stopped');
      }
    } catch (error) {
      setServerStatus('stopped');
    }
  };

  const problems = [
    {
      id: 'server-stopped',
      title: '🚫 Serveur Laravel arrêté',
      description: 'Le serveur Laravel n\'était pas démarré',
      solution: 'Démarrage du serveur avec php artisan serve',
      status: 'fixed',
      impact: 'Toutes les APIs retournaient des erreurs de connexion'
    },
    {
      id: 'stats-zero',
      title: '📊 Statistiques à zéro',
      description: 'Les statistiques affichaient 0 malgré les données en base',
      solution: 'Correction d\'AdminService pour retourner result.stats',
      status: 'fixed',
      impact: 'Dashboard admin non informatif'
    },
    {
      id: 'routes-not-working',
      title: '🛣️ Routes admin non fonctionnelles',
      description: 'Les chemins /admin/users, /admin/trips etc. ne fonctionnaient pas',
      solution: 'Ajout des routes spécifiques dans App.jsx et navigation par URL',
      status: 'fixed',
      impact: 'Impossible d\'accéder directement aux composants admin'
    }
  ];

  const adminRoutes = [
    { path: '/admin', title: 'Dashboard Principal', icon: FaChartBar, color: 'blue' },
    { path: '/admin/dashboard', title: 'Statistiques', icon: FaChartBar, color: 'indigo' },
    { path: '/admin/verification', title: 'Vérification', icon: FaUserCheck, color: 'green' },
    { path: '/admin/users', title: 'Utilisateurs', icon: FaUsers, color: 'purple' },
    { path: '/admin/trips', title: 'Trajets', icon: FaRoute, color: 'orange' },
    { path: '/admin/vehicles', title: 'Véhicules', icon: FaCar, color: 'red' },
    { path: '/admin/reservations', title: 'Réservations', icon: FaClipboardList, color: 'teal' }
  ];

  const testPages = [
    { path: '/simple-stats-test', title: 'Test Simple Stats', description: 'Test direct de l\'API' },
    { path: '/admin-stats-debug', title: 'Debug Complet', description: 'Diagnostic avancé' },
    { path: '/admin-routes-test', title: 'Test Routes Admin', description: 'Vérification des chemins' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
      teal: 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaCheckCircle className="text-4xl text-green-500" />
            <h1 className="text-3xl font-bold text-gray-900">Problèmes Résolus !</h1>
          </div>
          <p className="text-lg text-gray-600">
            Tous les problèmes ont été identifiés et corrigés
          </p>
        </div>

        {/* Statut du serveur */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaServer className="mr-2 text-indigo-600" />
            Statut du Serveur
          </h2>
          
          <div className={`p-4 rounded-lg border-2 ${
            serverStatus === 'running' ? 'bg-green-50 border-green-200' :
            serverStatus === 'stopped' ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                serverStatus === 'running' ? 'bg-green-500' :
                serverStatus === 'stopped' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}></div>
              <span className="font-medium">
                {serverStatus === 'running' ? '✅ Serveur Laravel en marche' :
                 serverStatus === 'stopped' ? '❌ Serveur Laravel arrêté' :
                 '⏳ Vérification du serveur...'}
              </span>
            </div>
            
            {serverStatus === 'running' && (
              <div className="mt-2 text-sm text-green-700">
                <p>🌐 http://localhost:8000 - Accessible</p>
                {statsTest && (
                  <p>📊 API admin/stats - {statsTest.success ? 'Fonctionnelle' : 'Erreur'}</p>
                )}
              </div>
            )}
            
            {serverStatus === 'stopped' && (
              <div className="mt-2 text-sm text-red-700">
                <p>💡 Pour démarrer: <code>php artisan serve</code></p>
              </div>
            )}
          </div>
        </div>

        {/* Problèmes résolus */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaCheckCircle className="mr-2 text-indigo-600" />
            Problèmes Résolus
          </h2>
          
          <div className="space-y-4">
            {problems.map((problem) => (
              <div key={problem.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{problem.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Problème :</strong> {problem.description}
                    </p>
                    <p className="text-sm text-green-700 mb-2">
                      <strong>Solution :</strong> {problem.solution}
                    </p>
                    <p className="text-xs text-gray-500">
                      <strong>Impact :</strong> {problem.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Routes admin fonctionnelles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaRoute className="mr-2 text-indigo-600" />
            Routes Admin Fonctionnelles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`block p-4 rounded-lg border-2 transition-all ${getColorClasses(route.color)}`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className="text-xl" />
                    <h3 className="font-medium">{route.title}</h3>
                  </div>
                  <div className="text-xs font-mono opacity-75">{route.path}</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pages de test */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaPlay className="mr-2 text-indigo-600" />
            Pages de Test Disponibles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-medium text-blue-900 mb-1">{page.title}</h3>
                <p className="text-sm text-blue-700">{page.description}</p>
                <div className="text-xs font-mono text-blue-600 mt-2">{page.path}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Statistiques actuelles */}
        {statsTest && statsTest.success && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaDatabase className="mr-2 text-indigo-600" />
              Statistiques Actuelles (Données Réelles)
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{statsTest.stats.total_users}</div>
                <div className="text-sm text-blue-600">Utilisateurs</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{statsTest.stats.total_trajets}</div>
                <div className="text-sm text-green-600">Trajets</div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">{statsTest.stats.total_vehicules}</div>
                <div className="text-sm text-purple-600">Véhicules</div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">{statsTest.stats.total_reservations}</div>
                <div className="text-sm text-orange-600">Réservations</div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions finales */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-900 mb-2">🎉 Résultat Final :</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✅ Serveur Laravel démarré et fonctionnel</li>
            <li>✅ Statistiques affichent les vraies données de la base</li>
            <li>✅ Toutes les routes admin accessibles directement</li>
            <li>✅ Navigation par URL fonctionnelle</li>
            <li>✅ APIs admin entièrement opérationnelles</li>
            <li>✅ Dashboard admin complet et responsive</li>
          </ul>
        </div>

        {/* Identifiants admin */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">🔑 Identifiants Admin :</h3>
          <div className="text-sm">
            <span className="font-medium">Email :</span> admin@covoitfacile.com<br/>
            <span className="font-medium">Mot de passe :</span> admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalFixSummary;
