import React, { useState, useEffect } from 'react';
import { FaSpinner, FaUsers, FaCar, FaRoute, FaClipboardList, FaSync } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import adminService from '../../services/adminService';

const AdminDashboardSimple = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const result = await adminService.getDashboardStats();
      
      if (result.success && result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
              <p className="text-gray-600">Vue d'ensemble de la plateforme CovoitFacile</p>
            </div>
            <button
              onClick={loadStats}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaSync className="text-sm" />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex items-center">
              <FaUsers className="text-3xl text-blue-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_users || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.total_voyageurs || 0} voyageurs • {stats?.total_conducteurs || 0} conducteurs
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <FaRoute className="text-3xl text-green-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trajets</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_trajets || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.active_trips || 0} actifs
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-center">
              <FaCar className="text-3xl text-purple-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Véhicules</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_vehicules || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.pending_vehicles || 0} en attente
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <div className="flex items-center">
              <FaClipboardList className="text-3xl text-orange-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Réservations</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_reservations || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((stats?.monthly_revenue || 0))} DH revenus
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vérifications en attente */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vérifications en attente</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaUsers className="text-yellow-600" />
                  <span className="text-sm font-medium">Comptes utilisateurs</span>
                </div>
                <span className="text-lg font-bold text-yellow-700">
                  {stats?.pending_verifications || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaCar className="text-blue-600" />
                  <span className="text-sm font-medium">Véhicules</span>
                </div>
                <span className="text-lg font-bold text-blue-700">
                  {stats?.pending_vehicles || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Activité de la plateforme */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité de la plateforme</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Utilisateurs actifs</span>
                <span className="font-semibold">{stats?.active_users || stats?.total_users || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trajets actifs</span>
                <span className="font-semibold">{stats?.active_trips || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CO2 économisé</span>
                <span className="font-semibold">{Math.round((stats?.co2_economise || 0) / 1000)} kg</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenus mensuels</span>
                <span className="font-semibold">{Math.round(stats?.monthly_revenue || 0)} DH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Résumé rapide */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de l'activité</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.total_users || 0}</div>
              <div className="text-sm text-gray-600">Utilisateurs inscrits</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.total_trajets || 0}</div>
              <div className="text-sm text-gray-600">Trajets créés</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats?.total_vehicules || 0}</div>
              <div className="text-sm text-gray-600">Véhicules enregistrés</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats?.total_reservations || 0}</div>
              <div className="text-sm text-gray-600">Réservations effectuées</div>
            </div>
          </div>
        </div>

        {/* Informations utilisateur connecté */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">👨‍💼 Administrateur connecté</h3>
          <p className="text-sm text-blue-700">
            <strong>Nom :</strong> {user?.prenom} {user?.nom} • 
            <strong> Email :</strong> {user?.email} • 
            <strong> Rôle :</strong> {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSimple;
