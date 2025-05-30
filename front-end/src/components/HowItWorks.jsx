import React from 'react';
import { FaSearch, FaHandshake, FaCar, FaStar } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: FaSearch,
      title: "Recherchez un trajet",
      description: "Trouvez le trajet qui correspond à vos besoins parmi des milliers d'options disponibles.",
      color: "bg-blue-500"
    },
    {
      icon: FaHandshake,
      title: "Réservez votre place",
      description: "Contactez le conducteur et réservez votre place en quelques clics seulement.",
      color: "bg-green-500"
    },
    {
      icon: FaCar,
      title: "Voyagez ensemble",
      description: "Rencontrez votre conducteur au point de rendez-vous et profitez du voyage.",
      color: "bg-purple-500"
    },
    {
      icon: FaStar,
      title: "Évaluez l'expérience",
      description: "Laissez un avis pour aider la communauté et améliorer l'expérience de tous.",
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Voyager en covoiturage n'a jamais été aussi simple. Suivez ces 4 étapes pour commencer votre aventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center">
                {/* Step Number */}
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.color} text-white shadow-lg`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                  </div>
                </div>

                {/* Step Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-300 transform translate-x-8"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-lg">
            Commencer maintenant
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
