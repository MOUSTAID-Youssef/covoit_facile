import axios from 'axios';

// Configuration de base d'Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Pour les cookies de session
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    // Essayer les deux noms de token
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🔑 Token utilisé:', token ? 'Présent' : 'Absent');
    console.log('📡 Requête vers:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse reçue:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Erreur API:', error.response?.status, error.config?.url);
    console.error('📄 Détails:', error.response?.data);

    // Gestion des erreurs d'authentification
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Gestion des erreurs de validation
    if (error.response?.status === 422) {
      console.error('Erreurs de validation:', error.response.data.errors);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
