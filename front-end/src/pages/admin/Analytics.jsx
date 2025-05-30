import React from 'react';
import { 
  FaUsers, 
  FaCar, 
  FaRoute, 
  FaMoneyBillWave,
  FaChartLine,
  FaCalendarAlt
} from 'react-icons/fa';
import StatsCard from '../../components/admin/StatsCard';
import ChartCard from '../../components/admin/ChartCard';

const Analytics = () => {
  const monthlyStats = [
    {
      title: 'Nouveaux Utilisateurs',
      value: '+156',
      change: '+23%',
      changeType: 'increase',
      icon: FaUsers,
      color: 'blue'
    },
    {
      title: 'Trajets Créés',
      value: '+89',
      change: '+15%',
      changeType: 'increase',
      icon: FaRoute,
      color: 'green'
    },
    {
      title: 'Revenus Générés',
      value: '+12,450 MAD',
      change: '+8%',
      changeType: 'increase',
      icon: FaMoneyBillWave,
      color: 'orange'
    },
    {
      title: 'Taux de Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      changeType: 'increase',
      icon: FaChartLine,
      color: 'purple'
    }
  ];

  const userGrowthData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Nouveaux Utilisateurs',
        data: [45, 52, 68, 84, 102, 156, 134, 178, 165, 189, 203, 234],
        borderColor: 'rgb(31, 142, 241)',
        backgroundColor: 'rgba(31, 142, 241, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const tripsData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Trajets Créés',
        data: [28, 48, 40, 19, 86, 89],
        backgroundColor: 'rgba(0, 212, 170, 0.8)',
        borderColor: 'rgb(0, 212, 170)',
        borderWidth: 1
      },
      {
        label: 'Trajets Complétés',
        data: [25, 45, 38, 17, 82, 85],
        backgroundColor: 'rgba(255, 141, 114, 0.8)',
        borderColor: 'rgb(255, 141, 114)',
        borderWidth: 1
      }
    ]
  };

  const revenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Revenus (MAD)',
        data: [8500, 12300, 9800, 15600, 18900, 21400],
        borderColor: 'rgb(253, 93, 147)',
        backgroundColor: 'rgba(253, 93, 147, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const topRoutes = [
    { route: 'Casablanca → Rabat', trips: 156, revenue: '7,800 MAD' },
    { route: 'Rabat → Fès', trips: 89, revenue: '7,120 MAD' },
    { route: 'Casablanca → Marrakech', trips: 67, revenue: '8,040 MAD' },
    { route: 'Fès → Meknès', trips: 45, revenue: '2,250 MAD' },
    { route: 'Agadir → Casablanca', trips: 34, revenue: '5,100 MAD' }
  ];

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Statistiques et Analytics</h1>
          <p className="page-subtitle">Analyse détaillée des performances de la plateforme</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary">
            <FaCalendarAlt className="btn-icon" />
            Exporter Rapport
          </button>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="stats-grid">
        {monthlyStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="analytics-content">
        <div className="dashboard-row">
          <div className="dashboard-col-8">
            <ChartCard
              title="Croissance des Utilisateurs"
              subtitle="Évolution mensuelle des nouveaux utilisateurs"
              data={userGrowthData}
              type="line"
              height={350}
            />
          </div>
          <div className="dashboard-col-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Top Routes</h5>
              </div>
              <div className="card-body">
                <div className="top-routes-list">
                  {topRoutes.map((route, index) => (
                    <div key={index} className="route-analytics-item">
                      <div className="route-rank">#{index + 1}</div>
                      <div className="route-details">
                        <div className="route-name">{route.route}</div>
                        <div className="route-stats">
                          {route.trips} trajets • {route.revenue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-col-6">
            <ChartCard
              title="Trajets par Mois"
              subtitle="Comparaison trajets créés vs complétés"
              data={tripsData}
              type="bar"
              height={300}
            />
          </div>
          <div className="dashboard-col-6">
            <ChartCard
              title="Évolution des Revenus"
              subtitle="Revenus mensuels en MAD"
              data={revenueData}
              type="line"
              height={300}
            />
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="dashboard-row">
          <div className="dashboard-col-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Répartition par Âge</h5>
              </div>
              <div className="card-body">
                <div className="age-distribution">
                  <div className="age-group">
                    <span className="age-label">18-25 ans</span>
                    <div className="age-bar">
                      <div className="age-progress" style={{width: '35%'}}></div>
                    </div>
                    <span className="age-percentage">35%</span>
                  </div>
                  <div className="age-group">
                    <span className="age-label">26-35 ans</span>
                    <div className="age-bar">
                      <div className="age-progress" style={{width: '45%'}}></div>
                    </div>
                    <span className="age-percentage">45%</span>
                  </div>
                  <div className="age-group">
                    <span className="age-label">36-50 ans</span>
                    <div className="age-bar">
                      <div className="age-progress" style={{width: '15%'}}></div>
                    </div>
                    <span className="age-percentage">15%</span>
                  </div>
                  <div className="age-group">
                    <span className="age-label">50+ ans</span>
                    <div className="age-bar">
                      <div className="age-progress" style={{width: '5%'}}></div>
                    </div>
                    <span className="age-percentage">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-col-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Performances Mensuelles</h5>
              </div>
              <div className="card-body">
                <div className="performance-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Taux de Conversion</span>
                    <span className="metric-value">68%</span>
                    <span className="metric-change positive">+5%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Temps Moyen de Réservation</span>
                    <span className="metric-value">2.3 min</span>
                    <span className="metric-change negative">+0.2 min</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Taux d'Annulation</span>
                    <span className="metric-value">12%</span>
                    <span className="metric-change positive">-3%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Note Moyenne</span>
                    <span className="metric-value">4.8/5</span>
                    <span className="metric-change positive">+0.1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-col-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Répartition Géographique</h5>
              </div>
              <div className="card-body">
                <div className="geographic-distribution">
                  <div className="city-item">
                    <span className="city-name">Casablanca</span>
                    <span className="city-percentage">35%</span>
                  </div>
                  <div className="city-item">
                    <span className="city-name">Rabat</span>
                    <span className="city-percentage">25%</span>
                  </div>
                  <div className="city-item">
                    <span className="city-name">Marrakech</span>
                    <span className="city-percentage">15%</span>
                  </div>
                  <div className="city-item">
                    <span className="city-name">Fès</span>
                    <span className="city-percentage">12%</span>
                  </div>
                  <div className="city-item">
                    <span className="city-name">Autres</span>
                    <span className="city-percentage">13%</span>
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

export default Analytics;
