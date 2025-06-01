<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'prenom' => ['required', 'string', 'max:255'],
            'nom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'telephone' => ['nullable', 'string', function ($attribute, $value, $fail) {
                if ($value && !preg_match('/^(\+212|0)[5-7][0-9]{8}$/', $value)) {
                    $fail('Le format du numéro de téléphone est invalide. Utilisez le format marocain : +212XXXXXXXXX ou 0XXXXXXXXX');
                }
            }],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['sometimes', 'string', 'in:voyageur,conducteur'],
            'genre' => ['sometimes', 'string', 'in:homme,femme'],
            'date_naissance' => ['sometimes', 'date', 'before:today'],
        ]);

        $user = User::create([
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'voyageur',
            'genre' => $request->genre,
            'date_naissance' => $request->date_naissance,
            'badge_verifie' => false,
        ]);

        event(new Registered($user));

        // Créer un token pour l'utilisateur
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
}
