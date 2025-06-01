import React, { useState, useEffect } from 'react';
import {
  FaIdCard, FaCheck, FaTimes, FaSpinner, FaEye, FaUser, FaCalendarAlt,
  FaEnvelope, FaPhone, FaExclamationTriangle, FaClock, FaCheckCircle
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const AccountVerificationWithStates = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('en_attente');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, activeFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getUsers();
      if (result.success) {
        // Filtrer seulement les utilisateurs qui ont uploadé un document d'identité
        const usersWithDocuments = result.data.filter(user => user.cin_path);
        setUsers(usersWithDocuments);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [];
    
    switch (activeFilter) {
      case 'verifie':
        // Vérifiés : ont un document ET badge_verifie = true
        filtered = users.filter(user => user.cin_path && user.badge_verifie === true);
        break;
      case 'en_attente':
        // En attente : ont un document MAIS badge_verifie = false/null
        filtered = users.filter(user => user.cin_path && !user.badge_verifie);
        break;
      case 'rejete':
        // Rejetés : ont un document ET statut_verification = 'rejete'
        filtered = users.filter(user => user.cin_path && user.statut_verification === 'rejete');
        break;
      default:
        filtered = users;
    }
    
    setFilteredUsers(filtered);
  };

  const handleVerifyUser = async (userId, action) => {
    setActionLoading(true);
    try {
      let result;
      
      if (action === 'approve') {
        // Approuver : badge_verifie = true
        result = await adminService.updateUser(userId, { 
          badge_verifie: true,
          statut_verification: 'verifie'
        });
        setSuccessMessage('Compte vérifié avec succès');
      } else if (action === 'reject') {
        // Rejeter : badge_verifie = false, statut_verification = 'rejete'
        result = await adminService.updateUser(userId, { 
          badge_verifie: false,
          statut_verification: 'rejete'
        });
        setSuccessMessage('Compte rejeté');
      }
      
      if (result.success) {
        loadUsers();
        setShowModal(false);
        setSelectedUser(null);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la vérification');
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const getStatusInfo = (user) => {
    if (user.badge_verifie === true) {
      return {
        status: 'verifie',
        label: 'Vérifié',
        color: 'bg-green-100 text-green-800',
        icon: FaCheckCircle
      };
    } else if (user.statut_verification === 'rejete') {
      return {
        status: 'rejete',
        label: 'Rejeté',
        color: 'bg-red-100 text-red-800',
        icon: FaTimes
      };
    } else {
      return {
        status: 'en_attente',
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: FaClock
      };
    }
  };

  const filters = [
    { key: 'en_attente', label: 'En attente', count: users.filter(u => u.cin_path && !u.badge_verifie && u.statut_verification !== 'rejete').length },
    { key: 'verifie', label: 'Vérifiés', count: users.filter(u => u.cin_path && u.badge_verifie === true).length },
    { key: 'rejete', label: 'Rejetés', count: users.filter(u => u.cin_path && u.statut_verification === 'rejete').length }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
        <span className="ml-2 text-gray-600">Chargement des comptes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vérification des comptes</h1>
          <p className="text-gray-600 mt-1">
            Gestion des documents d'identité uploadés par les utilisateurs
          </p>
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
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

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtrer par statut</h3>
        <div className="flex space-x-4">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                activeFilter === filter.key
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>{filter.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeFilter === filter.key
                  ? 'bg-white text-indigo-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Liste des utilisateurs */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FaIdCard className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun utilisateur dans cette catégorie
          </h3>
          <p className="text-gray-500">
            {activeFilter === 'en_attente' && 'Aucun document en attente de vérification.'}
            {activeFilter === 'verifie' && 'Aucun compte vérifié pour le moment.'}
            {activeFilter === 'rejete' && 'Aucun document rejeté.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const statusInfo = getStatusInfo(user);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={user.photo_url ? `http://localhost:8000/storage/${user.photo_url}` : '/images/default-avatar.svg'}
                    alt={`${user.prenom} ${user.nom}`}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
                    onError={(e) => {
                      e.target.src = '/images/default-avatar.svg';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{user.prenom} {user.nom}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'conducteur' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="mr-1" />
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaPhone className="mr-2" />
                    <span>{user.telephone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <span>Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <FaIdCard className="mr-2" />
                    <span>Document d'identité uploadé</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(user)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <FaEye />
                    <span>Examiner</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de vérification */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Vérification du compte de {selectedUser.prenom} {selectedUser.nom}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Statut actuel */}
              <div className="mb-4">
                {(() => {
                  const statusInfo = getStatusInfo(selectedUser);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
                      <StatusIcon className="mr-2" />
                      Statut actuel : {statusInfo.label}
                    </div>
                  );
                })()}
              </div>

              {/* Informations utilisateur */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={selectedUser.photo_url ? `http://localhost:8000/storage/${selectedUser.photo_url}` : '/images/default-avatar.svg'}
                    alt={`${selectedUser.prenom} ${selectedUser.nom}`}
                    className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
                    onError={(e) => {
                      e.target.src = '/images/default-avatar.svg';
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedUser.prenom} {selectedUser.nom}
                    </h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <p className="text-sm text-gray-500">
                      {selectedUser.role} • Inscrit le {new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document d'identité */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Document d'identité</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <img
                    src={`http://localhost:8000/storage/${selectedUser.cin_path}`}
                    alt="Document d'identité"
                    className="max-w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden text-center py-8 text-gray-500">
                    <FaIdCard className="mx-auto text-4xl mb-2" />
                    <p>Impossible de charger le document</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {!selectedUser.badge_verifie && selectedUser.statut_verification !== 'rejete' && (
                  <>
                    <button
                      onClick={() => handleVerifyUser(selectedUser.id, 'approve')}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                      <span>Accepter</span>
                    </button>
                    <button
                      onClick={() => handleVerifyUser(selectedUser.id, 'reject')}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                      <span>Refuser</span>
                    </button>
                  </>
                )}
                
                {selectedUser.badge_verifie && (
                  <button
                    onClick={() => handleVerifyUser(selectedUser.id, 'reject')}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                    <span>Révoquer la vérification</span>
                  </button>
                )}
                
                {selectedUser.statut_verification === 'rejete' && (
                  <button
                    onClick={() => handleVerifyUser(selectedUser.id, 'approve')}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                    <span>Accepter finalement</span>
                  </button>
                )}
                
                <button
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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

export default AccountVerificationWithStates;
