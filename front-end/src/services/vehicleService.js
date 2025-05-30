import apiClient from '../config/axios';

const vehicleService = {
  // Récupérer les véhicules du conducteur connecté
  getMyVehicles: async () => {
    try {
      const response = await apiClient.get('/my-vehicles');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des véhicules');
    }
  },

  // Ajouter un nouveau véhicule
  addVehicle: async (vehicleData) => {
    try {
      const response = await apiClient.post('/my-vehicles', vehicleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout du véhicule');
    }
  },

  // Modifier un véhicule
  updateVehicle: async (vehicleId, vehicleData) => {
    try {
      const response = await apiClient.put(`/my-vehicles/${vehicleId}`, vehicleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la modification du véhicule');
    }
  },

  // Supprimer un véhicule
  deleteVehicle: async (vehicleId) => {
    try {
      const response = await apiClient.delete(`/my-vehicles/${vehicleId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du véhicule');
    }
  }
};

export default vehicleService;
