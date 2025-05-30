<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Afficher le profil de l'utilisateur connecté
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ajouter l'URL complète de la photo de profil
        $user->photo_url = $this->getProfilePhotoUrl($user->photo_profil);

        return response()->json([
            'user' => $user
        ]);
    }

    /**
     * Mettre à jour le profil de l'utilisateur connecté
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'prenom' => 'sometimes|required|string|max:255',
            'nom' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
            'genre' => 'sometimes|required|string|in:homme,femme',
            'date_naissance' => 'sometimes|required|date|before:today',
            'photo' => 'sometimes|nullable|image|mimes:jpeg,jpg,png|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        // Gérer l'upload de la photo de profil
        if ($request->hasFile('photo')) {
            $photoPath = $this->handlePhotoUpload($request->file('photo'), $user);
            if ($photoPath) {
                // Supprimer l'ancienne photo si elle existe
                if ($user->photo_profil && $user->photo_profil !== 'default-avatar.png') {
                    Storage::disk('public')->delete('profile-photos/' . $user->photo_profil);
                }
                $user->photo_profil = $photoPath;
            }
        }

        // Mettre à jour les autres champs
        $user->fill($request->only([
            'prenom', 'nom', 'email', 'genre', 'date_naissance'
        ]));

        $user->save();

        // Ajouter l'URL complète de la photo de profil
        $user->photo_url = $this->getProfilePhotoUrl($user->photo_profil);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }

    /**
     * Gérer l'upload de la photo de profil
     */
    private function handlePhotoUpload($photo, $user): ?string
    {
        try {
            // Générer un nom unique pour la photo
            $filename = 'user_' . $user->id . '_' . time() . '.' . $photo->getClientOriginalExtension();

            // Stocker la photo dans storage/app/public/profile-photos
            $path = $photo->storeAs('profile-photos', $filename, 'public');

            if ($path) {
                return $filename;
            }
        } catch (\Exception $e) {
            // Log l'erreur si nécessaire
            Log::error('Erreur upload photo profil: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Obtenir l'URL complète de la photo de profil
     */
    private function getProfilePhotoUrl(?string $photoFilename): string
    {
        if (!$photoFilename) {
            return asset('images/default-avatar.svg');
        }

        // Vérifier si le fichier existe
        if (Storage::disk('public')->exists('profile-photos/' . $photoFilename)) {
            return asset('storage/profile-photos/' . $photoFilename);
        }

        // Retourner l'image par défaut si le fichier n'existe pas
        return asset('images/default-avatar.svg');
    }

    /**
     * Supprimer la photo de profil
     */
    public function deletePhoto(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->photo_profil && $user->photo_profil !== 'default-avatar.png') {
            // Supprimer le fichier
            Storage::disk('public')->delete('profile-photos/' . $user->photo_profil);

            // Mettre à jour la base de données
            $user->photo_profil = null;
            $user->save();
        }

        return response()->json([
            'message' => 'Photo de profil supprimée avec succès',
            'photo_url' => $this->getProfilePhotoUrl(null)
        ]);
    }
}
