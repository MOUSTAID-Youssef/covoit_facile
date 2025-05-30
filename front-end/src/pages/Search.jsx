import { useState } from 'react';
import TripCard from '../components/TripCard';
import TripListSimple from '../components/TripListSimple';

function Search() {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    destination: '',
    date: ''
  });

  // Exemple de données de trajets (à remplacer par des données réelles plus tard)
  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
    'Meknès', 'Oujda', 'Tétouan', 'Safi', 'El Jadida', 'Nador'
  ];

  const trips = [
    {
      id: 1,
      departure: 'Casablanca',
      destination: 'Marrakech',
      date: '22 Juin 2024 - 09:00',
      price: 120,
      seats: 3,
      driver: 'Hassan M.'
    },
    {
      id: 2,
      departure: 'Rabat',
      destination: 'Tanger',
      date: '23 Juin 2024 - 14:30',
      price: 150,
      seats: 4,
      driver: 'Amina K.'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Logique de recherche à implémenter
    console.log('Recherche avec les paramètres:', searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">Rechercher un trajet</span>
        </h2>

        <form onSubmit={handleSearch} className="bg-white shadow-xl rounded-2xl px-8 pt-8 pb-8 mb-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center" htmlFor="departure">
                <svg className="h-4 w-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Départ
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors duration-200"
                id="departure"
                value={searchParams.departure}
                onChange={(e) => setSearchParams({...searchParams, departure: e.target.value})}
              >
                <option value="">Sélectionnez une ville</option>
                {moroccanCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center" htmlFor="destination">
                <svg className="h-4 w-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Destination
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors duration-200"
                id="destination"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
              >
                <option value="">Sélectionnez une ville</option>
                {moroccanCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center" htmlFor="date">
                <svg className="h-4 w-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors duration-200"
                id="date"
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center justify-center mt-8">
            <button
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transform transition duration-200 hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              type="submit"
            >
              Rechercher un trajet
            </button>
          </div>
        </form>

        {/* Liste des trajets dynamique */}
        <TripListSimple />
      </div>
    </div>
  );
}

export default Search;