<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route de test de l'API
Route::get('/', function () {
    return response()->json([
        'message' => 'API CovoitFacile fonctionne !',
        'version' => '1.0.0',
        'timestamp' => now(),
        'endpoints' => [
            'POST /api/login' => 'Connexion utilisateur',
            'POST /api/register' => 'Inscription utilisateur',
            'GET /api/user' => 'Profil utilisateur (auth requis)',
            'GET /api/trips' => 'Liste des trajets (auth requis)',
        ]
    ]);
});

// Routes d'authentification (incluses depuis auth.php)
require __DIR__.'/auth.php';

// Route pour obtenir l'utilisateur authentifié
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Routes publiques pour les trajets (accessibles aux voyageurs)
Route::get('/trips', function () {
    try {
        Log::info('API /trips appelée');

        $trips = \App\Models\Trajet::with(['conducteur.vehicules'])
            ->where('statut', 'actif')
            ->orderBy('date_depart', 'asc')
            ->get();

        Log::info('Trajets trouvés: ' . $trips->count());

        $formattedTrips = $trips->map(function ($trip) {
            return [
                'id' => $trip->id,
                'ville_depart' => $trip->ville_depart,
                'ville_arrivee' => $trip->ville_arrivee,
                'date_depart' => $trip->date_depart,
                'heure_depart' => $trip->heure_depart,
                'prix' => $trip->prix,
                'places_disponibles' => $trip->places_disponibles,
                'places_totales' => $trip->places_totales,
                'description' => $trip->description,
                'conducteur' => $trip->conducteur ? [
                    'id' => $trip->conducteur->id,
                    'prenom' => $trip->conducteur->prenom,
                    'nom' => $trip->conducteur->nom,
                    'photo_url' => $trip->conducteur->photo_url ?? asset('images/default-avatar.svg'),
                    'badge_verifie' => $trip->conducteur->badge_verifie,
                ] : null,
                'vehicule' => $trip->conducteur && $trip->conducteur->vehicules->isNotEmpty() ? [
                    'marque' => $trip->conducteur->vehicules->first()->marque,
                    'modele' => $trip->conducteur->vehicules->first()->modele,
                    'couleur' => $trip->conducteur->vehicules->first()->couleur,
                    'nombre_places' => $trip->conducteur->vehicules->first()->nombre_places,
                    'climatisation' => $trip->conducteur->vehicules->first()->climatisation,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'trips' => $formattedTrips,
            'count' => $formattedTrips->count()
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } catch (\Exception $e) {
        Log::error('Erreur API /trips: ' . $e->getMessage());
        Log::error('Stack trace: ' . $e->getTraceAsString());

        return response()->json([
            'success' => false,
            'message' => 'Erreur: ' . $e->getMessage(),
            'trips' => [],
            'error_details' => $e->getTraceAsString()
        ], 500);
    }
});

// Routes pour le profil utilisateur
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', function (Request $request) {
        $user = $request->user();
        $user->photo_url = $user->photo_url; // Déclenche l'accesseur

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    });

    Route::put('/profile', function (Request $request) {
        $user = $request->user();

        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'genre' => 'nullable|in:homme,femme',
            'date_naissance' => 'nullable|date',
        ]);

        $user->update($request->only(['prenom', 'nom', 'email', 'genre', 'date_naissance']));

        $updatedUser = $user->fresh();
        $updatedUser->photo_url = $updatedUser->photo_url; // Déclenche l'accesseur

        return response()->json([
            'success' => true,
            'data' => $updatedUser,
            'message' => 'Profil mis à jour avec succès'
        ]);
    });

    Route::post('/profile/photo', function (Request $request) {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,jpg,png|max:2048'
        ]);

        $user = $request->user();

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('profiles', $filename, 'public');

            // Supprimer l'ancienne photo si elle existe
            if ($user->photo_profil) {
                Storage::disk('public')->delete($user->photo_profil);
            }

            $user->update(['photo_profil' => $path]);

            $updatedUser = $user->fresh();
            $updatedUser->photo_url = $updatedUser->photo_url; // Déclenche l'accesseur

            return response()->json([
                'success' => true,
                'data' => $updatedUser,
                'photo_url' => $updatedUser->photo_url
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Aucun fichier reçu'
        ]);
    });

    Route::delete('/profile/photo', function (Request $request) {
        $user = $request->user();

        if ($user->photo_profil) {
            Storage::disk('public')->delete($user->photo_profil);
            $user->update(['photo_profil' => null]);
        }

        return response()->json([
            'success' => true,
            'data' => $user->fresh()
        ]);
    });

    // Upload de pièce d'identité
    Route::post('/profile/identity-document', function (Request $request) {
        $user = $request->user();

        $request->validate([
            'document' => 'required|file|mimes:pdf,jpeg,jpg,png|max:5120', // 5MB max
        ]);

        try {
            // Supprimer l'ancien document si il existe
            if ($user->cin_path && Storage::disk('public')->exists($user->cin_path)) {
                Storage::disk('public')->delete($user->cin_path);
            }

            // Stocker le nouveau document
            $file = $request->file('document');
            $filename = 'identity_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('identity-documents', $filename, 'public');

            // Mettre à jour l'utilisateur
            $user->update([
                'cin_path' => $path
            ]);

            return response()->json([
                'success' => true,
                'data' => $user->fresh(),
                'message' => 'Document d\'identité téléchargé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: ' . $e->getMessage()
            ], 500);
        }
    });

    // Routes pour les trajets (conducteurs)
    Route::post('/trips', function (Request $request) {
        $user = $request->user();

        // Vérifier que l'utilisateur est conducteur
        if ($user->role !== 'conducteur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les conducteurs peuvent créer des trajets'
            ], 403);
        }

        $request->validate([
            'ville_depart' => 'required|string|max:255',
            'ville_arrivee' => 'required|string|max:255',
            'date_depart' => 'required|date|after_or_equal:today',
            'heure_depart' => 'required',
            'prix' => 'required|numeric|min:0',
            'places_disponibles' => 'required|integer|min:1|max:8',
            'description' => 'nullable|string|max:500',
        ]);

        $trajet = \App\Models\Trajet::create([
            'conducteur_id' => $user->id,
            'ville_depart' => $request->ville_depart,
            'ville_arrivee' => $request->ville_arrivee,
            'date_depart' => $request->date_depart,
            'heure_depart' => $request->heure_depart,
            'prix' => $request->prix,
            'places_disponibles' => $request->places_disponibles,
            'places_totales' => $request->places_disponibles,
            'description' => $request->description,
            'statut' => 'actif',
        ]);

        return response()->json([
            'success' => true,
            'data' => $trajet->load(['conducteur.vehicules']),
            'message' => 'Trajet créé avec succès'
        ], 201);
    });

    // Obtenir les trajets du conducteur connecté
    Route::get('/my-trips', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'conducteur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les conducteurs peuvent voir leurs trajets'
            ], 403);
        }

        $trips = \App\Models\Trajet::with(['conducteur.vehicules', 'reservations.voyageur'])
            ->where('conducteur_id', $user->id)
            ->orderBy('date_depart', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'trips' => $trips
        ]);
    });

    // Modifier un trajet
    Route::put('/trips/{trip}', function (\App\Models\Trajet $trip, Request $request) {
        $user = $request->user();

        // Vérifier que c'est le conducteur du trajet
        if ($trip->conducteur_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que vos propres trajets'
            ], 403);
        }

        $request->validate([
            'ville_depart' => 'sometimes|string|max:255',
            'ville_arrivee' => 'sometimes|string|max:255',
            'date_depart' => 'sometimes|date|after_or_equal:today',
            'heure_depart' => 'sometimes',
            'prix' => 'sometimes|numeric|min:0',
            'places_disponibles' => 'sometimes|integer|min:1|max:8',
            'description' => 'nullable|string|max:500',
            'statut' => 'sometimes|in:actif,complet,annule,termine',
        ]);

        $trip->update($request->only([
            'ville_depart', 'ville_arrivee', 'date_depart',
            'heure_depart', 'prix', 'places_disponibles', 'description', 'statut'
        ]));

        return response()->json([
            'success' => true,
            'data' => $trip->fresh()->load(['conducteur', 'vehicule']),
            'message' => 'Trajet mis à jour avec succès'
        ]);
    });

    // Supprimer un trajet
    Route::delete('/trips/{trip}', function (\App\Models\Trajet $trip, Request $request) {
        $user = $request->user();

        // Vérifier que c'est le conducteur du trajet
        if ($trip->conducteur_id !== $user->id) {
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
    });

    // Routes pour les réservations
    Route::post('/reservations', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'voyageur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les voyageurs peuvent faire des réservations'
            ], 403);
        }

        $request->validate([
            'trajet_id' => 'required|exists:trajets,id',
            'nombre_places' => 'required|integer|min:1|max:4',
            'message' => 'nullable|string|max:500',
        ]);

        $trajet = \App\Models\Trajet::findOrFail($request->trajet_id);

        // Vérifier que le voyageur ne réserve pas son propre trajet
        if ($trajet->conducteur_id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas réserver votre propre trajet'
            ], 400);
        }

        // Vérifier qu'il n'y a pas déjà une réservation
        $reservationExistante = \App\Models\Reservation::where('trajet_id', $request->trajet_id)
            ->where('voyageur_id', $user->id)
            ->first();

        if ($reservationExistante) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà une réservation pour ce trajet'
            ], 400);
        }

        // Vérifier qu'il y a assez de places disponibles
        if ($trajet->places_disponibles < $request->nombre_places) {
            return response()->json([
                'success' => false,
                'message' => 'Pas assez de places disponibles'
            ], 400);
        }

        // Créer la réservation
        $reservation = \App\Models\Reservation::create([
            'trajet_id' => $request->trajet_id,
            'voyageur_id' => $user->id,
            'nombre_places' => $request->nombre_places,
            'message' => $request->message,
            'statut' => 'en_attente',
        ]);

        // Mettre à jour les places disponibles
        $trajet->decrement('places_disponibles', $request->nombre_places);

        return response()->json([
            'success' => true,
            'data' => $reservation->load(['trajet', 'voyageur']),
            'message' => 'Réservation créée avec succès'
        ], 201);
    });

    // Obtenir les réservations du voyageur connecté
    Route::get('/my-reservations', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'voyageur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les voyageurs peuvent voir leurs réservations'
            ], 403);
        }

        $reservations = \App\Models\Reservation::with(['trajet.conducteur', 'trajet.conducteur.vehicules'])
            ->where('voyageur_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'reservations' => $reservations
        ]);
    });

    // Annuler une réservation
    Route::delete('/reservations/{reservation}', function (\App\Models\Reservation $reservation, Request $request) {
        $user = $request->user();

        // Vérifier que c'est le voyageur de la réservation
        if ($reservation->voyageur_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez annuler que vos propres réservations'
            ], 403);
        }

        // Remettre les places disponibles
        $trajet = $reservation->trajet;
        $trajet->increment('places_disponibles', $reservation->nombre_places);

        // Supprimer la réservation
        $reservation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Réservation annulée avec succès'
        ]);
    });

    // Routes pour les conducteurs - Gestion des réservations de leurs trajets
    Route::get('/my-trips-reservations', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'conducteur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les conducteurs peuvent voir les réservations de leurs trajets'
            ], 403);
        }

        $trips = \App\Models\Trajet::with(['reservations.voyageur', 'conducteur.vehicules'])
            ->where('conducteur_id', $user->id)
            ->orderBy('date_depart', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'trips' => $trips
        ]);
    });

    // Accepter une réservation
    Route::put('/reservations/{reservation}/accept', function (\App\Models\Reservation $reservation, Request $request) {
        $user = $request->user();

        // Vérifier que c'est le conducteur du trajet
        if ($reservation->trajet->conducteur_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez gérer que les réservations de vos propres trajets'
            ], 403);
        }

        $reservation->update(['statut' => 'confirmee']);

        return response()->json([
            'success' => true,
            'message' => 'Réservation acceptée avec succès',
            'reservation' => $reservation->load(['voyageur', 'trajet'])
        ]);
    });

    // Refuser une réservation
    Route::put('/reservations/{reservation}/reject', function (\App\Models\Reservation $reservation, Request $request) {
        $user = $request->user();

        // Vérifier que c'est le conducteur du trajet
        if ($reservation->trajet->conducteur_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez gérer que les réservations de vos propres trajets'
            ], 403);
        }

        // Remettre les places disponibles
        $trajet = $reservation->trajet;
        $trajet->increment('places_disponibles', $reservation->nombre_places);

        // Marquer comme annulée
        $reservation->update(['statut' => 'annulee']);

        return response()->json([
            'success' => true,
            'message' => 'Réservation refusée avec succès',
            'reservation' => $reservation->load(['voyageur', 'trajet'])
        ]);
    });
});

// Routes admin
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Gestion des utilisateurs
    Route::get('/users', function () {
        $users = \App\Models\User::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    });

    Route::put('/users/{user}', function (\App\Models\User $user, Request $request) {
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:voyageur,conducteur,admin',
            'badge_verifie' => 'boolean'
        ]);

        $user->update($request->only(['prenom', 'nom', 'email', 'role', 'badge_verifie']));

        return response()->json([
            'success' => true,
            'user' => $user->fresh()
        ]);
    });

    Route::delete('/users/{user}', function (\App\Models\User $user) {
        $user->delete();
        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    });

    // Gestion des trajets
    Route::get('/trips', function () {
        try {
            $trips = \App\Models\Trajet::with(['conducteur', 'reservations'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($trip) {
                    $trip->reservations_count = $trip->reservations->count();
                    return $trip;
                });

            return response()->json([
                'success' => true,
                'trips' => $trips
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage(),
                'trips' => []
            ]);
        }
    });

    Route::put('/trips/{trip}', function (\App\Models\Trajet $trip, Request $request) {
        $request->validate([
            'ville_depart' => 'required|string|max:255',
            'ville_arrivee' => 'required|string|max:255',
            'date_depart' => 'required|date',
            'heure_depart' => 'required',
            'prix' => 'required|numeric|min:0',
            'places_disponibles' => 'required|integer|min:0',
            'statut' => 'required|in:actif,complet,annule,termine'
        ]);

        $trip->update($request->only([
            'ville_depart', 'ville_arrivee', 'date_depart',
            'heure_depart', 'prix', 'places_disponibles', 'statut'
        ]));

        return response()->json([
            'success' => true,
            'trip' => $trip->fresh()
        ]);
    });

    Route::delete('/trips/{trip}', function (\App\Models\Trajet $trip) {
        $trip->delete();
        return response()->json([
            'success' => true,
            'message' => 'Trajet supprimé avec succès'
        ]);
    });

    // Gestion des véhicules
    Route::get('/vehicles', function () {
        try {
            $vehicles = \App\Models\Vehicule::with('user')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'vehicles' => $vehicles
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage(),
                'vehicles' => []
            ]);
        }
    });

    Route::put('/vehicles/{vehicle}', function (\App\Models\Vehicule $vehicle, Request $request) {
        $request->validate([
            'statut_verification' => 'required|in:en_attente,verifie,rejete',
            'commentaire_verification' => 'nullable|string'
        ]);

        $vehicle->update($request->only(['statut_verification', 'commentaire_verification']));

        return response()->json([
            'success' => true,
            'vehicle' => $vehicle->fresh()
        ]);
    });

    // Statistiques du dashboard
    Route::get('/stats', function () {
        $totalUsers = \App\Models\User::count();
        $totalConducteurs = \App\Models\User::where('role', 'conducteur')->count();
        $totalTrajets = \App\Models\Trajet::count();
        $totalReservations = \App\Models\Reservation::count();

        // Statistiques par mois (6 derniers mois)
        $monthlyStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthlyStats[] = [
                'month' => $date->format('M Y'),
                'users' => \App\Models\User::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)->count(),
                'trips' => \App\Models\Trajet::whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)->count(),
            ];
        }

        return response()->json([
            'success' => true,
            'stats' => [
                'total_users' => $totalUsers,
                'total_conducteurs' => $totalConducteurs,
                'total_trajets' => $totalTrajets,
                'total_reservations' => $totalReservations,
                'monthly_stats' => $monthlyStats
            ]
        ]);
    });
});

// Routes supplémentaires pour les trajets et réservations (à implémenter plus tard)
// Route::apiResource('trips', TripController::class);
// Route::apiResource('bookings', BookingController::class);
