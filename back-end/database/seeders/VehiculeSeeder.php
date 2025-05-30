<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicule;
use App\Models\User;
use Faker\Factory as Faker;

class VehiculeSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('fr_FR');
        
        // Récupérer tous les conducteurs
        $conducteurs = User::where('role', 'conducteur')->get();
        
        $marques = [
            'Renault' => ['Clio', 'Megane', 'Scenic', 'Captur', 'Kadjar'],
            'Peugeot' => ['208', '308', '3008', '5008', '2008'],
            'Citroën' => ['C3', 'C4', 'C5 Aircross', 'Berlingo'],
            'Volkswagen' => ['Golf', 'Polo', 'Tiguan', 'Passat'],
            'Ford' => ['Fiesta', 'Focus', 'Kuga', 'Mondeo'],
            'Toyota' => ['Yaris', 'Corolla', 'RAV4', 'Prius'],
            'Nissan' => ['Micra', 'Qashqai', 'Juke', 'X-Trail'],
            'Hyundai' => ['i20', 'i30', 'Tucson', 'Santa Fe'],
            'Kia' => ['Rio', 'Ceed', 'Sportage', 'Sorento'],
            'Dacia' => ['Sandero', 'Duster', 'Logan', 'Lodgy']
        ];
        
        $couleurs = [
            'Blanc', 'Noir', 'Gris', 'Rouge', 'Bleu', 'Vert', 
            'Argent', 'Beige', 'Marron', 'Orange'
        ];

        foreach ($conducteurs as $conducteur) {
            // Chaque conducteur peut avoir 1 à 2 véhicules
            $nombreVehicules = $faker->numberBetween(1, 2);
            
            for ($i = 0; $i < $nombreVehicules; $i++) {
                $marque = $faker->randomElement(array_keys($marques));
                $modele = $faker->randomElement($marques[$marque]);
                
                Vehicule::create([
                    'user_id' => $conducteur->id,
                    'marque' => $marque,
                    'modele' => $modele,
                    'annee' => $faker->numberBetween(2010, 2024),
                    'couleur' => $faker->randomElement($couleurs),
                    'nombre_places' => $faker->randomElement([4, 5, 7]),
                    'climatisation' => $faker->boolean(80), // 80% ont la clim
                    'statut_verification' => $faker->randomElement(['en_attente', 'verifie', 'rejete']),
                    'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                ]);
            }
        }
    }
}
