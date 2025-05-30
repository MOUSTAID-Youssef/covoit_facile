import React from 'react';
import { FaMapMarkerAlt, FaCar, FaArrowRight } from 'react-icons/fa';

const PopularDestinations = () => {
  const destinations = [
    {
      id: 1,
      from: "Casablanca",
      to: "Rabat",
      price: "50 MAD",
      duration: "1h 30min",
      trips: 45,
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      from: "Rabat",
      to: "Fès",
      price: "80 MAD",
      duration: "2h 45min",
      trips: 32,
      image: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      from: "Casablanca",
      to: "Marrakech",
      price: "120 MAD",
      duration: "3h 15min",
      trips: 28,
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      from: "Fès",
      to: "Meknès",
      price: "35 MAD",
      duration: "1h 00min",
      trips: 18,
      image: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      from: "Agadir",
      to: "Casablanca",
      price: "150 MAD",
      duration: "4h 30min",
      trips: 15,
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      from: "Tanger",
      to: "Rabat",
      price: "90 MAD",
      duration: "2h 15min",
      trips: 22,
      image: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Destinations populaires
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les trajets les plus demandés et trouvez votre prochaine destination
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image}
                  alt={`${destination.from} to ${destination.to}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md">
                  <span className="text-sm font-semibold text-indigo-600">
                    {destination.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Route */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-gray-900">
                      {destination.from}
                    </span>
                  </div>
                  <FaArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                    <span className="font-semibold text-gray-900">
                      {destination.to}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <FaCar className="w-4 h-4" />
                    <span>{destination.trips} trajets</span>
                  </div>
                  <span>{destination.duration}</span>
                </div>

                {/* Action Button */}
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 group-hover:bg-indigo-700">
                  Voir les trajets
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition-colors duration-300">
            Voir toutes les destinations
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
