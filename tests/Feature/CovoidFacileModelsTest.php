<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Trip;
use App\Models\Booking;
use Illuminate\Support\Facades\Hash;

class CovoidFacileModelsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user creation and relationships
     */
    public function test_user_creation_and_relationships()
    {
        // Créer un conducteur
        $driver = User::create([
            'prenom' => 'Test',
            'nom' => 'Driver',
            'email' => 'driver@test.com',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'conducteur',
            'genre' => 'homme',
            'date_naissance' => '1990-01-01',
            'badge_verifie' => true,
            'date_inscription' => now(),
        ]);

        // Créer un voyageur
        $passenger = User::create([
            'prenom' => 'Test',
            'nom' => 'Passenger',
            'email' => 'passenger@test.com',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'voyageur',
            'genre' => 'femme',
            'date_naissance' => '1995-01-01',
            'badge_verifie' => false,
            'date_inscription' => now(),
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'driver@test.com',
            'role' => 'conducteur'
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'passenger@test.com',
            'role' => 'voyageur'
        ]);
    }

    /**
     * Test trip creation and relationships
     */
    public function test_trip_creation_and_relationships()
    {
        // Créer un conducteur
        $driver = User::create([
            'prenom' => 'Test',
            'nom' => 'Driver',
            'email' => 'driver@test.com',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'conducteur',
            'genre' => 'homme',
            'date_naissance' => '1990-01-01',
            'badge_verifie' => true,
            'date_inscription' => now(),
        ]);

        // Créer un trajet
        $trip = Trip::create([
            'driver_id' => $driver->id,
            'depart' => 'Casablanca',
            'destination' => 'Rabat',
            'date_depart' => now()->addDay(),
            'prix' => 50.0,
            'nb_places' => 4,
        ]);

        $this->assertDatabaseHas('trips', [
            'driver_id' => $driver->id,
            'depart' => 'Casablanca',
            'destination' => 'Rabat'
        ]);

        // Tester la relation
        $this->assertEquals($driver->id, $trip->driver->id);
        $this->assertEquals(1, $driver->tripsAsDriver->count());
    }

    /**
     * Test booking creation and relationships
     */
    public function test_booking_creation_and_relationships()
    {
        // Créer un conducteur
        $driver = User::create([
            'prenom' => 'Test',
            'nom' => 'Driver',
            'email' => 'driver@test.com',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'conducteur',
            'genre' => 'homme',
            'date_naissance' => '1990-01-01',
            'badge_verifie' => true,
            'date_inscription' => now(),
        ]);

        // Créer un voyageur
        $passenger = User::create([
            'prenom' => 'Test',
            'nom' => 'Passenger',
            'email' => 'passenger@test.com',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'voyageur',
            'genre' => 'femme',
            'date_naissance' => '1995-01-01',
            'badge_verifie' => false,
            'date_inscription' => now(),
        ]);

        // Créer un trajet
        $trip = Trip::create([
            'driver_id' => $driver->id,
            'depart' => 'Casablanca',
            'destination' => 'Rabat',
            'date_depart' => now()->addDay(),
            'prix' => 50.0,
            'nb_places' => 4,
        ]);

        // Créer une réservation
        $booking = Booking::create([
            'trip_id' => $trip->id,
            'voyageur_id' => $passenger->id,
            'nb_places_reservees' => 2,
            'statut' => 'confirme',
        ]);

        $this->assertDatabaseHas('bookings', [
            'trip_id' => $trip->id,
            'voyageur_id' => $passenger->id,
            'statut' => 'confirme'
        ]);

        // Tester les relations
        $this->assertEquals($trip->id, $booking->trip->id);
        $this->assertEquals($passenger->id, $booking->voyageur->id);
        $this->assertEquals(1, $trip->bookings->count());
        $this->assertEquals(1, $passenger->bookings->count());
    }

    /**
     * Test trip available places calculation
     */
    public function test_trip_available_places()
    {
        // Créer un conducteur
        $driver = User::create([
            'prenom' => 'Test',
            'nom' => 'Driver',
            'email' => 'driver@test.com',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'conducteur',
            'genre' => 'homme',
            'date_naissance' => '1990-01-01',
            'badge_verifie' => true,
            'date_inscription' => now(),
        ]);

        // Créer un trajet avec 4 places
        $trip = Trip::create([
            'driver_id' => $driver->id,
            'depart' => 'Casablanca',
            'destination' => 'Rabat',
            'date_depart' => now()->addDay(),
            'prix' => 50.0,
            'nb_places' => 4,
        ]);

        // Initialement, toutes les places sont disponibles
        $this->assertEquals(4, $trip->available_places);
        $this->assertTrue($trip->hasAvailablePlaces(2));

        // Créer des voyageurs et des réservations
        $passenger1 = User::create([
            'prenom' => 'Passenger',
            'nom' => 'One',
            'email' => 'passenger1@test.com',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'voyageur',
            'genre' => 'homme',
            'date_naissance' => '1995-01-01',
            'badge_verifie' => false,
            'date_inscription' => now(),
        ]);

        $passenger2 = User::create([
            'prenom' => 'Passenger',
            'nom' => 'Two',
            'email' => 'passenger2@test.com',
            'mot_de_passe' => Hash::make('password'),
            'role' => 'voyageur',
            'genre' => 'femme',
            'date_naissance' => '1995-01-01',
            'badge_verifie' => false,
            'date_inscription' => now(),
        ]);

        // Réservation confirmée de 2 places
        Booking::create([
            'trip_id' => $trip->id,
            'voyageur_id' => $passenger1->id,
            'nb_places_reservees' => 2,
            'statut' => 'confirme',
        ]);

        // Réservation annulée (ne doit pas compter)
        Booking::create([
            'trip_id' => $trip->id,
            'voyageur_id' => $passenger2->id,
            'nb_places_reservees' => 1,
            'statut' => 'annule',
        ]);

        // Recharger le trip pour recalculer
        $trip->refresh();

        // Il devrait rester 2 places (4 - 2 confirmées)
        $this->assertEquals(2, $trip->available_places);
        $this->assertTrue($trip->hasAvailablePlaces(1));
        $this->assertTrue($trip->hasAvailablePlaces(2));
        $this->assertFalse($trip->hasAvailablePlaces(3));
    }
}
