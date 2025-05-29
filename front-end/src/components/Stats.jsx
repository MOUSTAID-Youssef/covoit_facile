import { motion } from 'framer-motion';

function Stats() {
  const stats = [
    { id: 1, value: '15K+', label: 'Utilisateurs actifs' },
    { id: 2, value: '50K+', label: 'Trajets effectués' },
    { id: 3, value: '2M+', label: 'KM parcourus' },
    { id: 4, value: '500K+', label: 'DH économisés' }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(stat => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg"
            >
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{stat.value}</div>
              <div className="mt-2 text-gray-700 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Stats;