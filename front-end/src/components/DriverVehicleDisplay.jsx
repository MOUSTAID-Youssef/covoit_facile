import React, { useState } from 'react';
import {
  FaCar, FaEdit, FaTrash, FaCalendarAlt, FaPalette, FaUsers, FaSpinner
} from 'react-icons/fa';

const DriverVehicleDisplay = ({ vehicle, onEdit, onDelete, loading = false }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);



  const handleDelete = async () => {
    if (!onDelete) return;
    
    setDeleting(true);
    try {
      await onDelete(vehicle.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-2xl text-indigo-600" />
          <span className="ml-2 text-gray-600">Chargement du véhicule...</span>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <FaCar className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule enregistré</h3>
          <p className="text-gray-500 mb-4">
            Vous devez ajouter un véhicule pour pouvoir proposer des trajets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaCar className="text-2xl text-indigo-500" />
          <h3 className="text-lg font-medium text-gray-900">Mon véhicule</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Informations principales */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FaCar className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Véhicule</p>
              <p className="text-lg font-semibold text-gray-900">
                {vehicle.marque} {vehicle.modele}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaPalette className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Couleur</p>
              <p className="text-gray-900">{vehicle.couleur}</p>
            </div>
          </div>
        </div>

        {/* Informations secondaires */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Année</p>
              <p className="text-gray-900">{vehicle.annee}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FaUsers className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Nombre de places</p>
              <p className="text-gray-900">{vehicle.nombre_places} places</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {vehicle.description && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
          <p className="text-gray-900">{vehicle.description}</p>
        </div>
      )}

      {/* Date d'ajout */}
      <div className="mb-6 text-sm text-gray-500">
        Ajouté le {new Date(vehicle.created_at).toLocaleDateString('fr-FR')}
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t">
        {onEdit && (
          <button
            onClick={() => onEdit(vehicle)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaEdit />
            <span>Modifier</span>
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            <FaTrash />
            <span>Supprimer</span>
          </button>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Êtes-vous sûr de vouloir supprimer ce véhicule ?
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FaCar className="text-red-500" />
                  <span className="font-medium text-red-900">
                    {vehicle.marque} {vehicle.modele}
                  </span>
                </div>
                <p className="text-sm text-red-700">
                  Cette action est irréversible. Vous ne pourrez plus proposer de trajets 
                  tant que vous n'aurez pas ajouté un nouveau véhicule.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <>
                    <FaTrash />
                    <span>Supprimer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverVehicleDisplay;
