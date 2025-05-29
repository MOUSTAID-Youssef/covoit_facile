import { useState } from 'react';

function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: 'Comment fonctionne le système de réservation ?',
      answer: 'Pour réserver un trajet, il suffit de sélectionner votre destination et la date souhaitée. Vous pourrez voir les trajets disponibles et choisir celui qui vous convient. Une fois votre choix fait, vous pouvez réserver directement en ligne.'
    },
    {
      id: 2,
      question: 'Comment sont calculés les prix des trajets ?',
      answer: 'Les prix sont fixés par les conducteurs en fonction de la distance, du type de véhicule et des frais de carburant. Nous nous assurons que les prix restent raisonnables et compétitifs.'
    },
    {
      id: 3,
      question: 'Comment fonctionne le système de points de fidélité ?',
      answer: 'Vous gagnez des points à chaque trajet effectué. Ces points peuvent être échangés contre des réductions sur vos prochains trajets ou des avantages exclusifs.'
    },
    {
      id: 4,
      question: 'Comment contacter le conducteur avant le trajet ?',
      answer: 'Une fois votre réservation confirmée, vous aurez accès à notre système de messagerie instantanée pour communiquer directement avec le conducteur.'
    },
    {
      id: 5,
      question: 'Que faire en cas d\'annulation ?',
      answer: 'Si vous devez annuler votre trajet, faites-le au plus tôt. Les annulations effectuées 24h avant le départ sont remboursées intégralement. Pour les annulations plus tardives, des frais peuvent s\'appliquer.'
    },
    {
      id: 6,
      question: 'Comment fonctionne le système d\'évaluation ?',
      answer: 'Après chaque trajet, vous pouvez noter votre expérience et laisser un commentaire. Ces évaluations nous aident à maintenir la qualité du service et à récompenser les meilleurs conducteurs.'
    }
  ];

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Questions fréquentes</h2>
      <div className="space-y-4">
        {faqItems.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => toggleQuestion(item.id)}
            >
              <span className="text-lg font-medium text-gray-900">{item.question}</span>
              <svg
                className={`h-6 w-6 text-gray-400 transform ${openQuestion === item.id ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openQuestion === item.id && (
              <div className="px-4 pb-4">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-indigo-900 mb-4">Vous ne trouvez pas la réponse à votre question ?</h3>
        <p className="text-indigo-700 mb-4">
          Notre équipe de support est là pour vous aider. N'hésitez pas à nous contacter.
        </p>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Contacter le support
        </button>
      </div>
    </div>
  );
}

export default FAQ;