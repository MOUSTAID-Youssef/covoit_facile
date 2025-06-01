import React, { useState } from 'react';
import { FaCar, FaSpinner, FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const VehicleForm = ({ onVehicleAdded, onCancel, existingVehicle = null }) => {
  const [formData, setFormData] = useState({
    marque: existingVehicle?.marque || '',
    modele: existingVehicle?.modele || '',
    couleur: existingVehicle?.couleur || '',
    annee: existingVehicle?.annee || '',
    nombre_places: existingVehicle?.nombre_places || 4,
    description: existingVehicle?.description || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.marque.trim()) {
      newErrors.marque = 'La marque est obligatoire';
    }
    
    if (!formData.modele.trim()) {
      newErrors.modele = 'Le modèle est obligatoire';
    }
    
    if (!formData.couleur.trim()) {
      newErrors.couleur = 'La couleur est obligatoire';
    }
    
    if (!formData.annee) {
      newErrors.annee = 'L\'année est obligatoire';
    } else {
      const year = parseInt(formData.annee);
      const currentYear = new Date().getFullYear();
      if (year < 1990 || year > currentYear + 1) {
        newErrors.annee = `L'année doit être entre 1990 et ${currentYear + 1}`;
      }
    }
    
    if (!formData.nombre_places) {
      newErrors.nombre_places = 'Le nombre de places est obligatoire';
    } else {
      const places = parseInt(formData.nombre_places);
      if (places < 2 || places > 8) {
        newErrors.nombre_places = 'Le nombre de places doit être entre 2 et 8';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Appeler la fonction de callback avec les données du véhicule
      await onVehicleAdded(formData);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du véhicule:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear + 1; year >= 1990; year--) {
    years.push(year);
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaCar className="text-2xl text-indigo-500" />
          <h3 className="text-lg font-medium text-gray-900">
            {existingVehicle ? 'Modifier mon véhicule' : 'Ajouter mon véhicule'}
          </h3>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="text-xl" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marque *
            </label>
            <input
              type="text"
              name="marque"
              value={formData.marque}
              onChange={handleInputChange}
              placeholder="Ex: Toyota, Renault, BMW..."
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.marque ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.marque && (
              <p className="mt-1 text-sm text-red-600">{errors.marque}</p>
            )}
          </div>

          {/* Modèle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modèle *
            </label>
            <input
              type="text"
              name="modele"
              value={formData.modele}
              onChange={handleInputChange}
              placeholder="Ex: Corolla, Clio, X3..."
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.modele ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.modele && (
              <p className="mt-1 text-sm text-red-600">{errors.modele}</p>
            )}
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur *
            </label>
            <select
              name="couleur"
              value={formData.couleur}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.couleur ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Sélectionner une couleur</option>
              <option value="Blanc">Blanc</option>
              <option value="Noir">Noir</option>
              <option value="Gris">Gris</option>
              <option value="Rouge">Rouge</option>
              <option value="Bleu">Bleu</option>
              <option value="Vert">Vert</option>
              <option value="Jaune">Jaune</option>
              <option value="Orange">Orange</option>
              <option value="Violet">Violet</option>
              <option value="Marron">Marron</option>
              <option value="Argent">Argent</option>
              <option value="Autre">Autre</option>
            </select>
            {errors.couleur && (
              <p className="mt-1 text-sm text-red-600">{errors.couleur}</p>
            )}
          </div>

          {/* Année */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année *
            </label>
            <select
              name="annee"
              value={formData.annee}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.annee ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Sélectionner une année</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.annee && (
              <p className="mt-1 text-sm text-red-600">{errors.annee}</p>
            )}
          </div>

          {/* Nombre de places */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de places (conducteur inclus) *
            </label>
            <select
              name="nombre_places"
              value={formData.nombre_places}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.nombre_places ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Sélectionner le nombre de places</option>
              <option value="2">2 places</option>
              <option value="3">3 places</option>
              <option value="4">4 places</option>
              <option value="5">5 places</option>
              <option value="6">6 places</option>
              <option value="7">7 places</option>
              <option value="8">8 places</option>
            </select>
            {errors.nombre_places && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre_places}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Informations supplémentaires sur votre véhicule..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Boutons */}
        <div className="flex space-x-3 pt-4 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>{existingVehicle ? 'Modification...' : 'Ajout...'}</span>
              </>
            ) : (
              <>
                <FaCheckCircle />
                <span>{existingVehicle ? 'Modifier le véhicule' : 'Ajouter le véhicule'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Note informative */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <FaCar className="text-blue-500 mt-1" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Important :</p>
            <p>
              Vous devez ajouter un véhicule pour pouvoir proposer des trajets. 
              Un seul véhicule par conducteur est autorisé. Vous pourrez le modifier à tout moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;
