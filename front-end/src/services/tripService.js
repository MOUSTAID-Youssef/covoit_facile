import apiClient from '../config/axios';

class TripService {
  // Obtenir tous les trajets (public)
  async getTrips(params = {}) {
    try {
      console.log('📥 Chargement de tous les trajets...');
      const response = await apiClient.get('/trips', { params });
      console.log('✅ Trajets chargés:', response.data);

      return {
        success: true,
        trips: response.data.trips || [],
        data: response.data.trips || [], // Pour compatibilité
        meta: response.data.meta || null
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des trajets:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des trajets',
        trips: [],
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Rechercher des trajets
  async searchTrips(searchParams) {
    try {
      const response = await apiClient.get('/trips/search', { params: searchParams });
      return {
        success: true,
        data: response.data.data || response.data,
        meta: response.data.meta || null
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la recherche',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Obtenir un trajet par ID
  async getTripById(id) {
    try {
      const response = await apiClient.get(`/trips/${id}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement du trajet',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Créer un nouveau trajet
  async createTrip(tripData) {
    try {
      console.log('🚗 Création d\'un nouveau trajet:', tripData);
      const response = await apiClient.post('/trips', tripData);
      console.log('✅ Trajet créé:', response.data);

      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Trajet créé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la création du trajet:', error);
      console.error('📄 Détails de l\'erreur:', error.response?.data);

      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la création du trajet',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Mettre à jour un trajet
  async updateTrip(id, tripData) {
    try {
      const response = await apiClient.put(`/trips/${id}`, tripData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Trajet mis à jour avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la mise à jour',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Supprimer un trajet
  async deleteTrip(id) {
    try {
      const response = await apiClient.delete(`/trips/${id}`);
      return {
        success: true,
        message: response.data.message || 'Trajet supprimé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la suppression',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Obtenir les trajets de l'utilisateur connecté
  async getMyTrips() {
    try {
      console.log('📋 Chargement de mes trajets...');
      const response = await apiClient.get('/my-trips');
      console.log('✅ Mes trajets chargés:', response.data);

      return {
        success: true,
        trips: response.data.trips || [],
        data: response.data.trips || [] // Pour compatibilité
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement de mes trajets:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement de vos trajets',
        trips: [],
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Obtenir les trajets populaires
  async getPopularTrips() {
    try {
      const response = await apiClient.get('/trips/popular');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des trajets populaires',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Obtenir les trajets récents
  async getRecentTrips(limit = 10) {
    try {
      const response = await apiClient.get('/trips/recent', { params: { limit } });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des trajets récents',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Obtenir les statistiques des trajets
  async getTripStats() {
    try {
      const response = await apiClient.get('/trips/stats');
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
}

export default new TripService();
