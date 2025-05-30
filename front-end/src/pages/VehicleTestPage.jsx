import React from 'react';
import { FaCar, FaUser, FaCheck } from 'react-icons/fa';
import VehicleManagement from '../components/VehicleManagement';

const VehicleTestPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test - Gestion des Véhicules</h1>
          <p className="text-gray-600">Interface pour que les conducteurs gèrent leurs véhicules</p>
        </div>

        {/* Informations importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Fonctionnalités testables :</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ajouter un nouveau véhicule</li>
            <li>• Modifier les informations d'un véhicule existant</li>
            <li>• Supprimer un véhicule</li>
            <li>• Voir le statut de vérification (en attente, vérifié, rejeté)</li>
            <li>• Voir les commentaires de rejet de l'admin</li>
          </ul>
        </div>

        {/* Composant de gestion des véhicules */}
        <VehicleManagement />

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">Instructions :</h3>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. <strong>Connectez-vous comme conducteur</strong> pour tester cette fonctionnalité</li>
            <li>2. <strong>Ajoutez un véhicule</strong> en cliquant sur "Ajouter un véhicule"</li>
            <li>3. <strong>Modifiez un véhicule</strong> en cliquant sur "Modifier"</li>
            <li>4. <strong>Supprimez un véhicule</strong> en cliquant sur "Supprimer"</li>
            <li>5. <strong>Vérifiez les statuts</strong> - Les véhicules sont en attente de vérification par défaut</li>
          </ol>
        </div>

        {/* APIs utilisées */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">APIs utilisées :</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>GET /api/my-vehicles</strong> - Récupérer les véhicules du conducteur</p>
            <p><strong>POST /api/my-vehicles</strong> - Ajouter un nouveau véhicule</p>
            <p><strong>PUT /api/my-vehicles/{id}</strong> - Modifier un véhicule</p>
            <p><strong>DELETE /api/my-vehicles/{id}</strong> - Supprimer un véhicule</p>
          </div>
        </div>

        {/* Liens rapides */}
        <div className="mt-6 flex space-x-4">
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaUser className="mr-2" />
            Se connecter comme conducteur
          </a>
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaCheck className="mr-2" />
            Dashboard Admin
          </a>
          <a
            href="/profile"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaCar className="mr-2" />
            Profil Conducteur
          </a>
        </div>
      </div>
    </div>
  );
};

export default VehicleTestPage;
