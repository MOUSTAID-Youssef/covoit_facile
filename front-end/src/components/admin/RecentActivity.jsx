import React from 'react';

const RecentActivity = ({ activities }) => {
  const getActivityColor = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="activity-card">
      <div className="activity-header">
        <h5 className="activity-title">Activité Récente</h5>
        <a href="#" className="view-all-link">Voir tout</a>
      </div>
      
      <div className="activity-body">
        <div className="activity-list">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-wrapper">
                  <div className={`activity-icon ${getActivityColor(activity.color)}`}>
                    <IconComponent className="icon" />
                  </div>
                </div>
                
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">Il y a {activity.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="activity-footer">
        <button className="load-more-btn">
          Charger plus d'activités
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
