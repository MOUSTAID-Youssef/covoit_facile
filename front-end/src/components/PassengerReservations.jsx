import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt, FaCar, FaUser, FaTrash, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import reservationService from '../services/reservationService';

const PassengerReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des réservations du voyageur...');
      
      const result = await reservationService.getMyReservations();
      
      if (result.success) {
        setReservations(result.reservations || []);
      } else {
        setError(result.message || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('💥 Erreur lors du chargement:', error);
      setError('Erreur de connexion: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      const result = await reservationService.cancelReservation(reservationId);
      
      if (result.success) {
        setSuccessMessage(result.message || 'Réservation annulée avec succès');
        setReservations(reservations.filter(r => r.id !== reservationId));
        
        // Effacer le message après 3 secondes
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(result.message || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error('💥 Erreur:', error);
      alert('Erreur lors de l\'annulation de la réservation');
    }
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'en_attente': { class: 'bg-yellow-100 text-yellow-800', icon: FaClock },
      'confirmee': { class: 'bg-green-100 text-green-800', icon: FaCheck },
      'annulee': { class: 'bg-red-100 text-red-800', icon: FaTimes }
    };
    
    const labels = {
      'en_attente': 'En attente',
      'confirmee': 'Confirmée',
      'annulee': 'Annulée'
    };

    const config = badges[statut] || { class: 'bg-gray-100 text-gray-800', icon: FaClock };
    const IconComponent = config.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.class} flex items-center space-x-1`}>
        <IconComponent className="w-3 h-3" />
        <span>{labels[statut] || statut}</span>
      </span>
    );
  };

  const getStatusMessage = (statut) => {
    const messages = {
      'en_attente': 'Votre demande de réservation est en attente de validation par le conducteur.',
      'confirmee': 'Votre réservation a été confirmée par le conducteur. Bon voyage !',
      'annulee': 'Cette réservation a été annulée.'
    };
    
    return messages[statut] || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadReservations}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message de succès */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCheck className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mes Réservations</h2>
        <p className="text-gray-600">{reservations.length} réservation{reservations.length > 1 ? 's' : ''}</p>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-4">Aucune réservation</h3>
          <p className="text-gray-600 mb-6">Vous n'avez pas encore fait de réservation.</p>
          <a
            href="/search"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Rechercher des trajets</span>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(reservation => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              {/* En-tête de la réservation */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-xl font-bold text-gray-900">
                    {reservation.trajet?.ville_depart} → {reservation.trajet?.ville_arrivee}
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {reservation.trajet?.prix * reservation.nombre_places} MAD
                  </div>
                  {getStatusBadge(reservation.statut)}
                </div>
                
                {reservation.statut === 'en_attente' && (
                  <button
                    onClick={() => cancelReservation(reservation.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <FaTrash />
                    <span>Annuler</span>
                  </button>
                )}
              </div>

              {/* Message de statut */}
              <div className={`p-3 rounded-md mb-4 ${
                reservation.statut === 'en_attente' ? 'bg-yellow-50 border border-yellow-200' :
                reservation.statut === 'confirmee' ? 'bg-green-50 border border-green-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  reservation.statut === 'en_attente' ? 'text-yellow-800' :
                  reservation.statut === 'confirmee' ? 'text-green-800' :
                  'text-red-800'
                }`}>
                  {getStatusMessage(reservation.statut)}
                </p>
              </div>
              
              {/* Détails du trajet */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-indigo-500" />
                  <span>{reservation.trajet?.date_depart} à {reservation.trajet?.heure_depart}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaUser className="text-indigo-500" />
                  <span>{reservation.nombre_places} place{reservation.nombre_places > 1 ? 's' : ''}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Réservé le {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Informations du conducteur */}
              {reservation.trajet?.conducteur && (
                <div className="flex items-center space-x-3 mb-3 p-3 bg-gray-50 rounded-md">
                  <img
                    src={reservation.trajet.conducteur.photo_url || '/images/default-avatar.svg'}
                    alt={`${reservation.trajet.conducteur.prenom} ${reservation.trajet.conducteur.nom}`}
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      Conducteur: {reservation.trajet.conducteur.prenom} {reservation.trajet.conducteur.nom}
                    </div>
                    <div className="text-sm text-gray-600">
                      {reservation.trajet.conducteur.email}
                    </div>
                    {reservation.trajet.conducteur.badge_verifie && (
                      <span className="text-green-600 text-xs">✓ Vérifié</span>
                    )}
                  </div>
                </div>
              )}

              {/* Informations du véhicule */}
              {reservation.trajet?.conducteur?.vehicules && reservation.trajet.conducteur.vehicules.length > 0 && (
                <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
                  <FaCar className="text-indigo-500" />
                  <span>
                    {reservation.trajet.conducteur.vehicules[0].marque} {reservation.trajet.conducteur.vehicules[0].modele}
                    {reservation.trajet.conducteur.vehicules[0].couleur && ` (${reservation.trajet.conducteur.vehicules[0].couleur})`}
                  </span>
                </div>
              )}

              {/* Message du voyageur */}
              {reservation.message && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Votre message:</strong> {reservation.message}
                  </p>
                </div>
              )}

              {/* Actions selon le statut */}
              {reservation.statut === 'confirmee' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800 font-medium">
                    🎉 Votre réservation est confirmée ! Contactez le conducteur pour les détails du rendez-vous.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassengerReservations;
