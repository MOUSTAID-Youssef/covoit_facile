import { useState } from 'react';

function UserProfile() {
  // Exemple de données utilisateur (à remplacer par des données réelles)
  const [userData] = useState({
    name: 'Mohammed Alami',
    email: 'mohammed.alami@email.com',

    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 4.7,
    tripsAsDriver: [
      {
        id: '1',
        departure: 'Casablanca',
        destination: 'Rabat',
        date: '2024-02-15',
        time: '09:00',
        price: 50,
        seatsAvailable: 3,
        status: 'À venir'
      },
      {
        id: '2',
        departure: 'Rabat',
        destination: 'Casablanca',
        date: '2024-02-10',
        time: '18:00',
        price: 50,
        seatsAvailable: 0,
        status: 'Terminé'
      }
    ],
    tripsAsPassenger: [
      {
        id: '3',
        departure: 'Marrakech',
        destination: 'Agadir',
        date: '2024-02-20',
        time: '10:00',
        price: 120,
        driver: 'Fatima K.',
        status: 'Réservé'
      }
    ]
  });

  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* En-tête du profil */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-8">
          <div className="flex items-center">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
            />
            <div className="ml-6 text-white">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-indigo-200">{userData.email}</p>
              <div className="mt-2 flex items-center">
                <span className="text-yellow-400">{"★".repeat(Math.floor(userData.rating))}</span>
                <span className="ml-2 text-indigo-200">{userData.rating}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`${
                activeTab === 'info'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              onClick={() => setActiveTab('info')}
            >
              Informations personnelles
            </button>
            <button
              className={`${
                activeTab === 'driver'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              onClick={() => setActiveTab('driver')}
            >
              Mes trajets proposés
            </button>
            <button
              className={`${
                activeTab === 'passenger'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              onClick={() => setActiveTab('passenger')}
            >
              Mes réservations
            </button>
          </nav>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Informations de contact</h3>
                <div className="mt-4 space-y-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{userData.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'driver' && (
            <div className="space-y-6">
              {userData.tripsAsDriver.map(trip => (
                <div key={trip.id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {trip.departure} → {trip.destination}
                      </h3>
                      <p className="text-gray-600">
                        {trip.date} à {trip.time}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      trip.status === 'À venir' ? 'bg-green-100 text-green-800' :
                      trip.status === 'Terminé' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-600">
                    <span>{trip.seatsAvailable} places disponibles</span>
                    <span>{trip.price} MAD par personne</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'passenger' && (
            <div className="space-y-6">
              {userData.tripsAsPassenger.map(trip => (
                <div key={trip.id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {trip.departure} → {trip.destination}
                      </h3>
                      <p className="text-gray-600">
                        {trip.date} à {trip.time}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Conducteur: {trip.driver}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      trip.status === 'Réservé' ? 'bg-blue-100 text-blue-800' :
                      trip.status === 'Terminé' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <span>{trip.price} MAD</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;