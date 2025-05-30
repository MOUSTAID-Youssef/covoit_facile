import React, { useState, useEffect } from 'react';
import {
  FaUsers, FaCar, FaRoute, FaClipboardList, FaChartBar, FaCog,
  FaUserShield, FaExclamationTriangle, FaCheckCircle, FaTimesCircle,
  FaSpinner, FaSearch, FaFilter, FaDownload, FaBell, FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import adminService from '../../services/adminService';
import UsersManagement from './UsersManagement';
import TripsManagement from './TripsManagement';
import VehiclesManagement from './VehiclesManagement';
import ReservationsManagement from './ReservationsManagement';
import AdminStats from './AdminStats';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsResult = await adminService.getDashboardStats();
      if (statsResult.success) {
        setStats(statsResult.data);
        generateNotifications(statsResult.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
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
    { id: 'dashboard', label: 'Tableau de bord', icon: FaChartBar },
    { id: 'users', label: 'Utilisateurs', icon: FaUsers },
    { id: 'trips', label: 'Trajets', icon: FaRoute },
    { id: 'vehicles', label: 'Véhicules', icon: FaCar },
    { id: 'reservations', label: 'Réservations', icon: FaClipboardList },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminStats stats={stats} onRefresh={loadDashboardData} />;
      case 'users':
        return <UsersManagement />;
      case 'trips':
        return <TripsManagement />;
      case 'vehicles':
        return <VehiclesManagement />;
      case 'reservations':
        return <ReservationsManagement />;
      default:
        return <AdminStats stats={stats} onRefresh={loadDashboardData} />;
    }
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUserShield className="text-2xl text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>•</span>
                <span>CovoitFacile</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <FaBell className="text-xl" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.prenom} {user?.nom}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <img
                  src={user?.photo_url || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
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
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Notifications Panel */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Notifications</h3>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg text-xs cursor-pointer transition-colors ${
                      notif.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                      notif.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                      'bg-green-50 text-green-800 border border-green-200'
                    }`}
                    onClick={notif.action}
                  >
                    <div className="flex items-center space-x-2">
                      {notif.type === 'warning' && <FaExclamationTriangle />}
                      {notif.type === 'info' && <FaCheckCircle />}
                      {notif.type === 'success' && <FaCheckCircle />}
                      <span>{notif.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
