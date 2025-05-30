<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Trajet;
use App\Models\User;
use Faker\Factory as Faker;
use Carbon\Carbon;

class TrajetSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('fr_FR');

        // Récupérer tous les conducteurs
        $conducteurs = User::where('role', 'conducteur')->get();

        $villes = [
            'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
            'Meknès', 'Oujda', 'Tétouan', 'Safi', 'El Jadida', 'Nador',
            'Kénitra', 'Beni Mellal', 'Khemisset', 'Mohammedia', 'Salé'
        ];

        $routes_populaires = [
            ['Casablanca', 'Rabat', 60, '1h30'],
            ['Rabat', 'Fès', 120, '2h45'],
            ['Casablanca', 'Marrakech', 150, '3h15'],
            ['Fès', 'Meknès', 40, '1h00'],
            ['Agadir', 'Casablanca', 200, '4h30'],
            ['Tanger', 'Rabat', 100, '2h15'],
            ['Marrakech', 'Agadir', 180, '3h45'],
            ['Casablanca', 'El Jadida', 80, '1h45'],
            ['Rabat', 'Meknès', 90, '2h00'],
            ['Fès', 'Oujda', 160, '3h30']
        ];

        foreach ($conducteurs as $conducteur) {
            // Chaque conducteur crée entre 2 et 8 trajets
            $nombreTrajets = $faker->numberBetween(2, 8);

            for ($i = 0; $i < $nombreTrajets; $i++) {

                // 70% de chance d'utiliser une route populaire
                if ($faker->boolean(70)) {
                    $route = $faker->randomElement($routes_populaires);
                    $ville_depart = $route[0];
                    $ville_arrivee = $route[1];
                    $prix_base = $route[2];
                } else {
                    $ville_depart = $faker->randomElement($villes);
                    do {
                        $ville_arrivee = $faker->randomElement($villes);
                    } while ($ville_arrivee === $ville_depart);
                    $prix_base = $faker->numberBetween(30, 250);
                }

                // Générer des dates futures et passées
                $date_depart = $faker->dateTimeBetween('-3 months', '+2 months');
                $heure_depart = $faker->time('H:i', '22:00');

                // Déterminer le statut basé sur la date
                $date_carbon = Carbon::parse($date_depart);

                if ($date_carbon->isPast()) {
                    $statut = $faker->randomElement(['termine', 'annule']);
                } else {
                    $statut = $faker->randomElement(['actif', 'complet']);
                }

                // Places aléatoires entre 1 et 4
                $places_totales = $faker->numberBetween(2, 4);
                $places_disponibles = $faker->numberBetween(1, $places_totales);
                if ($statut === 'complet') {
                    $places_disponibles = 0;
                }

                Trajet::create([
                    'conducteur_id' => $conducteur->id,
                    'ville_depart' => $ville_depart,
                    'ville_arrivee' => $ville_arrivee,
                    'date_depart' => $date_depart->format('Y-m-d'),
                    'heure_depart' => $heure_depart,
                    'prix' => $faker->numberBetween($prix_base - 20, $prix_base + 30),
                    'places_disponibles' => $places_disponibles,
                    'places_totales' => $places_totales,
                    'description' => $faker->optional(0.7)->sentence(10),
                    'statut' => $statut,
                    'created_at' => $faker->dateTimeBetween('-6 months', 'now'),
                ]);
            }
        }
    }
}
