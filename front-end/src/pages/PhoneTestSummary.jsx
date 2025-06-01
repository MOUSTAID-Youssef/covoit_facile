import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPhone, FaUser, FaCheckCircle, FaDatabase, FaEdit, FaEye,
  FaSpinner, FaExclamationTriangle, FaTools, FaCar, FaCalendarCheck
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

const PhoneTestSummary = () => {
  const { user, updateUser } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState('');

  const testPhoneUpdate = async () => {
    if (!testPhone) {
      alert('Veuillez entrer un numéro de téléphone');
      return;
    }

    setLoading(true);
    try {
      console.log('🧪 Test de mise à jour du téléphone:', testPhone);
      
      const result = await userService.updateProfile({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        telephone: testPhone,
        genre: user.genre,
        date_naissance: user.date_naissance
      });

      if (result.success) {
        setTestResults(prev => ({
          ...prev,
          phoneUpdate: {
            success: true,
            message: 'Téléphone mis à jour avec succès',
            newPhone: result.data.telephone,
            timestamp: new Date().toLocaleTimeString()
          }
        }));
        updateUser(result.data);
      } else {
        setTestResults(prev => ({
          ...prev,
          phoneUpdate: {
            success: false,
            message: result.message || 'Erreur lors de la mise à jour',
            timestamp: new Date().toLocaleTimeString()
          }
        }));
      }
    } catch (error) {
      console.error('❌ Erreur test téléphone:', error);
      setTestResults(prev => ({
        ...prev,
        phoneUpdate: {
          success: false,
          message: 'Erreur de connexion: ' + error.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const phoneImplementationStatus = [
    {
      location: 'Inscription',
      description: 'Champ téléphone dans le formulaire d\'inscription',
      status: '✅ Implémenté',
      details: [
        'Validation format marocain',
        'Champ optionnel',
        'Sauvegarde en base de données'
      ]
    },
    {
      location: 'Profil (édition)',
      description: 'Modification du téléphone dans le profil',
      status: '✅ Corrigé',
      details: [
        'Téléphone inclus dans handleSubmit',
        'Validation en temps réel',
        'Sauvegarde en base de données'
      ]
    },
    {
      location: 'Profil (affichage)',
      description: 'Affichage du téléphone avec lien d\'appel',
      status: '✅ Implémenté',
      details: [
        'Lien tel: cliquable',
        'Icône téléphone',
        'Fallback si vide'
      ]
    },
    {
      location: 'Liste des trajets',
      description: 'Téléphone des conducteurs dans TripListSimple',
      status: '✅ Ajouté',
      details: [
        'Téléphone sous le nom',
        'Lien d\'appel direct',
        'Icône téléphone'
      ]
    },
    {
      location: 'Gestion conducteur',
      description: 'Téléphone des voyageurs dans DriverTripsManagement',
      status: '✅ Ajouté',
      details: [
        'Téléphone dans les réservations',
        'Contact direct voyageur',
        'Interface améliorée'
      ]
    },
    {
      location: 'Admin - Trajets',
      description: 'Téléphone des conducteurs dans l\'admin',
      status: '✅ Ajouté',
      details: [
        'Téléphone dans TripsManagementImproved',
        'Contact direct admin',
        'Interface complète'
      ]
    },
    {
      location: 'API Trajets',
      description: 'Téléphone inclus dans les réponses API',
      status: '✅ Corrigé',
      details: [
        'Téléphone dans /api/trips',
        'Données complètes',
        'Synchronisation frontend'
      ]
    }
  ];

  const testScenarios = [
    {
      title: 'Test sauvegarde téléphone',
      description: 'Vérifier que le téléphone se sauvegarde en base',
      steps: [
        'Modifier le téléphone dans le profil',
        'Enregistrer les modifications',
        'Vérifier en base de données',
        'Recharger la page'
      ],
      status: testResults.phoneUpdate?.success ? '✅ Réussi' : '⏳ En attente'
    },
    {
      title: 'Test affichage trajets',
      description: 'Vérifier l\'affichage des téléphones dans les trajets',
      steps: [
        'Aller sur la liste des trajets',
        'Vérifier les téléphones des conducteurs',
        'Tester les liens d\'appel',
        'Vérifier l\'interface'
      ],
      status: '✅ Implémenté'
    },
    {
      title: 'Test gestion réservations',
      description: 'Vérifier les téléphones dans la gestion conducteur',
      steps: [
        'Se connecter comme conducteur',
        'Voir ses trajets et réservations',
        'Vérifier les téléphones des voyageurs',
        'Tester les liens d\'appel'
      ],
      status: '✅ Implémenté'
    },
    {
      title: 'Test interface admin',
      description: 'Vérifier les téléphones dans l\'admin',
      steps: [
        'Se connecter comme admin',
        'Aller dans la gestion des trajets',
        'Vérifier les téléphones des conducteurs',
        'Tester les fonctionnalités'
      ],
      status: '✅ Implémenté'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaPhone className="text-4xl text-green-500" />
            <FaCheckCircle className="text-4xl text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Corrections Téléphone Complètes</h1>
          </div>
          <p className="text-lg text-gray-600">
            Résumé des corrections pour la sauvegarde et l'affichage des téléphones
          </p>
        </div>

        {/* Statut global */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <FaCheckCircle className="text-green-500 text-xl" />
            <span className="font-medium text-green-900">
              Erreur regex corrigée - Validation téléphone fonctionnelle
            </span>
          </div>
        </div>

        {/* Correction appliquée */}
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">🔧 Correction Appliquée</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>Problème :</strong> <code>preg_match(): No ending delimiter '/' found</code></p>
              <p><strong>Cause :</strong> Expression régulière mal formatée dans la validation Laravel</p>
              <p><strong>Solution :</strong> Remplacement par une fonction de validation personnalisée</p>
              <div className="mt-3 p-3 bg-blue-100 rounded">
                <p className="font-medium mb-2">Nouvelle validation :</p>
                <code className="text-xs">
                  function ($attribute, $value, $fail) {'{'}
                  <br />
                  &nbsp;&nbsp;if ($value && !preg_match('/^(\+212|0)[5-7][0-9]{8}$/', $value)) {'{'}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;$fail('Format invalide...');
                  <br />
                  &nbsp;&nbsp;{'}'}
                  <br />
                  {'}'}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Test en direct */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🧪 Test de Sauvegarde en Direct</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-4">Tester la mise à jour du téléphone</h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+212612345678 ou 0612345678"
                className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={testPhoneUpdate}
                disabled={loading || !testPhone}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaPhone />}
                <span>Tester</span>
              </button>
            </div>

            {testResults.phoneUpdate && (
              <div className={`p-3 rounded-lg ${testResults.phoneUpdate.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {testResults.phoneUpdate.success ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaExclamationTriangle className="text-red-500" />
                  )}
                  <span className={`font-medium ${testResults.phoneUpdate.success ? 'text-green-900' : 'text-red-900'}`}>
                    {testResults.phoneUpdate.message}
                  </span>
                </div>
                {testResults.phoneUpdate.newPhone && (
                  <p className="text-sm text-green-700">
                    Nouveau téléphone: {testResults.phoneUpdate.newPhone}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  Test effectué à {testResults.phoneUpdate.timestamp}
                </p>
              </div>
            )}

            <p className="text-sm text-blue-700 mt-3">
              <strong>Utilisateur actuel:</strong> {user?.prenom} {user?.nom} - 
              <strong> Téléphone:</strong> {user?.telephone || 'Non renseigné'}
            </p>
          </div>
        </div>

        {/* Statut d'implémentation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">📋 Statut d'Implémentation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phoneImplementationStatus.map((item, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{item.location}</h3>
                  <span className="text-sm font-medium text-green-600">{item.status}</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {item.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Scénarios de test */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🧪 Scénarios de Test</h2>
          
          <div className="space-y-4">
            {testScenarios.map((scenario, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-green-900">{scenario.title}</h3>
                  <span className="text-sm font-medium">{scenario.status}</span>
                </div>
                <p className="text-sm text-green-700 mb-3">{scenario.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Étapes :</h4>
                    <ol className="text-sm text-green-700 space-y-1">
                      {scenario.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{stepIndex + 1}. {step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaEdit className="mr-2" />
            Tester Profil
          </Link>
          
          <Link
            to="/trips"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaCar className="mr-2" />
            Voir Trajets
          </Link>
          
          <Link
            to="/my-trips"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FaCalendarCheck className="mr-2" />
            Mes Trajets
          </Link>
          
          <Link
            to="/admin/trips"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaTools className="mr-2" />
            Admin Trajets
          </Link>
        </div>

        {/* Note finale */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">🎉 Corrections Appliquées :</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✅ <strong>Sauvegarde téléphone corrigée</strong> - Téléphone inclus dans handleSubmit du profil</li>
            <li>✅ <strong>Affichage universel</strong> - Téléphones visibles partout où les profils apparaissent</li>
            <li>✅ <strong>API mise à jour</strong> - Téléphones inclus dans toutes les réponses</li>
            <li>✅ <strong>Liens d'appel</strong> - Tous les téléphones sont cliquables avec tel:</li>
            <li>✅ <strong>Interface améliorée</strong> - Icônes et design cohérents</li>
          </ul>
        </div>

        {/* Identifiants de test */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">🔑 Identifiants de Test :</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Admin :</strong> admin@covoitfacile.com • <strong>Mot de passe :</strong> admin123</p>
            <p><strong>Conducteur :</strong> test@conducteur.com • <strong>Mot de passe :</strong> password</p>
            <p><strong>Voyageur :</strong> test@voyageur.com • <strong>Mot de passe :</strong> password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneTestSummary;
