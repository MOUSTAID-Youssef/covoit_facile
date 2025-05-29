import { Link } from 'react-router-dom';
import TripCard from './TripCard';

function Trips() {
  const trips = [
    {
      id: 1,
      departure: 'Casablanca',
      destination: 'Rabat',
      date: '20 Juin 2024 - 10:00',
      price: 50,
      seats: 3,
      driver: 'Mohammed A.'
    },
    {
      id: 2,
      departure: 'Marrakech',
      destination: 'Agadir',
      date: '21 Juin 2024 - 08:30',
      price: 80,
      seats: 4,
      driver: 'Fatima B.'
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Trajets Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/search"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Voir plus de trajets →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Trips;