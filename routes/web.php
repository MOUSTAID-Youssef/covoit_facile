<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Route temporaire pour initialiser la base de données (SUPPRIMER EN PRODUCTION)
Route::get('/setup-db', function () {
    try {
        // Configuration de base de données
        $host = env('DB_HOST', 'localhost');
        $dbname = env('DB_DATABASE', 'covoit_facile');
        $username = env('DB_USERNAME', 'root');
        $password = env('DB_PASSWORD', '');

        $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Créer la base de données
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `$dbname`");

        // Supprimer les tables existantes
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
        $tables = ['reservations', 'trajets', 'vehicules', 'bookings', 'trips', 'users', 'password_resets', 'failed_jobs', 'personal_access_tokens', 'migrations'];
        foreach ($tables as $table) {
            $pdo->exec("DROP TABLE IF EXISTS $table");
        }
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

        // Créer la table users
        $pdo->exec("
            CREATE TABLE users (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                prenom VARCHAR(255) NOT NULL,
                nom VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                email_verified_at TIMESTAMP NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('voyageur', 'conducteur', 'admin') DEFAULT 'voyageur',
                genre ENUM('homme', 'femme') NULL,
                date_naissance DATE NULL,
                photo_profil VARCHAR(255) NULL,
                cin_path VARCHAR(255) NULL,
                badge_verifie BOOLEAN DEFAULT FALSE,
                remember_token VARCHAR(100) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");

        // Créer la table personal_access_tokens
        $pdo->exec("
            CREATE TABLE personal_access_tokens (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                tokenable_type VARCHAR(255) NOT NULL,
                tokenable_id BIGINT UNSIGNED NOT NULL,
                name VARCHAR(255) NOT NULL,
                token VARCHAR(64) UNIQUE NOT NULL,
                abilities TEXT NULL,
                last_used_at TIMESTAMP NULL,
                expires_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type, tokenable_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");

        // Insérer les utilisateurs
        $hashedPassword = \Illuminate\Support\Facades\Hash::make('password');

        $users = [
            ['Admin', 'CovoitFacile', 'admin@covoitfacile.ma', 'admin', 'homme'],
            ['Test', 'Admin', 'test@admin.com', 'admin', 'homme'],
            ['Test', 'Conducteur', 'test@conducteur.com', 'conducteur', 'homme'],
            ['Test', 'Voyageur', 'test@voyageur.com', 'voyageur', 'femme'],
            ['Ahmed', 'Benali', 'ahmed@test.com', 'conducteur', 'homme'],
            ['Fatima', 'Zahra', 'fatima@test.com', 'voyageur', 'femme'],
        ];

        $stmt = $pdo->prepare("
            INSERT INTO users (prenom, nom, email, password, role, genre, date_naissance, badge_verifie, email_verified_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");

        foreach ($users as $user) {
            $stmt->execute([
                $user[0], $user[1], $user[2], $hashedPassword, $user[3], $user[4], '1990-01-01', 1
            ]);
        }

        $count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();

        return response()->json([
            'success' => true,
            'message' => 'Base de données initialisée avec succès !',
            'users_created' => $count,
            'accounts' => [
                'admin@covoitfacile.ma' => 'password',
                'test@admin.com' => 'password',
                'test@conducteur.com' => 'password',
                'test@voyageur.com' => 'password',
                'ahmed@test.com' => 'password',
                'fatima@test.com' => 'password'
            ]
        ]);

    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur: ' . $e->getMessage()
        ]);
    }
});

// Route pour vérifier la base de données
Route::get('/check-db', function () {
    try {
        $userCount = \App\Models\User::count();
        $users = \App\Models\User::select('id', 'prenom', 'nom', 'email', 'role', 'password')->get();

        // Vérifier la structure de la table
        $tableStructure = \Illuminate\Support\Facades\DB::select("DESCRIBE users");

        return response()->json([
            'success' => true,
            'message' => 'Base de données vérifiée',
            'user_count' => $userCount,
            'users' => $users,
            'table_structure' => $tableStructure,
            'test_accounts' => [
                'admin@covoitfacile.ma' => 'password (admin)',
                'test@admin.com' => 'password (admin)',
                'test@conducteur.com' => 'password (conducteur)',
                'test@voyageur.com' => 'password (voyageur)',
            ]
        ]);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur: ' . $e->getMessage()
        ]);
    }
});

// Route pour tester la connexion directement
Route::post('/test-login', function (\Illuminate\Http\Request $request) {
    try {
        $email = $request->input('email');
        $password = $request->input('password');

        // Chercher l'utilisateur
        $user = \App\Models\User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
                'email_searched' => $email
            ]);
        }

        // Vérifier le mot de passe
        $passwordCheck = \Illuminate\Support\Facades\Hash::check($password, $user->password);

        if (!$passwordCheck) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe incorrect',
                'user_found' => true,
                'password_hash' => substr($user->password, 0, 20) . '...'
            ]);
        }

        // Créer un token
        $token = $user->createToken('test_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user->id,
                'prenom' => $user->prenom,
                'nom' => $user->nom,
                'email' => $user->email,
                'role' => $user->role
            ],
            'token' => $token,
            'token_type' => 'Bearer'
        ]);

    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur: ' . $e->getMessage()
        ]);
    }
});

// Route pour initialiser les données complètes
Route::get('/init-full-data', function () {
    try {
        // Exécuter les migrations
        \Illuminate\Support\Facades\Artisan::call('migrate:fresh');

        // Exécuter tous les seeders
        \Illuminate\Support\Facades\Artisan::call('db:seed');

        return response()->json([
            'success' => true,
            'message' => 'Base de données complètement initialisée !',
            'data' => [
                'users' => \App\Models\User::count(),
                'trajets' => \App\Models\Trajet::count(),
                'vehicules' => \App\Models\Vehicule::count(),
                'reservations' => \App\Models\Reservation::count(),
            ]
        ]);
    } catch (Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur: ' . $e->getMessage()
        ]);
    }
});

// Route pour servir les images avec les bons headers
Route::get('/image/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);

    if (!file_exists($fullPath)) {
        abort(404);
    }

    $file = file_get_contents($fullPath);
    $type = mime_content_type($fullPath);

    return response($file, 200)
        ->header('Content-Type', $type)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Cache-Control', 'public, max-age=31536000');
});

// Route pour servir les documents d'identité (protégée)
Route::middleware(['auth:sanctum'])->get('/document/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);

    if (!file_exists($fullPath)) {
        abort(404);
    }

    // Vérifier que l'utilisateur peut accéder à ce document
    $user = auth()->user();
    if (!$user || (!$user->cin_path || !str_contains($path, (string)$user->id))) {
        abort(403, 'Accès non autorisé');
    }

    $file = file_get_contents($fullPath);
    $type = mime_content_type($fullPath);

    return response($file, 200)
        ->header('Content-Type', $type)
        ->header('Access-Control-Allow-Origin', '*');
})->where('path', '.*');

// Route de debug pour les trajets
Route::get('/debug-trips', function () {
    try {
        $trajets = \App\Models\Trajet::with(['conducteur', 'vehicule'])->get();

        $tripData = [];
        foreach ($trajets as $trajet) {
            $tripData[] = [
                'id' => $trajet->id,
                'ville_depart' => $trajet->ville_depart,
                'ville_arrivee' => $trajet->ville_arrivee,
                'date_depart' => $trajet->date_depart,
                'heure_depart' => $trajet->heure_depart,
                'prix' => $trajet->prix,
                'places_disponibles' => $trajet->places_disponibles,
                'statut' => $trajet->statut,
                'conducteur' => $trajet->conducteur ? [
                    'id' => $trajet->conducteur->id,
                    'prenom' => $trajet->conducteur->prenom,
                    'nom' => $trajet->conducteur->nom,
                    'email' => $trajet->conducteur->email,
                ] : null,
                'vehicule' => $trajet->vehicule ? [
                    'marque' => $trajet->vehicule->marque,
                    'modele' => $trajet->vehicule->modele,
                ] : null,
            ];
        }

        return response()->json([
            'success' => true,
            'total_trajets' => $trajets->count(),
            'trajets_actifs' => $trajets->where('statut', 'actif')->count(),
            'trajets_futurs' => $trajets->where('date_depart', '>=', now()->format('Y-m-d'))->count(),
            'trajets' => $tripData,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }
});

// Route de debug pour les images
Route::get('/debug-images', function () {
    $users = \App\Models\User::whereNotNull('photo_profil')->get();

    $imageData = [];
    foreach ($users as $user) {
        $imageData[] = [
            'user_id' => $user->id,
            'email' => $user->email,
            'photo_profil' => $user->photo_profil,
            'photo_url_computed' => $user->photo_profil ? asset('storage/' . $user->photo_profil) : null,
            'file_exists' => $user->photo_profil ? file_exists(public_path('storage/' . $user->photo_profil)) : false,
            'full_path' => $user->photo_profil ? public_path('storage/' . $user->photo_profil) : null,
        ];
    }

    return response()->json([
        'success' => true,
        'storage_path' => storage_path('app/public'),
        'public_storage_path' => public_path('storage'),
        'storage_link_exists' => is_link(public_path('storage')),
        'users_with_photos' => $imageData,
        'all_files_in_storage' => glob(public_path('storage/profiles/*')),
    ]);
});

require __DIR__.'/auth.php';
