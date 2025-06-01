<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'marque',
        'modele',
        'annee',
        'couleur',
        'nombre_places',
        'description',
        'statut',
        'climatisation',
        'statut_verification',
        'commentaire_verification',
    ];

    protected $casts = [
        'climatisation' => 'boolean',
        'annee' => 'integer',
        'nombre_places' => 'integer',
    ];

    /**
     * Relation: Propriétaire du véhicule
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation: Propriétaire du véhicule (alias)
     */
    public function proprietaire()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relation: Trajets utilisant ce véhicule
     */
    public function trajets()
    {
        return $this->hasMany(Trajet::class);
    }
}
