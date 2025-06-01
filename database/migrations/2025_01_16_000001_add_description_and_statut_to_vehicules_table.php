<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vehicules', function (Blueprint $table) {
            // Ajouter la colonne description
            $table->text('description')->nullable()->after('nombre_places');
            
            // Ajouter la colonne statut (alias pour statut_verification)
            $table->enum('statut', ['en_attente', 'verifie', 'refuse'])->default('en_attente')->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicules', function (Blueprint $table) {
            $table->dropColumn(['description', 'statut']);
        });
    }
};
