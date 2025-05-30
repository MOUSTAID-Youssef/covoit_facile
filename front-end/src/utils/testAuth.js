// Script de test pour l'authentification
import authService from '../services/authService';

export const testLogin = async () => {
  console.log('🧪 Test de connexion...');
  
  const testAccounts = [
    { email: 'admin@covoitfacile.ma', password: 'password', role: 'admin' },
    { email: 'test@admin.com', password: 'password', role: 'admin' },
    { email: 'test@conducteur.com', password: 'password', role: 'conducteur' },
    { email: 'test@voyageur.com', password: 'password', role: 'voyageur' }
  ];

  for (const account of testAccounts) {
    console.log(`\n📧 Test avec ${account.email}...`);
    
    try {
      const result = await authService.login({
        email: account.email,
        password: account.password
      });

      if (result.success) {
        console.log(`✅ Connexion réussie pour ${account.email}`);
        console.log(`👤 Utilisateur:`, result.user);
        console.log(`🔑 Token:`, result.token ? 'Présent' : 'Absent');
        
        // Test de déconnexion
        await authService.logout();
        console.log(`🚪 Déconnexion réussie`);
      } else {
        console.log(`❌ Échec de connexion pour ${account.email}`);
        console.log(`📝 Message:`, result.message);
        console.log(`🔍 Erreurs:`, result.errors);
      }
    } catch (error) {
      console.log(`💥 Erreur pour ${account.email}:`, error.message);
    }
  }
};

export const testRegister = async () => {
  console.log('\n🧪 Test d\'inscription...');
  
  const testUser = {
    prenom: 'Test',
    nom: 'Inscription',
    email: `test.inscription.${Date.now()}@example.com`,
    password: 'password123',
    password_confirmation: 'password123',
    role: 'voyageur',
    genre: 'homme',
    date_naissance: '1990-01-01'
  };

  try {
    const result = await authService.register(testUser);

    if (result.success) {
      console.log(`✅ Inscription réussie pour ${testUser.email}`);
      console.log(`👤 Utilisateur:`, result.user);
      console.log(`🔑 Token:`, result.token ? 'Présent' : 'Absent');
      
      // Test de déconnexion
      await authService.logout();
      console.log(`🚪 Déconnexion réussie`);
    } else {
      console.log(`❌ Échec d'inscription pour ${testUser.email}`);
      console.log(`📝 Message:`, result.message);
      console.log(`🔍 Erreurs:`, result.errors);
    }
  } catch (error) {
    console.log(`💥 Erreur d'inscription:`, error.message);
  }
};

// Fonction pour tester depuis la console du navigateur
window.testAuth = {
  login: testLogin,
  register: testRegister,
  both: async () => {
    await testLogin();
    await testRegister();
  }
};
