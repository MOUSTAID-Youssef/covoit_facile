import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaIdCard, FaImage, FaCheckCircle, FaTimes, FaExclamationTriangle,
  FaSync, FaEye, FaDatabase
} from 'react-icons/fa';
import adminService from '../services/adminService';

const UserDataDiagnostic = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getUsers();
      if (result.success) {
        setUsers(result.data);
        calculateStats(result.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData) => {
    const stats = {
      total: userData.length,
      with_photo_profil: userData.filter(u => u.photo_profil).length,
      with_cin_path: userData.filter(u => u.cin_path).length,
      badge_verifie_true: userData.filter(u => u.badge_verifie === true).length,
      badge_verifie_false: userData.filter(u => u.badge_verifie === false).length,
      badge_verifie_null: userData.filter(u => u.badge_verifie === null).length,
      
      // États selon notre logique
      verifie: userData.filter(u => u.cin_path && u.badge_verifie === true).length,
      en_attente: userData.filter(u => u.cin_path && !u.badge_verifie && u.statut_verification !== 'rejete').length,
      rejete: userData.filter(u => u.cin_path && u.statut_verification === 'rejete').length,
      non_verifie: userData.filter(u => !u.cin_path).length,
    };
    setStats(stats);
  };

  const getUserStatus = (user) => {
    if (user.cin_path && user.badge_verifie === true) {
      return { status: 'verifie', label: 'Vérifié', color: 'text-green-600 bg-green-50' };
    } else if (user.cin_path && user.statut_verification === 'rejete') {
      return { status: 'rejete', label: 'Rejeté', color: 'text-red-600 bg-red-50' };
    } else if (user.cin_path && !user.badge_verifie) {
      return { status: 'en_attente', label: 'En attente', color: 'text-yellow-600 bg-yellow-50' };
    } else {
      return { status: 'non_verifie', label: 'Non vérifié', color: 'text-gray-600 bg-gray-50' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSync className="animate-spin text-2xl text-blue-600" />
        <span className="ml-2 text-gray-600">Chargement des données utilisateur...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaDatabase className="text-4xl text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Diagnostic des Données Utilisateur</h1>
          </div>
          <p className="text-lg text-gray-600">
            Analyse des champs photo_profil, cin_path et badge_verifie
          </p>
        </div>

        {/* Statistiques globales */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Statistiques Globales</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
              <div className="text-sm text-blue-600">Total utilisateurs</div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{stats.with_photo_profil}</div>
              <div className="text-sm text-purple-600">Avec photo_profil</div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">{stats.with_cin_path}</div>
              <div className="text-sm text-orange-600">Avec cin_path</div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.badge_verifie_true}</div>
              <div className="text-sm text-green-600">badge_verifie = true</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.verifie}</div>
              <div className="text-sm text-green-600">Vérifiés</div>
              <div className="text-xs text-green-500">cin_path + badge_verifie</div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-700">{stats.en_attente}</div>
              <div className="text-sm text-yellow-600">En attente</div>
              <div className="text-xs text-yellow-500">cin_path + !badge_verifie</div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{stats.rejete}</div>
              <div className="text-sm text-red-600">Rejetés</div>
              <div className="text-xs text-red-500">statut = rejete</div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">{stats.non_verifie}</div>
              <div className="text-sm text-gray-600">Non vérifiés</div>
              <div className="text-xs text-gray-500">pas de cin_path</div>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">👥 Détail des Utilisateurs</h2>
            <button
              onClick={loadUsers}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaSync />
              <span>Actualiser</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo Profil</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CIN Path</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badge Vérifié</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut Vérif</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">État Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => {
                  const status = getUserStatus(user);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.photo_url || '/images/default-avatar.svg'}
                            alt={`${user.prenom} ${user.nom}`}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = '/images/default-avatar.svg';
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-900">{user.prenom} {user.nom}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {user.photo_profil ? (
                            <FaCheckCircle className="text-green-500" />
                          ) : (
                            <FaTimes className="text-red-500" />
                          )}
                          <span className="text-sm">
                            {user.photo_profil ? 'Oui' : 'Non'}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {user.cin_path ? (
                            <FaIdCard className="text-blue-500" />
                          ) : (
                            <FaTimes className="text-red-500" />
                          )}
                          <span className="text-sm">
                            {user.cin_path ? 'Oui' : 'Non'}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.badge_verifie === true ? 'bg-green-100 text-green-800' :
                          user.badge_verifie === false ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.badge_verifie === true ? 'True' : 
                           user.badge_verifie === false ? 'False' : 'Null'}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className="text-sm">
                          {user.statut_verification || 'Aucun'}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Problèmes identifiés */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">⚠️ Problèmes Identifiés</h2>
          
          <div className="space-y-4">
            {stats.with_photo_profil > stats.with_cin_path && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FaExclamationTriangle className="text-yellow-600" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Confusion entre photo_profil et cin_path</h3>
                    <p className="text-sm text-yellow-700">
                      {stats.with_photo_profil} utilisateurs ont une photo_profil mais seulement {stats.with_cin_path} ont un cin_path.
                      Les utilisateurs uploadent peut-être leur photo d'identité dans photo_profil au lieu de cin_path.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {stats.non_verifie > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FaIdCard className="text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-900">Utilisateurs sans documents</h3>
                    <p className="text-sm text-blue-700">
                      {stats.non_verifie} utilisateurs n'ont pas uploadé de document d'identité (cin_path vide).
                      Ces utilisateurs n'apparaîtront pas dans la page de vérification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions suggérées */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-3">💡 Actions Suggérées</h3>
          <ul className="text-sm text-green-700 space-y-2">
            <li>• Vérifier que les utilisateurs uploadent bien dans le champ cin_path et non photo_profil</li>
            <li>• S'assurer que le formulaire d'upload pointe vers le bon champ</li>
            <li>• Migrer les photos d'identité de photo_profil vers cin_path si nécessaire</li>
            <li>• Ajouter des validations pour distinguer photo de profil et document d'identité</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDataDiagnostic;
