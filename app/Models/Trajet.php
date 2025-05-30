<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trajet extends Model
{
    use HasFactory;

    protected $fillable = [
        'conducteur_id',
        // 'vehicule_id', // Temporairement commenté car la colonne n'existe pas encore
        'ville_depart',
        'ville_arrivee',
        'date_depart',
        'heure_depart',
        'prix',
        'places_disponibles',
        'places_totales',
        'description',
        'statut',
    ];

    protected $casts = [
        'date_depart' => 'date',
        'prix' => 'decimal:2',
        'places_disponibles' => 'integer',
        'places_totales' => 'integer',
    ];

    /**
     * Relation: Conducteur du trajet
     */
    public function conducteur()
    {
        return $this->belongsTo(User::class, 'conducteur_id');
    }

    /**
     * Relation: Véhicule utilisé (temporairement désactivée)
     */
    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class, 'vehicule_id');
    }

    /**
     * Accesseur pour obtenir le véhicule du conducteur
     */
    public function getVehiculeAttribute()
    {
        if ($this->conducteur && $this->conducteur->vehicules) {
            return $this->conducteur->vehicules->first();
        }
        return null;
    }

    /**
     * Relation: Réservations pour ce trajet
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Relation: Voyageurs ayant réservé ce trajet
     */
    public function voyageurs()
    {
        return $this->belongsToMany(User::class, 'reservations', 'trajet_id', 'voyageur_id')
                    ->withPivot('nombre_places', 'statut', 'message')
                    ->withTimestamps();
    }
}
