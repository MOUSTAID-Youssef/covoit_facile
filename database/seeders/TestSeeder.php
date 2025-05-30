<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Supprimer tous les utilisateurs existants
        User::truncate();

        // Créer un utilisateur admin avec mot de passe en clair (le mutateur va le hasher)
        $admin = User::create([
            'prenom' => 'Admin',
            'nom' => 'Test',
            'email' => 'admin@test.com',
            'password' => 'password', // Le mutateur va automatiquement hasher
            'role' => 'admin',
            'badge_verifie' => true,
        ]);

        // Créer un utilisateur avec hashage manuel pour comparaison
        $adminManual = User::create([
            'prenom' => 'Admin',
            'nom' => 'Manual',
            'email' => 'admin@manual.com',
            'password' => Hash::make('password'), // Hashage manuel
            'role' => 'admin',
            'badge_verifie' => true,
        ]);

        // Créer un utilisateur en désactivant temporairement le mutateur
        $adminDirect = new User();
        $adminDirect->prenom = 'Admin';
        $adminDirect->nom = 'Direct';
        $adminDirect->email = 'admin@direct.com';
        $adminDirect->attributes['password'] = Hash::make('password'); // Bypass du mutateur
        $adminDirect->role = 'admin';
        $adminDirect->badge_verifie = true;
        $adminDirect->save();

        $this->command->info('✅ Utilisateurs de test créés :');
        $this->command->info('1. admin@test.com - password (avec mutateur)');
        $this->command->info('2. admin@manual.com - password (hashage manuel)');
        $this->command->info('3. admin@direct.com - password (bypass mutateur)');
        
        // Afficher les hashes pour comparaison
        $users = User::all();
        foreach ($users as $user) {
            $this->command->info("Hash pour {$user->email}: " . substr($user->password, 0, 20) . '...');
        }
    }
}
