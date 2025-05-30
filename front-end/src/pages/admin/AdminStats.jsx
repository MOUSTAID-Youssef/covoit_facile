import React from 'react';
import {
  FaUsers, FaCar, FaRoute, FaClipboardList, FaUserCheck,
  FaSync, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaClock
} from 'react-icons/fa';

const AdminStats = ({ stats, onRefresh }) => {
  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune statistique disponible</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Utilisateurs',
      value: stats.total_users || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
      description: 'Tous les comptes'
    },
    {
      title: 'Conducteurs',
      value: stats.total_conducteurs || 0,
      icon: FaUserCheck,
      color: 'bg-green-500',
      description: 'Comptes conducteurs'
    },
    {
      title: 'Total Trajets',
      value: stats.total_trajets || 0,
      icon: FaRoute,
      color: 'bg-purple-500',
      description: 'Trajets créés'
    },
    {
      title: 'Réservations',
      value: stats.total_reservations || 0,
      icon: FaClipboardList,
      color: 'bg-orange-500',
      description: 'Réservations totales'
    }
  ];

  const alertCards = [
    {
      title: 'Comptes en attente',
      value: stats.pending_verifications || 0,
      icon: FaClock,
      color: 'bg-yellow-500',
      type: 'warning'
    },
    {
      title: 'Véhicules à vérifier',
      value: stats.pending_vehicles || 0,
      icon: FaCar,
      color: 'bg-blue-500',
      type: 'info'
    },
    {
      title: 'Trajets actifs',
      value: stats.active_trips || 0,
      icon: FaRoute,
      color: 'bg-green-500',
      type: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme CovoitFacile</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FaSync />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alertes et actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {alertCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                  {card.value > 0 && (
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        card.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        card.type === 'info' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {card.type === 'warning' && <FaExclamationTriangle className="mr-1" />}
                        {card.type === 'info' && <FaClock className="mr-1" />}
                        {card.type === 'success' && <FaCheckCircle className="mr-1" />}
                        Action requise
                      </span>
                    </div>
                  )}
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphique des statistiques mensuelles */}
      {stats.monthly_stats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Évolution mensuelle</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FaCalendarAlt />
              <span>6 derniers mois</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Utilisateurs */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Nouveaux utilisateurs</h4>
              <div className="space-y-2">
                {stats.monthly_stats.map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(month.users / Math.max(...stats.monthly_stats.map(m => m.users))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{month.users}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trajets */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Nouveaux trajets</h4>
              <div className="space-y-2">
                {stats.monthly_stats.map((month, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(month.trips / Math.max(...stats.monthly_stats.map(m => m.trips))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{month.trips}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FaUsers className="text-blue-500 text-xl" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Gérer les utilisateurs</p>
              <p className="text-sm text-gray-500">Voir tous les comptes</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FaCar className="text-green-500 text-xl" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Vérifier véhicules</p>
              <p className="text-sm text-gray-500">Approuver les documents</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FaRoute className="text-purple-500 text-xl" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Modérer trajets</p>
              <p className="text-sm text-gray-500">Surveiller l'activité</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
