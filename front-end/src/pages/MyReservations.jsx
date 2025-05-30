import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner, FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt, FaCar, FaUser, FaTrash } from 'react-icons/fa';
import reservationService from '../services/reservationService';

const MyReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === 'voyageur') {
      loadMyReservations();
    }
  }, [user]);

  const loadMyReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement de mes réservations...');
      
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
        // Supprimer la réservation de la liste
        setReservations(reservations.filter(r => r.id !== reservationId));
        alert(result.message || 'Réservation annulée avec succès');
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
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'confirmee': 'bg-green-100 text-green-800',
      'annulee': 'bg-red-100 text-red-800'
    };
    
    const labels = {
      'en_attente': 'En attente',
      'confirmee': 'Confirmée',
      'annulee': 'Annulée'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[statut] || 'bg-gray-100 text-gray-800'}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  if (!user || user.role !== 'voyageur') {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Seuls les voyageurs peuvent accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement de vos réservations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadMyReservations}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Réservations</h1>
          <p className="text-gray-600 mt-2">Gérez vos réservations de trajets</p>
        </div>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucune réservation</h2>
            <p className="text-gray-600 mb-6">Vous n'avez pas encore fait de réservation. Explorez les trajets disponibles !</p>
            <a
              href="/search"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Rechercher des trajets</span>
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map(reservation => (
              <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
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
                      {reservation.trajet.conducteur.badge_verifie && (
                        <span className="text-green-600 text-xs">✓ Vérifié</span>
                      )}
                    </div>
                  </div>
                )}

                {reservation.trajet?.conducteur?.vehicules && reservation.trajet.conducteur.vehicules.length > 0 && (
                  <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
                    <FaCar className="text-indigo-500" />
                    <span>
                      {reservation.trajet.conducteur.vehicules[0].marque} {reservation.trajet.conducteur.vehicules[0].modele}
                      {reservation.trajet.conducteur.vehicules[0].couleur && ` (${reservation.trajet.conducteur.vehicules[0].couleur})`}
                    </span>
                  </div>
                )}

                {reservation.message && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Votre message:</strong> {reservation.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
