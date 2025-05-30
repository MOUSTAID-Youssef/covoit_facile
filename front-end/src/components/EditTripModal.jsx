import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaEuroSign, FaUsers } from 'react-icons/fa';

const EditTripModal = ({ trip, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    ville_depart: '',
    ville_arrivee: '',
    date_depart: '',
    heure_depart: '',
    prix: '',
    places_disponibles: '',
    description: '',
    statut: 'actif'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Villes marocaines
  const villesMarocaines = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda',
    'Kenitra', 'Tétouan', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Béni Mellal',
    'Nador', 'Taza', 'Settat', 'Larache', 'Ksar El Kebir', 'Guelmim', 'Berrechid',
    'Khemisset', 'Errachidia', 'Ouarzazate', 'Dakhla', 'Laâyoune'
  ];

  useEffect(() => {
    if (trip && isOpen) {
      setFormData({
        ville_depart: trip.ville_depart || '',
        ville_arrivee: trip.ville_arrivee || '',
        date_depart: trip.date_depart || '',
        heure_depart: trip.heure_depart || '',
        prix: trip.prix || '',
        places_disponibles: trip.places_disponibles || '',
        description: trip.description || '',
        statut: trip.statut || 'actif'
      });
      setErrors({});
    }
  }, [trip, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      console.log('✏️ Modification du trajet:', trip.id, formData);

      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      
      const response = await fetch(`http://localhost:8000/api/trips/${trip.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('📤 Réponse de modification:', result);

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message || 'Erreur lors de la modification' });
        }
        return;
      }

      if (result.success) {
        onSuccess(result.message || 'Trajet modifié avec succès !');
        onClose();
      } else {
        setErrors(result.errors || { general: result.message || 'Erreur lors de la modification' });
      }
    } catch (error) {
      console.error('💥 Erreur lors de la modification:', error);
      setErrors({ general: 'Erreur de connexion lors de la modification' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Modifier le trajet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Trip Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 mb-2">
            <FaMapMarkerAlt className="text-indigo-600" />
            <div className="text-lg font-semibold text-gray-900">
              {trip.ville_depart} → {trip.ville_arrivee}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Trajet créé le {new Date(trip.created_at).toLocaleDateString('fr-FR')}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Erreur générale */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ville de départ */}
            <div>
              <label htmlFor="ville_depart" className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-1" />
                Ville de départ *
              </label>
              <select
                id="ville_depart"
                name="ville_depart"
                value={formData.ville_depart}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.ville_depart ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Sélectionner une ville</option>
                {villesMarocaines.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
              {errors.ville_depart && (
                <p className="mt-1 text-sm text-red-600">{errors.ville_depart[0]}</p>
              )}
            </div>

            {/* Ville d'arrivée */}
            <div>
              <label htmlFor="ville_arrivee" className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-1" />
                Ville d'arrivée *
              </label>
              <select
                id="ville_arrivee"
                name="ville_arrivee"
                value={formData.ville_arrivee}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.ville_arrivee ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Sélectionner une ville</option>
                {villesMarocaines.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
              {errors.ville_arrivee && (
                <p className="mt-1 text-sm text-red-600">{errors.ville_arrivee[0]}</p>
              )}
            </div>

            {/* Date de départ */}
            <div>
              <label htmlFor="date_depart" className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-1" />
                Date de départ *
              </label>
              <input
                type="date"
                id="date_depart"
                name="date_depart"
                value={formData.date_depart}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.date_depart ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.date_depart && (
                <p className="mt-1 text-sm text-red-600">{errors.date_depart[0]}</p>
              )}
            </div>

            {/* Heure de départ */}
            <div>
              <label htmlFor="heure_depart" className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-1" />
                Heure de départ *
              </label>
              <input
                type="time"
                id="heure_depart"
                name="heure_depart"
                value={formData.heure_depart}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.heure_depart ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.heure_depart && (
                <p className="mt-1 text-sm text-red-600">{errors.heure_depart[0]}</p>
              )}
            </div>

            {/* Prix */}
            <div>
              <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-2">
                <FaEuroSign className="inline mr-1" />
                Prix par place (MAD) *
              </label>
              <input
                type="number"
                id="prix"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.prix ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.prix && (
                <p className="mt-1 text-sm text-red-600">{errors.prix[0]}</p>
              )}
            </div>

            {/* Places disponibles */}
            <div>
              <label htmlFor="places_disponibles" className="block text-sm font-medium text-gray-700 mb-2">
                <FaUsers className="inline mr-1" />
                Places disponibles *
              </label>
              <input
                type="number"
                id="places_disponibles"
                name="places_disponibles"
                value={formData.places_disponibles}
                onChange={handleChange}
                min="1"
                max="8"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.places_disponibles ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.places_disponibles && (
                <p className="mt-1 text-sm text-red-600">{errors.places_disponibles[0]}</p>
              )}
            </div>

            {/* Statut */}
            <div>
              <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                id="statut"
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="actif">Actif</option>
                <option value="complet">Complet</option>
                <option value="annule">Annulé</option>
                <option value="termine">Terminé</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ajoutez des informations supplémentaires sur votre trajet..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Modification...</span>
                </>
              ) : (
                <span>Modifier le trajet</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTripModal;
