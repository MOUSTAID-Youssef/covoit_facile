import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheckCircle, FaTimes, FaPlus, FaEye, FaMousePointer,
  FaChartBar, FaUserCheck, FaUsers, FaRoute, FaCar, FaClipboardList,
  FaBars, FaList, FaArrowRight
} from 'react-icons/fa';

const UIModificationsSummary = () => {
  const beforeAfter = [
    {
      category: 'Dashboard Admin (/admin)',
      before: {
        title: 'Avec Sidebar',
        description: 'Interface avec sidebar fixe à gauche',
        features: [
          'Sidebar de navigation fixe',
          'Contenu principal réduit',
          'Navigation uniquement par sidebar',
          'Espace perdu sur les côtés'
        ],
        icon: FaTimes,
        color: 'red'
      },
      after: {
        title: 'Sans Sidebar + Grille de liens',
        description: 'Interface moderne avec grille de liens visuels',
        features: [
          'Pas de sidebar, plus d\'espace',
          'Grille de 6 liens avec icônes',
          'Contenu utilise toute la largeur',
          'Navigation visuelle et intuitive'
        ],
        icon: FaCheckCircle,
        color: 'green'
      }
    },
    {
      category: 'Navbar (Barre de navigation)',
      before: {
        title: 'Lien Direct',
        description: 'Lien simple "Dashboard" vers /admin',
        features: [
          'Lien direct vers /admin',
          'Pas d\'options de navigation',
          'Navigation limitée',
          'Moins d\'accessibilité'
        ],
        icon: FaTimes,
        color: 'red'
      },
      after: {
        title: 'Dropdown Menu',
        description: 'Menu déroulant avec 7 options admin',
        features: [
          'Dropdown "Dashboard" avec flèche',
          '7 liens admin avec icônes',
          'Navigation rapide et complète',
          'Interface plus professionnelle'
        ],
        icon: FaCheckCircle,
        color: 'green'
      }
    }
  ];

  const adminLinks = [
    { title: 'Tableau de bord', url: '/admin', icon: FaChartBar, description: 'Dashboard principal avec grille de liens' },
    { title: 'Statistiques', url: '/admin/dashboard', icon: FaChartBar, description: 'Page dédiée aux statistiques' },
    { title: 'Vérification', url: '/admin/verification', icon: FaUserCheck, description: 'Validation des comptes utilisateurs' },
    { title: 'Utilisateurs', url: '/admin/users', icon: FaUsers, description: 'Gestion CRUD des utilisateurs' },
    { title: 'Trajets', url: '/admin/trips', icon: FaRoute, description: 'Modération des trajets' },
    { title: 'Véhicules', url: '/admin/vehicles', icon: FaCar, description: 'Validation des véhicules' },
    { title: 'Réservations', url: '/admin/reservations', icon: FaClipboardList, description: 'Suivi des réservations' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-50 border-red-200',
      green: 'bg-green-50 border-green-200'
    };
    return colors[color] || colors.green;
  };

  const getTextColorClasses = (color) => {
    const colors = {
      red: 'text-red-700',
      green: 'text-green-700'
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaCheckCircle className="text-4xl text-green-500" />
            <h1 className="text-3xl font-bold text-gray-900">Modifications UI Terminées</h1>
          </div>
          <p className="text-lg text-gray-600">
            Sidebar supprimée + Grille de liens + Dropdown navbar
          </p>
        </div>

        {/* Résumé des changements */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Résumé des Changements</h2>

          <div className="space-y-8">
            {beforeAfter.map((change, index) => (
              <div key={index} className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{change.category}</h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Avant */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClasses(change.before.color)}`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <change.before.icon className={`text-2xl ${getTextColorClasses(change.before.color)}`} />
                      <div>
                        <h4 className={`font-semibold ${getTextColorClasses(change.before.color)}`}>
                          ❌ {change.before.title}
                        </h4>
                        <p className={`text-sm ${getTextColorClasses(change.before.color)}`}>
                          {change.before.description}
                        </p>
                      </div>
                    </div>
                    <ul className={`text-sm ${getTextColorClasses(change.before.color)} space-y-1`}>
                      {change.before.features.map((feature, i) => (
                        <li key={i}>• {feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Après */}
                  <div className={`p-4 rounded-lg border-2 ${getColorClasses(change.after.color)}`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <change.after.icon className={`text-2xl ${getTextColorClasses(change.after.color)}`} />
                      <div>
                        <h4 className={`font-semibold ${getTextColorClasses(change.after.color)}`}>
                          ✅ {change.after.title}
                        </h4>
                        <p className={`text-sm ${getTextColorClasses(change.after.color)}`}>
                          {change.after.description}
                        </p>
                      </div>
                    </div>
                    <ul className={`text-sm ${getTextColorClasses(change.after.color)} space-y-1`}>
                      {change.after.features.map((feature, i) => (
                        <li key={i}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Flèche de transition */}
                <div className="flex justify-center my-4">
                  <FaArrowRight className="text-2xl text-blue-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liens admin disponibles */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Liens Admin Disponibles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Icon className="text-2xl text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900">{link.title}</h3>
                    <p className="text-sm text-blue-700 mb-1">{link.description}</p>
                    <p className="text-xs font-mono text-blue-600">{link.url}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Instructions de test */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comment Tester</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Dashboard */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                <FaEye className="mr-2" />
                Test Dashboard Sans Sidebar
              </h3>
              <ol className="text-sm text-green-700 space-y-2">
                <li>1. Connectez-vous comme admin</li>
                <li>2. Allez sur <code>/admin</code></li>
                <li>3. Vérifiez qu'il n'y a plus de sidebar</li>
                <li>4. Testez la grille de 6 liens</li>
                <li>5. Cliquez sur les cartes pour naviguer</li>
              </ol>
            </div>

            {/* Test Navbar */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <FaBars className="mr-2" />
                Test Dropdown Navbar
              </h3>
              <ol className="text-sm text-blue-700 space-y-2">
                <li>1. Connectez-vous comme admin</li>
                <li>2. Regardez la navbar en haut</li>
                <li>3. Cliquez sur "Dashboard" avec la flèche</li>
                <li>4. Vérifiez le dropdown avec 7 liens</li>
                <li>5. Testez la navigation par le dropdown</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Avantages */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Avantages des Modifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <FaPlus className="text-3xl text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Plus d'Espace</h3>
              <p className="text-sm text-green-700">
                Suppression de la sidebar libère l'espace pour le contenu principal
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <FaList className="text-3xl text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Navigation Visuelle</h3>
              <p className="text-sm text-blue-700">
                Grille de liens avec icônes plus intuitive et moderne
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <FaMousePointer className="text-3xl text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Accès Rapide</h3>
              <p className="text-sm text-purple-700">
                Dropdown navbar permet un accès rapide depuis n'importe quelle page
              </p>
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
            Se connecter comme admin
          </Link>

          <Link
            to="/admin-ui-test"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FaList className="mr-2" />
            Page de test UI
          </Link>
        </div>

        {/* Identifiants admin */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">🔑 Identifiants Admin :</h3>
          <div className="text-sm">
            <span className="font-medium">Email :</span> admin@covoitfacile.com<br/>
            <span className="font-medium">Mot de passe :</span> admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIModificationsSummary;
