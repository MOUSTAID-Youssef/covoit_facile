import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaUsers, FaRoute, FaLeaf, FaStar } from 'react-icons/fa';
import apiService from '../../services/api';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsResult, testimonialsResult] = await Promise.all([
          apiService.getPublicStats(),
          apiService.getTestimonials()
        ]);

        if (statsResult.success) {
          setStats(statsResult.data.stats);
        }

        if (testimonialsResult.success) {
          setTestimonials(testimonialsResult.data.testimonials);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            CovoitFacile
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Partagez vos trajets, économisez de l'argent et protégez l'environnement. 
            La plateforme de covoiturage simple et sécurisée.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Commencer maintenant
            </Link>
            <Link
              to="/trips"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Voir les trajets
            </Link>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">CovoitFacile en chiffres</h2>
          
          {loading ? (
            <div className="text-center">Chargement des statistiques...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-2xl text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats?.total_users || 0}</div>
                <div className="text-gray-600">Utilisateurs inscrits</div>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaRoute className="text-2xl text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats?.total_trajets || 0}</div>
                <div className="text-gray-600">Trajets partagés</div>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCar className="text-2xl text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats?.total_vehicules || 0}</div>
                <div className="text-gray-600">Véhicules enregistrés</div>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLeaf className="text-2xl text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{Math.round((stats?.co2_economise || 0) / 1000)}kg</div>
                <div className="text-gray-600">CO2 économisé</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir CovoitFacile ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCar className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Économique</h3>
              <p className="text-gray-600">
                Partagez les frais de carburant et réduisez vos coûts de transport jusqu'à 70%.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLeaf className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Écologique</h3>
              <p className="text-gray-600">
                Réduisez votre empreinte carbone en partageant votre véhicule avec d'autres voyageurs.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Social</h3>
              <p className="text-gray-600">
                Rencontrez de nouvelles personnes et créez des liens lors de vos trajets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos utilisateurs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à CovoitFacile pour leurs trajets quotidiens.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            S'inscrire gratuitement
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
