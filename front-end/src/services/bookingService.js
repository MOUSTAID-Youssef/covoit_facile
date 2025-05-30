import apiClient from '../config/axios';

class BookingService {
  // Réserver un trajet
  async bookTrip(tripId, bookingData = {}) {
    try {
      const response = await apiClient.post(`/trips/${tripId}/book`, bookingData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Réservation effectuée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la réservation',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Obtenir les réservations de l'utilisateur
  async getMyBookings() {
    try {
      const response = await apiClient.get('/bookings');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des réservations',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Obtenir une réservation par ID
  async getBookingById(id) {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement de la réservation',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Annuler une réservation
  async cancelBooking(id, reason = '') {
    try {
      const response = await apiClient.put(`/bookings/${id}/cancel`, { reason });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Réservation annulée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'annulation',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Confirmer une réservation (pour le conducteur)
  async confirmBooking(id) {
    try {
      const response = await apiClient.put(`/bookings/${id}/confirm`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Réservation confirmée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la confirmation',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Refuser une réservation (pour le conducteur)
  async rejectBooking(id, reason = '') {
    try {
      const response = await apiClient.put(`/bookings/${id}/reject`, { reason });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Réservation refusée'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du refus',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Marquer un trajet comme terminé
  async completeTrip(tripId) {
    try {
      const response = await apiClient.put(`/trips/${tripId}/complete`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Trajet marqué comme terminé'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la finalisation',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Évaluer un trajet
  async rateTrip(tripId, rating, comment = '') {
    try {
      const response = await apiClient.post(`/trips/${tripId}/rate`, {
        rating,
        comment
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Évaluation enregistrée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'évaluation',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Obtenir les réservations pour les trajets du conducteur
  async getDriverBookings() {
    try {
      const response = await apiClient.get('/bookings/driver');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement des réservations',
        errors: error.response?.data?.errors || {}
      };
    }
  }

  // Obtenir l'historique des réservations
  async getBookingHistory() {
    try {
      const response = await apiClient.get('/bookings/history');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du chargement de l\'historique',
        errors: error.response?.data?.errors || {}
      };
    }
  }
}

export default new BookingService();
