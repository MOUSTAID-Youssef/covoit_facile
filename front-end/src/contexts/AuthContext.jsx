import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();

    // Pas de vérification périodique pour éviter les déconnexions automatiques
    // L'utilisateur reste connecté en permanence
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Vérification du statut d\'authentification...');

      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        console.log('👤 Utilisateur trouvé dans localStorage:', currentUser?.email);

        setUser(currentUser);
        setIsAuthenticated(true);

        // Pas de validation du token pour éviter les déconnexions automatiques
        // L'utilisateur reste connecté tant que les données sont présentes
        console.log('✅ Utilisateur authentifié - connexion permanente');
      } else {
        console.log('❌ Aucune authentification trouvée');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de l\'authentification:', error);
      // Ne pas déconnecter automatiquement en cas d'erreur
      console.log('⚠️ Erreur ignorée pour maintenir la connexion');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        message: 'Erreur de connexion'
      };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return {
        success: false,
        message: 'Erreur d\'inscription'
      };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Début de la déconnexion dans le contexte...');
      await authService.logout();
      console.log('✅ Service de déconnexion terminé');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    } finally {
      console.log('🧹 Mise à jour de l\'état React...');
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ État React mis à jour - utilisateur déconnecté');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isConducteur = () => {
    return hasRole('conducteur');
  };

  const isVoyageur = () => {
    return hasRole('voyageur');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isConducteur,
    isVoyageur,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
