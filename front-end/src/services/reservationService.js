import apiClient from '../config/axios';

const reservationService = {
  /**
   * Créer une nouvelle réservation
   */
  async createReservation(reservationData) {
    try {
      console.log('🎫 Création d\'une réservation:', reservationData);
      
      const response = await apiClient.post('/reservations', reservationData);
      
      console.log('✅ Réservation créée:', response.data);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Erreur lors de la création de la réservation:', error);
      
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Erreur lors de la création de la réservation',
          errors: error.response.data.errors || {}
        };
      }
      
      return {
        success: false,
        message: 'Erreur de connexion lors de la création de la réservation'
      };
    }
  },

  /**
   * Obtenir les réservations du voyageur connecté
   */
  async getMyReservations() {
    try {
      console.log('📋 Chargement de mes réservations...');
      
      const response = await apiClient.get('/my-reservations');
      
      console.log('✅ Réservations chargées:', response.data);
      return {
        success: true,
        reservations: response.data.reservations || []
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des réservations:', error);
      
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Erreur lors du chargement des réservations',
          reservations: []
        };
      }
      
      return {
        success: false,
        message: 'Erreur de connexion lors du chargement des réservations',
        reservations: []
      };
    }
  },

  /**
   * Annuler une réservation
   */
  async cancelReservation(reservationId) {
    try {
      console.log('🗑️ Annulation de la réservation:', reservationId);
      
      const response = await apiClient.delete(`/reservations/${reservationId}`);
      
      console.log('✅ Réservation annulée:', response.data);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation de la réservation:', error);
      
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Erreur lors de l\'annulation de la réservation'
        };
      }
      
      return {
        success: false,
        message: 'Erreur de connexion lors de l\'annulation de la réservation'
      };
    }
  },

  /**
   * Créer une réservation avec fetch direct (fallback)
   */
  async createReservationDirect(reservationData) {
    try {
      console.log('🎫 Création directe d\'une réservation:', reservationData);
      
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reservationData)
      });

      const data = await response.json();
      console.log('📤 Réponse de création directe:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erreur lors de la création de la réservation',
          errors: data.errors || {}
        };
      }

      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      console.error('💥 Erreur lors de la création directe:', error);
      return {
        success: false,
        message: 'Erreur de connexion: ' + error.message
      };
    }
  }
};

export default reservationService;
