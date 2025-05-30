<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trajet;
use App\Models\Reservation;

class TripController extends Controller
{
    /**
     * Lister tous les trajets disponibles
     */
    public function index()
    {
        $trips = Trajet::with(['conducteur'])
            ->where('statut', 'actif')
            ->where('date_depart', '>=', now())
            ->orderBy('date_depart', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'trips' => $trips
        ]);
    }

    /**
     * Créer un nouveau trajet
     */
    public function store(Request $request)
    {
        $request->validate([
            'ville_depart' => 'required|string|max:255',
            'ville_arrivee' => 'required|string|max:255',
            'date_depart' => 'required|date|after:today',
            'heure_depart' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'places_totales' => 'required|integer|min:1|max:8',
            'description' => 'nullable|string|max:1000'
        ]);

        $trip = Trajet::create([
            'conducteur_id' => $request->user()->id,
            'ville_depart' => $request->ville_depart,
            'ville_arrivee' => $request->ville_arrivee,
            'date_depart' => $request->date_depart,
            'heure_depart' => $request->heure_depart,
            'prix' => $request->prix,
            'places_totales' => $request->places_totales,
            'places_disponibles' => $request->places_totales,
            'description' => $request->description,
            'statut' => 'actif'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trajet créé avec succès',
            'trip' => $trip->load('conducteur')
        ], 201);
    }

    /**
     * Afficher un trajet spécifique
     */
    public function show(Trajet $trip)
    {
        $trip->load(['conducteur', 'reservations.voyageur']);

        return response()->json([
            'success' => true,
            'trip' => $trip
        ]);
    }

    /**
     * Modifier un trajet
     */
    public function update(Trajet $trip, Request $request)
    {
        // Vérifier que le trajet appartient au conducteur
        if ($trip->conducteur_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que vos propres trajets'
            ], 403);
        }

        $request->validate([
            'ville_depart' => 'required|string|max:255',
            'ville_arrivee' => 'required|string|max:255',
            'date_depart' => 'required|date|after:today',
            'heure_depart' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'places_totales' => 'required|integer|min:1|max:8',
            'description' => 'nullable|string|max:1000'
        ]);

        $trip->update($request->only([
            'ville_depart', 'ville_arrivee', 'date_depart', 'heure_depart', 
            'prix', 'places_totales', 'description'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Trajet mis à jour avec succès',
            'trip' => $trip->fresh()->load('conducteur')
        ]);
    }

    /**
     * Supprimer un trajet
     */
    public function destroy(Trajet $trip, Request $request)
    {
        // Vérifier que le trajet appartient au conducteur
        if ($trip->conducteur_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez supprimer que vos propres trajets'
            ], 403);
        }

        $trip->delete();

        return response()->json([
            'success' => true,
            'message' => 'Trajet supprimé avec succès'
        ]);
    }

    /**
     * Mes trajets (conducteur)
     */
    public function myTrips(Request $request)
    {
        $trips = Trajet::with(['reservations.voyageur'])
            ->where('conducteur_id', $request->user()->id)
            ->orderBy('date_depart', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'trips' => $trips
        ]);
    }

    /**
     * Réserver un trajet
     */
    public function reserve(Trajet $trip, Request $request)
    {
        $request->validate([
            'nombre_places' => 'required|integer|min:1'
        ]);

        // Vérifier les places disponibles
        if ($trip->places_disponibles < $request->nombre_places) {
            return response()->json([
                'success' => false,
                'message' => 'Pas assez de places disponibles'
            ], 400);
        }

        // Vérifier que l'utilisateur n'a pas déjà réservé ce trajet
        $existingReservation = Reservation::where('voyageur_id', $request->user()->id)
            ->where('trajet_id', $trip->id)
            ->first();

        if ($existingReservation) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà réservé ce trajet'
            ], 400);
        }

        $reservation = Reservation::create([
            'voyageur_id' => $request->user()->id,
            'trajet_id' => $trip->id,
            'nombre_places' => $request->nombre_places,
            'statut' => 'en_attente'
        ]);

        // Décrémenter les places disponibles
        $trip->decrement('places_disponibles', $request->nombre_places);

        return response()->json([
            'success' => true,
            'message' => 'Réservation effectuée avec succès',
            'reservation' => $reservation->load(['trajet', 'voyageur'])
        ], 201);
    }

    /**
     * Mes réservations (voyageur)
     */
    public function myReservations(Request $request)
    {
        $reservations = Reservation::with(['trajet.conducteur'])
            ->where('voyageur_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'reservations' => $reservations
        ]);
    }

    /**
     * Annuler une réservation
     */
    public function cancelReservation(Reservation $reservation, Request $request)
    {
        // Vérifier que la réservation appartient au voyageur
        if ($reservation->voyageur_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez annuler que vos propres réservations'
            ], 403);
        }

        // Remettre les places disponibles
        $reservation->trajet->increment('places_disponibles', $reservation->nombre_places);

        // Marquer comme annulée
        $reservation->update(['statut' => 'annulee']);

        return response()->json([
            'success' => true,
            'message' => 'Réservation annulée avec succès'
        ]);
    }
}
