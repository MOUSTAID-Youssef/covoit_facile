import React from 'react';
import { FaUsers, FaCar, FaRoute, FaLeaf } from 'react-icons/fa';

const Stats = () => {
  const stats = [
    {
      icon: FaUsers,
      number: "2,847",
      label: "Utilisateurs actifs",
      color: "text-blue-600"
    },
    {
      icon: FaRoute,
      number: "1,234",
      label: "Trajets partagés",
      color: "text-green-600"
    },
    {
      icon: FaCar,
      number: "856",
      label: "Véhicules enregistrés",
      color: "text-purple-600"
    },
    {
      icon: FaLeaf,
      number: "12,450",
      label: "Kg CO2 économisés",
      color: "text-emerald-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            CovoitFacile en chiffres
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rejoignez une communauté grandissante de voyageurs responsables
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 ${stat.color}`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
