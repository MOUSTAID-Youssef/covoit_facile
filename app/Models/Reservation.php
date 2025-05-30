<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'trajet_id',
        'voyageur_id',
        'nombre_places',
        'statut',
        'message',
    ];

    protected $casts = [
        'nombre_places' => 'integer',
    ];

    /**
     * Relation: Trajet réservé
     */
    public function trajet()
    {
        return $this->belongsTo(Trajet::class);
    }

    /**
     * Relation: Voyageur qui a fait la réservation
     */
    public function voyageur()
    {
        return $this->belongsTo(User::class, 'voyageur_id');
    }
}
