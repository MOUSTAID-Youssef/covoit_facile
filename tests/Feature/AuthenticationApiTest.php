<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthenticationApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user registration with role selection
     */
    public function test_user_can_register_with_role()
    {
        $response = $this->postJson('/api/register', [
            'prenom' => 'Test',
            'nom' => 'User',
            'email' => 'test@example.com',
            'mot_de_passe' => 'password123',
            'mot_de_passe_confirmation' => 'password123',
            'role' => 'conducteur',
            'genre' => 'homme',
            'date_naissance' => '1990-01-01',
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'user' => [
                        'id', 'prenom', 'nom', 'email', 'role', 'genre'
                    ],
                    'token',
                    'token_type'
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'role' => 'conducteur'
        ]);
    }

    /**
     * Test user cannot register as admin
     */
    public function test_user_cannot_register_as_admin()
    {
        $response = $this->postJson('/api/register', [
            'prenom' => 'Test',
            'nom' => 'Admin',
            'email' => 'admin@example.com',
            'mot_de_passe' => 'password123',
            'mot_de_passe_confirmation' => 'password123',
            'role' => 'admin',
            'genre' => 'homme',
            'date_naissance' => '1990-01-01',
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['role']);
    }

    /**
     * Test user login
     */
    public function test_user_can_login()
    {
        $user = User::create([
            'prenom' => 'Test',
            'nom' => 'User',
            'email' => 'test@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'role' => 'voyageur',
            'genre' => 'femme',
            'date_naissance' => '1995-01-01',
            'badge_verifie' => false,
            'date_inscription' => now(),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'mot_de_passe' => 'password123',
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'user' => [
                        'id', 'prenom', 'nom', 'email', 'role'
                    ],
                    'token',
                    'token_type'
                ]);
    }

    /**
     * Test user can access protected route with token
     */
    public function test_user_can_access_protected_route_with_token()
    {
        $user = User::create([
            'prenom' => 'Test',
            'nom' => 'User',
            'email' => 'test@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'role' => 'voyageur',
            'genre' => 'femme',
            'date_naissance' => '1995-01-01',
            'badge_verifie' => false,
            'date_inscription' => now(),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user');

        $response->assertStatus(200)
                ->assertJson([
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role
                ]);
    }
}
