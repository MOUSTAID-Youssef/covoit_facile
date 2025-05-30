import React, { useState } from 'react';
import { FaTimes, FaUser, FaCar, FaCalendarAlt, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import reservationService from '../services/reservationService';

const ReservationModal = ({ trip, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre_places: 1,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const reservationData = {
        trajet_id: trip.id,
        nombre_places: parseInt(formData.nombre_places),
        message: formData.message
      };

      // Essayer d'abord avec le service
      let result = await reservationService.createReservation(reservationData);
      
      // Si ça échoue, essayer avec fetch direct
      if (!result.success) {
        console.log('🔄 Tentative avec fetch direct...');
        result = await reservationService.createReservationDirect(reservationData);
      }

      if (result.success) {
        onSuccess(result.message || 'Réservation créée avec succès !');
        onClose();
        // Réinitialiser le formulaire
        setFormData({
          nombre_places: 1,
          message: ''
        });
      } else {
        setErrors(result.errors || { general: result.message });
      }
    } catch (error) {
      console.error('💥 Erreur lors de la réservation:', error);
      setErrors({ general: 'Erreur lors de la création de la réservation' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Réserver ce trajet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Trip Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 mb-3">
            <FaMapMarkerAlt className="text-indigo-600" />
            <div className="text-lg font-semibold text-gray-900">
              {trip.ville_depart} → {trip.ville_arrivee}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-indigo-500" />
              <span>{trip.date_depart} à {trip.heure_depart}</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-indigo-600">{trip.prix} MAD</span>
            </div>
          </div>

          {trip.conducteur && (
            <div className="flex items-center space-x-3 mt-3 pt-3 border-t border-gray-200">
              <img
                src={trip.conducteur.photo_url || '/images/default-avatar.svg'}
                alt={`${trip.conducteur.prenom} ${trip.conducteur.nom}`}
                className="w-8 h-8 rounded-full border border-gray-200"
              />
              <div>
                <div className="font-medium text-gray-900">
                  {trip.conducteur.prenom} {trip.conducteur.nom}
                </div>
                {trip.conducteur.badge_verifie && (
                  <span className="text-green-600 text-xs">✓ Vérifié</span>
                )}
              </div>
            </div>
          )}

          {trip.vehicule && (
            <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
              <FaCar className="text-indigo-500" />
              <span>{trip.vehicule.marque} {trip.vehicule.modele}</span>
              {trip.vehicule.couleur && <span>({trip.vehicule.couleur})</span>}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Nombre de places */}
          <div className="mb-4">
            <label htmlFor="nombre_places" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de places
            </label>
            <select
              id="nombre_places"
              name="nombre_places"
              value={formData.nombre_places}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {Array.from({ length: Math.min(trip.places_disponibles, 4) }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num} place{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {trip.places_disponibles} place{trip.places_disponibles > 1 ? 's' : ''} disponible{trip.places_disponibles > 1 ? 's' : ''}
            </p>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message pour le conducteur (optionnel)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Présentez-vous ou ajoutez des informations utiles..."
            />
          </div>

          {/* Erreurs */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              {errors.general && (
                <p className="text-red-600 text-sm">{errors.general}</p>
              )}
              {Object.entries(errors).map(([field, messages]) => {
                if (field === 'general') return null;
                return (
                  <p key={field} className="text-red-600 text-sm">
                    {Array.isArray(messages) ? messages[0] : messages}
                  </p>
                );
              })}
            </div>
          )}

          {/* Prix total */}
          <div className="mb-6 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Prix total :</span>
              <span className="text-lg font-bold text-indigo-600">
                {trip.prix * formData.nombre_places} MAD
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
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
                  <span>Réservation...</span>
                </>
              ) : (
                <span>Confirmer la réservation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
