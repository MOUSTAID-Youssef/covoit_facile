import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaCar, FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown,
  FaChartBar, FaUserCheck, FaUsers, FaRoute, FaClipboardList
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Menu items admin
  const adminMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: FaChartBar, url: '/admin' },
    { id: 'stats', label: 'Statistiques', icon: FaChartBar, url: '/admin/dashboard' },
    { id: 'verification', label: 'Vérification', icon: FaUserCheck, url: '/admin/verification' },
    { id: 'users', label: 'Utilisateurs', icon: FaUsers, url: '/admin/users' },
    { id: 'trips', label: 'Trajets', icon: FaRoute, url: '/admin/trips' },
    { id: 'vehicles', label: 'Véhicules', icon: FaCar, url: '/admin/vehicles' },
    { id: 'reservations', label: 'Réservations', icon: FaClipboardList, url: '/admin/reservations' },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setAdminMenuOpen(false); // Fermer l'autre menu
  };

  const toggleAdminMenu = () => {
    setAdminMenuOpen(!adminMenuOpen);
    setUserMenuOpen(false); // Fermer l'autre menu
  };

  const handleLogout = async () => {
    console.log('🔄 Clic sur déconnexion dans Navbar...');
    console.log('👤 Utilisateur actuel:', user);
    console.log('🔐 État authentifié:', isAuthenticated);

    try {
      await logout();
      console.log('✅ Logout terminé, fermeture du menu...');
      setUserMenuOpen(false);
      console.log('🏠 Navigation vers la page d\'accueil...');
      navigate('/');
    } catch (error) {
      console.error('❌ Erreur dans handleLogout:', error);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-xl shadow-lg fixed w-full top-0 z-50 transition-all duration-300 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaCar className="text-2xl text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CovoitFacile
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Accueil
            </Link>
            <Link
              to="/search"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Rechercher
            </Link>

            {isAuthenticated && (
              <>
                {(user?.role === 'conducteur' || user?.role === 'admin') && (
                  <Link
                    to="/create"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Proposer un trajet
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <div className="relative">
                    <button
                      onClick={toggleAdminMenu}
                      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <span>Dashboard</span>
                      <FaChevronDown className="text-xs" />
                    </button>

                    {adminMenuOpen && (
                      <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border">
                        {adminMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.id}
                              to={item.url}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setAdminMenuOpen(false)}
                            >
                              <Icon className="mr-3 text-indigo-600" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FaUser className="text-sm" />
                  <span>{user?.prenom}</span>
                  <FaChevronDown className="text-xs" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FaUser className="mr-3" />
                      Mon profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all duration-300"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-indigo-600 p-2"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Ouvert */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/search"
                className="block px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Rechercher
              </Link>

              {isAuthenticated ? (
                <>
                  {(user?.role === 'conducteur' || user?.role === 'admin') && (
                    <Link
                      to="/create"
                      className="block px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Proposer un trajet
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Mon profil
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-base font-medium"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;