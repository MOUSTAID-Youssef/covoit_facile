<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ==================== ROUTES PUBLIQUES ====================
// Statistiques publiques pour la page d'accueil
Route::get('/public/stats', function () {
    try {
        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_trajets' => \App\Models\Trajet::count(),
            'total_vehicules' => \App\Models\Vehicule::count(),
            'total_reservations' => \App\Models\Reservation::count(),
            'co2_economise' => \App\Models\Trajet::sum('places_disponibles') * 2.3 * 100, // Estimation CO2 économisé
            'trajets_actifs' => \App\Models\Trajet::where('statut', 'actif')->count(),
            'utilisateurs_actifs' => \App\Models\User::where('statut', 'actif')->count()
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors du chargement des statistiques'
        ], 500);
    }
});

// Témoignages publics pour la page d'accueil
Route::get('/public/testimonials', function () {
    try {
        // Pour l'instant, on retourne des témoignages statiques
        // Plus tard, on pourra créer une table testimonials
        $testimonials = [
            [
                'name' => 'Ahmed Benali',
                'role' => 'Conducteur',
                'comment' => 'CovoitFacile m\'a permis de rencontrer des personnes formidables tout en réduisant mes frais de transport.',
                'rating' => 5,
                'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            ],
            [
                'name' => 'Fatima Zahra',
                'role' => 'Voyageuse',
                'comment' => 'Grâce à CovoitFacile, je voyage de Casablanca à Rabat chaque semaine. C\'est économique et convivial !',
                'rating' => 5,
                'avatar' => 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            ],
            [
                'name' => 'Omar Tazi',
                'role' => 'Étudiant',
                'comment' => 'En tant qu\'étudiant, CovoitFacile me permet de voyager à petit prix. Les conducteurs sont sympas !',
                'rating' => 5,
                'avatar' => 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            ]
        ];

        return response()->json([
            'success' => true,
            'testimonials' => $testimonials
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors du chargement des témoignages'
        ], 500);
    }
});
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
                    'telephone' => $trip->conducteur->telephone,
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
            'telephone' => ['nullable', 'string', function ($attribute, $value, $fail) {
                if ($value && !preg_match('/^(\+212|0)[5-7][0-9]{8}$/', $value)) {
                    $fail('Le format du numéro de téléphone est invalide. Utilisez le format marocain : +212XXXXXXXXX ou 0XXXXXXXXX');
                }
            }],
            'date_naissance' => 'nullable|date',
        ]);

        $user->update($request->only(['prenom', 'nom', 'email', 'genre', 'telephone', 'date_naissance']));

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

    // Upload de CIN (identité)
    Route::post('/profile/identity', function (Request $request) {
        $user = $request->user();

        $request->validate([
            'cin' => 'required|file|mimes:pdf,jpeg,jpg,png|max:5120', // 5MB max
        ]);

        try {
            // Supprimer l'ancien document si il existe
            if ($user->cin_path && Storage::disk('public')->exists($user->cin_path)) {
                Storage::disk('public')->delete($user->cin_path);
            }

            // Stocker le nouveau document
            $file = $request->file('cin');
            $filename = 'cin_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('identity-documents', $filename, 'public');

            // Mettre à jour l'utilisateur
            $user->update([
                'cin_path' => $path,
                'badge_verifie' => false // Remettre en attente de vérification
            ]);

            return response()->json([
                'success' => true,
                'data' => $user->fresh(),
                'message' => 'Document CIN téléchargé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: ' . $e->getMessage()
            ], 500);
        }
    });

    // Mettre à jour le téléphone
    Route::put('/profile/phone', function (Request $request) {
        $user = $request->user();

        $request->validate([
            'telephone' => ['required', 'string', function ($attribute, $value, $fail) {
                if (!preg_match('/^(\+212|0)[5-7][0-9]{8}$/', $value)) {
                    $fail('Le format du numéro de téléphone est invalide. Utilisez le format marocain : +212XXXXXXXXX ou 0XXXXXXXXX');
                }
            }],
        ]);

        $user->update([
            'telephone' => $request->telephone
        ]);

        return response()->json([
            'success' => true,
            'data' => $user->fresh(),
            'message' => 'Numéro de téléphone mis à jour avec succès'
        ]);
    });

    // ==================== GESTION DES VÉHICULES ====================

    // Obtenir le véhicule du conducteur connecté
    Route::get('/profile/vehicle', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'conducteur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les conducteurs peuvent avoir des véhicules'
            ], 403);
        }

        $vehicle = \App\Models\Vehicule::where('user_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'data' => $vehicle,
            'message' => $vehicle ? 'Véhicule trouvé' : 'Aucun véhicule enregistré'
        ]);
    });

    // Ajouter un véhicule
    Route::post('/profile/vehicle', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'conducteur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les conducteurs peuvent ajouter des véhicules'
            ], 403);
        }

        // Vérifier qu'il n'a pas déjà un véhicule
        $existingVehicle = \App\Models\Vehicule::where('user_id', $user->id)->first();
        if ($existingVehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà un véhicule enregistré. Vous pouvez le modifier ou le supprimer.'
            ], 400);
        }

        $request->validate([
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'couleur' => 'required|string|max:255',
            'annee' => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'nombre_places' => 'required|integer|min:2|max:8',
            'description' => 'nullable|string|max:500',
        ]);

        $vehicle = \App\Models\Vehicule::create([
            'user_id' => $user->id,
            'marque' => $request->marque,
            'modele' => $request->modele,
            'couleur' => $request->couleur,
            'annee' => $request->annee,
            'nombre_places' => $request->nombre_places,
            'description' => $request->description,
            'statut' => 'en_attente', // En attente de vérification
        ]);

        return response()->json([
            'success' => true,
            'data' => $vehicle,
            'message' => 'Véhicule ajouté avec succès'
        ], 201);
    });

    // Modifier un véhicule
    Route::put('/profile/vehicle', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'conducteur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les conducteurs peuvent modifier des véhicules'
            ], 403);
        }

        $vehicle = \App\Models\Vehicule::where('user_id', $user->id)->first();
        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun véhicule trouvé'
            ], 404);
        }

        $request->validate([
            'marque' => 'sometimes|string|max:255',
            'modele' => 'sometimes|string|max:255',
            'couleur' => 'sometimes|string|max:255',
            'annee' => 'sometimes|integer|min:1990|max:' . (date('Y') + 1),
            'nombre_places' => 'sometimes|integer|min:2|max:8',
            'description' => 'nullable|string|max:500',
        ]);

        $vehicle->update($request->only([
            'marque', 'modele', 'couleur', 'annee', 'nombre_places', 'description'
        ]));

        return response()->json([
            'success' => true,
            'data' => $vehicle->fresh(),
            'message' => 'Véhicule mis à jour avec succès'
        ]);
    });

    // Supprimer un véhicule
    Route::delete('/profile/vehicle', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'conducteur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les conducteurs peuvent supprimer des véhicules'
            ], 403);
        }

        $vehicle = \App\Models\Vehicule::where('user_id', $user->id)->first();
        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun véhicule trouvé'
            ], 404);
        }

        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Véhicule supprimé avec succès'
        ]);
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

        // Vérifier que le conducteur a un véhicule
        $vehicle = \App\Models\Vehicule::where('user_id', $user->id)->first();
        if (!$vehicle) {
            return response()->json([
                'success' => false,
                'message' => 'Vous devez ajouter un véhicule avant de pouvoir créer des trajets'
            ], 400);
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

        // Ne pas décrémenter les places immédiatement
        // Les places seront décrementées seulement quand le conducteur accepte la réservation

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

        // Remettre les places disponibles seulement si la réservation était confirmée
        $trajet = $reservation->trajet;
        if ($reservation->statut === 'confirmee') {
            $trajet->increment('places_disponibles', $reservation->nombre_places);
        }

        // Supprimer la réservation
        $reservation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Réservation annulée avec succès'
        ]);
    });

    // Routes pour les conducteurs - Gestion des réservations de leurs trajets
    // ==================== ROUTES ADMIN ====================
    Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
        // Statistiques admin
        Route::get('/stats', function (Request $request) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $stats = [
                'total_users' => \App\Models\User::count(),
                'total_conducteurs' => \App\Models\User::where('role', 'conducteur')->count(),
                'total_voyageurs' => \App\Models\User::where('role', 'voyageur')->count(),
                'total_trajets' => \App\Models\Trajet::count(),
                'total_vehicules' => \App\Models\Vehicule::count(),
                'active_trips' => \App\Models\Trajet::where('statut', 'actif')->count(),
                'total_reservations' => \App\Models\Reservation::count(),
                'pending_verifications' => \App\Models\User::where('badge_verifie', false)->count(),
                'pending_vehicles' => \App\Models\Vehicule::where('statut_verification', 'en_attente')->count(),
                'co2_economise' => \App\Models\Trajet::where('statut', 'termine')->sum('prix') * 0.1, // Estimation
                'monthly_stats' => [
                    ['month' => 'Jan', 'users' => 45, 'trips' => 23],
                    ['month' => 'Fév', 'users' => 52, 'trips' => 31],
                    ['month' => 'Mar', 'users' => 38, 'trips' => 28],
                    ['month' => 'Avr', 'users' => 61, 'trips' => 42],
                    ['month' => 'Mai', 'users' => 73, 'trips' => 56],
                    ['month' => 'Juin', 'users' => 89, 'trips' => 67]
                ]
            ];

            return response()->json(['success' => true, 'stats' => $stats]);
        });

        // Gestion des utilisateurs
        Route::get('/users', function (Request $request) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            try {
                $users = \App\Models\User::with(['vehicules', 'trajets', 'reservations'])
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'prenom' => $user->prenom,
                            'nom' => $user->nom,
                            'email' => $user->email,
                            'telephone' => $user->telephone,
                            'role' => $user->role,
                            'statut' => $user->statut,
                            'badge_verifie' => $user->badge_verifie,
                            'photo_url' => $user->photo_url,
                            'cin_path' => $user->cin_path,
                            'created_at' => $user->created_at,
                            'updated_at' => $user->updated_at,
                            'vehicules_count' => $user->vehicules->count(),
                            'trajets_count' => $user->trajets->count(),
                            'reservations_count' => $user->reservations->count(),
                            'last_login' => $user->updated_at // Approximation
                        ];
                    });

                return response()->json(['success' => true, 'users' => $users]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors du chargement des utilisateurs: ' . $e->getMessage()
                ], 500);
            }
        });

        Route::put('/users/{id}', function (Request $request, $id) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            try {
                $targetUser = \App\Models\User::findOrFail($id);

                // Validation des données
                $validatedData = $request->validate([
                    'statut' => 'sometimes|in:actif,bloque,suspendu',
                    'badge_verifie' => 'sometimes|boolean',
                    'role' => 'sometimes|in:voyageur,conducteur,admin'
                ]);

                $targetUser->update($validatedData);

                return response()->json([
                    'success' => true,
                    'user' => $targetUser->fresh(),
                    'message' => 'Utilisateur mis à jour avec succès'
                ]);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non trouvé'
                ], 404);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $e->errors()
                ], 422);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
                ], 500);
            }
        });

        Route::delete('/users/{id}', function (Request $request, $id) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $targetUser = \App\Models\User::findOrFail($id);
            $targetUser->delete();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé avec succès'
            ]);
        });

        // Gestion des trajets
        Route::get('/trips', function (Request $request) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $trips = \App\Models\Trajet::with(['conducteur', 'reservations'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($trip) {
                    return [
                        'id' => $trip->id,
                        'ville_depart' => $trip->ville_depart,
                        'ville_arrivee' => $trip->ville_arrivee,
                        'date_depart' => $trip->date_depart,
                        'heure_depart' => $trip->heure_depart,
                        'prix' => $trip->prix,
                        'places_disponibles' => $trip->places_disponibles,
                        'statut' => $trip->statut,
                        'created_at' => $trip->created_at,
                        'conducteur' => [
                            'id' => $trip->conducteur->id,
                            'prenom' => $trip->conducteur->prenom,
                            'nom' => $trip->conducteur->nom,
                            'email' => $trip->conducteur->email,
                            'photo_url' => $trip->conducteur->photo_url
                        ],
                        'reservations_count' => $trip->reservations->count()
                    ];
                });

            return response()->json(['success' => true, 'trips' => $trips]);
        });

        Route::put('/trips/{id}', function (Request $request, $id) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $trip = \App\Models\Trajet::findOrFail($id);
            $trip->update($request->only(['statut']));

            return response()->json([
                'success' => true,
                'trip' => $trip,
                'message' => 'Trajet mis à jour avec succès'
            ]);
        });

        // Annuler un trajet (changer le statut)
        Route::put('/trips/{id}/cancel', function (Request $request, $id) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $trip = \App\Models\Trajet::findOrFail($id);
            $trip->update(['statut' => 'annule']);

            return response()->json([
                'success' => true,
                'message' => 'Trajet annulé avec succès'
            ]);
        });

        // Réactiver un trajet annulé
        Route::put('/trips/{id}/reactivate', function (Request $request, $id) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $trip = \App\Models\Trajet::findOrFail($id);
            $trip->update(['statut' => 'actif']);

            return response()->json([
                'success' => true,
                'message' => 'Trajet réactivé avec succès'
            ]);
        });

        Route::delete('/trips/{id}', function (Request $request, $id) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $trip = \App\Models\Trajet::findOrFail($id);
            $trip->delete();

            return response()->json([
                'success' => true,
                'message' => 'Trajet supprimé avec succès'
            ]);
        });

        // Gestion des véhicules
        Route::get('/vehicles', function (Request $request) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $vehicles = \App\Models\Vehicule::with(['user'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($vehicle) {
                    return [
                        'id' => $vehicle->id,
                        'marque' => $vehicle->marque,
                        'modele' => $vehicle->modele,
                        'annee' => $vehicle->annee,
                        'couleur' => $vehicle->couleur,
                        'nombre_places' => $vehicle->nombre_places,
                        'type_vehicule' => $vehicle->type_vehicule,
                        'statut_verification' => $vehicle->statut_verification,
                        'commentaire_verification' => $vehicle->commentaire_verification,
                        'created_at' => $vehicle->created_at,
                        'user' => [
                            'id' => $vehicle->user->id,
                            'prenom' => $vehicle->user->prenom,
                            'nom' => $vehicle->user->nom,
                            'email' => $vehicle->user->email,
                            'photo_url' => $vehicle->user->photo_url
                        ]
                    ];
                });

            return response()->json(['success' => true, 'vehicles' => $vehicles]);
        });

        Route::put('/vehicles/{id}', function (Request $request, $id) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $vehicle = \App\Models\Vehicule::findOrFail($id);
            $vehicle->update($request->only(['statut_verification', 'commentaire_verification']));

            return response()->json([
                'success' => true,
                'vehicle' => $vehicle,
                'message' => 'Véhicule mis à jour avec succès'
            ]);
        });

        // Gestion des réservations
        Route::get('/reservations', function (Request $request) {
            $user = $request->user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }

            $reservations = \App\Models\Reservation::with(['voyageur', 'trajet.conducteur'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($reservation) {
                    return [
                        'id' => $reservation->id,
                        'nombre_places' => $reservation->nombre_places,
                        'statut' => $reservation->statut,
                        'created_at' => $reservation->created_at,
                        'voyageur' => [
                            'id' => $reservation->voyageur->id,
                            'prenom' => $reservation->voyageur->prenom,
                            'nom' => $reservation->voyageur->nom,
                            'email' => $reservation->voyageur->email,
                            'telephone' => $reservation->voyageur->telephone,
                            'photo_profil' => $reservation->voyageur->photo_profil
                        ],
                        'trajet' => [
                            'id' => $reservation->trajet->id,
                            'ville_depart' => $reservation->trajet->ville_depart,
                            'ville_arrivee' => $reservation->trajet->ville_arrivee,
                            'date_depart' => $reservation->trajet->date_depart,
                            'heure_depart' => $reservation->trajet->heure_depart,
                            'prix' => $reservation->trajet->prix,
                            'conducteur' => [
                                'id' => $reservation->trajet->conducteur->id,
                                'prenom' => $reservation->trajet->conducteur->prenom,
                                'nom' => $reservation->trajet->conducteur->nom,
                                'email' => $reservation->trajet->conducteur->email,
                                'telephone' => $reservation->trajet->conducteur->telephone,
                                'photo_profil' => $reservation->trajet->conducteur->photo_profil
                            ]
                        ]
                    ];
                });

            return response()->json(['success' => true, 'reservations' => $reservations]);
        });
    });

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

        // Vérifier qu'il y a encore assez de places disponibles
        $trajet = $reservation->trajet;
        if ($trajet->places_disponibles < $reservation->nombre_places) {
            return response()->json([
                'success' => false,
                'message' => 'Plus assez de places disponibles pour accepter cette réservation'
            ], 400);
        }

        // Accepter la réservation et décrémenter les places
        $reservation->update(['statut' => 'confirmee']);
        $trajet->decrement('places_disponibles', $reservation->nombre_places);

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

    // Gestion des véhicules par les conducteurs
    Route::get('/my-vehicles', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'conducteur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les conducteurs peuvent gérer des véhicules'
            ], 403);
        }

        $vehicles = \App\Models\Vehicule::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'vehicles' => $vehicles
        ]);
    });

    Route::post('/my-vehicles', function (Request $request) {
        $user = $request->user();

        if ($user->role !== 'conducteur') {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les conducteurs peuvent ajouter des véhicules'
            ], 403);
        }

        $validatedData = $request->validate([
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'annee' => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'couleur' => 'required|string|max:255',
            'nombre_places' => 'required|integer|min:1|max:8',
            'type_vehicule' => 'required|in:berline,suv,break,coupe,cabriolet,monospace,utilitaire'
        ]);

        $vehicle = \App\Models\Vehicule::create([
            'user_id' => $user->id,
            'marque' => $validatedData['marque'],
            'modele' => $validatedData['modele'],
            'annee' => $validatedData['annee'],
            'couleur' => $validatedData['couleur'],
            'nombre_places' => $validatedData['nombre_places'],
            'type_vehicule' => $validatedData['type_vehicule'],
            'statut_verification' => 'en_attente'
        ]);

        return response()->json([
            'success' => true,
            'vehicle' => $vehicle,
            'message' => 'Véhicule ajouté avec succès'
        ]);
    });

    Route::put('/my-vehicles/{vehicle}', function (\App\Models\Vehicule $vehicle, Request $request) {
        $user = $request->user();

        if ($vehicle->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que vos propres véhicules'
            ], 403);
        }

        $validatedData = $request->validate([
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'annee' => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'couleur' => 'required|string|max:255',
            'nombre_places' => 'required|integer|min:1|max:8',
            'type_vehicule' => 'required|in:berline,suv,break,coupe,cabriolet,monospace,utilitaire'
        ]);

        $vehicle->update($validatedData);

        return response()->json([
            'success' => true,
            'vehicle' => $vehicle->fresh(),
            'message' => 'Véhicule mis à jour avec succès'
        ]);
    });

    Route::delete('/my-vehicles/{vehicle}', function (\App\Models\Vehicule $vehicle, Request $request) {
        $user = $request->user();

        if ($vehicle->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez supprimer que vos propres véhicules'
            ], 403);
        }

        $vehicle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Véhicule supprimé avec succès'
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
        try {
            $totalUsers = \App\Models\User::count();
            $totalVoyageurs = \App\Models\User::where('role', 'voyageur')->count();
            $totalConducteurs = \App\Models\User::where('role', 'conducteur')->count();
            $totalTrajets = \App\Models\Trajet::count();
            $totalVehicules = \App\Models\Vehicule::count();
            $totalReservations = \App\Models\Reservation::count();
            $pendingAccounts = \App\Models\User::where('badge_verifie', false)
                ->whereNotNull('cin_path')->count();
            $activeUsers = \App\Models\User::where('statut', 'actif')->count();
            $monthlyRevenue = \App\Models\Reservation::where('statut', 'confirmee')
                ->whereMonth('created_at', now()->month)
                ->sum('prix_total') ?? 0;

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
                    'total_voyageurs' => $totalVoyageurs,
                    'total_conducteurs' => $totalConducteurs,
                    'total_trajets' => $totalTrajets,
                    'total_vehicules' => $totalVehicules,
                    'total_reservations' => $totalReservations,
                    'pending_accounts' => $pendingAccounts,
                    'active_users' => $activeUsers,
                    'monthly_revenue' => $monthlyRevenue,
                    'monthly_stats' => $monthlyStats
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des statistiques: ' . $e->getMessage()
            ], 500);
        }
    });
});

// Routes supplémentaires pour les trajets et réservations (à implémenter plus tard)
// Route::apiResource('trips', TripController::class);
// Route::apiResource('bookings', BookingController::class);
