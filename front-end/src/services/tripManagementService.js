import apiClient from '../config/axios';

const tripManagementService = {
  /**
   * Obtenir les trajets du conducteur avec leurs réservations
   */
  async getMyTripsWithReservations() {
    try {
      console.log('🚗 Chargement des trajets avec réservations...');

      const response = await apiClient.get('/my-trips-reservations');

      console.log('✅ Trajets avec réservations chargés:', response.data);
      return {
        success: true,
        trips: response.data.trips || []
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des trajets:', error);

      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Erreur lors du chargement des trajets',
          trips: []
        };
      }

      return {
        success: false,
        message: 'Erreur de connexion lors du chargement des trajets',
        trips: []
      };
    }
  },

  /**
   * Accepter une réservation
   */
  async acceptReservation(reservationId) {
    try {
      console.log('✅ Acceptation de la réservation:', reservationId);

      const response = await apiClient.put(`/reservations/${reservationId}/accept`);

      console.log('✅ Réservation acceptée:', response.data);
      return {
        success: true,
        message: response.data.message,
        reservation: response.data.reservation
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'acceptation:', error);

      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Erreur lors de l\'acceptation de la réservation'
        };
      }

      return {
        success: false,
        message: 'Erreur de connexion lors de l\'acceptation de la réservation'
      };
    }
  },

  /**
   * Refuser une réservation
   */
  async rejectReservation(reservationId) {
    try {
      console.log('❌ Refus de la réservation:', reservationId);

      const response = await apiClient.put(`/reservations/${reservationId}/reject`);

      console.log('✅ Réservation refusée:', response.data);
      return {
        success: true,
        message: response.data.message,
        reservation: response.data.reservation
      };
    } catch (error) {
      console.error('❌ Erreur lors du refus:', error);

      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Erreur lors du refus de la réservation'
        };
      }

      return {
        success: false,
        message: 'Erreur de connexion lors du refus de la réservation'
      };
    }
  },

  /**
   * Supprimer un trajet
   */
  async deleteTrip(tripId) {
    try {
      console.log('🗑️ Suppression du trajet:', tripId);

      const response = await apiClient.delete(`/trips/${tripId}`);

      console.log('✅ Trajet supprimé:', response.data);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);

      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Erreur lors de la suppression du trajet'
        };
      }

      return {
        success: false,
        message: 'Erreur de connexion lors de la suppression du trajet'
      };
    }
  },

  /**
   * Modifier un trajet
   */
  async updateTrip(tripId, tripData) {
    try {
      console.log('✏️ Modification du trajet:', tripId, tripData);

      const response = await apiClient.put(`/trips/${tripId}`, tripData);

      console.log('✅ Trajet modifié:', response.data);
      return {
        success: true,
        message: response.data.message,
        trip: response.data.data
      };
    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);

      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || 'Erreur lors de la modification du trajet',
          errors: error.response.data.errors || {}
        };
      }

      return {
        success: false,
        message: 'Erreur de connexion lors de la modification du trajet'
      };
    }
  },

  /**
   * Modifier un trajet avec fetch direct (fallback)
   */
  async updateTripDirect(tripId, tripData) {
    try {
      console.log('✏️ Modification directe du trajet:', tripId, tripData);

      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

      const response = await fetch(`http://localhost:8000/api/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tripData)
      });

      const data = await response.json();
      console.log('📤 Réponse de modification directe:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erreur lors de la modification du trajet',
          errors: data.errors || {}
        };
      }

      return {
        success: true,
        message: data.message,
        trip: data.data
      };
    } catch (error) {
      console.error('💥 Erreur lors de la modification directe:', error);
      return {
        success: false,
        message: 'Erreur de connexion: ' + error.message
      };
    }
  },

  /**
   * Méthodes avec fetch direct (fallback)
   */
  async getMyTripsWithReservationsDirect() {
    try {
      console.log('🚗 Chargement direct des trajets avec réservations...');

      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

      const response = await fetch('http://localhost:8000/api/my-trips-reservations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('📤 Réponse directe:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erreur lors du chargement des trajets',
          trips: []
        };
      }

      return {
        success: true,
        trips: data.trips || []
      };
    } catch (error) {
      console.error('💥 Erreur lors du chargement direct:', error);
      return {
        success: false,
        message: 'Erreur de connexion: ' + error.message,
        trips: []
      };
    }
  },

  async acceptReservationDirect(reservationId) {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

      const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erreur lors de l\'acceptation'
        };
      }

      return {
        success: true,
        message: data.message,
        reservation: data.reservation
      };
    } catch (error) {
      console.error('💥 Erreur:', error);
      return {
        success: false,
        message: 'Erreur de connexion: ' + error.message
      };
    }
  },

  async rejectReservationDirect(reservationId) {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

      const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Erreur lors du refus'
        };
      }

      return {
        success: true,
        message: data.message,
        reservation: data.reservation
      };
    } catch (error) {
      console.error('💥 Erreur:', error);
      return {
        success: false,
        message: 'Erreur de connexion: ' + error.message
      };
    }
  }
};

export default tripManagementService;
