import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import tripManagementService from '../services/tripManagementService';
import reservationService from '../services/reservationService';

const ReservationTest = () => {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testGetTripsWithReservations = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🔍 Test: Récupération des trajets avec réservations');

      const response = await tripManagementService.getMyTripsWithReservations();

      setResult({
        success: response.success,
        title: 'Trajets avec réservations',
        data: response,
        message: response.success ? 'Trajets chargés avec succès' : response.message
      });

    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        success: false,
        title: 'Erreur',
        message: error.message,
        error: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testGetMyReservations = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🔍 Test: Récupération de mes réservations');

      const response = await reservationService.getMyReservations();

      setResult({
        success: response.success,
        title: 'Mes réservations',
        data: response,
        message: response.success ? 'Réservations chargées avec succès' : response.message
      });

    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        success: false,
        title: 'Erreur',
        message: error.message,
        error: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testAcceptReservation = async () => {
    const reservationId = prompt('ID de la réservation à accepter:');
    if (!reservationId) return;

    setLoading(true);
    setResult(null);

    try {
      console.log('🔍 Test: Acceptation de réservation', reservationId);

      const response = await tripManagementService.acceptReservation(reservationId);

      setResult({
        success: response.success,
        title: 'Acceptation de réservation',
        data: response,
        message: response.message
      });

    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        success: false,
        title: 'Erreur',
        message: error.message,
        error: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testRejectReservation = async () => {
    const reservationId = prompt('ID de la réservation à refuser:');
    if (!reservationId) return;

    setLoading(true);
    setResult(null);

    try {
      console.log('🔍 Test: Refus de réservation', reservationId);

      const response = await tripManagementService.rejectReservation(reservationId);

      setResult({
        success: response.success,
        title: 'Refus de réservation',
        data: response,
        message: response.message
      });

    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        success: false,
        title: 'Erreur',
        message: error.message,
        error: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testUpdateTrip = async () => {
    const tripId = prompt('ID du trajet à modifier:');
    if (!tripId) return;

    const newPrice = prompt('Nouveau prix:');
    if (!newPrice) return;

    setLoading(true);
    setResult(null);

    try {
      console.log('🔍 Test: Modification de trajet', tripId);

      const response = await tripManagementService.updateTrip(tripId, {
        prix: parseFloat(newPrice)
      });

      setResult({
        success: response.success,
        title: 'Modification de trajet',
        data: response,
        message: response.message
      });

    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        success: false,
        title: 'Erreur',
        message: error.message,
        error: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🔍 Test: API directe');

      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

      const response = await fetch('http://localhost:8000/api/my-trips-reservations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      setResult({
        success: response.ok,
        title: 'API directe',
        status: response.status,
        data: data,
        message: response.ok ? 'API accessible' : 'Erreur API'
      });

    } catch (error) {
      console.error('❌ Erreur:', error);
      setResult({
        success: false,
        title: 'Erreur API',
        message: error.message,
        error: error.toString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test des Réservations</h1>

        {user && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Utilisateur connecté:</strong> {user.prenom} {user.nom} ({user.role})
            </p>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={testGetTripsWithReservations}
            disabled={loading || !user || user.role !== 'conducteur'}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test Trajets + Réservations (Conducteur)'}
          </button>

          <button
            onClick={testGetMyReservations}
            disabled={loading || !user || user.role !== 'voyageur'}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test Mes Réservations (Voyageur)'}
          </button>

          <button
            onClick={testAcceptReservation}
            disabled={loading || !user || user.role !== 'conducteur'}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test Accepter Réservation'}
          </button>

          <button
            onClick={testRejectReservation}
            disabled={loading || !user || user.role !== 'conducteur'}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test Refuser Réservation'}
          </button>

          <button
            onClick={testUpdateTrip}
            disabled={loading || !user || user.role !== 'conducteur'}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test Modifier Trajet'}
          </button>

          <button
            onClick={testDirectAPI}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Test en cours...' : 'Test API Directe'}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Succès' : '❌ Échec'} - {result.title}
            </h3>
            <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message}
            </p>

            {result.status && (
              <p className="text-sm mt-1 text-gray-600">
                <strong>Status HTTP:</strong> {result.status}
              </p>
            )}

            {result.data && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-900 mb-2">Données reçues :</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}

            {result.error && (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-900 mb-2">Erreur détaillée :</p>
                <pre className="text-xs bg-red-100 p-2 rounded overflow-auto">
                  {result.error}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions de test :</h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li><strong>Conducteur</strong> : Connectez-vous avec ahmed@conducteur.com</li>
            <li><strong>Voyageur</strong> : Connectez-vous avec mehdi@voyageur.com</li>
            <li><strong>Trajets + Réservations</strong> : Voir les trajets du conducteur avec leurs réservations</li>
            <li><strong>Mes Réservations</strong> : Voir les réservations du voyageur</li>
            <li><strong>Accepter/Refuser</strong> : Gérer les réservations (conducteur uniquement)</li>
          </ol>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">URLs à tester manuellement :</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              <a
                href="http://localhost:8000/api/my-trips-reservations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                http://localhost:8000/api/my-trips-reservations
              </a>
            </li>
            <li>
              <a
                href="http://localhost:8000/api/my-reservations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                http://localhost:8000/api/my-reservations
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/profile"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-4"
          >
            ← Aller au Profil
          </a>
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReservationTest;
