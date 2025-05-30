import React, { useState, useEffect } from 'react';
import { 
  FaCar, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner,
  FaExclamationTriangle, FaClock, FaCheckCircle
} from 'react-icons/fa';
import vehicleService from '../services/vehicleService';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    couleur: '',
    nombre_places: 4,
    type_vehicule: 'berline'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const typeVehiculeOptions = [
    { value: 'berline', label: 'Berline' },
    { value: 'suv', label: 'SUV' },
    { value: 'break', label: 'Break' },
    { value: 'coupe', label: 'Coupé' },
    { value: 'cabriolet', label: 'Cabriolet' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'utilitaire', label: 'Utilitaire' }
  ];

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const result = await vehicleService.getMyVehicles();
      if (result.success) {
        setVehicles(result.vehicles);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      let result;
      if (editingVehicle) {
        result = await vehicleService.updateVehicle(editingVehicle.id, formData);
      } else {
        result = await vehicleService.addVehicle(formData);
      }
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: editingVehicle ? 'Véhicule modifié avec succès' : 'Véhicule ajouté avec succès'
        });
        resetForm();
        loadVehicles();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      marque: vehicle.marque,
      modele: vehicle.modele,
      annee: vehicle.annee,
      couleur: vehicle.couleur,
      nombre_places: vehicle.nombre_places,
      type_vehicule: vehicle.type_vehicule
    });
    setShowForm(true);
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      return;
    }

    try {
      const result = await vehicleService.deleteVehicle(vehicleId);
      if (result.success) {
        setMessage({ type: 'success', text: 'Véhicule supprimé avec succès' });
        loadVehicles();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      marque: '',
      modele: '',
      annee: new Date().getFullYear(),
      couleur: '',
      nombre_places: 4,
      type_vehicule: 'berline'
    });
    setEditingVehicle(null);
    setShowForm(false);
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'verifie':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejete':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'verifie':
        return 'Vérifié';
      case 'rejete':
        return 'Rejeté';
      default:
        return 'En attente';
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'verifie':
        return 'bg-green-100 text-green-800';
      case 'rejete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FaSpinner className="animate-spin text-2xl text-indigo-600 mr-2" />
        <span>Chargement des véhicules...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mes véhicules</h2>
          <p className="text-gray-600">Gérez vos véhicules pour proposer des trajets</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FaPlus />
          <span>Ajouter un véhicule</span>
        </button>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })} className="float-right">×</button>
        </div>
      )}

      {/* Liste des véhicules */}
      {vehicles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaCar className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule</h3>
          <p className="text-gray-500 mb-4">Ajoutez votre premier véhicule pour commencer à proposer des trajets</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaPlus />
            <span>Ajouter un véhicule</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FaCar className="text-indigo-500" />
                  <h3 className="font-medium text-gray-900">
                    {vehicle.marque} {vehicle.modele}
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(vehicle.statut_verification)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.statut_verification)}`}>
                    {getStatusText(vehicle.statut_verification)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Année:</span>
                  <span>{vehicle.annee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Couleur:</span>
                  <span>{vehicle.couleur}</span>
                </div>
                <div className="flex justify-between">
                  <span>Places:</span>
                  <span>{vehicle.nombre_places}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="capitalize">{vehicle.type_vehicule}</span>
                </div>
              </div>

              {vehicle.commentaire_verification && vehicle.statut_verification === 'rejete' && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <FaExclamationTriangle className="text-red-500 text-sm" />
                    <span className="text-sm font-medium text-red-800">Motif du rejet:</span>
                  </div>
                  <p className="text-sm text-red-700">{vehicle.commentaire_verification}</p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <FaEdit />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <FaTrash />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                  <input
                    type="text"
                    value={formData.marque}
                    onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                  <input
                    type="text"
                    value={formData.modele}
                    onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={formData.annee}
                    onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                  <input
                    type="text"
                    value={formData.couleur}
                    onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de places</label>
                  <select
                    value={formData.nombre_places}
                    onChange={(e) => setFormData({ ...formData, nombre_places: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} place{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de véhicule</label>
                  <select
                    value={formData.type_vehicule}
                    onChange={(e) => setFormData({ ...formData, type_vehicule: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    {typeVehiculeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {formLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  <span>{editingVehicle ? 'Modifier' : 'Ajouter'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
