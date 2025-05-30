<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('document_identite')->nullable()->after('cin_path');
            $table->enum('statut_verification_identite', ['en_attente', 'verifie', 'rejete'])->default('en_attente')->after('document_identite');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['document_identite', 'statut_verification_identite']);
        });
    }
};
