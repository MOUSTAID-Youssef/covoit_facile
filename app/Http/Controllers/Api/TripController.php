<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Trip;
use Illuminate\Http\JsonResponse;

class TripController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $trips = Trip::with(['driver', 'bookings'])->get();
        return response()->json($trips);
    }

    /**
     * Store a newly created resource in storage.
     * Seuls les conducteurs peuvent créer des trajets.
     */
    public function store(Request $request): JsonResponse
    {
        // Vérifier que l'utilisateur est conducteur
        if ($request->user()->role !== 'conducteur') {
            return response()->json([
                'message' => 'Seuls les conducteurs peuvent créer des trajets'
            ], 403);
        }

        $request->validate([
            'depart' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'date_depart' => 'required|date|after:now',
            'prix' => 'required|numeric|min:0',
            'nb_places' => 'required|integer|min:1|max:8',
        ]);

        $trip = Trip::create([
            'driver_id' => $request->user()->id,
            'depart' => $request->depart,
            'destination' => $request->destination,
            'date_depart' => $request->date_depart,
            'prix' => $request->prix,
            'nb_places' => $request->nb_places,
        ]);

        return response()->json($trip->load('driver'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Trip $trip): JsonResponse
    {
        return response()->json($trip->load(['driver', 'bookings.voyageur']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trip $trip): JsonResponse
    {
        // Seul le conducteur du trajet peut le modifier
        if ($trip->driver_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez modifier que vos propres trajets'
            ], 403);
        }

        $request->validate([
            'depart' => 'sometimes|string|max:255',
            'destination' => 'sometimes|string|max:255',
            'date_depart' => 'sometimes|date|after:now',
            'prix' => 'sometimes|numeric|min:0',
            'nb_places' => 'sometimes|integer|min:1|max:8',
        ]);

        $trip->update($request->only([
            'depart', 'destination', 'date_depart', 'prix', 'nb_places'
        ]));

        return response()->json($trip->load('driver'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trip $trip): JsonResponse
    {
        // Seul le conducteur du trajet peut le supprimer
        if ($trip->driver_id !== request()->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez supprimer que vos propres trajets'
            ], 403);
        }

        $trip->delete();
        return response()->json(['message' => 'Trajet supprimé avec succès']);
    }

    /**
     * Rechercher des trajets
     */
    public function search(Request $request): JsonResponse
    {
        $query = Trip::with(['driver', 'bookings']);

        if ($request->has('depart')) {
            $query->where('depart', 'like', '%' . $request->depart . '%');
        }

        if ($request->has('destination')) {
            $query->where('destination', 'like', '%' . $request->destination . '%');
        }

        if ($request->has('date')) {
            $query->whereDate('date_depart', $request->date);
        }

        $trips = $query->get();
        return response()->json($trips);
    }

    /**
     * Obtenir les trajets du conducteur connecté
     */
    public function myTrips(Request $request): JsonResponse
    {
        $trips = Trip::where('driver_id', $request->user()->id)
                    ->with(['bookings.voyageur'])
                    ->get();

        return response()->json($trips);
    }
}
