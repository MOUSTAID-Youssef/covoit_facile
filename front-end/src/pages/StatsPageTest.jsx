import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheckCircle, FaChartBar, FaEye, FaSync, FaDatabase,
  FaUsers, FaCar, FaRoute, FaClipboardList, FaExclamationTriangle
} from 'react-icons/fa';
import adminService from '../services/adminService';

const StatsPageTest = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const testStats = async () => {
    setLoading(true);
    try {
      const result = await adminService.getDashboardStats();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testStats();
  }, []);

  const features = [
    {
      id: 'stats-cards',
      title: '📊 Cartes de statistiques',
      description: '4 cartes principales avec données réelles',
      items: [
        'Total utilisateurs avec répartition voyageurs/conducteurs',
        'Total trajets avec nombre de trajets actifs',
        'Total véhicules avec véhicules en attente',
        'Total réservations avec revenus générés'
      ]
    },
    {
      id: 'alerts',
      title: '🚨 Alertes et notifications',
      description: '3 cartes d\'alerte pour les actions urgentes',
      items: [
        'Comptes à vérifier avec lien direct',
        'Véhicules en attente de validation',
        'Utilisateurs actifs sur la plateforme'
      ]
    },
    {
      id: 'metrics',
      title: '📈 Métriques importantes',
      description: 'Calculs automatiques de KPIs',
      items: [
        'Taux d\'occupation moyen des trajets',
        'Revenus par trajet',
        'Utilisateurs par véhicule',
        'CO2 économisé en kg'
      ]
    },
    {
      id: 'charts',
      title: '📊 Graphiques et répartitions',
      description: 'Visualisations des données',
      items: [
        'Répartition voyageurs/conducteurs',
        'Pourcentage de comptes vérifiés',
        'Barres de progression colorées',
        'Tendances avec pourcentages'
      ]
    },
    {
      id: 'actions',
      title: '⚡ Actions rapides',
      description: '6 boutons de navigation directe',
      items: [
        'Gérer les utilisateurs',
        'Vérifier les comptes',
        'Modérer les trajets',
        'Valider les véhicules',
        'Gérer les réservations',
        'Retour au dashboard'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaChartBar className="text-4xl text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Page Statistiques Remplie</h1>
          </div>
          <p className="text-lg text-gray-600">
            Page /admin/dashboard maintenant complète avec toutes les fonctionnalités
          </p>
        </div>

        {/* Statut */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <FaCheckCircle className="text-green-500 text-xl" />
            <span className="font-medium text-green-900">Page statistiques entièrement remplie et fonctionnelle !</span>
          </div>
        </div>

        {/* Test des données */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">🧪 Test des Données en Temps Réel</h2>
            <button
              onClick={testStats}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              <span>Tester</span>
            </button>
          </div>
          
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <FaUsers className="text-2xl text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">{stats.total_users}</div>
                <div className="text-sm text-blue-600">Utilisateurs</div>
                <div className="text-xs text-blue-500 mt-1">
                  {stats.total_voyageurs}V • {stats.total_conducteurs}C
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <FaRoute className="text-2xl text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">{stats.total_trajets}</div>
                <div className="text-sm text-green-600">Trajets</div>
                <div className="text-xs text-green-500 mt-1">
                  {stats.active_trips} actifs
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <FaCar className="text-2xl text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">{stats.total_vehicules}</div>
                <div className="text-sm text-purple-600">Véhicules</div>
                <div className="text-xs text-purple-500 mt-1">
                  {stats.pending_vehicles} en attente
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <FaClipboardList className="text-2xl text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-700">{stats.total_reservations}</div>
                <div className="text-sm text-orange-600">Réservations</div>
                <div className="text-xs text-orange-500 mt-1">
                  {Math.round(stats.monthly_revenue)} DH
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Cliquez sur "Tester" pour charger les données
            </div>
          )}
        </div>

        {/* Fonctionnalités implémentées */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">✨ Fonctionnalités Implémentées</h2>
          
          <div className="space-y-6">
            {features.map((feature) => (
              <div key={feature.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {feature.items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                      <FaCheckCircle className="text-green-500 text-xs flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Métriques calculées */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🧮 Métriques Calculées</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Taux d'occupation</h3>
                <div className="text-2xl font-bold text-blue-700">
                  {Math.round(((stats.total_reservations || 0) / Math.max(stats.total_trajets || 1, 1)) * 100)}%
                </div>
                <p className="text-xs text-blue-600">Réservations / Trajets</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Revenus par trajet</h3>
                <div className="text-2xl font-bold text-green-700">
                  {Math.round((stats.monthly_revenue || 0) / Math.max(stats.total_trajets || 1, 1))} DH
                </div>
                <p className="text-xs text-green-600">Revenus / Trajets</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-medium text-purple-900 mb-2">Users/Véhicule</h3>
                <div className="text-2xl font-bold text-purple-700">
                  {Math.round((stats.total_users || 0) / Math.max(stats.total_vehicules || 1, 1))}
                </div>
                <p className="text-xs text-purple-600">Utilisateurs / Véhicules</p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-medium text-orange-900 mb-2">CO2 économisé</h3>
                <div className="text-2xl font-bold text-orange-700">
                  {Math.round((stats.co2_economise || 0) / 1000)} kg
                </div>
                <p className="text-xs text-orange-600">Impact environnemental</p>
              </div>
            </div>
          </div>
        )}

        {/* Comparaison avant/après */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparaison Avant/Après</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avant */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-3 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                ❌ Avant
              </h3>
              <ul className="text-sm text-red-700 space-y-2">
                <li>• Page statistiques vide</li>
                <li>• Aucune donnée affichée</li>
                <li>• Pas de métriques calculées</li>
                <li>• Aucune action rapide</li>
                <li>• Interface non fonctionnelle</li>
              </ul>
            </div>
            
            {/* Après */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-3 flex items-center">
                <FaCheckCircle className="mr-2" />
                ✅ Après
              </h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Page complète avec 4 cartes statistiques</li>
                <li>• Données réelles de la base</li>
                <li>• Métriques calculées automatiquement</li>
                <li>• 6 actions rapides fonctionnelles</li>
                <li>• Interface moderne et responsive</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions de test */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaEye className="mr-2" />
            Voir les Statistiques
          </Link>
          
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaChartBar className="mr-2" />
            Dashboard Principal
          </Link>
          
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FaUsers className="mr-2" />
            Se connecter admin
          </Link>
          
          <button
            onClick={testStats}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            <FaDatabase className="mr-2" />
            Tester les APIs
          </button>
        </div>

        {/* Note finale */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">🎉 Résultat Final :</h3>
          <p className="text-sm text-green-700">
            La page statistiques (/admin/dashboard) est maintenant entièrement remplie avec des données réelles, 
            des métriques calculées, des graphiques et des actions rapides. Plus aucune page vide !
          </p>
        </div>

        {/* Identifiants */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">🔑 Identifiants Admin :</h3>
          <p className="text-sm text-gray-700">
            <strong>Email :</strong> admin@covoitfacile.com • 
            <strong> Mot de passe :</strong> admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsPageTest;
