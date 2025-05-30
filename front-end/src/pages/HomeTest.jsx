import React, { useState, useEffect } from 'react';
import { FaUsers, FaCar, FaRoute, FaLeaf, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import apiClient from '../config/axios';

const HomeTest = () => {
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const testPublicAPIs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Test des APIs publiques...');
      
      // Test des statistiques publiques
      const statsResponse = await apiClient.get('/public/stats');
      console.log('📊 Réponse stats:', statsResponse.data);
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      // Test des témoignages publics
      const testimonialsResponse = await apiClient.get('/public/testimonials');
      console.log('💬 Réponse témoignages:', testimonialsResponse.data);
      
      if (testimonialsResponse.data.success) {
        setTestimonials(testimonialsResponse.data.testimonials);
      }

    } catch (error) {
      console.error('❌ Erreur test APIs:', error);
      setError('Erreur lors du chargement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testPublicAPIs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Test APIs Publiques - Page d'Accueil</h1>
          <button
            onClick={testPublicAPIs}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <FaSpinner className={loading ? 'animate-spin' : ''} />
            <span>Recharger</span>
          </button>
        </div>

        {/* Statut des APIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">API Statistiques</h3>
            <div className="flex items-center">
              {stats ? (
                <>
                  <FaCheck className="text-green-500 mr-2" />
                  <span className="text-green-700">Fonctionnelle</span>
                </>
              ) : error ? (
                <>
                  <FaTimes className="text-red-500 mr-2" />
                  <span className="text-red-700">Erreur</span>
                </>
              ) : (
                <>
                  <FaSpinner className="animate-spin text-blue-500 mr-2" />
                  <span className="text-blue-700">Chargement...</span>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">API Témoignages</h3>
            <div className="flex items-center">
              {testimonials.length > 0 ? (
                <>
                  <FaCheck className="text-green-500 mr-2" />
                  <span className="text-green-700">Fonctionnelle</span>
                </>
              ) : error ? (
                <>
                  <FaTimes className="text-red-500 mr-2" />
                  <span className="text-red-700">Erreur</span>
                </>
              ) : (
                <>
                  <FaSpinner className="animate-spin text-blue-500 mr-2" />
                  <span className="text-blue-700">Chargement...</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Statistiques */}
        {stats && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques Réelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <FaUsers className="text-blue-500 text-2xl mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.total_users}</div>
                <div className="text-sm text-gray-600">Utilisateurs</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <FaRoute className="text-green-500 text-2xl mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.total_trajets}</div>
                <div className="text-sm text-gray-600">Trajets</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <FaCar className="text-purple-500 text-2xl mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.total_vehicules}</div>
                <div className="text-sm text-gray-600">Véhicules</div>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg text-center">
                <FaLeaf className="text-emerald-500 text-2xl mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{Math.round(stats.co2_economise)}</div>
                <div className="text-sm text-gray-600">Kg CO2 économisés</div>
              </div>
            </div>
          </div>
        )}

        {/* Témoignages */}
        {testimonials.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Témoignages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{testimonial.comment}"</p>
                  <div className="flex mt-2">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Données brutes */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Données brutes (JSON)</h3>
          <div className="space-y-4">
            {stats && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Statistiques:</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto">
                  {JSON.stringify(stats, null, 2)}
                </pre>
              </div>
            )}
            
            {testimonials.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Témoignages:</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40">
                  {JSON.stringify(testimonials, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Instructions de test :</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Cette page teste les APIs publiques utilisées par la page d'accueil</li>
            <li>2. Les statistiques sont calculées en temps réel depuis la base de données</li>
            <li>3. Les témoignages sont actuellement statiques mais l'API est prête</li>
            <li>4. Allez sur <code>/</code> pour voir la page d'accueil avec les vraies données</li>
          </ol>
        </div>

        {/* Liens rapides */}
        <div className="mt-6 flex space-x-4">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Page d'Accueil
          </a>
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeTest;
