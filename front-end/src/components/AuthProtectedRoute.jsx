import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner, FaCheckCircle, FaHome, FaUser } from 'react-icons/fa';

/**
 * Composant pour protéger les routes d'authentification
 * Empêche les utilisateurs connectés d'accéder aux pages login/register
 */
const AuthProtectedRoute = ({ children, redirectTo = '/' }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est connecté, le rediriger
  if (isAuthenticated) {
    // Déterminer la page de redirection selon le rôle
    let defaultRedirect = '/';
    
    if (user?.role === 'admin') {
      defaultRedirect = '/admin/dashboard';
    } else if (user?.role === 'conducteur') {
      defaultRedirect = '/profile';
    } else if (user?.role === 'voyageur') {
      defaultRedirect = '/trips';
    }

    // Utiliser la redirection personnalisée ou celle par défaut
    const finalRedirect = redirectTo === '/' ? defaultRedirect : redirectTo;

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Déjà connecté</h2>
            <p className="text-gray-600">
              Vous êtes déjà connecté en tant que <strong>{user?.prenom} {user?.nom}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Rôle : <span className="capitalize font-medium">{user?.role}</span>
            </p>
          </div>

          <div className="space-y-3">
            <Navigate to={finalRedirect} replace />
            
            <div className="flex flex-col space-y-2">
              <a
                href={finalRedirect}
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
              Vous serez automatiquement redirigé dans quelques secondes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher la page demandée
  return children;
};

export default AuthProtectedRoute;
