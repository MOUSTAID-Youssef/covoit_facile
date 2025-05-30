import React, { useState, useEffect } from 'react';
import {
  FaCar, FaSearch, FaFilter, FaCheck, FaTimes, FaEye, FaSpinner,
  FaExclamationTriangle, FaDownload, FaSort, FaUser, FaClock,
  FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationComment, setVerificationComment] = useState('');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const result = await adminService.getVehicles();
      if (result.success) {
        setVehicles(result.data);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors du chargement des véhicules');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVehicle = async (vehicleId, status) => {
    setActionLoading(true);
    try {
      const result = await adminService.verifyVehicle(vehicleId, status, verificationComment);
      if (result.success) {
        setSuccessMessage(result.message);
        setVerificationComment('');
        loadVehicles();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la vérification');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.user?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.user?.nom?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || vehicle.statut_verification === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_attente': { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, label: 'En attente' },
      'verifie': { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, label: 'Vérifié' },
      'rejete': { color: 'bg-red-100 text-red-800', icon: FaTimesCircle, label: 'Rejeté' }
    };

    const config = statusConfig[status] || statusConfig['en_attente'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="mr-1" />
        {config.label}
      </span>
    );
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
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gestion des véhicules</h1>
          <p className="text-gray-600 text-sm">{vehicles.length} véhicules au total</p>
        </div>
        <button
          onClick={loadVehicles}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <FaSpinner className={loading ? 'animate-spin' : ''} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
          <button onClick={() => setSuccessMessage('')} className="float-right">×</button>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
          <button onClick={() => setErrorMessage('')} className="float-right">×</button>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un véhicule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="verifie">Vérifiés</option>
            <option value="rejete">Rejetés</option>
          </select>

          <button
            onClick={loadVehicles}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaSort />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Table des véhicules */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'ajout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCar className="text-indigo-500 mr-3 text-xl" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.marque} {vehicle.modele}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.annee} • {vehicle.couleur}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={vehicle.user?.photo_url ? `http://localhost:8000/storage/${vehicle.user.photo_url}` : '/images/default-avatar.svg'}
                        alt=""
                        className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.svg';
                        }}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.user?.prenom} {vehicle.user?.nom}
                        </div>
                        <div className="text-sm text-gray-500">{vehicle.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Places: {vehicle.nombre_places}</div>
                      <div className="text-gray-500">Type: {vehicle.type_vehicule}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(vehicle.statut_verification)}
                    {vehicle.commentaire_verification && (
                      <div className="text-xs text-gray-500 mt-1">
                        {vehicle.commentaire_verification}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(vehicle.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Voir détails"
                      >
                        <FaEye />
                      </button>

                      {vehicle.statut_verification === 'en_attente' && (
                        <>
                          <button
                            onClick={() => handleVerifyVehicle(vehicle.id, 'verifie')}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Approuver"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleVerifyVehicle(vehicle.id, 'rejete')}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Rejeter"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}

                      {vehicle.statut_verification === 'rejete' && (
                        <button
                          onClick={() => handleVerifyVehicle(vehicle.id, 'verifie')}
                          disabled={actionLoading}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Approuver"
                        >
                          <FaCheck />
                        </button>
                      )}

                      {vehicle.statut_verification === 'verifie' && (
                        <button
                          onClick={() => handleVerifyVehicle(vehicle.id, 'rejete')}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Rejeter"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zone de commentaire pour la vérification */}
      {vehicles.some(v => v.statut_verification === 'en_attente') && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Commentaire de vérification</h3>
          <textarea
            value={verificationComment}
            onChange={(e) => setVerificationComment(e.target.value)}
            placeholder="Ajoutez un commentaire pour la vérification (optionnel)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-2">
            Ce commentaire sera visible par le propriétaire du véhicule.
          </p>
        </div>
      )}

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <FaCar className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">Aucun véhicule trouvé</p>
        </div>
      )}
    </div>
  );
};

export default VehiclesManagement;
