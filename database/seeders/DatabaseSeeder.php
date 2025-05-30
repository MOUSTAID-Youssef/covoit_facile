<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Utiliser le seeder complet (sans Hash::make car le mutateur s'en charge)
        $this->call([
            CompleteSeeder::class,
        ]);

        // Seeders complets (commentés pour éviter les erreurs)
        // $this->call([
        //     UserSeeder::class,
        //     VehiculeSeeder::class,
        //     TrajetSeeder::class,
        //     ReservationSeeder::class,
        // ]);
    }
}
