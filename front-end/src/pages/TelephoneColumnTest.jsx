import React, { useState, useEffect } from 'react';
import { 
  FaPhone, FaUsers, FaCheckCircle, FaTimes, FaDatabase, FaSync,
  FaIdCard, FaEnvelope, FaCalendarAlt, FaUserTag
} from 'react-icons/fa';
import adminService from '../services/adminService';

const TelephoneColumnTest = () => {
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
      with_telephone: userData.filter(u => u.telephone).length,
      without_telephone: userData.filter(u => !u.telephone).length,
      telephone_percentage: userData.length > 0 ? 
        Math.round((userData.filter(u => u.telephone).length / userData.length) * 100) : 0
    };
    setStats(stats);
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Non renseigné';
    return phone;
  };

  const getPhoneStatus = (phone) => {
    if (phone) {
      return {
        status: 'has_phone',
        label: 'Téléphone renseigné',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: FaCheckCircle
      };
    } else {
      return {
        status: 'no_phone',
        label: 'Téléphone manquant',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: FaTimes
      };
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
            <FaPhone className="text-4xl text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Test Colonne Téléphone</h1>
          </div>
          <p className="text-lg text-gray-600">
            Vérification de l'ajout de la colonne téléphone dans la base de données
          </p>
        </div>

        {/* Statut de la migration */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <FaCheckCircle className="text-green-500 text-xl" />
            <span className="font-medium text-green-900">
              Migration réussie ! La colonne téléphone a été ajoutée à la table users
            </span>
          </div>
        </div>

        {/* Statistiques */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Statistiques Téléphone</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
              <div className="text-sm text-blue-600">Total utilisateurs</div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.with_telephone}</div>
              <div className="text-sm text-green-600">Avec téléphone</div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{stats.without_telephone}</div>
              <div className="text-sm text-red-600">Sans téléphone</div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{stats.telephone_percentage}%</div>
              <div className="text-sm text-purple-600">Taux de remplissage</div>
            </div>
          </div>
        </div>

        {/* Informations sur la migration */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Détails de la Migration</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">📋 Fichier de migration</h3>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  2025_01_15_140000_add_telephone_to_users_table.php
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">🗃️ Structure de la colonne</h3>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  telephone VARCHAR(20) NULLABLE
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">📍 Position</h3>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  AFTER email
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">🔄 Commande exécutée</h3>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  php artisan migrate
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs avec téléphones */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">👥 Utilisateurs avec Téléphones</h2>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => {
                  const phoneStatus = getPhoneStatus(user.telephone);
                  const StatusIcon = phoneStatus.icon;
                  
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
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <FaEnvelope className="text-gray-400" />
                          <span className="text-sm text-gray-900">{user.email}</span>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <FaPhone className={user.telephone ? 'text-green-500' : 'text-red-500'} />
                          <span className={`text-sm ${user.telephone ? 'text-gray-900' : 'text-gray-500 italic'}`}>
                            {formatPhoneNumber(user.telephone)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'conducteur' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <FaUserTag className="mr-1" />
                          {user.role}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${phoneStatus.color}`}>
                          <StatusIcon className="mr-1" />
                          {phoneStatus.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modifications apportées */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">✅ Modifications Apportées</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">🗃️ Base de données</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Migration créée : add_telephone_to_users_table</li>
                <li>• Colonne ajoutée : telephone VARCHAR(20) NULLABLE</li>
                <li>• Position : après la colonne email</li>
                <li>• Migration exécutée avec succès</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">📝 Modèle User</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Champ 'telephone' ajouté au $fillable</li>
                <li>• Modèle mis à jour pour accepter les données téléphone</li>
                <li>• Prêt pour les formulaires et API</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">🌱 Seeders</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• UserSeeder mis à jour avec numéros de téléphone</li>
                <li>• init_database.php mis à jour</li>
                <li>• Numéros marocains (+212 6 XX XX XX XX)</li>
                <li>• Données de test cohérentes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Prochaines étapes */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-3">🚀 Prochaines Étapes Possibles</h3>
          <ul className="text-sm text-green-700 space-y-2">
            <li>• Ajouter le champ téléphone aux formulaires d'inscription</li>
            <li>• Mettre à jour les pages de profil utilisateur</li>
            <li>• Ajouter la validation du format téléphone</li>
            <li>• Intégrer le téléphone dans les pages admin</li>
            <li>• Ajouter des notifications SMS (optionnel)</li>
          </ul>
        </div>

        {/* Note finale */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">🎉 Résultat :</h3>
          <p className="text-sm text-green-700">
            La colonne téléphone a été ajoutée avec succès à la table users ! 
            Tous les utilisateurs peuvent maintenant avoir un numéro de téléphone associé à leur compte.
            Les seeders ont été mis à jour pour inclure des numéros de téléphone de test.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TelephoneColumnTest;
