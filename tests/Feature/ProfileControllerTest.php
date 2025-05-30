<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test GET /api/profile returns user profile
     */
    public function test_user_can_get_profile()
    {
        // Créer un utilisateur
        $user = User::create([
            'prenom' => 'Ahmed',
            'nom' => 'Benali',
            'email' => 'ahmed@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'role' => 'conducteur',
            'genre' => 'homme',
            'date_naissance' => '1990-01-01',
            'badge_verifie' => true,
            'date_inscription' => now(),
        ]);

        // Créer un token pour l'utilisateur
        $token = $user->createToken('test-token')->plainTextToken;

        // Faire la requête GET /api/profile
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/profile');

        // Vérifier la réponse
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'user' => [
                        'id', 'prenom', 'nom', 'email', 'role', 'genre',
                        'date_naissance', 'badge_verifie', 'photo_url'
                    ]
                ])
                ->assertJson([
                    'user' => [
                        'id' => $user->id,
                        'prenom' => 'Ahmed',
                        'nom' => 'Benali',
                        'email' => 'ahmed@example.com',
                        'role' => 'conducteur',
                        'genre' => 'homme'
                    ]
                ]);

        // Vérifier que photo_url contient l'image par défaut
        $this->assertStringContainsString('default-avatar.svg', $response->json('user.photo_url'));
    }

    /**
     * Test que l'accès au profil nécessite une authentification
     */
    public function test_profile_requires_authentication()
    {
        $response = $this->getJson('/api/profile');

        $response->assertStatus(401);
    }

    /**
     * Test PUT /api/profile updates user profile
     */
    public function test_user_can_update_profile()
    {
        // Créer un utilisateur
        $user = User::create([
            'prenom' => 'Ahmed',
            'nom' => 'Benali',
            'email' => 'ahmed@example.com',
            'mot_de_passe' => Hash::make('password123'),
            'role' => 'voyageur',
            'genre' => 'homme',
            'date_naissance' => '1990-01-01',
            'badge_verifie' => false,
            'date_inscription' => now(),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        // Données de mise à jour
        $updateData = [
            'prenom' => 'Ahmed Updated',
            'nom' => 'Benali Updated',
            'genre' => 'homme',
            'date_naissance' => '1985-05-15',
        ];

        // Faire la requête PUT /api/profile
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson('/api/profile', $updateData);

        // Vérifier la réponse
        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Profil mis à jour avec succès',
                    'user' => [
                        'prenom' => 'Ahmed Updated',
                        'nom' => 'Benali Updated',
                        'genre' => 'homme'
                    ]
                ]);

        // Vérifier que la date a été mise à jour (format ISO)
        $this->assertStringStartsWith('1985-05-15', $response->json('user.date_naissance'));

        // Vérifier que les données ont été mises à jour en base
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'prenom' => 'Ahmed Updated',
            'nom' => 'Benali Updated',
            'date_naissance' => '1985-05-15'
        ]);
    }

    /**
     * Test validation des données de profil
     */
    public function test_profile_update_validation()
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

        // Test avec des données invalides
        $invalidData = [
            'prenom' => '', // Requis
            'genre' => 'invalid', // Doit être 'homme' ou 'femme'
            'date_naissance' => '2030-01-01', // Ne peut pas être dans le futur
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson('/api/profile', $invalidData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['prenom', 'genre', 'date_naissance']);
    }

    /**
     * Test upload d'image de profil
     */
    public function test_user_can_upload_profile_photo()
    {
        Storage::fake('public');

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

        // Créer un fichier factice (sans utiliser l'extension GD)
        $file = UploadedFile::fake()->create('avatar.jpg', 1024, 'image/jpeg'); // 1MB

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->post('/api/profile', [
            'photo' => $file,
            'prenom' => 'Test Updated',
            '_method' => 'PUT'
        ]);

        $response->assertStatus(200);

        // Vérifier que le fichier a été stocké
        $user->refresh();
        $this->assertNotNull($user->photo_profil);

        // Vérifier que le fichier existe dans le stockage
        $this->assertTrue(Storage::disk('public')->exists('profile-photos/' . $user->photo_profil));
    }
}
