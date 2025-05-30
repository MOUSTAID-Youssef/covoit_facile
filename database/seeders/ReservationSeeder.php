<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\Trajet;
use App\Models\User;
use Faker\Factory as Faker;

class ReservationSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('fr_FR');
        
        // Récupérer tous les voyageurs
        $voyageurs = User::where('role', 'voyageur')->get();
        
        // Récupérer tous les trajets
        $trajets = Trajet::all();

        foreach ($trajets as $trajet) {
            // Déterminer combien de réservations ce trajet devrait avoir
            $places_reservees = $trajet->places_totales - $trajet->places_disponibles;
            
            if ($places_reservees > 0) {
                // Sélectionner des voyageurs aléatoires pour ce trajet
                $voyageurs_selectionnes = $voyageurs->random(min($places_reservees, $voyageurs->count()));
                
                foreach ($voyageurs_selectionnes as $index => $voyageur) {
                    // Éviter que le voyageur réserve son propre trajet
                    if ($voyageur->id === $trajet->conducteur_id) {
                        continue;
                    }
                    
                    // Déterminer le statut de la réservation
                    if ($trajet->statut === 'termine') {
                        $statut = 'confirmee';
                    } elseif ($trajet->statut === 'annule') {
                        $statut = $faker->randomElement(['annulee', 'confirmee']);
                    } else {
                        $statut = $faker->randomElement(['en_attente', 'confirmee', 'annulee']);
                    }
                    
                    Reservation::create([
                        'trajet_id' => $trajet->id,
                        'voyageur_id' => $voyageur->id,
                        'nombre_places' => $faker->numberBetween(1, 2),
                        'statut' => $statut,
                        'message' => $faker->optional(0.6)->sentence(8),
                        'created_at' => $faker->dateTimeBetween($trajet->created_at, 'now'),
                    ]);
                    
                    // Limiter le nombre de réservations pour éviter les doublons
                    if ($index >= $places_reservees - 1) {
                        break;
                    }
                }
            }
        }
        
        // Créer quelques réservations supplémentaires pour les voyageurs actifs
        foreach ($voyageurs->random(10) as $voyageur) {
            $trajets_disponibles = Trajet::where('conducteur_id', '!=', $voyageur->id)
                ->where('statut', 'actif')
                ->where('places_disponibles', '>', 0)
                ->get();
                
            if ($trajets_disponibles->isNotEmpty()) {
                $trajet = $faker->randomElement($trajets_disponibles->toArray());
                
                // Vérifier qu'il n'y a pas déjà une réservation
                $reservation_existante = Reservation::where('trajet_id', $trajet['id'])
                    ->where('voyageur_id', $voyageur->id)
                    ->exists();
                    
                if (!$reservation_existante) {
                    Reservation::create([
                        'trajet_id' => $trajet['id'],
                        'voyageur_id' => $voyageur->id,
                        'nombre_places' => $faker->numberBetween(1, min(2, $trajet['places_disponibles'])),
                        'statut' => $faker->randomElement(['en_attente', 'confirmee']),
                        'message' => $faker->optional(0.7)->sentence(6),
                        'created_at' => $faker->dateTimeBetween('-1 month', 'now'),
                    ]);
                }
            }
        }
    }
}
