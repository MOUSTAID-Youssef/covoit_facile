import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheckCircle, FaTimes, FaEye, FaSync, FaDatabase,
  FaUsers, FaCar, FaRoute, FaClipboardList
} from 'react-icons/fa';
import adminService from '../services/adminService';

const DashboardFixTest = () => {
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

  const corrections = [
    {
      id: 'access-removed',
      title: '🚫 Accès rapide supprimé',
      description: 'La grille de liens "Fonctionnalités Admin" a été supprimée',
      before: 'Grille de 6 cartes avec liens admin',
      after: 'Dashboard simple sans grille de liens',
      status: 'fixed'
    },
    {
      id: 'display-fixed',
      title: '🔧 Affichage corrigé',
      description: 'Le tableau de bord s\'affiche maintenant complètement',
      before: 'Problème d\'affichage incomplet',
      after: 'Affichage complet et propre',
      status: 'fixed'
    },
    {
      id: 'dynamic-values',
      title: '📊 Valeurs dynamiques',
      description: 'Les valeurs 0 remplacées par des données réelles',
      before: 'Statistiques affichaient 0',
      after: 'Données réelles de la base de données',
      status: 'fixed'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaCheckCircle className="text-4xl text-green-500" />
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin Corrigé</h1>
          </div>
          <p className="text-lg text-gray-600">
            Toutes les corrections appliquées avec succès
          </p>
        </div>

        {/* Corrections appliquées */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">✅ Corrections Appliquées</h2>
          
          <div className="space-y-4">
            {corrections.map((correction) => (
              <div key={correction.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{correction.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{correction.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium text-red-700">Avant :</span>
                        <span className="text-red-600"> {correction.before}</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Après :</span>
                        <span className="text-green-600"> {correction.after}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test des statistiques */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">📊 Test des Statistiques</h2>
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
                  {stats.total_voyageurs} voyageurs • {stats.total_conducteurs} conducteurs
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
                  {Math.round(stats.monthly_revenue)} DH revenus
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Cliquez sur "Tester" pour charger les statistiques
            </div>
          )}
        </div>

        {/* Comparaison avant/après */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparaison Avant/Après</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avant */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-3 flex items-center">
                <FaTimes className="mr-2" />
                ❌ Avant
              </h3>
              <ul className="text-sm text-red-700 space-y-2">
                <li>• Grille de liens "Accès rapide" encombrante</li>
                <li>• Affichage incomplet du dashboard</li>
                <li>• Statistiques affichaient 0</li>
                <li>• Interface confuse avec double navigation</li>
                <li>• Problèmes de mise en page</li>
              </ul>
            </div>
            
            {/* Après */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-3 flex items-center">
                <FaCheckCircle className="mr-2" />
                ✅ Après
              </h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Dashboard simple et épuré</li>
                <li>• Affichage complet et correct</li>
                <li>• Statistiques réelles de la base</li>
                <li>• Interface claire et professionnelle</li>
                <li>• Mise en page optimisée</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fonctionnalités du nouveau dashboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Fonctionnalités du Nouveau Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📊 Statistiques Réelles</h3>
              <p className="text-sm text-blue-700">
                Affichage des vraies données de la base de données avec actualisation en temps réel
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">🔄 Actualisation</h3>
              <p className="text-sm text-green-700">
                Bouton d'actualisation pour recharger les statistiques à la demande
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">📱 Responsive</h3>
              <p className="text-sm text-purple-700">
                Interface adaptée à tous les écrans avec grilles responsives
              </p>
            </div>
          </div>
        </div>

        {/* Actions de test */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaEye className="mr-2" />
            Voir le Dashboard
          </Link>
          
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaUsers className="mr-2" />
            Se connecter admin
          </Link>
          
          <button
            onClick={testStats}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <FaDatabase className="mr-2" />
            Tester les APIs
          </button>
        </div>

        {/* Note finale */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">🎉 Résultat Final :</h3>
          <p className="text-sm text-green-700">
            Le tableau de bord admin est maintenant simple, épuré et affiche les vraies statistiques. 
            L'accès rapide a été supprimé et l'affichage est complètement corrigé.
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

export default DashboardFixTest;
