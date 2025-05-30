<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Trajet;
use App\Models\Vehicule;
use App\Models\Reservation;

/*
|--------------------------------------------------------------------------
| API Routes Simplifiées - CovoitFacile
|--------------------------------------------------------------------------
*/

// ==================== ROUTES PUBLIQUES ====================

// Statistiques publiques
Route::get('/stats', function () {
    return response()->json([
        'success' => true,
        'stats' => [
            'total_users' => User::count(),
            'total_voyageurs' => User::where('role', 'voyageur')->count(),
            'total_conducteurs' => User::where('role', 'conducteur')->count(),
            'total_trajets' => Trajet::count(),
            'total_vehicules' => Vehicule::count(),
            'total_reservations' => Reservation::count(),
            'co2_economise' => Trajet::sum('places_disponibles') * 2.3 * 100,
        ]
    ]);
});

// Témoignages
Route::get('/testimonials', function () {
    return response()->json([
        'success' => true,
        'testimonials' => [
            [
                'name' => 'Ahmed Benali',
                'role' => 'Conducteur',
                'comment' => 'CovoitFacile m\'a permis de rencontrer des personnes formidables.',
                'rating' => 5,
                'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face'
            ],
            [
                'name' => 'Fatima Zahra',
                'role' => 'Voyageuse',
                'comment' => 'Je voyage de Casablanca à Rabat chaque semaine. C\'est économique !',
                'rating' => 5,
                'avatar' => 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=256&h=256&fit=crop&crop=face'
            ]
        ]
    ]);
});

// ==================== AUTHENTIFICATION ====================

// Inscription
Route::post('/register', function (Request $request) {
    $request->validate([
        'prenom' => 'required|string|max:255',
        'nom' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
        'role' => 'required|in:voyageur,conducteur'
    ]);

    $user = User::create([
        'prenom' => $request->prenom,
        'nom' => $request->nom,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => $request->role,
        'statut' => 'actif'
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'success' => true,
        'user' => $user,
        'token' => $token
    ]);
});

// Connexion
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    if (Auth::attempt($request->only('email', 'password'))) {
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $token
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Email ou mot de passe incorrect'
    ], 401);
});

// ==================== ROUTES PROTÉGÉES ====================

Route::middleware('auth:sanctum')->group(function () {
    
    // Utilisateur connecté
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });

    // Déconnexion
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Déconnecté']);
    });

    // ==================== PROFIL ====================
    
    // Voir profil
    Route::get('/profile', function (Request $request) {
        $user = $request->user()->load(['vehicules', 'trajets', 'reservations']);
        return response()->json(['success' => true, 'user' => $user]);
    });

    // Modifier profil
    Route::put('/profile', function (Request $request) {
        $user = $request->user();
        
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'date_naissance' => 'nullable|date',
            'genre' => 'nullable|in:homme,femme'
        ]);

        $user->update($request->only(['prenom', 'nom', 'telephone', 'date_naissance', 'genre']));

        return response()->json(['success' => true, 'user' => $user->fresh()]);
    });

    // ==================== TRAJETS ====================
    
    // Lister tous les trajets
    Route::get('/trips', function () {
        $trips = Trajet::with(['conducteur', 'reservations'])
            ->where('statut', 'actif')
            ->orderBy('date_depart', 'asc')
            ->get();

        return response()->json(['success' => true, 'trips' => $trips]);
    });

    // Créer un trajet
    Route::post('/trips', function (Request $request) {
        $request->validate([
            'ville_depart' => 'required|string|max:255',
            'ville_arrivee' => 'required|string|max:255',
            'date_depart' => 'required|date|after:today',
            'heure_depart' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'places_totales' => 'required|integer|min:1|max:8'
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
            'statut' => 'actif'
        ]);

        return response()->json(['success' => true, 'trip' => $trip->load('conducteur')]);
    });

    // Mes trajets (conducteur)
    Route::get('/my-trips', function (Request $request) {
        $trips = Trajet::with(['reservations.voyageur'])
            ->where('conducteur_id', $request->user()->id)
            ->orderBy('date_depart', 'desc')
            ->get();

        return response()->json(['success' => true, 'trips' => $trips]);
    });

    // ==================== RÉSERVATIONS ====================
    
    // Réserver un trajet
    Route::post('/trips/{trip}/reserve', function (Trajet $trip, Request $request) {
        $request->validate([
            'nombre_places' => 'required|integer|min:1'
        ]);

        if ($trip->places_disponibles < $request->nombre_places) {
            return response()->json([
                'success' => false,
                'message' => 'Pas assez de places disponibles'
            ], 400);
        }

        $reservation = Reservation::create([
            'voyageur_id' => $request->user()->id,
            'trajet_id' => $trip->id,
            'nombre_places' => $request->nombre_places,
            'statut' => 'en_attente'
        ]);

        $trip->decrement('places_disponibles', $request->nombre_places);

        return response()->json(['success' => true, 'reservation' => $reservation->load(['trajet', 'voyageur'])]);
    });

    // Mes réservations
    Route::get('/my-reservations', function (Request $request) {
        $reservations = Reservation::with(['trajet.conducteur'])
            ->where('voyageur_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['success' => true, 'reservations' => $reservations]);
    });

    // ==================== VÉHICULES ====================
    
    // Mes véhicules
    Route::get('/my-vehicles', function (Request $request) {
        $vehicles = Vehicule::where('user_id', $request->user()->id)->get();
        return response()->json(['success' => true, 'vehicles' => $vehicles]);
    });

    // Ajouter un véhicule
    Route::post('/my-vehicles', function (Request $request) {
        $request->validate([
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'annee' => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'couleur' => 'required|string|max:255',
            'nombre_places' => 'required|integer|min:2|max:8'
        ]);

        $vehicle = Vehicule::create([
            'user_id' => $request->user()->id,
            'marque' => $request->marque,
            'modele' => $request->modele,
            'annee' => $request->annee,
            'couleur' => $request->couleur,
            'nombre_places' => $request->nombre_places,
            'statut_verification' => 'en_attente'
        ]);

        return response()->json(['success' => true, 'vehicle' => $vehicle]);
    });

    // ==================== ADMIN ====================
    
    Route::middleware(function ($request, $next) {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }
        return $next($request);
    })->prefix('admin')->group(function () {
        
        // Dashboard admin
        Route::get('/stats', function () {
            return response()->json([
                'success' => true,
                'stats' => [
                    'total_users' => User::count(),
                    'total_voyageurs' => User::where('role', 'voyageur')->count(),
                    'total_conducteurs' => User::where('role', 'conducteur')->count(),
                    'total_trajets' => Trajet::count(),
                    'total_vehicules' => Vehicule::count(),
                    'total_reservations' => Reservation::count(),
                    'pending_verifications' => User::where('badge_verifie', false)->count(),
                    'pending_vehicles' => Vehicule::where('statut_verification', 'en_attente')->count(),
                ]
            ]);
        });

        // Gestion des utilisateurs
        Route::get('/users', function () {
            $users = User::withCount(['vehicules', 'trajets', 'reservations'])
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json(['success' => true, 'users' => $users]);
        });

        Route::put('/users/{user}', function (User $user, Request $request) {
            $user->update($request->only(['statut', 'badge_verifie', 'role']));
            return response()->json(['success' => true, 'user' => $user->fresh()]);
        });

        Route::delete('/users/{user}', function (User $user) {
            $user->delete();
            return response()->json(['success' => true, 'message' => 'Utilisateur supprimé']);
        });

        // Gestion des trajets
        Route::get('/trips', function () {
            $trips = Trajet::with(['conducteur', 'reservations'])->orderBy('created_at', 'desc')->get();
            return response()->json(['success' => true, 'trips' => $trips]);
        });

        // Gestion des véhicules
        Route::get('/vehicles', function () {
            $vehicles = Vehicule::with('user')->orderBy('created_at', 'desc')->get();
            return response()->json(['success' => true, 'vehicles' => $vehicles]);
        });

        // Gestion des réservations
        Route::get('/reservations', function () {
            $reservations = Reservation::with(['voyageur', 'trajet.conducteur'])->orderBy('created_at', 'desc')->get();
            return response()->json(['success' => true, 'reservations' => $reservations]);
        });
    });
});
