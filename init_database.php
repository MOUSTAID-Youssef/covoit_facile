<?php

// Script d'initialisation directe de la base de données
require_once 'vendor/autoload.php';

// Configuration de base de données
$host = 'localhost';
$dbname = 'covoit_facile';
$username = 'root';
$password = '';

try {
    echo "🔄 Connexion à la base de données...\n";
    $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Créer la base de données si elle n'existe pas
    echo "🔄 Création de la base de données...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$dbname`");
    
    // Supprimer les tables existantes
    echo "🔄 Suppression des tables existantes...\n";
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $pdo->exec("DROP TABLE IF EXISTS reservations");
    $pdo->exec("DROP TABLE IF EXISTS trajets");
    $pdo->exec("DROP TABLE IF EXISTS vehicules");
    $pdo->exec("DROP TABLE IF EXISTS bookings");
    $pdo->exec("DROP TABLE IF EXISTS trips");
    $pdo->exec("DROP TABLE IF EXISTS users");
    $pdo->exec("DROP TABLE IF EXISTS password_resets");
    $pdo->exec("DROP TABLE IF EXISTS failed_jobs");
    $pdo->exec("DROP TABLE IF EXISTS personal_access_tokens");
    $pdo->exec("DROP TABLE IF EXISTS migrations");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    
    // Créer la table users
    echo "🔄 Création de la table users...\n";
    $pdo->exec("
        CREATE TABLE users (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            prenom VARCHAR(255) NOT NULL,
            nom VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            telephone VARCHAR(20) NULL,
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
    
    // Créer la table personal_access_tokens pour Sanctum
    echo "🔄 Création de la table personal_access_tokens...\n";
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
    
    // Insérer les utilisateurs de test
    echo "🔄 Insertion des utilisateurs...\n";
    
    $hashedPassword = password_hash('password', PASSWORD_DEFAULT);
    
    // Admin principal
    $pdo->prepare("
        INSERT INTO users (prenom, nom, email, telephone, password, role, genre, date_naissance, badge_verifie, email_verified_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ")->execute([
        'Admin',
        'CovoitFacile',
        'admin@covoitfacile.ma',
        '+212 6 12 34 56 78',
        $hashedPassword,
        'admin',
        'homme',
        '1985-01-01',
        1
    ]);
    
    // Comptes de test
    $testAccounts = [
        ['Test', 'Admin', 'test@admin.com', '+212 6 11 22 33 44', 'admin', 'homme'],
        ['Test', 'Conducteur', 'test@conducteur.com', '+212 6 55 66 77 88', 'conducteur', 'homme'],
        ['Test', 'Voyageur', 'test@voyageur.com', '+212 6 99 00 11 22', 'voyageur', 'femme'],
        ['Ahmed', 'Benali', 'ahmed@test.com', '+212 6 33 44 55 66', 'conducteur', 'homme'],
        ['Fatima', 'Zahra', 'fatima@test.com', '+212 6 77 88 99 00', 'voyageur', 'femme'],
        ['Omar', 'Tazi', 'omar@test.com', '+212 6 11 33 55 77', 'conducteur', 'homme'],
        ['Aicha', 'Alami', 'aicha@test.com', '+212 6 22 44 66 88', 'voyageur', 'femme'],
        ['Youssef', 'Idrissi', 'youssef@test.com', '+212 6 99 11 33 55', 'conducteur', 'homme'],
    ];
    
    $stmt = $pdo->prepare("
        INSERT INTO users (prenom, nom, email, telephone, password, role, genre, date_naissance, badge_verifie, email_verified_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    foreach ($testAccounts as $account) {
        $stmt->execute([
            $account[0], // prenom
            $account[1], // nom
            $account[2], // email
            $account[3], // telephone
            $hashedPassword,
            $account[4], // role
            $account[5], // genre
            '1990-01-01',
            1
        ]);
    }
    
    // Vérifier les utilisateurs créés
    $count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    
    echo "\n✅ Base de données initialisée avec succès !\n";
    echo "📊 $count utilisateurs créés\n\n";
    echo "🔑 Comptes de test disponibles :\n";
    echo "   Admin: admin@covoitfacile.ma / password\n";
    echo "   Test Admin: test@admin.com / password\n";
    echo "   Test Conducteur: test@conducteur.com / password\n";
    echo "   Test Voyageur: test@voyageur.com / password\n";
    echo "   Ahmed: ahmed@test.com / password\n";
    echo "   Fatima: fatima@test.com / password\n";
    echo "   Omar: omar@test.com / password\n";
    echo "   Aicha: aicha@test.com / password\n";
    echo "   Youssef: youssef@test.com / password\n\n";
    echo "🚀 Vous pouvez maintenant tester l'authentification !\n";
    
} catch (PDOException $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    exit(1);
}
?>
