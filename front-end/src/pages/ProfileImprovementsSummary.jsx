import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, FaCalendarAlt, FaClock, FaEye, FaUsers, FaCheckCircle,
  FaArrowRight, FaDesktop, FaMobile, FaPalette, FaTools
} from 'react-icons/fa';

const ProfileImprovementsSummary = () => {
  const improvements = [
    {
      id: 1,
      title: 'Réservations automatiquement affichées (Voyageur)',
      description: 'Les réservations s\'affichent directement sans cliquer sur un onglet',
      icon: FaEye,
      color: 'text-blue-500',
      status: '✅ Implémenté',
      details: [
        'Suppression de l\'onglet "Mes Réservations"',
        'Affichage direct des réservations au chargement',
        'Header avec titre et description',
        'UX simplifiée pour les voyageurs'
      ]
    },
    {
      id: 2,
      title: 'Dates et heures améliorées (Conducteur)',
      description: 'Formatage français et cartes colorées pour les dates/heures',
      icon: FaClock,
      color: 'text-green-500',
      status: '✅ Implémenté',
      details: [
        'Format français complet "lundi 15 janvier 2024"',
        'Cartes colorées pour date/heure, places et réservations',
        'Fonction formatDateTime() intelligente',
        'Visual hierarchy améliorée'
      ]
    }
  ];

  const beforeAfterComparison = [
    {
      aspect: 'Profil Voyageur',
      before: 'Onglet "Mes Réservations" à cliquer',
      after: 'Réservations affichées automatiquement',
      improvement: 'UX simplifiée, accès direct'
    },
    {
      aspect: 'Dates Conducteur',
      before: 'Format simple "2024-01-15 à 14:30"',
      after: 'Format français "lundi 15 janvier 2024 à 14:30"',
      improvement: 'Lisibilité et professionnalisme'
    },
    {
      aspect: 'Layout Conducteur',
      before: 'Informations en ligne simple',
      after: 'Cartes colorées avec icônes et labels',
      improvement: 'Visual hierarchy et attractivité'
    }
  ];

  const technicalImplementations = [
    {
      category: 'Affichage automatique réservations',
      icon: FaEye,
      color: 'text-blue-500',
      changes: [
        {
          file: 'pages/Profile.jsx',
          description: 'Suppression des onglets pour voyageurs',
          code: `// Définir l'onglet par défaut selon le rôle
useEffect(() => {
  if (user) {
    if (user.role === 'voyageur') {
      setActiveTab('reservations');
    } else if (user.role === 'conducteur') {
      setActiveTab('trips');
    }
  }
}, [user]);

// Pour les voyageurs : affichage direct des réservations
{user.role === 'voyageur' && (
  <div className="px-6 py-6">
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
        <FaCalendarAlt className="text-indigo-500" />
        <span>Mes Réservations</span>
      </h3>
      <p className="text-gray-600 mt-1">Gérez vos réservations de trajets</p>
    </div>
    <PassengerReservations />
  </div>
)}`
        }
      ]
    },
    {
      category: 'Formatage dates et heures',
      icon: FaClock,
      color: 'text-green-500',
      changes: [
        {
          file: 'components/DriverTripsManagement.jsx',
          description: 'Fonctions de formatage français',
          code: `// Fonctions de formatage des dates et heures
const formatDate = (dateString) => {
  if (!dateString) return 'Date non définie';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return 'Date invalide';
  }
};

const formatTime = (timeString) => {
  if (!timeString) return 'Heure non définie';
  try {
    return timeString.substring(0, 5); // Format HH:MM
  } catch (error) {
    return 'Heure invalide';
  }
};

const formatDateTime = (dateString, timeString) => {
  const formattedDate = formatDate(dateString);
  const formattedTime = formatTime(timeString);
  return \`\${formattedDate} à \${formattedTime}\`;
};`
        }
      ]
    },
    {
      category: 'Cartes colorées conducteur',
      icon: FaPalette,
      color: 'text-purple-500',
      changes: [
        {
          file: 'components/DriverTripsManagement.jsx',
          description: 'Interface avec cartes colorées',
          code: `<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
    <div className="flex items-center space-x-2 mb-1">
      <FaCalendarAlt className="text-blue-500" />
      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Date & Heure</span>
    </div>
    <div className="text-sm font-semibold text-blue-900">
      {formatDateTime(trip.date_depart, trip.heure_depart)}
    </div>
  </div>
  
  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
    <div className="flex items-center space-x-2 mb-1">
      <FaUsers className="text-green-500" />
      <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Places</span>
    </div>
    <div className="text-sm font-semibold text-green-900">
      {trip.places_disponibles}/{trip.places_totales} disponibles
    </div>
  </div>
</div>`
        }
      ]
    }
  ];

  const userFlows = [
    {
      scenario: 'Voyageur consulte ses réservations',
      steps: [
        'Voyageur se connecte et va sur son profil',
        'Les réservations s\'affichent automatiquement',
        'Pas besoin de cliquer sur un onglet',
        'Interface claire avec titre et description',
        'Accès direct aux fonctionnalités'
      ],
      result: 'UX simplifiée et accès immédiat aux réservations'
    },
    {
      scenario: 'Conducteur consulte ses trajets',
      steps: [
        'Conducteur va sur son profil',
        'Voit ses trajets avec dates françaises',
        'Informations dans des cartes colorées',
        'Date complète "lundi 15 janvier 2024 à 14:30"',
        'Visual hierarchy claire et professionnelle'
      ],
      result: 'Interface moderne et informations lisibles'
    }
  ];

  const designFeatures = [
    {
      feature: 'Header réservations voyageur',
      description: 'Titre avec icône et description explicative',
      color: 'bg-blue-50 border-blue-200 text-blue-900'
    },
    {
      feature: 'Carte Date & Heure',
      description: 'Fond bleu avec formatage français complet',
      color: 'bg-blue-50 border-blue-200 text-blue-900'
    },
    {
      feature: 'Carte Places',
      description: 'Fond vert avec disponibilité claire',
      color: 'bg-green-50 border-green-200 text-green-900'
    },
    {
      feature: 'Carte Réservations',
      description: 'Fond orange avec compteur de réservations',
      color: 'bg-orange-50 border-orange-200 text-orange-900'
    }
  ];

  const benefits = [
    {
      benefit: 'UX Voyageur simplifiée',
      description: 'Accès direct aux réservations sans navigation supplémentaire',
      icon: FaUser,
      color: 'text-blue-500'
    },
    {
      benefit: 'Lisibilité améliorée',
      description: 'Dates en français complet plus naturelles à lire',
      icon: FaClock,
      color: 'text-green-500'
    },
    {
      benefit: 'Visual hierarchy',
      description: 'Cartes colorées pour organiser l\'information',
      icon: FaPalette,
      color: 'text-purple-500'
    },
    {
      benefit: 'Professionnalisme',
      description: 'Interface plus moderne et soignée',
      icon: FaCheckCircle,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FaUser className="text-4xl text-blue-500" />
            <FaClock className="text-4xl text-green-500" />
            <FaEye className="text-4xl text-purple-500" />
            <h1 className="text-3xl font-bold text-gray-900">Améliorations Profils</h1>
          </div>
          <p className="text-lg text-gray-600">
            Résumé des améliorations : réservations auto-affichées et dates/heures stylisées
          </p>
        </div>

        {/* Statut global */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <FaCheckCircle className="text-green-500 text-xl" />
            <span className="font-medium text-green-900">
              Profils voyageur et conducteur optimisés
            </span>
          </div>
        </div>

        {/* Améliorations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🔧 Améliorations Apportées</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {improvements.map((improvement) => {
              const IconComponent = improvement.icon;
              return (
                <div key={improvement.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <IconComponent className={`text-2xl ${improvement.color}`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{improvement.title}</h3>
                      <span className="text-sm font-medium text-green-600">{improvement.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{improvement.description}</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {improvement.details.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparaison Avant/Après */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🔄 Comparaison Avant/Après</h2>
          
          <div className="space-y-4">
            {beforeAfterComparison.map((comparison, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded p-4">
                <h3 className="font-medium text-gray-900 mb-3">{comparison.aspect}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-2">❌ Avant</h4>
                    <p className="text-sm text-red-700 bg-red-50 p-2 rounded">{comparison.before}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-600 mb-2">✅ Après</h4>
                    <p className="text-sm text-green-700 bg-green-50 p-2 rounded">{comparison.after}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-600 mb-2">📈 Amélioration</h4>
                    <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">{comparison.improvement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implémentations techniques */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">⚙️ Implémentations Techniques</h2>
          
          <div className="space-y-6">
            {technicalImplementations.map((impl, index) => {
              const IconComponent = impl.icon;
              return (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <IconComponent className={`text-xl ${impl.color}`} />
                    <h3 className="font-medium text-gray-900">{impl.category}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {impl.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="bg-white border border-gray-200 rounded p-4">
                        <h4 className="font-medium text-sm text-gray-900 mb-2">{change.file}</h4>
                        <p className="text-sm text-gray-700 mb-3">{change.description}</p>
                        <code className="block text-xs bg-gray-100 p-3 rounded text-gray-800 overflow-x-auto whitespace-pre">
                          {change.code}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flux utilisateur */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">👤 Flux Utilisateur Améliorés</h2>
          
          <div className="space-y-6">
            {userFlows.map((flow, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-4">{flow.scenario}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-3">Étapes :</h4>
                    <ol className="text-sm text-blue-700 space-y-2">
                      {flow.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start space-x-2">
                          <span className="font-medium text-blue-600">{stepIndex + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-3">Résultat :</h4>
                    <p className="text-sm text-blue-700 bg-blue-100 p-3 rounded">{flow.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fonctionnalités design */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🎨 Fonctionnalités Design</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {designFeatures.map((feature, index) => (
              <div key={index} className={`p-4 rounded-lg border ${feature.color}`}>
                <h3 className="font-medium mb-2">{feature.feature}</h3>
                <p className="text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bénéfices */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">🎯 Bénéfices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <IconComponent className={`text-2xl ${benefit.color}`} />
                    <h3 className="font-medium text-gray-900">{benefit.benefit}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaUser className="mr-2" />
            Tester Profil
          </Link>
          
          <Link
            to="/trips"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaCalendarAlt className="mr-2" />
            Voir Trajets
          </Link>
          
          <Link
            to="/create"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FaTools className="mr-2" />
            Créer Trajet
          </Link>
        </div>

        {/* Note finale */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">✅ Améliorations Appliquées :</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✅ <strong>Réservations auto-affichées</strong> - Plus d'onglet à cliquer pour voyageurs</li>
            <li>✅ <strong>Dates françaises</strong> - Format "lundi 15 janvier 2024 à 14:30"</li>
            <li>✅ <strong>Cartes colorées</strong> - Visual hierarchy pour conducteurs</li>
            <li>✅ <strong>UX simplifiée</strong> - Interface plus intuitive et moderne</li>
          </ul>
        </div>

        {/* Identifiants de test */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">🔑 Identifiants de Test :</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Voyageur :</strong> test@voyageur.com • <strong>Mot de passe :</strong> password</p>
            <p><strong>Conducteur :</strong> test@conducteur.com • <strong>Mot de passe :</strong> password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImprovementsSummary;
