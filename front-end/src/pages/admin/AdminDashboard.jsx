import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import adminService from '../../services/adminService';
import AdminStats from './AdminStats';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Chargement des statistiques admin...');
      const statsResult = await adminService.getDashboardStats();
      console.log('📊 Résultat des statistiques:', statsResult);

      if (statsResult.success && statsResult.stats) {
        console.log('✅ Statistiques chargées avec succès:', statsResult.stats);
        setStats(statsResult.stats);
        generateNotifications(statsResult.stats);
      } else {
        console.error('❌ Erreur lors du chargement des statistiques:', statsResult.message);
        // Données par défaut en cas d'erreur
        const defaultStats = {
          total_users: 0,
          total_voyageurs: 0,
          total_conducteurs: 0,
          total_trajets: 0,
          total_vehicules: 0,
          total_reservations: 0,
          pending_accounts: 0,
          active_users: 0,
          monthly_revenue: 0,
          monthly_stats: []
        };
        setStats(defaultStats);
        generateNotifications(defaultStats);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
      // Données par défaut en cas d'erreur
      const defaultStats = {
        total_users: 0,
        total_voyageurs: 0,
        total_conducteurs: 0,
        total_trajets: 0,
        total_vehicules: 0,
        total_reservations: 0,
        pending_accounts: 0,
        active_users: 0,
        monthly_revenue: 0,
        monthly_stats: []
      };
      setStats(defaultStats);
      generateNotifications(defaultStats);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = (statsData) => {
    const notifs = [];

    if (statsData.pending_verifications > 0) {
      notifs.push({
        id: 1,
        type: 'warning',
        message: `${statsData.pending_verifications} comptes en attente de vérification`,
        action: () => setActiveTab('users')
      });
    }

    if (statsData.pending_vehicles > 0) {
      notifs.push({
        id: 2,
        type: 'info',
        message: `${statsData.pending_vehicles} véhicules en attente de vérification`,
        action: () => setActiveTab('vehicles')
      });
    }

    if (statsData.active_trips > 50) {
      notifs.push({
        id: 3,
        type: 'success',
        message: `${statsData.active_trips} trajets actifs - Activité élevée!`,
        action: () => setActiveTab('trips')
      });
    }

    setNotifications(notifs);
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: FaChartBar, url: '/admin/dashboard' },
    { id: 'verification', label: 'Vérification', icon: FaCheckCircle, url: '/admin/verification' },
    { id: 'users', label: 'Utilisateurs', icon: FaUsers, url: '/admin/users' },
    { id: 'trips', label: 'Trajets', icon: FaRoute, url: '/admin/trips' },
    { id: 'vehicles', label: 'Véhicules', icon: FaCar, url: '/admin/vehicles' },
    { id: 'reservations', label: 'Réservations', icon: FaClipboardList, url: '/admin/reservations' },
  ];

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    return <AdminStats stats={stats} onRefresh={loadDashboardData} onNavigate={handleNavigate} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du dashboard admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-10">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUserShield className="text-xl text-indigo-600" />
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>•</span>
                <span>CovoitFacile</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.prenom} {user?.nom}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <img
                src={user?.photo_url ? `http://localhost:8000/storage/${user.photo_url}` : '/images/default-avatar.svg'}
                alt="Avatar"
                className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
                onError={(e) => {
                  e.target.src = '/images/default-avatar.svg';
                }}
              />
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Déconnexion"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content sans sidebar */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header du dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
            <p className="text-gray-600">Vue d'ensemble de la plateforme CovoitFacile</p>
          </div>

          {/* Contenu principal */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
