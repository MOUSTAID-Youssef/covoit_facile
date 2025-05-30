import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatsCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className="stats-card">
      <div className="stats-card-content">
        <div className="stats-icon-wrapper">
          <div className={`stats-icon ${getColorClass(color)}`}>
            <Icon className="icon" />
          </div>
        </div>
        
        <div className="stats-info">
          <h3 className="stats-value">{value}</h3>
          <p className="stats-title">{title}</p>
          
          <div className="stats-change">
            <span className={`change-indicator ${changeType === 'increase' ? 'positive' : 'negative'}`}>
              {changeType === 'increase' ? <FaArrowUp /> : <FaArrowDown />}
              {change}
            </span>
            <span className="change-period">vs mois dernier</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
