import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUsers, FaCar, FaRoute, FaLeaf, FaArrowRight, FaStar, FaQuoteLeft } from 'react-icons/fa';

function Home() {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    destination: '',
    date: ''
  });

  const navigate = useNavigate();

  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
    'Meknès', 'Oujda', 'Tétouan', 'Safi', 'El Jadida', 'Nador'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search', { state: searchParams });
  };

  const stats = [
    { icon: FaUsers, number: "2,847", label: "Utilisateurs actifs", color: "text-blue-600" },
    { icon: FaRoute, number: "1,234", label: "Trajets partagés", color: "text-green-600" },
    { icon: FaCar, number: "856", label: "Véhicules enregistrés", color: "text-purple-600" },
    { icon: FaLeaf, number: "12,450", label: "Kg CO2 économisés", color: "text-emerald-600" }
  ];

  const steps = [
    {
      icon: FaSearch,
      title: "Recherchez",
      description: "Trouvez le trajet qui vous convient",
      color: "bg-blue-500"
    },
    {
      icon: FaCar,
      title: "Réservez",
      description: "Contactez le conducteur et réservez",
      color: "bg-green-500"
    },
    {
      icon: FaRoute,
      title: "Voyagez",
      description: "Profitez du voyage ensemble",
      color: "bg-purple-500"
    },
    {
      icon: FaStar,
      title: "Évaluez",
      description: "Partagez votre expérience",
      color: "bg-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Benali",
      role: "Conducteur",
      comment: "CovoitFacile m'a permis de rencontrer des personnes formidables tout en réduisant mes frais de transport.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Fatima Zahra",
      role: "Voyageuse",
      comment: "Grâce à CovoitFacile, je voyage de Casablanca à Rabat chaque semaine. C'est économique et convivial !",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Omar Tazi",
      role: "Étudiant",
      comment: "En tant qu'étudiant, CovoitFacile me permet de voyager à petit prix. Les conducteurs sont sympas !",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Voyagez ensemble
              <span className="block text-purple-200">à moindre coût</span>
            </h1>
            <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto">
              Trouvez des covoiturages dans tout le Maroc. Économique, écologique et convivial !
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white/95 p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    value={searchParams.departure}
                    onChange={(e) => setSearchParams({...searchParams, departure: e.target.value})}
                  >
                    <option value="">Ville de départ</option>
                    {moroccanCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    value={searchParams.destination}
                    onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                  >
                    <option value="">Ville d'arrivée</option>
                    {moroccanCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    value={searchParams.date}
                    onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  type="submit"
                  className="w-full md:w-auto px-12 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Rechercher un trajet
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              CovoitFacile en chiffres
            </h2>
            <p className="text-lg text-gray-600">
              Rejoignez une communauté grandissante de voyageurs responsables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color}`}>
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

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600">
              Voyager en covoiturage n'a jamais été aussi simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center relative">
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.color} text-white shadow-lg`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez les témoignages de notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <FaQuoteLeft className="w-8 h-8 text-indigo-600 opacity-50" />
                </div>
                <div className="flex justify-center mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 text-center mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center justify-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer votre voyage ?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à CovoitFacile pour leurs déplacements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Créer un compte
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Rechercher un trajet
              <FaArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;