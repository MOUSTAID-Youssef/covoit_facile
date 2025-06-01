import apiClient from '../config/axios';

class AdminService {
  // ==================== STATISTIQUES ====================
  async getDashboardStats() {
    try {
      console.log('📊 Chargement des statistiques admin...');
      const response = await apiClient.get('/admin/stats');
      console.log('✅ Statistiques chargées:', response.data);

      // L'API retourne { success: true, stats: {...} }
      if (response.data.success) {
        return {
          success: true,
          stats: response.data.stats
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Erreur lors du chargement des statistiques'
        };
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des statistiques'
      };
    }
  }

  // ==================== GESTION DES UTILISATEURS ====================
  async getUsers() {
    try {
      console.log('👥 Chargement des utilisateurs...');
      const response = await apiClient.get('/admin/users');
      console.log('✅ Utilisateurs chargés:', response.data);
      return {
        success: true,
        data: response.data.users
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des utilisateurs'
      };
    }
  }

  async updateUser(userId, userData) {
    try {
      console.log('✏️ Mise à jour utilisateur:', userId, userData);
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      console.log('✅ Utilisateur mis à jour:', response.data);
      return {
        success: true,
        data: response.data.user,
        message: 'Utilisateur mis à jour avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la mise à jour',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  async deleteUser(userId) {
    try {
      console.log('🗑️ Suppression utilisateur:', userId);
      const response = await apiClient.delete(`/admin/users/${userId}`);
      console.log('✅ Utilisateur supprimé:', response.data);
      return {
        success: true,
        message: response.data.message || 'Utilisateur supprimé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la suppression'
      };
    }
  }

  async blockUser(userId) {
    try {
      console.log('🚫 Blocage utilisateur:', userId);
      const response = await apiClient.put(`/admin/users/${userId}`, { statut: 'bloque' });
      console.log('✅ Utilisateur bloqué:', response.data);
      return {
        success: true,
        data: response.data.user,
        message: 'Utilisateur bloqué avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors du blocage:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du blocage'
      };
    }
  }

  async unblockUser(userId) {
    try {
      console.log('✅ Déblocage utilisateur:', userId);
      const response = await apiClient.put(`/admin/users/${userId}`, { statut: 'actif' });
      console.log('✅ Utilisateur débloqué:', response.data);
      return {
        success: true,
        data: response.data.user,
        message: 'Utilisateur débloqué avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors du déblocage:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du déblocage'
      };
    }
  }

  async verifyUser(userId) {
    try {
      console.log('✅ Vérification utilisateur:', userId);
      const response = await apiClient.put(`/admin/users/${userId}`, { badge_verifie: true });
      console.log('✅ Utilisateur vérifié:', response.data);
      return {
        success: true,
        data: response.data.user,
        message: 'Utilisateur vérifié avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la vérification:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la vérification'
      };
    }
  }

  // ==================== GESTION DES TRAJETS ====================
  async getTrips() {
    try {
      console.log('🚗 Chargement des trajets...');
      const response = await apiClient.get('/admin/trips');
      console.log('✅ Trajets chargés:', response.data);
      return {
        success: true,
        data: response.data.trips
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des trajets:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des trajets'
      };
    }
  }

  async updateTrip(tripId, tripData) {
    try {
      console.log('✏️ Mise à jour trajet:', tripId, tripData);
      const response = await apiClient.put(`/admin/trips/${tripId}`, tripData);
      console.log('✅ Trajet mis à jour:', response.data);
      return {
        success: true,
        data: response.data.trip,
        message: 'Trajet mis à jour avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la mise à jour',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  async deleteTrip(tripId) {
    try {
      console.log('🗑️ Suppression trajet:', tripId);
      const response = await apiClient.delete(`/admin/trips/${tripId}`);
      console.log('✅ Trajet supprimé:', response.data);
      return {
        success: true,
        message: response.data.message || 'Trajet supprimé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la suppression'
      };
    }
  }

  // ==================== GESTION DES VÉHICULES ====================
  async getVehicles() {
    try {
      console.log('🚙 Chargement des véhicules...');
      const response = await apiClient.get('/admin/vehicles');
      console.log('✅ Véhicules chargés:', response.data);
      return {
        success: true,
        data: response.data.vehicles
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des véhicules:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des véhicules'
      };
    }
  }

  async verifyVehicle(vehicleId, status, comment = '') {
    try {
      console.log('🔍 Vérification véhicule:', vehicleId, status);
      const response = await apiClient.put(`/admin/vehicles/${vehicleId}`, {
        statut_verification: status,
        commentaire_verification: comment
      });
      console.log('✅ Véhicule vérifié:', response.data);
      return {
        success: true,
        data: response.data.vehicle,
        message: `Véhicule ${status === 'verifie' ? 'vérifié' : 'rejeté'} avec succès`
      };
    } catch (error) {
      console.error('❌ Erreur lors de la vérification:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la vérification'
      };
    }
  }

  // ==================== GESTION DES RÉSERVATIONS ====================
  async getReservations() {
    try {
      console.log('📋 Chargement des réservations...');
      const response = await apiClient.get('/admin/reservations');
      console.log('✅ Réservations chargées:', response.data);
      return {
        success: true,
        data: response.data.reservations
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des réservations:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des réservations'
      };
    }
  }
  // Supprimer un utilisateur
  async deleteUser(userId) {
    try {
      console.log('🗑️ Suppression utilisateur:', userId);
      const response = await apiClient.delete(`/admin/users/${userId}`);
      console.log('✅ Utilisateur supprimé:', response.data);
      return {
        success: true,
        message: response.data.message || 'Utilisateur supprimé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la suppression'
      };
    }
  }

  // Supprimer un trajet
  async deleteTrip(tripId) {
    try {
      console.log('🗑️ Suppression trajet:', tripId);
      const response = await apiClient.delete(`/admin/trips/${tripId}`);
      console.log('✅ Trajet supprimé:', response.data);
      return {
        success: true,
        message: response.data.message || 'Trajet supprimé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du trajet:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la suppression du trajet'
      };
    }
  }

  // Annuler un trajet
  async cancelTrip(tripId) {
    try {
      console.log('❌ Annulation trajet:', tripId);
      const response = await apiClient.put(`/admin/trips/${tripId}/cancel`);
      console.log('✅ Trajet annulé:', response.data);
      return {
        success: true,
        message: response.data.message || 'Trajet annulé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation du trajet:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'annulation du trajet'
      };
    }
  }

  // Réactiver un trajet
  async reactivateTrip(tripId) {
    try {
      console.log('🔄 Réactivation trajet:', tripId);
      const response = await apiClient.put(`/admin/trips/${tripId}/reactivate`);
      console.log('✅ Trajet réactivé:', response.data);
      return {
        success: true,
        message: response.data.message || 'Trajet réactivé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la réactivation du trajet:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la réactivation du trajet'
      };
    }
  }
}

export default new AdminService();
