<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Trajet;
use App\Models\Vehicule;
use App\Models\Reservation;

class SimpleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer l'admin
        User::create([
            'prenom' => 'Admin',
            'nom' => 'CovoitFacile',
            'email' => 'admin@covoitfacile.ma',
            'password' => 'password',
            'role' => 'admin',
            'badge_verifie' => true,
        ]);

        // Créer des conducteurs
        $conducteur1 = User::create([
            'prenom' => 'Ahmed',
            'nom' => 'Benali',
            'email' => 'ahmed@conducteur.com',
            'password' => 'password',
            'role' => 'conducteur',
            'badge_verifie' => true,
        ]);

        $conducteur2 = User::create([
            'prenom' => 'Fatima',
            'nom' => 'Alami',
            'email' => 'fatima@conducteur.com',
            'password' => 'password',
            'role' => 'conducteur',
            'badge_verifie' => true,
        ]);

        // Créer des voyageurs
        $voyageur1 = User::create([
            'prenom' => 'Youssef',
            'nom' => 'Tazi',
            'email' => 'youssef@voyageur.com',
            'password' => 'password',
            'role' => 'voyageur',
            'badge_verifie' => true,
        ]);

        $voyageur2 = User::create([
            'prenom' => 'Aicha',
            'nom' => 'Idrissi',
            'email' => 'aicha@voyageur.com',
            'password' => 'password',
            'role' => 'voyageur',
            'badge_verifie' => false,
        ]);

        // Créer des véhicules
        Vehicule::create([
            'user_id' => $conducteur1->id,
            'marque' => 'Renault',
            'modele' => 'Clio',
            'annee' => 2020,
            'couleur' => 'Blanc',
            'nombre_places' => 5,
            'climatisation' => true,
            'statut_verification' => 'verifie',
        ]);

        Vehicule::create([
            'user_id' => $conducteur2->id,
            'marque' => 'Peugeot',
            'modele' => '308',
            'annee' => 2019,
            'couleur' => 'Gris',
            'nombre_places' => 5,
            'climatisation' => true,
            'statut_verification' => 'verifie',
        ]);

        // Créer des trajets
        $trajet1 = Trajet::create([
            'conducteur_id' => $conducteur1->id,
            'ville_depart' => 'Casablanca',
            'ville_arrivee' => 'Rabat',
            'date_depart' => '2025-01-20',
            'heure_depart' => '08:00',
            'prix' => 60,
            'places_disponibles' => 3,
            'places_totales' => 4,
            'description' => 'Trajet confortable avec climatisation',
            'statut' => 'actif',
        ]);

        $trajet2 = Trajet::create([
            'conducteur_id' => $conducteur2->id,
            'ville_depart' => 'Rabat',
            'ville_arrivee' => 'Fès',
            'date_depart' => '2025-01-22',
            'heure_depart' => '14:30',
            'prix' => 120,
            'places_disponibles' => 2,
            'places_totales' => 3,
            'description' => 'Voyage direct sans arrêt',
            'statut' => 'actif',
        ]);

        $trajet3 = Trajet::create([
            'conducteur_id' => $conducteur1->id,
            'ville_depart' => 'Casablanca',
            'ville_arrivee' => 'Marrakech',
            'date_depart' => '2025-01-15',
            'heure_depart' => '09:00',
            'prix' => 150,
            'places_disponibles' => 0,
            'places_totales' => 4,
            'description' => 'Trajet terminé',
            'statut' => 'termine',
        ]);

        // Créer des réservations
        Reservation::create([
            'trajet_id' => $trajet1->id,
            'voyageur_id' => $voyageur1->id,
            'nombre_places' => 1,
            'statut' => 'confirmee',
            'message' => 'Merci pour le trajet !',
        ]);

        Reservation::create([
            'trajet_id' => $trajet2->id,
            'voyageur_id' => $voyageur2->id,
            'nombre_places' => 1,
            'statut' => 'en_attente',
            'message' => 'Je souhaite réserver une place',
        ]);

        $this->command->info('✅ Données simples créées avec succès !');
        $this->command->info('👥 Utilisateurs: ' . User::count());
        $this->command->info('🚗 Véhicules: ' . Vehicule::count());
        $this->command->info('🛣️ Trajets: ' . Trajet::count());
        $this->command->info('📋 Réservations: ' . Reservation::count());
    }
}
