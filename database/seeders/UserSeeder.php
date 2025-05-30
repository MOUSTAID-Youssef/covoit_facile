<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('fr_FR');

        // Créer un admin
        User::create([
            'prenom' => 'Admin',
            'nom' => 'CovoitFacile',
            'email' => 'admin@covoitfacile.ma',
            'password' => 'password',
            'genre' => 'homme',
            'date_naissance' => '1985-01-01',
            'role' => 'admin',
            'badge_verifie' => true,
            'email_verified_at' => now(),
        ]);

        // Créer des conducteurs
        for ($i = 0; $i < 15; $i++) {
            User::create([
                'prenom' => $faker->firstName,
                'nom' => $faker->lastName,
                'email' => $faker->unique()->email,
                'password' => 'password',
                'genre' => $faker->randomElement(['homme', 'femme']),
                'date_naissance' => $faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
                'role' => 'conducteur',
                'badge_verifie' => $faker->boolean(70), // 70% de chance d'être vérifié
                'email_verified_at' => $faker->boolean(80) ? now() : null,
                'created_at' => $faker->dateTimeBetween('-2 years', 'now'),
            ]);
        }

        // Créer des voyageurs
        for ($i = 0; $i < 20; $i++) {
            User::create([
                'prenom' => $faker->firstName,
                'nom' => $faker->lastName,
                'email' => $faker->unique()->email,
                'password' => 'password',
                'genre' => $faker->randomElement(['homme', 'femme']),
                'date_naissance' => $faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
                'role' => 'voyageur',
                'badge_verifie' => $faker->boolean(60), // 60% de chance d'être vérifié
                'email_verified_at' => $faker->boolean(85) ? now() : null,
                'created_at' => $faker->dateTimeBetween('-2 years', 'now'),
            ]);
        }

        // Créer des comptes de test simples
        User::create([
            'prenom' => 'Test',
            'nom' => 'Admin',
            'email' => 'test@admin.com',
            'password' => 'password',
            'genre' => 'homme',
            'date_naissance' => '1990-01-01',
            'role' => 'admin',
            'badge_verifie' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'prenom' => 'Test',
            'nom' => 'Conducteur',
            'email' => 'test@conducteur.com',
            'password' => 'password',
            'genre' => 'homme',
            'date_naissance' => '1990-01-01',
            'role' => 'conducteur',
            'badge_verifie' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'prenom' => 'Test',
            'nom' => 'Voyageur',
            'email' => 'test@voyageur.com',
            'password' => 'password',
            'genre' => 'femme',
            'date_naissance' => '1995-01-01',
            'role' => 'voyageur',
            'badge_verifie' => true,
            'email_verified_at' => now(),
        ]);
    }
}
