import axios from 'axios';

// Configuration de base
const API_BASE_URL = 'http://localhost:8000/api';

// Instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service API
const apiService = {
  // ==================== AUTHENTIFICATION ====================
  
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de l\'inscription' 
      };
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la connexion' 
      };
    }
  },

  async logout() {
    try {
      await api.post('/logout');
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  async getUser() {
    try {
      const response = await api.get('/user');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false };
    }
  },

  // ==================== PROFIL ====================
  
  async getProfile() {
    try {
      const response = await api.get('/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement du profil' };
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await api.put('/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la mise à jour' 
      };
    }
  },

  async uploadPhoto(file) {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await api.post('/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors de l\'upload de la photo' };
    }
  },

  // ==================== TRAJETS ====================
  
  async getTrips() {
    try {
      const response = await api.get('/trips');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement des trajets' };
    }
  },

  async createTrip(tripData) {
    try {
      const response = await api.post('/trips', tripData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la création du trajet' 
      };
    }
  },

  async getMyTrips() {
    try {
      const response = await api.get('/my-trips');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement de vos trajets' };
    }
  },

  async reserveTrip(tripId, numberOfSeats) {
    try {
      const response = await api.post(`/trips/${tripId}/reserve`, { 
        nombre_places: numberOfSeats 
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la réservation' 
      };
    }
  },

  async getMyReservations() {
    try {
      const response = await api.get('/my-reservations');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement de vos réservations' };
    }
  },

  // ==================== VÉHICULES ====================
  
  async getMyVehicles() {
    try {
      const response = await api.get('/my-vehicles');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement de vos véhicules' };
    }
  },

  async addVehicle(vehicleData) {
    try {
      const response = await api.post('/my-vehicles', vehicleData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de l\'ajout du véhicule' 
      };
    }
  },

  // ==================== STATISTIQUES PUBLIQUES ====================
  
  async getPublicStats() {
    try {
      const response = await api.get('/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement des statistiques' };
    }
  },

  async getTestimonials() {
    try {
      const response = await api.get('/testimonials');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement des témoignages' };
    }
  },

  // ==================== ADMIN ====================
  
  async getAdminStats() {
    try {
      const response = await api.get('/admin/dashboard');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement des statistiques admin' };
    }
  },

  async getAdminUsers() {
    try {
      const response = await api.get('/admin/users');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement des utilisateurs' };
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur lors de la mise à jour' 
      };
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la suppression' };
    }
  },

  async getAdminTrips() {
    try {
      const response = await api.get('/admin/trips');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement des trajets' };
    }
  },

  async getAdminVehicles() {
    try {
      const response = await api.get('/admin/vehicles');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement des véhicules' };
    }
  },

  async getAdminReservations() {
    try {
      const response = await api.get('/admin/reservations');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement des réservations' };
    }
  }
};

export default apiService;
