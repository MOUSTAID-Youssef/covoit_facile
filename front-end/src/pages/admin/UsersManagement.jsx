import React, { useState, useEffect } from 'react';
import {
  FaUsers, FaSearch, FaFilter, FaEdit, FaTrash, FaBan, FaCheck,
  FaTimes, FaSpinner, FaEye, FaUserCheck, FaUserTimes, FaExclamationTriangle,
  FaDownload, FaPlus, FaSort
} from 'react-icons/fa';
import adminService from '../../services/adminService';
import Avatar from '../../components/Avatar';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

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

  const handleVerifyUser = async (userId) => {
    setActionLoading(true);
    try {
      const result = await adminService.verifyUser(userId);
      if (result.success) {
        setSuccessMessage(result.message);
        loadUsers();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la vérification');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir bloquer cet utilisateur ?')) return;

    setActionLoading(true);
    try {
      const result = await adminService.blockUser(userId);
      if (result.success) {
        setSuccessMessage(result.message);
        loadUsers();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors du blocage');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockUser = async (userId) => {
    setActionLoading(true);
    try {
      const result = await adminService.unblockUser(userId);
      if (result.success) {
        setSuccessMessage(result.message);
        loadUsers();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors du déblocage');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ?')) return;

    setActionLoading(true);
    try {
      const result = await adminService.deleteUser(userId);
      if (result.success) {
        setSuccessMessage(result.message);
        loadUsers();
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'verified' && user.badge_verifie) ||
                         (filterStatus === 'pending' && !user.badge_verifie) ||
                         (filterStatus === 'blocked' && user.statut === 'bloque');

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (user) => {
    if (user.statut === 'bloque') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <FaBan className="mr-1" /> Bloqué
      </span>;
    }

    if (user.badge_verifie) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <FaCheck className="mr-1" /> Vérifié
      </span>;
    }

    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <FaExclamationTriangle className="mr-1" /> En attente
    </span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-indigo-600" />
        <span className="ml-2 text-gray-600">Chargement des utilisateurs...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600 text-sm">{users.length} utilisateurs au total</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tous les rôles</option>
            <option value="voyageur">Voyageurs</option>
            <option value="conducteur">Conducteurs</option>
            <option value="admin">Administrateurs</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="verified">Vérifiés</option>
            <option value="pending">En attente</option>
            <option value="blocked">Bloqués</option>
          </select>

          <button
            onClick={loadUsers}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaSort />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar
                        src={user.photo_url}
                        alt={`${user.prenom} ${user.nom}`}
                        size="md"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.prenom} {user.nom}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'conducteur' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' && <FaUserCheck className="mr-1" />}
                      {user.role === 'conducteur' && <FaUsers className="mr-1" />}
                      {user.role === 'voyageur' && <FaUsers className="mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Voir détails"
                      >
                        <FaEye />
                      </button>

                      {!user.badge_verifie && (
                        <button
                          onClick={() => handleVerifyUser(user.id)}
                          disabled={actionLoading}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Vérifier"
                        >
                          <FaCheck />
                        </button>
                      )}

                      {user.statut !== 'bloque' ? (
                        <button
                          onClick={() => handleBlockUser(user.id)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Bloquer"
                        >
                          <FaBan />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblockUser(user.id)}
                          disabled={actionLoading}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Débloquer"
                        >
                          <FaUserCheck />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500">Aucun utilisateur trouvé</p>
        </div>
      )}

      {/* Modal de détails utilisateur */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Détails de l'utilisateur
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Informations utilisateur */}
              <div className="space-y-6">
                {/* Photo et infos de base */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar
                    src={selectedUser.photo_url}
                    alt={`${selectedUser.prenom} ${selectedUser.nom}`}
                    size="xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedUser.prenom} {selectedUser.nom}
                    </h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        selectedUser.role === 'conducteur' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.role}
                      </span>
                      {getStatusBadge(selectedUser)}
                    </div>
                  </div>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Informations personnelles</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">ID:</span> {selectedUser.id}</p>
                      <p><span className="font-medium">Téléphone:</span> {selectedUser.telephone || 'Non renseigné'}</p>
                      <p><span className="font-medium">Genre:</span> {selectedUser.genre || 'Non renseigné'}</p>
                      <p><span className="font-medium">Date de naissance:</span> {selectedUser.date_naissance || 'Non renseignée'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Activité</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Inscription:</span> {new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}</p>
                      <p><span className="font-medium">Dernière mise à jour:</span> {new Date(selectedUser.updated_at).toLocaleDateString('fr-FR')}</p>
                      <p><span className="font-medium">Véhicules:</span> {selectedUser.vehicules_count || 0}</p>
                      <p><span className="font-medium">Trajets:</span> {selectedUser.trajets_count || 0}</p>
                      <p><span className="font-medium">Réservations:</span> {selectedUser.reservations_count || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Document d'identité */}
                {selectedUser.cin_path && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Document d'identité</h4>
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
                        <p>Impossible de charger le document</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  {!selectedUser.badge_verifie && (
                    <button
                      onClick={() => {
                        handleVerifyUser(selectedUser.id);
                        setShowModal(false);
                      }}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <FaCheck />
                      <span>Vérifier</span>
                    </button>
                  )}

                  {selectedUser.statut !== 'bloque' ? (
                    <button
                      onClick={() => {
                        handleBlockUser(selectedUser.id);
                        setShowModal(false);
                      }}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      <FaBan />
                      <span>Bloquer</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleUnblockUser(selectedUser.id);
                        setShowModal(false);
                      }}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <FaUserCheck />
                      <span>Débloquer</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedUser(null);
                    }}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
