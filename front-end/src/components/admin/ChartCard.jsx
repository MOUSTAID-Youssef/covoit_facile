import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartCard = ({ title, subtitle, data, type = 'line', height = 300 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const ChartComponent = type === 'bar' ? Bar : Line;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title-section">
          <h5 className="chart-title">{title}</h5>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
      </div>
      
      <div className="chart-body">
        <div style={{ height: `${height}px` }}>
          <ChartComponent data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
