import React, { useState, useEffect } from 'react';
import {
  FaUsers, FaSearch, FaFilter, FaEye, FaSpinner, FaCheck, FaTimes,
  FaExclamationTriangle, FaDownload, FaSort, FaIdCard, FaClock,
  FaCheckCircle, FaTimesCircle, FaUserTag, FaEnvelope, FaPhone, FaTrash
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const UsersManagementWithVerificationStatus = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, verificationFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getUsers();
      if (result.success) {
        setUsers(result.data);
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
    let filtered = users;

    // Filtre par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.telephone && user.telephone.includes(searchTerm))
      );
    }

    // Filtre par rôle
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtre par statut de vérification
    if (verificationFilter !== 'all') {
      filtered = filtered.filter(user => {
        const status = getVerificationStatus(user);
        return status.status === verificationFilter;
      });
    }

    setFilteredUsers(filtered);
  };

  const getVerificationStatus = (user) => {
    if (user.cin_path && user.badge_verifie === true) {
      return {
        status: 'verifie',
        label: 'Vérifié',
        color: 'bg-green-100 text-green-800',
        icon: FaCheckCircle
      };
    } else if (user.cin_path && !user.badge_verifie) {
      return {
        status: 'en_attente',
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: FaClock
      };
    } else {
      return {
        status: 'non_verifie',
        label: 'Non vérifié',
        color: 'bg-red-100 text-red-800',
        icon: FaTimesCircle
      };
    }
  };

  const getUserPhotoUrl = (user) => {
    if (user.photo_profil) {
      // Utiliser directement le chemin de la base de données
      return `http://localhost:8000/storage/${user.photo_profil}`;
    }
    return '/images/default-avatar.svg';
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      const result = await adminService.deleteUser(userToDelete.id);
      if (result.success) {
        setSuccessMessage(`Utilisateur ${userToDelete.prenom} ${userToDelete.nom} supprimé avec succès`);
        loadUsers();
        closeDeleteModal();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setDeleting(false);
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['ID', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Rôle', 'Statut Vérification', 'Date Inscription'].join(','),
      ...filteredUsers.map(user => [
        user.id,
        user.prenom,
        user.nom,
        user.email,
        user.telephone || '',
        user.role,
        getVerificationStatus(user).label,
        new Date(user.created_at).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utilisateurs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const total = users.length;
    const verifie = users.filter(u => getVerificationStatus(u).status === 'verifie').length;
    const en_attente = users.filter(u => getVerificationStatus(u).status === 'en_attente').length;
    const non_verifie = users.filter(u => getVerificationStatus(u).status === 'non_verifie').length;
    
    return { total, verifie, en_attente, non_verifie };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
        <span className="ml-2 text-gray-600">Chargement des utilisateurs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-1">
            Gestion des comptes utilisateur avec statuts de vérification CIN
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaDownload />
            <span>Exporter CSV</span>
          </button>
        </div>
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <FaUsers className="text-2xl text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total utilisateurs</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <FaCheckCircle className="text-2xl text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-700">{stats.verifie}</div>
              <div className="text-sm text-gray-600">CIN vérifiés</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <FaClock className="text-2xl text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-yellow-700">{stats.en_attente}</div>
              <div className="text-sm text-gray-600">En attente</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <FaTimesCircle className="text-2xl text-red-500" />
            <div>
              <div className="text-2xl font-bold text-red-700">{stats.non_verifie}</div>
              <div className="text-sm text-gray-600">Non vérifiés</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nom, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Admin</option>
              <option value="conducteur">Conducteur</option>
              <option value="voyageur">Voyageur</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut Vérification</label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="verifie">Vérifiés</option>
              <option value="en_attente">En attente</option>
              <option value="non_verifie">Non vérifiés</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setVerificationFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut Vérification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const verificationStatus = getVerificationStatus(user);
                const StatusIcon = verificationStatus.icon;
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={getUserPhotoUrl(user)}
                          alt={`${user.prenom} ${user.nom}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.src = '/images/default-avatar.svg';
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.prenom} {user.nom}
                          </div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaEnvelope className="mr-2 text-gray-400" />
                          {user.email}
                        </div>
                        {user.telephone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <FaPhone className="mr-2 text-gray-400" />
                            {user.telephone}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'conducteur' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <FaUserTag className="mr-1" />
                        {user.role}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verificationStatus.color}`}>
                        <StatusIcon className="mr-1" />
                        {verificationStatus.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(user)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                        >
                          <FaEye />
                          <span>Voir</span>
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        >
                          <FaTrash />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Modal de détails utilisateur */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails de {selectedUser.prenom} {selectedUser.nom}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Informations utilisateur */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={getUserPhotoUrl(selectedUser)}
                    alt={`${selectedUser.prenom} ${selectedUser.nom}`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                    onError={(e) => {
                      e.target.src = '/images/default-avatar.svg';
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedUser.prenom} {selectedUser.nom}
                    </h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    {selectedUser.telephone && (
                      <p className="text-gray-600">{selectedUser.telephone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rôle</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.role}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut Vérification</label>
                    <div className="mt-1">
                      {(() => {
                        const status = getVerificationStatus(selectedUser);
                        const StatusIcon = status.icon;
                        return (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="mr-1" />
                            {status.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Genre</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.genre || 'Non renseigné'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.date_naissance ? 
                        new Date(selectedUser.date_naissance).toLocaleDateString('fr-FR') : 
                        'Non renseignée'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date d'inscription</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Document CIN</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedUser.cin_path ? 'Uploadé' : 'Non uploadé'}
                    </p>
                  </div>
                </div>

                {/* Document CIN si disponible */}
                {selectedUser.cin_path && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document d'identité
                    </label>
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
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Confirmer la suppression
                </h2>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={getUserPhotoUrl(userToDelete)}
                    alt={`${userToDelete.prenom} ${userToDelete.nom}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = '/images/default-avatar.svg';
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {userToDelete.prenom} {userToDelete.nom}
                    </h3>
                    <p className="text-gray-600">{userToDelete.email}</p>
                    <p className="text-sm text-gray-500">{userToDelete.role}</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaExclamationTriangle className="text-red-500" />
                    <h4 className="font-medium text-red-900">Attention !</h4>
                  </div>
                  <p className="text-sm text-red-700">
                    Cette action est irréversible. L'utilisateur et toutes ses données associées
                    (trajets, réservations, véhicules) seront définitivement supprimés.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteUser}
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
        </div>
      )}
    </div>
  );
};

export default UsersManagementWithVerificationStatus;
