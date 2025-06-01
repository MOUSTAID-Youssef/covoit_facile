import apiClient from '../config/axios';

class AuthService {
  // Connexion
  async login(credentials) {
    try {
      console.log('🔄 Tentative de connexion avec:', credentials);
      console.log('🌐 URL de l\'API:', apiClient.defaults.baseURL);

      const response = await apiClient.post('/login', {
        email: credentials.email,
        password: credentials.password
      });

      console.log('✅ Réponse du serveur:', response.data);

      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('💾 Token et utilisateur sauvegardés');
      }

      return {
        success: true,
        data: response.data,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      console.error('📝 Détails de l\'erreur:', error.response?.data);
      console.error('🔢 Status code:', error.response?.status);

      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Inscription
  async register(userData) {
    try {
      const response = await apiClient.post('/register', userData);

      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return {
        success: true,
        data: response.data,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur d\'inscription',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Déconnexion
  async logout() {
    try {
      console.log('🚪 Début de la déconnexion...');
      await apiClient.post('/logout');
      console.log('✅ Déconnexion serveur réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion serveur:', error);
      // Continuer même si l'API échoue
    } finally {
      console.log('🧹 Nettoyage des données locales...');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      console.log('✅ Données locales supprimées');
      // Ne pas rediriger ici, laisser le contexte gérer
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Obtenir le token
  getToken() {
    return localStorage.getItem('auth_token');
  }

  // Vérifier le rôle de l'utilisateur
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Vérifier si l'utilisateur est conducteur
  isConducteur() {
    return this.hasRole('conducteur');
  }

  // Vérifier si l'utilisateur est voyageur
  isVoyageur() {
    return this.hasRole('voyageur');
  }

  // Rafraîchir les données utilisateur
  async refreshUser() {
    try {
      const response = await apiClient.get('/profile');
      if (response.data.success && response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      } else if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données utilisateur:', error);
      // Si erreur 401, le token est invalide
      if (error.response?.status === 401) {
        console.warn('🔒 Token invalide lors du refresh - déconnexion nécessaire');
        this.clearAuthData();
        return null;
      }
      return null;
    }
  }

  // Nettoyer les données d'authentification
  clearAuthData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    console.log('🧹 Données d\'authentification supprimées');
  }

  // Vérifier la validité du token
  async validateToken() {
    try {
      const response = await apiClient.get('/user');
      return response.data ? true : false;
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn('🔒 Token invalide - nettoyage des données');
        this.clearAuthData();
        return false;
      }
      return false;
    }
  }
}

export default new AuthService();
