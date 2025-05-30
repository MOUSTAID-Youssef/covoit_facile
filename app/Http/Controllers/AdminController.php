<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Trajet;
use App\Models\Vehicule;
use App\Models\Reservation;

class AdminController extends Controller
{
    /**
     * Statistiques publiques
     */
    public function getPublicStats()
    {
        return response()->json([
            'success' => true,
            'stats' => [
                'total_users' => User::count(),
                'total_trajets' => Trajet::count(),
                'total_vehicules' => Vehicule::count(),
                'total_reservations' => Reservation::count(),
                'co2_economise' => Trajet::sum('places_disponibles') * 2.3 * 100,
                'trajets_actifs' => Trajet::where('statut', 'actif')->count(),
                'utilisateurs_actifs' => User::where('statut', 'actif')->count()
            ]
        ]);
    }

    /**
     * Témoignages publics
     */
    public function getTestimonials()
    {
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
    }

    /**
     * Dashboard admin - Statistiques détaillées
     */
    public function dashboard()
    {
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
                'active_trips' => Trajet::where('statut', 'actif')->count(),
                'co2_economise' => Trajet::sum('places_disponibles') * 2.3 * 100,
                'monthly_revenue' => Reservation::where('statut', 'confirmee')->sum('nombre_places') * 10, // Estimation
            ]
        ]);
    }

    /**
     * Gestion des utilisateurs
     */
    public function getUsers()
    {
        $users = User::withCount(['vehicules', 'trajets', 'reservations'])
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
                    'vehicules_count' => $user->vehicules_count,
                    'trajets_count' => $user->trajets_count,
                    'reservations_count' => $user->reservations_count,
                ];
            });

        return response()->json(['success' => true, 'users' => $users]);
    }

    /**
     * Modifier un utilisateur
     */
    public function updateUser(User $user, Request $request)
    {
        $request->validate([
            'statut' => 'sometimes|in:actif,bloque,suspendu',
            'badge_verifie' => 'sometimes|boolean',
            'role' => 'sometimes|in:voyageur,conducteur,admin'
        ]);

        $user->update($request->only(['statut', 'badge_verifie', 'role']));

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Supprimer un utilisateur
     */
    public function deleteUser(User $user)
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }

    /**
     * Gestion des trajets
     */
    public function getTrips()
    {
        $trips = Trajet::with(['conducteur', 'reservations'])
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
                    'places_totales' => $trip->places_totales,
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
    }

    /**
     * Gestion des véhicules
     */
    public function getVehicles()
    {
        $vehicles = Vehicule::with(['user'])
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
    }

    /**
     * Gestion des réservations
     */
    public function getReservations()
    {
        $reservations = Reservation::with(['voyageur', 'trajet.conducteur'])
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
                        'photo_url' => $reservation->voyageur->photo_url
                    ],
                    'trajet' => [
                        'id' => $reservation->trajet->id,
                        'ville_depart' => $reservation->trajet->ville_depart,
                        'ville_arrivee' => $reservation->trajet->ville_arrivee,
                        'date_depart' => $reservation->trajet->date_depart,
                        'heure_depart' => $reservation->trajet->heure_depart,
                        'prix' => $reservation->trajet->prix,
                        'conducteur' => [
                            'prenom' => $reservation->trajet->conducteur->prenom,
                            'nom' => $reservation->trajet->conducteur->nom
                        ]
                    ]
                ];
            });

        return response()->json(['success' => true, 'reservations' => $reservations]);
    }
}
