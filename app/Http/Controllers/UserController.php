<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicule;

class UserController extends Controller
{
    /**
     * Récupérer l'utilisateur connecté
     */
    public function getUser(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }

    /**
     * Récupérer le profil complet
     */
    public function getProfile(Request $request)
    {
        $user = $request->user()->load(['vehicules', 'trajets', 'reservations']);
        
        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    /**
     * Mettre à jour le profil
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'date_naissance' => 'nullable|date',
            'genre' => 'nullable|in:homme,femme'
        ]);

        $user->update($request->only([
            'prenom', 'nom', 'telephone', 'date_naissance', 'genre'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Upload photo de profil
     */
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $user = $request->user();
        
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('photos', 'public');
            $user->update(['photo_url' => $path]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Photo uploadée avec succès',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Upload document d'identité
     */
    public function uploadIdentity(Request $request)
    {
        $request->validate([
            'identity' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        $user = $request->user();
        
        if ($request->hasFile('identity')) {
            $path = $request->file('identity')->store('identities', 'public');
            $user->update(['cin_path' => $path]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Document d\'identité uploadé avec succès',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Récupérer les véhicules de l'utilisateur
     */
    public function getVehicles(Request $request)
    {
        $vehicles = Vehicule::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'vehicles' => $vehicles
        ]);
    }

    /**
     * Ajouter un véhicule
     */
    public function storeVehicle(Request $request)
    {
        $request->validate([
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'annee' => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'couleur' => 'required|string|max:255',
            'nombre_places' => 'required|integer|min:2|max:8',
            'type_vehicule' => 'required|in:berline,suv,break,coupe,cabriolet,monospace,utilitaire'
        ]);

        $vehicle = Vehicule::create([
            'user_id' => $request->user()->id,
            'marque' => $request->marque,
            'modele' => $request->modele,
            'annee' => $request->annee,
            'couleur' => $request->couleur,
            'nombre_places' => $request->nombre_places,
            'type_vehicule' => $request->type_vehicule,
            'statut_verification' => 'en_attente'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Véhicule ajouté avec succès',
            'vehicle' => $vehicle
        ], 201);
    }

    /**
     * Modifier un véhicule
     */
    public function updateVehicle(Vehicule $vehicle, Request $request)
    {
        // Vérifier que le véhicule appartient à l'utilisateur
        if ($vehicle->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que vos propres véhicules'
            ], 403);
        }

        $request->validate([
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'annee' => 'required|integer|min:1990|max:' . (date('Y') + 1),
            'couleur' => 'required|string|max:255',
            'nombre_places' => 'required|integer|min:2|max:8',
            'type_vehicule' => 'required|in:berline,suv,break,coupe,cabriolet,monospace,utilitaire'
        ]);

        $vehicle->update($request->only([
            'marque', 'modele', 'annee', 'couleur', 'nombre_places', 'type_vehicule'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Véhicule mis à jour avec succès',
            'vehicle' => $vehicle->fresh()
        ]);
    }

    /**
     * Supprimer un véhicule
     */
    public function deleteVehicle(Vehicule $vehicle, Request $request)
    {
        // Vérifier que le véhicule appartient à l'utilisateur
        if ($vehicle->user_id !== $request->user()->id) {
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
    }
}
