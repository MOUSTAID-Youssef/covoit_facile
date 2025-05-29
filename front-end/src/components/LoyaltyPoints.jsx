import { useState } from 'react';

function LoyaltyPoints({ userPoints = 450 }) {
  const [showRewardDetails, setShowRewardDetails] = useState(false);

  const rewards = [
    {
      id: 1,
      title: 'Réduction de 10%',
      points: 200,
      description: 'Obtenez une réduction de 10% sur votre prochain trajet',
      icon: '🎫'
    },
    {
      id: 2,
      title: 'Trajet gratuit',
      points: 1000,
      description: 'Profitez d\'un trajet gratuit (valeur max. 200 MAD)',
      icon: '🚗'
    },
    {
      id: 3,
      title: 'Status VIP',
      points: 2000,
      description: 'Accédez au statut VIP avec des avantages exclusifs pendant 1 mois',
      icon: '👑'
    }
  ];

  const calculateProgress = (points) => {
    const nextTier = rewards.find(reward => reward.points > points);
    if (!nextTier) return 100;
    const previousTier = rewards[rewards.indexOf(nextTier) - 1];
    const base = previousTier ? previousTier.points : 0;
    return ((points - base) / (nextTier.points - base)) * 100;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Vos points de fidélité</h2>
        <span className="text-3xl font-bold text-indigo-600">{userPoints} pts</span>
      </div>

      <div className="mb-8">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                Progression
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-indigo-600">
                {Math.round(calculateProgress(userPoints))}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
            <div
              style={{ width: `${calculateProgress(userPoints)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className={`p-4 border rounded-lg ${userPoints >= reward.points ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{reward.icon}</span>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{reward.title}</h3>
                  <p className="text-sm text-gray-500">{reward.points} points</p>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${userPoints >= reward.points
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                disabled={userPoints < reward.points}
                onClick={() => setShowRewardDetails(true)}
              >
                {userPoints >= reward.points ? 'Échanger' : 'Points insuffisants'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showRewardDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirmer l'échange</h3>
              <button
                onClick={() => setShowRewardDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir échanger vos points contre cette récompense ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRewardDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  // Logique d'échange à implémenter
                  setShowRewardDetails(false);
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
        <h3 className="text-lg font-medium text-indigo-900 mb-2">Comment gagner plus de points ?</h3>
        <ul className="space-y-2 text-sm text-indigo-700">
          <li>✓ Effectuez des trajets régulièrement</li>
          <li>✓ Partagez l'application avec vos amis</li>
          <li>✓ Laissez des avis sur vos trajets</li>
          <li>✓ Complétez votre profil</li>
        </ul>
      </div>
    </div>
  );
}

export default LoyaltyPoints;