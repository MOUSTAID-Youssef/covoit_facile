import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner, FaExclamationTriangle, FaShieldAlt, FaHome, FaUser } from 'react-icons/fa';

/**
 * Composant pour protéger les routes admin
 * Seuls les utilisateurs avec le rôle 'admin' peuvent accéder
 */
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si l'utilisateur n'est pas admin, afficher une page d'accès refusé
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
            <p className="text-gray-600">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cette section est réservée aux administrateurs uniquement.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="text-red-500" />
                <span className="font-medium text-red-900">Zone Administrateur</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Votre rôle actuel : <strong className="capitalize">{user?.role || 'Non défini'}</strong>
              </p>
              <p className="text-sm text-red-700">
                Rôle requis : <strong>Administrateur</strong>
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Retour
              </button>
              
              <a
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaHome className="mr-2" />
                Aller à l'accueil
              </a>
              
              <a
                href="/profile"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaUser className="mr-2" />
                Mon profil
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Si vous pensez qu'il s'agit d'une erreur, contactez l'administrateur système.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est admin, afficher le contenu protégé
  return children;
};

export default AdminProtectedRoute;
