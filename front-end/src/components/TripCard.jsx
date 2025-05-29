function TripCard({ trip }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-4 transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-indigo-600">{trip.departure}</span>
            <span className="text-indigo-500 font-medium">→</span>
            <span className="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-indigo-600">{trip.destination}</span>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{trip.date}</span>
          </div>
        </div>
        <div className="text-right ml-4">
          <p className="text-2xl font-bold text-indigo-600 transition-colors duration-200 hover:text-indigo-700">{trip.price}€</p>
          <div className="mt-1 flex items-center justify-end text-sm">
            <svg className="h-4 w-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-gray-500">{trip.seats} places disponibles</span>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-md">
            {trip.driver.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-700">{trip.driver}</span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transform transition duration-200 hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Réserver ce trajet
        </button>
      </div>
    </div>
  );
}

export default TripCard;