import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaCar, FaRoute, FaClipboardList, FaUserCheck,
  FaSync, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaClock,
  FaDollarSign, FaChartBar, FaArrowUp, FaArrowDown, FaEye
} from 'react-icons/fa';
import adminService from '../../services/adminService';

const AdminStatsComplete = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          <FaSync className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Erreur lors du chargement des statistiques</p>
          <button
            onClick={loadStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Utilisateurs',
      value: stats.total_users || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${stats.total_voyageurs || 0} voyageurs • ${stats.total_conducteurs || 0} conducteurs`,
      trend: '+12%'
    },
    {
      title: 'Total Trajets',
      value: stats.total_trajets || 0,
      icon: FaRoute,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${stats.active_trips || 0} trajets actifs`,
      trend: '+8%'
    },
    {
      title: 'Total Véhicules',
      value: stats.total_vehicules || 0,
      icon: FaCar,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: `${stats.pending_vehicles || 0} en attente de validation`,
      trend: '+5%'
    },
    {
      title: 'Total Réservations',
      value: stats.total_reservations || 0,
      icon: FaClipboardList,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: `${Math.round(stats.monthly_revenue || 0)} DH de revenus`,
      trend: '+15%'
    }
  ];

  const alertCards = [
    {
      title: 'Comptes à vérifier',
      value: stats.pending_verifications || 0,
      icon: FaClock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      type: 'warning',
      action: () => navigate('/admin/verification')
    },
    {
      title: 'Véhicules en attente',
      value: stats.pending_vehicles || 0,
      icon: FaCar,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      type: 'danger',
      action: () => navigate('/admin/vehicles')
    },
    {
      title: 'Utilisateurs actifs',
      value: stats.active_users || stats.total_users || 0,
      icon: FaUsers,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      type: 'success',
      action: () => navigate('/admin/users')
    }
  ];

  const quickActions = [
    {
      title: 'Gérer les utilisateurs',
      description: 'Voir tous les comptes utilisateurs',
      icon: FaUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/admin/users')
    },
    {
      title: 'Vérifier les comptes',
      description: 'Valider les documents d\'identité',
      icon: FaUserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => navigate('/admin/verification')
    },
    {
      title: 'Modérer les trajets',
      description: 'Surveiller l\'activité des trajets',
      icon: FaRoute,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => navigate('/admin/trips')
    },
    {
      title: 'Valider les véhicules',
      description: 'Approuver les documents véhicules',
      icon: FaCar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => navigate('/admin/vehicles')
    },
    {
      title: 'Gérer les réservations',
      description: 'Suivre toutes les réservations',
      icon: FaClipboardList,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      action: () => navigate('/admin/reservations')
    },
    {
      title: 'Voir le dashboard',
      description: 'Retour au tableau de bord principal',
      icon: FaChartBar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      action: () => navigate('/admin')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Statistiques Détaillées</h1>
              <p className="text-gray-600">Analyse complète de la plateforme CovoitFacile</p>
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
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`text-xl ${card.textColor}`} />
                  </div>
                  <div className="flex items-center space-x-1 text-green-600 text-sm">
                    <FaArrowUp className="text-xs" />
                    <span>{card.trend}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alertes et notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {alertCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`text-xl ${card.textColor}`} />
                  </div>
                  {card.value > 0 && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      card.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      card.type === 'danger' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {card.type === 'warning' && <FaExclamationTriangle className="mr-1" />}
                      {card.type === 'danger' && <FaClock className="mr-1" />}
                      {card.type === 'success' && <FaCheckCircle className="mr-1" />}
                      {card.type === 'warning' ? 'Attention' : card.type === 'danger' ? 'Urgent' : 'OK'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  {card.value > 0 && (
                    <button
                      onClick={card.action}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Voir les détails →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Activité récente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Métriques importantes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques Importantes</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taux d'occupation moyen</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(((stats.total_reservations || 0) / Math.max(stats.total_trajets || 1, 1)) * 100)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenus par trajet</span>
                <span className="font-semibold text-gray-900">
                  {Math.round((stats.monthly_revenue || 0) / Math.max(stats.total_trajets || 1, 1))} DH
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Utilisateurs par véhicule</span>
                <span className="font-semibold text-gray-900">
                  {Math.round((stats.total_users || 0) / Math.max(stats.total_vehicules || 1, 1))}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CO2 économisé</span>
                <span className="font-semibold text-green-600">
                  {Math.round((stats.co2_economise || 0) / 1000)} kg
                </span>
              </div>
            </div>
          </div>

          {/* Répartition des utilisateurs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des Utilisateurs</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Voyageurs</span>
                  <span className="text-sm font-medium">{stats.total_voyageurs || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${((stats.total_voyageurs || 0) / Math.max(stats.total_users || 1, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Conducteurs</span>
                  <span className="text-sm font-medium">{stats.total_conducteurs || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${((stats.total_conducteurs || 0) / Math.max(stats.total_users || 1, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Comptes vérifiés</span>
                  <span className="text-sm font-medium">
                    {(stats.total_users || 0) - (stats.pending_verifications || 0)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(((stats.total_users || 0) - (stats.pending_verifications || 0)) / Math.max(stats.total_users || 1, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className={`p-3 rounded-lg ${action.bgColor}`}>
                    <Icon className={`text-xl ${action.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsComplete;
