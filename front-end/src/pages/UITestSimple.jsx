import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheckCircle, FaEye, FaMousePointer, FaList, FaBars,
  FaChartBar, FaUserCheck, FaUsers, FaRoute, FaCar, FaClipboardList
} from 'react-icons/fa';

const UITestSimple = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaCheckCircle className="text-4xl text-green-500" />
            <h1 className="text-3xl font-bold text-gray-900">Test UI Admin - Simple</h1>
          </div>
          <p className="text-lg text-gray-600">
            Vérification rapide des modifications UI
          </p>
        </div>

        {/* Résumé des modifications */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">✅ Modifications Appliquées</h2>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FaCheckCircle className="text-green-500" />
              <span className="font-medium">Sidebar supprimée du dashboard admin</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FaCheckCircle className="text-green-500" />
              <span className="font-medium">Grille de liens ajoutée sur /admin</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FaCheckCircle className="text-green-500" />
              <span className="font-medium">Dropdown "Dashboard" dans la navbar</span>
            </div>
          </div>
        </div>

        {/* Test rapide */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🧪 Test Rapide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Test Dashboard */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <FaEye className="mr-2" />
                Dashboard Sans Sidebar
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Vérifiez que le dashboard n'a plus de sidebar et affiche une grille de liens.
              </p>
              <Link
                to="/admin"
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                <FaEye className="mr-2" />
                Tester Dashboard
              </Link>
            </div>

            {/* Test Navbar */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                <FaBars className="mr-2" />
                Dropdown Navbar
              </h3>
              <p className="text-sm text-green-700 mb-3">
                Connectez-vous comme admin et cliquez sur "Dashboard" dans la navbar.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                <FaMousePointer className="mr-2" />
                Se connecter
              </Link>
            </div>
          </div>
        </div>

        {/* Liens admin */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔗 Liens Admin Disponibles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { title: 'Dashboard', url: '/admin', icon: FaChartBar },
              { title: 'Statistiques', url: '/admin/dashboard', icon: FaChartBar },
              { title: 'Vérification', url: '/admin/verification', icon: FaUserCheck },
              { title: 'Utilisateurs', url: '/admin/users', icon: FaUsers },
              { title: 'Trajets', url: '/admin/trips', icon: FaRoute },
              { title: 'Véhicules', url: '/admin/vehicles', icon: FaCar },
              { title: 'Réservations', url: '/admin/reservations', icon: FaClipboardList }
            ].map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  to={link.url}
                  className="flex items-center space-x-2 p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                >
                  <Icon className="text-blue-600" />
                  <span className="text-sm font-medium">{link.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-yellow-900 mb-2">📋 Instructions :</h3>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. <strong>Connectez-vous</strong> comme admin (admin@covoitfacile.com / admin123)</li>
            <li>2. <strong>Testez le dashboard</strong> - Allez sur /admin et vérifiez qu'il n'y a plus de sidebar</li>
            <li>3. <strong>Testez la grille</strong> - Cliquez sur les cartes de liens pour naviguer</li>
            <li>4. <strong>Testez la navbar</strong> - Cliquez sur "Dashboard" pour voir le dropdown</li>
          </ol>
        </div>

        {/* Statut */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <FaCheckCircle />
            <span className="font-medium">Toutes les modifications UI sont terminées !</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UITestSimple;
