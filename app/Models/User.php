<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'prenom',
        'nom',
        'email',
        'email_verified_at',
        'password',
        'role',
        'genre',
        'date_naissance',
        'photo_profil',
        'cin_path',
        'badge_verifie',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_naissance' => 'date',
        'badge_verifie' => 'boolean',
    ];

    /**
     * Automatically hash password when setting it.
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    /**
     * Get the photo URL attribute.
     */
    public function getPhotoUrlAttribute()
    {
        if ($this->photo_profil) {
            // Essayer d'abord le lien symbolique standard
            $standardPath = asset('storage/' . $this->photo_profil);

            // Si le fichier existe via le lien symbolique, l'utiliser
            if (file_exists(public_path('storage/' . $this->photo_profil))) {
                return $standardPath;
            }

            // Sinon, utiliser notre route personnalisée
            return url('/image/' . $this->photo_profil);
        }
        return asset('images/default-avatar.svg');
    }

    /**
     * Get the identity document URL attribute.
     */
    public function getIdentityDocumentUrlAttribute()
    {
        if ($this->cin_path) {
            // Essayer d'abord le lien symbolique standard
            $standardPath = asset('storage/' . $this->cin_path);

            // Si le fichier existe via le lien symbolique, l'utiliser
            if (file_exists(public_path('storage/' . $this->cin_path))) {
                return $standardPath;
            }

            // Sinon, utiliser notre route personnalisée
            return url('/document/' . $this->cin_path);
        }
        return null;
    }


    /**
     * Relation: Véhicules appartenant à cet utilisateur
     */
    public function vehicules()
    {
        return $this->hasMany(Vehicule::class);
    }

    /**
     * Relation: Trajets où l'utilisateur est conducteur
     */
    public function trajetsAsConducteur()
    {
        return $this->hasMany(Trajet::class, 'conducteur_id');
    }

    /**
     * Relation: Réservations faites par cet utilisateur en tant que voyageur
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'voyageur_id');
    }

    /**
     * Relation: Trajets où l'utilisateur est voyageur (via réservations)
     */
    public function trajetsAsVoyageur()
    {
        return $this->belongsToMany(Trajet::class, 'reservations', 'voyageur_id', 'trajet_id')
                    ->withPivot('nombre_places', 'statut', 'message')
                    ->withTimestamps();
    }


}
