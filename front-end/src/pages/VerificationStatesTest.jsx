import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCheckCircle, FaClock, FaExclamationTriangle, FaIdCard, FaEye,
  FaCheck, FaTimes, FaUsers, FaFilter
} from 'react-icons/fa';

const VerificationStatesTest = () => {
  const verificationStates = [
    {
      id: 'verifie',
      title: '✅ Vérifiés',
      description: 'Utilisateurs avec documents d\'identité acceptés par l\'admin',
      icon: FaCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      count: 15,
      criteria: [
        'Document d\'identité uploadé (cin_path existe)',
        'badge_verifie = true',
        'statut_verification = "verifie"',
        'Admin a cliqué sur "Accepter"'
      ],
      actions: [
        'Peut révoquer la vérification',
        'Compte considéré comme fiable',
        'Accès complet aux fonctionnalités'
      ]
    },
    {
      id: 'en_attente',
      title: '⏳ En attente',
      description: 'Utilisateurs avec documents uploadés mais pas encore traités',
      icon: FaClock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      count: 6,
      criteria: [
        'Document d\'identité uploadé (cin_path existe)',
        'badge_verifie = false ou null',
        'statut_verification ≠ "rejete"',
        'En attente de traitement admin'
      ],
      actions: [
        'Admin peut accepter ou refuser',
        'Apparaît dans la liste de vérification',
        'Fonctionnalités limitées'
      ]
    },
    {
      id: 'non_verifie',
      title: '❌ Non vérifiés',
      description: 'Utilisateurs qui n\'ont uploadé aucun document',
      icon: FaExclamationTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      count: 4,
      criteria: [
        'Aucun document uploadé (cin_path = null)',
        'badge_verifie = false ou null',
        'Pas de statut de vérification',
        'N\'apparaît pas dans la vérification'
      ],
      actions: [
        'Doit uploader un document',
        'N\'apparaît pas dans /admin/verification',
        'Accès limité aux fonctionnalités'
      ]
    }
  ];

  const dashboardFeatures = [
    {
      title: '📊 Statistiques mises à jour',
      description: 'Dashboard affiche maintenant les 3 états séparément',
      items: [
        'Carte "Comptes vérifiés" avec nombre d\'utilisateurs acceptés',
        'Carte "En attente de vérification" avec documents à traiter',
        'Carte "Non vérifiés" avec utilisateurs sans documents',
        'Graphiques avec barres de progression colorées',
        'Descriptions explicatives pour chaque état'
      ]
    },
    {
      title: '🔍 Page de vérification améliorée',
      description: 'Interface avec filtres pour gérer les 3 états',
      items: [
        'Filtres par état : En attente, Vérifiés, Rejetés',
        'Compteurs en temps réel pour chaque filtre',
        'Affichage seulement des utilisateurs avec documents',
        'Actions contextuelles selon l\'état',
        'Statut visuel avec icônes et couleurs'
      ]
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Utilisateur s\'inscrit',
      description: 'Création du compte sans document',
      status: 'non_verifie',
      icon: FaUsers
    },
    {
      step: 2,
      title: 'Upload du document',
      description: 'Utilisateur uploade sa photo d\'identité',
      status: 'en_attente',
      icon: FaIdCard
    },
    {
      step: 3,
      title: 'Examen admin',
      description: 'Admin examine le document dans /admin/verification',
      status: 'en_attente',
      icon: FaEye
    },
    {
      step: 4,
      title: 'Décision admin',
      description: 'Admin accepte ou refuse le document',
      status: 'verifie',
      icon: FaCheck
    }
  ];

  const getStateColor = (status) => {
    switch (status) {
      case 'verifie': return 'text-green-600 bg-green-50 border-green-200';
      case 'en_attente': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'non_verifie': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaIdCard className="text-4xl text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">Système de Vérification à 3 États</h1>
          </div>
          <p className="text-lg text-gray-600">
            Gestion complète des documents d'identité avec états distincts
          </p>
        </div>

        {/* États de vérification */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">📋 Les 3 États de Vérification</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {verificationStates.map((state) => {
              const Icon = state.icon;
              return (
                <div key={state.id} className={`p-6 rounded-lg border-2 ${state.bgColor} ${state.borderColor}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon className={`text-2xl ${state.color}`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{state.title}</h3>
                      <p className="text-sm text-gray-600">{state.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${state.color} ${state.bgColor}`}>
                      <Icon className="mr-1" />
                      {state.count} utilisateurs
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Critères :</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {state.criteria.map((criterion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Actions :</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {state.actions.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workflow */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🔄 Workflow de Vérification</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className={`p-4 rounded-lg border-2 ${getStateColor(step.status)}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <Icon className="text-xl text-gray-700" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fonctionnalités */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">✨ Fonctionnalités Implémentées</h2>
          
          <div className="space-y-6">
            {dashboardFeatures.map((feature, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-blue-700 mb-4">{feature.description}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2 text-sm text-blue-700">
                      <FaCheckCircle className="text-blue-500 text-xs mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Règles importantes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">⚠️ Règles Importantes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-3">🔍 Page de Vérification</h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• Affiche SEULEMENT les utilisateurs avec documents uploadés</li>
                <li>• Filtre par état : En attente, Vérifiés, Rejetés</li>
                <li>• Les utilisateurs sans documents n'apparaissent PAS</li>
                <li>• Actions contextuelles selon l'état actuel</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-3">📊 Dashboard Statistiques</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• 3 cartes séparées pour chaque état</li>
                <li>• Graphiques avec barres de progression</li>
                <li>• Descriptions explicatives</li>
                <li>• Liens directs vers la page de vérification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions de test */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/verification"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaIdCard className="mr-2" />
            Tester Vérification
          </Link>
          
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaCheckCircle className="mr-2" />
            Voir Statistiques
          </Link>
          
          <Link
            to="/admin/users"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FaUsers className="mr-2" />
            Gérer Utilisateurs
          </Link>
          
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <FaFilter className="mr-2" />
            Se connecter admin
          </Link>
        </div>

        {/* Note finale */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">🎉 Résultat Final :</h3>
          <p className="text-sm text-green-700">
            Le système de vérification fonctionne maintenant avec 3 états distincts. La page de vérification 
            affiche seulement les utilisateurs avec documents uploadés et permet de filtrer par état. 
            Le dashboard affiche les statistiques détaillées pour chaque état.
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

export default VerificationStatesTest;
