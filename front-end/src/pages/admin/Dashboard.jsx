import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaCar,
  FaRoute,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import StatsCard from '../../components/admin/StatsCard';
import RecentActivity from '../../components/admin/RecentActivity';

const Dashboard = () => {
  const statsData = [
    {
      title: 'Utilisateurs Total',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: FaUsers,
      color: 'blue'
    },
    {
      title: 'Trajets Actifs',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: FaRoute,
      color: 'green'
    },
    {
      title: 'Véhicules Enregistrés',
      value: '1,234',
      change: '+5%',
      changeType: 'increase',
      icon: FaCar,
      color: 'orange'
    },
    {
      title: 'Revenus du Mois',
      value: '45,678 MAD',
      change: '-3%',
      changeType: 'decrease',
      icon: FaMoneyBillWave,
      color: 'red'
    }
  ];

  // Données simulées - à remplacer par des appels API
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const recentActivities = [
    {
      id: 1,
      type: 'user_registered',
      message: 'Nouvel utilisateur inscrit: Ahmed Benali',
      time: '5 minutes',
      icon: FaUsers,
      color: 'blue'
    },
    {
      id: 2,
      type: 'trip_created',
      message: 'Nouveau trajet: Casablanca → Rabat',
      time: '12 minutes',
      icon: FaRoute,
      color: 'green'
    },
    {
      id: 3,
      type: 'vehicle_added',
      message: 'Véhicule ajouté: Toyota Corolla 2020',
      time: '25 minutes',
      icon: FaCar,
      color: 'orange'
    },
    {
      id: 4,
      type: 'booking_confirmed',
      message: 'Réservation confirmée pour le trajet #1234',
      time: '1 heure',
      icon: FaMoneyBillWave,
      color: 'purple'
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Tableau de Bord</h1>
        <p className="page-subtitle">Vue d'ensemble de votre plateforme de covoiturage</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="dashboard-content">
        <div className="dashboard-row">
          <div className="dashboard-col-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Aperçu des Performances</h5>
                <p className="card-subtitle">Métriques clés de votre plateforme</p>
              </div>
              <div className="card-body">
                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="metric-icon blue">
                      <FaUsers />
                    </div>
                    <div className="metric-info">
                      <h4>Taux de croissance</h4>
                      <p className="metric-value">+12.5%</p>
                      <span className="metric-period">ce mois</span>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon green">
                      <FaRoute />
                    </div>
                    <div className="metric-info">
                      <h4>Trajets complétés</h4>
                      <p className="metric-value">89.2%</p>
                      <span className="metric-period">taux de réussite</span>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon orange">
                      <FaCar />
                    </div>
                    <div className="metric-info">
                      <h4>Véhicules actifs</h4>
                      <p className="metric-value">1,156</p>
                      <span className="metric-period">sur 1,234 total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-col-4">
            <RecentActivity activities={recentActivities} />
          </div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-col-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Trajets Populaires</h5>
              </div>
              <div className="card-body">
                <div className="popular-routes">
                  <div className="route-item">
                    <div className="route-info">
                      <span className="route-name">Casablanca → Rabat</span>
                      <span className="route-count">45 trajets</span>
                    </div>
                    <div className="route-progress">
                      <div className="progress-bar" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="route-item">
                    <div className="route-info">
                      <span className="route-name">Rabat → Fès</span>
                      <span className="route-count">32 trajets</span>
                    </div>
                    <div className="route-progress">
                      <div className="progress-bar" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  <div className="route-item">
                    <div className="route-info">
                      <span className="route-name">Casablanca → Marrakech</span>
                      <span className="route-count">28 trajets</span>
                    </div>
                    <div className="route-progress">
                      <div className="progress-bar" style={{width: '55%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-col-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Utilisateurs Actifs</h5>
              </div>
              <div className="card-body">
                <div className="user-stats">
                  <div className="stat-item">
                    <span className="stat-label">Aujourd'hui</span>
                    <span className="stat-value">234</span>
                    <span className="stat-change positive">+12%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Cette semaine</span>
                    <span className="stat-value">1,456</span>
                    <span className="stat-change positive">+8%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Ce mois</span>
                    <span className="stat-value">5,678</span>
                    <span className="stat-change negative">-3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
