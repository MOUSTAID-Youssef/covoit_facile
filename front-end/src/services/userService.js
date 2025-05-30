import apiClient from '../config/axios';

class UserService {
  // Obtenir le profil utilisateur
  async getProfile() {
    try {
      console.log('📥 Chargement du profil utilisateur...');
      const response = await apiClient.get('/profile');
      console.log('✅ Profil chargé:', response.data);

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement du profil:', error);
      console.error('📄 Détails de l\'erreur:', error.response?.data);

      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement du profil',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Mettre à jour le profil
  async updateProfile(profileData) {
    try {
      console.log('🔄 Mise à jour du profil avec:', profileData);
      const response = await apiClient.put('/profile', profileData);
      console.log('✅ Réponse API:', response.data);

      // Mettre à jour les données utilisateur en local
      const userData = response.data.data || response.data.user;
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('💾 Données utilisateur mises à jour dans localStorage');
      }

      return {
        success: true,
        data: userData,
        message: response.data.message || 'Profil mis à jour avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la mise à jour',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Upload de photo de profil
  async uploadPhoto(file) {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await apiClient.post('/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Mettre à jour les données utilisateur en local
      if (response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }

      return {
        success: true,
        data: response.data.data,
        photo_url: response.data.photo_url,
        message: 'Photo mise à jour avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'upload',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Supprimer la photo de profil
  async deletePhoto() {
    try {
      const response = await apiClient.delete('/profile/photo');

      // Mettre à jour les données utilisateur en local
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return {
        success: true,
        data: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la suppression',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Upload de pièce d'identité
  async uploadIdentityDocument(file) {
    try {
      const formData = new FormData();
      formData.append('identity_document', file);

      const response = await apiClient.post('/profile/identity-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'upload du document',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Obtenir les statistiques utilisateur
  async getUserStats() {
    try {
      const response = await apiClient.get('/profile/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des statistiques',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Changer le mot de passe
  async changePassword(passwordData) {
    try {
      const response = await apiClient.put('/profile/password', passwordData);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du changement de mot de passe',
        errors: error.response?.data?.errors || {}
      };
    }
  }
}

export default new UserService();
