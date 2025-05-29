import { motion } from 'framer-motion';

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah B.',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiM2MzY2ZjEiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjMwIiByPSIxNSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xNSA2NWMwLTE1IDE1LTI1IDI1LTI1czI1IDEwIDI1IDI1IiBmaWxsPSIjZmZmIi8+PC9zdmc+',
      rating: '★★★★★',
      text: 'Une expérience incroyable ! J\'ai fait de belles rencontres et économisé sur mes trajets. Je recommande vivement !',
      borderColor: 'border-indigo-100'
    },
    {
      id: 2,
      name: 'Karim M.',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiM4YjVjZjYiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjMwIiByPSIxNSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xNSA2NWMwLTE1IDE1LTI1IDI1LTI1czI1IDEwIDI1IDI1IiBmaWxsPSIjZmZmIi8+PC9zdmc+',
      rating: '★★★★★',
      text: 'Excellent service ! Les conducteurs sont ponctuels et sympathiques. Je l\'utilise régulièrement pour mes déplacements.',
      borderColor: 'border-purple-100'
    },
    {
      id: 3,
      name: 'Fatima L.',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiM4MThlZjciLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjMwIiByPSIxNSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xNSA2NWMwLTE1IDE1LTI1IDI1LTI1czI1IDEwIDI1IDI1IiBmaWxsPSIjZmZmIi8+PC9zdmc+',
      rating: '★★★★★',
      text: 'Une super alternative pour voyager à petit prix. L\'application est très facile à utiliser !',
      borderColor: 'border-indigo-100'
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Ce que disent nos voyageurs</h2>
        <div className="relative">
          <div className="flex overflow-x-hidden snap-x snap-mandatory gap-6 pb-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="snap-center shrink-0 w-full md:w-[340px] bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center space-y-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={`w-20 h-20 rounded-full overflow-hidden border-4 ${testimonial.borderColor}`}>
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-indigo-600 font-medium">{testimonial.rating}</p>
                </div>
                <p className="text-gray-600 text-center italic">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4 z-10">
            <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200 hover:scale-110">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200 hover:scale-110">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;