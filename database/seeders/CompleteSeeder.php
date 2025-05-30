<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Trajet;
use App\Models\Vehicule;
use App\Models\Reservation;

class CompleteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer l'admin
        $admin = User::create([
            'prenom' => 'Admin',
            'nom' => 'CovoitFacile',
            'email' => 'admin@covoitfacile.ma',
            'password' => 'password',
            'role' => 'admin',
            'badge_verifie' => true,
        ]);

        // Créer des conducteurs
        $conducteurs = [];
        $nomsConduteurs = [
            ['Ahmed', 'Benali', 'ahmed@conducteur.com'],
            ['Fatima', 'Alami', 'fatima@conducteur.com'],
            ['Omar', 'Tazi', 'omar@conducteur.com'],
            ['Khadija', 'Idrissi', 'khadija@conducteur.com'],
            ['Youssef', 'Bennani', 'youssef@conducteur.com'],
            ['Aicha', 'Fassi', 'aicha@conducteur.com'],
            ['Hassan', 'Alaoui', 'hassan@conducteur.com'],
            ['Zineb', 'Chraibi', 'zineb@conducteur.com'],
        ];

        foreach ($nomsConduteurs as $nom) {
            $conducteurs[] = User::create([
                'prenom' => $nom[0],
                'nom' => $nom[1],
                'email' => $nom[2],
                'password' => 'password',
                'role' => 'conducteur',
                'badge_verifie' => rand(0, 1) ? true : false,
            ]);
        }

        // Créer des voyageurs
        $voyageurs = [];
        $nomsVoyageurs = [
            ['Mehdi', 'Lahlou', 'mehdi@voyageur.com'],
            ['Salma', 'Berrada', 'salma@voyageur.com'],
            ['Karim', 'Ziani', 'karim@voyageur.com'],
            ['Nadia', 'Amrani', 'nadia@voyageur.com'],
            ['Rachid', 'Bouazza', 'rachid@voyageur.com'],
            ['Leila', 'Mansouri', 'leila@voyageur.com'],
            ['Saad', 'Kettani', 'saad@voyageur.com'],
            ['Meryem', 'Hajji', 'meryem@voyageur.com'],
            ['Amine', 'Sekkat', 'amine@voyageur.com'],
            ['Houda', 'Benkirane', 'houda@voyageur.com'],
        ];

        foreach ($nomsVoyageurs as $nom) {
            $voyageurs[] = User::create([
                'prenom' => $nom[0],
                'nom' => $nom[1],
                'email' => $nom[2],
                'password' => 'password',
                'role' => 'voyageur',
                'badge_verifie' => rand(0, 1) ? true : false,
            ]);
        }

        // Créer des véhicules pour chaque conducteur
        $marques = [
            'Renault' => ['Clio', 'Megane', 'Scenic', 'Captur'],
            'Peugeot' => ['208', '308', '3008', '2008'],
            'Citroën' => ['C3', 'C4', 'C5', 'Berlingo'],
            'Dacia' => ['Sandero', 'Duster', 'Logan', 'Lodgy'],
            'Toyota' => ['Yaris', 'Corolla', 'RAV4', 'Prius'],
        ];
        $couleurs = ['Blanc', 'Noir', 'Gris', 'Rouge', 'Bleu', 'Vert'];

        foreach ($conducteurs as $conducteur) {
            $marque = array_rand($marques);
            $modele = $marques[$marque][array_rand($marques[$marque])];

            Vehicule::create([
                'user_id' => $conducteur->id,
                'marque' => $marque,
                'modele' => $modele,
                'annee' => rand(2015, 2024),
                'couleur' => $couleurs[array_rand($couleurs)],
                'nombre_places' => rand(4, 7),
                'climatisation' => rand(0, 1) ? true : false,
                'statut_verification' => ['en_attente', 'verifie', 'rejete'][rand(0, 2)],
            ]);
        }

        // Créer des trajets
        $villes = [
            'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger',
            'Agadir', 'Meknès', 'Oujda', 'Tétouan', 'Safi'
        ];

        $routes = [
            ['Casablanca', 'Rabat', 60],
            ['Rabat', 'Fès', 120],
            ['Casablanca', 'Marrakech', 150],
            ['Fès', 'Meknès', 40],
            ['Agadir', 'Casablanca', 200],
            ['Tanger', 'Rabat', 100],
            ['Marrakech', 'Agadir', 180],
            ['Casablanca', 'El Jadida', 80],
        ];

        $trajets = [];
        foreach ($conducteurs as $conducteur) {
            // Chaque conducteur crée 2-4 trajets
            $nombreTrajets = rand(2, 4);

            for ($i = 0; $i < $nombreTrajets; $i++) {
                $route = $routes[array_rand($routes)];
                $dateDepart = date('Y-m-d', strtotime('+' . rand(1, 60) . ' days'));
                $heureDepart = sprintf('%02d:%02d', rand(6, 20), rand(0, 3) * 15);

                $trajets[] = Trajet::create([
                    'conducteur_id' => $conducteur->id,
                    'ville_depart' => $route[0],
                    'ville_arrivee' => $route[1],
                    'date_depart' => $dateDepart,
                    'heure_depart' => $heureDepart,
                    'prix' => $route[2] + rand(-20, 30),
                    'places_disponibles' => rand(1, 4),
                    'places_totales' => rand(2, 4),
                    'description' => 'Trajet confortable avec ' . ($conducteur->prenom),
                    'statut' => ['actif', 'complet', 'termine'][rand(0, 2)],
                ]);
            }
        }

        // Créer des réservations
        foreach ($voyageurs as $voyageur) {
            // Chaque voyageur fait 1-3 réservations
            $nombreReservations = rand(1, 3);

            for ($i = 0; $i < $nombreReservations; $i++) {
                $trajet = $trajets[array_rand($trajets)];

                // Éviter que le voyageur réserve son propre trajet
                if ($trajet->conducteur_id === $voyageur->id) continue;

                // Vérifier qu'il n'y a pas déjà une réservation
                $existante = Reservation::where('trajet_id', $trajet->id)
                    ->where('voyageur_id', $voyageur->id)
                    ->exists();

                if (!$existante) {
                    Reservation::create([
                        'trajet_id' => $trajet->id,
                        'voyageur_id' => $voyageur->id,
                        'nombre_places' => rand(1, 2),
                        'statut' => ['en_attente', 'confirmee', 'annulee'][rand(0, 2)],
                        'message' => 'Réservation de ' . $voyageur->prenom,
                    ]);
                }
            }
        }

        $this->command->info('✅ Données complètes créées avec succès !');
        $this->command->info('👥 Utilisateurs: ' . User::count());
        $this->command->info('🚗 Véhicules: ' . Vehicule::count());
        $this->command->info('🛣️ Trajets: ' . Trajet::count());
        $this->command->info('📋 Réservations: ' . Reservation::count());
    }
}
