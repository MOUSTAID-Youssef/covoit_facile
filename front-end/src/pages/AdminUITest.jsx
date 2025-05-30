import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheckCircle, FaEye, FaMousePointer, FaList, FaBars,
  FaChartBar, FaUserCheck, FaUsers, FaRoute, FaCar, FaClipboardList
} from 'react-icons/fa';

const AdminUITest = () => {
  const modifications = [
    {
      id: 'sidebar-removed',
      title: '🚫 Sidebar supprimée',
      description: 'La sidebar a été supprimée de /admin',
      before: 'Dashboard avec sidebar fixe à gauche',
      after: 'Dashboard sans sidebar, plus d\'espace pour le contenu',
      status: 'completed'
    },
    {
      id: 'links-grid-added',
      title: '📋 Grille de liens ajoutée',
      description: 'Liste de liens admin en grille sur /admin',
      before: 'Navigation uniquement par sidebar',
      after: 'Grille de 6 liens admin cliquables avec icônes',
      status: 'completed'
    },
    {
      id: 'navbar-dropdown',
      title: '📂 Dropdown navbar ajouté',
      description: 'Menu déroulant "Dashboard" dans la navbar',
      before: 'Lien direct vers /admin',
      after: 'Dropdown avec 7 liens admin + icônes',
      status: 'completed'
    }
  ];

  const adminLinks = [
    { title: 'Tableau de bord', url: '/admin', icon: FaChartBar, color: 'blue' },
    { title: 'Statistiques', url: '/admin/dashboard', icon: FaChartBar, color: 'indigo' },
    { title: 'Vérification', url: '/admin/verification', icon: FaUserCheck, color: 'green' },
    { title: 'Utilisateurs', url: '/admin/users', icon: FaUsers, color: 'purple' },
    { title: 'Trajets', url: '/admin/trips', icon: FaRoute, color: 'orange' },
    { title: 'Véhicules', url: '/admin/vehicles', icon: FaCar, color: 'red' },
    { title: 'Réservations', url: '/admin/reservations', icon: FaClipboardList, color: 'teal' }
  ];

  const testSteps = [
    {
      step: 1,
      title: 'Connectez-vous comme admin',
      description: 'Email: admin@covoitfacile.com / Mot de passe: admin123',
      icon: FaMousePointer
    },
    {
      step: 2,
      title: 'Vérifiez la navbar',
      description: 'Cliquez sur "Dashboard" dans la navbar pour voir le dropdown',
      icon: FaBars
    },
    {
      step: 3,
      title: 'Testez le dashboard',
      description: 'Allez sur /admin et vérifiez qu\'il n\'y a plus de sidebar',
      icon: FaEye
    },
    {
      step: 4,
      title: 'Testez les liens',
      description: 'Cliquez sur les cartes de la grille pour naviguer',
      icon: FaList
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Interface Admin Modifiée</h1>
          </div>
          <p className="text-lg text-gray-600">
            Sidebar supprimée + Grille de liens + Dropdown navbar
          </p>
        </div>

        {/* Résumé des modifications */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaCheckCircle className="mr-2 text-indigo-600" />
            Modifications Appliquées
          </h2>

          <div className="space-y-4">
            {modifications.map((mod) => (
              <div key={mod.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{mod.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{mod.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium text-red-700">Avant :</span>
                        <span className="text-red-600"> {mod.before}</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Après :</span>
                        <span className="text-green-600"> {mod.after}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liens admin disponibles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaList className="mr-2 text-indigo-600" />
            Liens Admin Disponibles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  to={link.url}
                  className={`block p-4 rounded-lg border-2 transition-all ${getColorClasses(link.color)}`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className="text-xl" />
                    <h3 className="font-medium">{link.title}</h3>
                  </div>
                  <div className="text-xs font-mono opacity-75">{link.url}</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Instructions de test */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaMousePointer className="mr-2 text-indigo-600" />
            Instructions de Test
          </h2>

          <div className="space-y-4">
            {testSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className="text-blue-600" />
                      <h3 className="font-medium text-blue-900">{step.title}</h3>
                    </div>
                    <p className="text-sm text-blue-700">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparaison avant/après */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparaison Avant/Après</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avant */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-3">❌ Avant</h3>
              <ul className="text-sm text-red-700 space-y-2">
                <li>• Sidebar fixe prenant de l'espace</li>
                <li>• Navigation uniquement par sidebar</li>
                <li>• Lien direct "Dashboard" dans navbar</li>
                <li>• Interface moins flexible</li>
                <li>• Espace de contenu réduit</li>
              </ul>
            </div>

            {/* Après */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-3">✅ Après</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Pas de sidebar, plus d'espace</li>
                <li>• Grille de liens visuels avec icônes</li>
                <li>• Dropdown "Dashboard" avec 7 options</li>
                <li>• Interface plus moderne et flexible</li>
                <li>• Contenu utilise toute la largeur</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaEye className="mr-2" />
            Voir le Dashboard
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaMousePointer className="mr-2" />
            Se connecter
          </Link>

          <Link
            to="/admin/users"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FaUsers className="mr-2" />
            Tester Utilisateurs
          </Link>
        </div>

        {/* Note importante */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-900 mb-2">💡 Note importante :</h3>
          <p className="text-sm text-yellow-700">
            Pour tester le dropdown dans la navbar, vous devez être connecté comme admin.
            Le dropdown "Dashboard" apparaîtra automatiquement dans la barre de navigation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUITest;
