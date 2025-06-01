import React, { useState, useEffect } from 'react';
import {
  FaCar, FaSearch, FaEye, FaSpinner, FaUser, FaCalendarAlt,
  FaPalette, FaTimes
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const VehiclesManagementImproved = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const result = await adminService.getVehicles();
      if (result.success) {
        setVehicles(result.data || []);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors du chargement des véhicules');
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.couleur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.proprietaire?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.proprietaire?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.proprietaire?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  };

  const getUserPhotoUrl = (photoPath) => {
    if (!photoPath) return '/images/default-avatar.svg';
    if (photoPath.startsWith('http')) return photoPath;
    if (photoPath.startsWith('/')) return photoPath;
    return `http://localhost:8000/storage/${photoPath}`;
  };

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
        <span className="ml-2 text-gray-600">Chargement des véhicules...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Véhicules</h1>
          <p className="text-gray-600 mt-1">
            Gestion des véhicules avec photos réelles des propriétaires
          </p>
        </div>
        <button
          onClick={loadVehicles}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FaSpinner className={loading ? 'animate-spin' : ''} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
          <button onClick={() => setSuccessMessage('')} className="float-right">×</button>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
          <button onClick={() => setErrorMessage('')} className="float-right">×</button>
        </div>
      )}

      {/* Recherche */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par marque, modèle, propriétaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Liste des véhicules */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propriétaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Détails
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => {
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <FaCar className="text-indigo-500 text-xl" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.marque} {vehicle.modele}
                          </div>
                          <div className="text-sm text-gray-500">ID: {vehicle.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getUserPhotoUrl(vehicle.proprietaire?.photo_profil || vehicle.user?.photo_profil)}
                          alt={`${vehicle.proprietaire?.prenom || vehicle.user?.prenom} ${vehicle.proprietaire?.nom || vehicle.user?.nom}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.svg';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.proprietaire?.prenom || vehicle.user?.prenom} {vehicle.proprietaire?.nom || vehicle.user?.nom}
                          </div>
                          <div className="text-sm text-gray-500">{vehicle.proprietaire?.email || vehicle.user?.email}</div>
                          {(vehicle.proprietaire?.telephone || vehicle.user?.telephone) && (
                            <div className="text-sm text-gray-500">
                              📞 {vehicle.proprietaire?.telephone || vehicle.user?.telephone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaPalette className="mr-2 text-gray-400" />
                          {vehicle.couleur}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {vehicle.annee}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(vehicle)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                      >
                        <FaEye />
                        <span>Voir</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <FaCar className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails du véhicule #{selectedVehicle.id}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Informations du véhicule */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">
                    <FaCar className="inline mr-2" />
                    Informations du véhicule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Marque</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVehicle.marque}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Modèle</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVehicle.modele}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Couleur</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVehicle.couleur}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Année</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVehicle.annee}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre de places</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedVehicle.nombre_places}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date d'ajout</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedVehicle.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations du propriétaire */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-900 mb-3">
                    <FaUser className="inline mr-2" />
                    Propriétaire
                  </h3>
                  <div className="flex items-center space-x-4">
                    <img
                      src={getUserPhotoUrl(selectedVehicle.proprietaire?.photo_profil || selectedVehicle.user?.photo_profil)}
                      alt={`${selectedVehicle.proprietaire?.prenom || selectedVehicle.user?.prenom} ${selectedVehicle.proprietaire?.nom || selectedVehicle.user?.nom}`}
                      className="w-16 h-16 rounded-full border-2 border-green-200 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/default-avatar.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900">
                        {selectedVehicle.proprietaire?.prenom || selectedVehicle.user?.prenom} {selectedVehicle.proprietaire?.nom || selectedVehicle.user?.nom}
                      </h4>
                      <p className="text-sm text-green-700">{selectedVehicle.proprietaire?.email || selectedVehicle.user?.email}</p>
                      {(selectedVehicle.proprietaire?.telephone || selectedVehicle.user?.telephone) && (
                        <p className="text-sm text-green-700">
                          📞 {selectedVehicle.proprietaire?.telephone || selectedVehicle.user?.telephone}
                        </p>
                      )}
                      <p className="text-sm text-green-600 mt-1">
                        Rôle: {selectedVehicle.proprietaire?.role || selectedVehicle.user?.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description si disponible */}
                {selectedVehicle.description && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-700">{selectedVehicle.description}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesManagementImproved;
