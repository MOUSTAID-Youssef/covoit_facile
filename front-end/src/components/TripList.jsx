import { useState } from 'react';
import TripCard from './TripCard';

function TripList() {
  // Exemple de données de trajets (à remplacer par des données réelles plus tard)
  const [trips] = useState([
    {
      id: '1',
      departure: 'Casablanca',
      destination: 'Rabat',
      date: '2024-02-01',
      time: '09:00',
      price: 50,
      seatsAvailable: 3,
      driverName: 'Mohammed',
      driverPhoto: 'https://i.pravatar.cc/150?img=1',
      rating: 4.5
    },
    {
      id: '2',
      departure: 'Marrakech',
      destination: 'Agadir',
      date: '2024-02-02',
      time: '10:30',
      price: 120,
      seatsAvailable: 2,
      driverName: 'Fatima',
      driverPhoto: 'https://i.pravatar.cc/150?img=2',
      rating: 4.8
    }
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Trajets disponibles</h2>
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}

export default TripList;