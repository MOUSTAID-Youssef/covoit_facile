import { motion } from 'framer-motion';

function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: '🔍',
      title: 'Recherchez',
      description: 'Trouvez le trajet qui vous convient parmi nos nombreuses offres'
    },
    {
      id: 2,
      icon: '📱',
      title: 'Réservez',
      description: 'Réservez votre place en quelques clics'
    },
    {
      id: 3,
      icon: '🚗',
      title: 'Voyagez',
      description: 'Profitez de votre trajet en toute sérénité'
    }
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(step => (
            <motion.div
              key={step.id}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 rounded-lg shadow-lg bg-white"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;