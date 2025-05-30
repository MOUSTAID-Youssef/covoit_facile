import React, { useState, useEffect } from 'react';
import {
  FaIdCard, FaCheck, FaTimes, FaSpinner, FaEye, FaUser, FaCalendarAlt,
  FaEnvelope, FaPhone, FaExclamationTriangle
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const AccountVerification = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getUsers();
      if (result.success) {
        // Filtrer les utilisateurs avec des documents d'identité non vérifiés
        const pending = result.data.filter(user =>
          user.cin_path && !user.badge_verifie
        );
        setPendingUsers(pending);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors du chargement des comptes en attente');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId, approved) => {
    setActionLoading(true);
    try {
      const result = await adminService.verifyUser(userId);
      if (result.success) {
        setSuccessMessage(`Compte ${approved ? 'vérifié' : 'rejeté'} avec succès`);
        loadPendingUsers();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
        <span className="ml-2 text-gray-600">Chargement des comptes en attente...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vérification des comptes</h1>
          <p className="text-gray-600 mt-1">{pendingUsers.length} comptes en attente de vérification</p>
        </div>
        <button
          onClick={loadPendingUsers}
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

      {/* Liste des comptes en attente */}
      {pendingUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FaCheckCircle className="mx-auto text-4xl text-green-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun compte en attente</h3>
          <p className="text-gray-500">Tous les comptes avec documents d'identité ont été vérifiés.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingUsers.map((user) => (
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
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'conducteur' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
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
                <div className="flex items-center text-sm text-orange-600">
                  <FaExclamationTriangle className="mr-2" />
                  <span>Document d'identité soumis</span>
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
          ))}
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
                {selectedUser.cin_path ? (
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
                ) : (
                  <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                    <FaIdCard className="mx-auto text-4xl mb-2" />
                    <p>Aucun document d'identité</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleVerifyUser(selectedUser.id, true)}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  <span>Vérifier le compte</span>
                </button>
                <button
                  onClick={() => handleVerifyUser(selectedUser.id, false)}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                  <span>Rejeter</span>
                </button>
                <button
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountVerification;
