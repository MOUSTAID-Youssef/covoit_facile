import React, { useState } from 'react';

const LoginTest = () => {
  const [email, setEmail] = useState('admin@covoitfacile.ma');
  const [password, setPassword] = useState('password');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Erreur de connexion: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testAccounts = [
    { email: 'admin@covoitfacile.ma', role: 'admin' },
    { email: 'ahmed@conducteur.com', role: 'conducteur' },
    { email: 'mehdi@voyageur.com', role: 'voyageur' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test de Connexion</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Test en cours...' : 'Tester la connexion'}
          </button>
        </div>

        {/* Comptes de test */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Comptes de test :</h3>
          <div className="space-y-2">
            {testAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => {
                  setEmail(account.email);
                  setPassword('password');
                }}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm transition-colors"
              >
                <div className="font-medium">{account.email}</div>
                <div className="text-gray-500 text-xs">{account.role} - password</div>
              </button>
            ))}
          </div>
        </div>

        {/* Résultat */}
        {result && (
          <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Succès' : '❌ Échec'}
            </h3>
            <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message}
            </p>
            
            {result.user && (
              <div className="mt-2 text-sm text-green-700">
                <p><strong>Utilisateur :</strong> {result.user.prenom} {result.user.nom}</p>
                <p><strong>Rôle :</strong> {result.user.role}</p>
                <p><strong>Token :</strong> {result.token?.substring(0, 20)}...</p>
              </div>
            )}
            
            {result.password_hash && (
              <div className="mt-2 text-sm text-red-700">
                <p><strong>Hash trouvé :</strong> {result.password_hash}</p>
              </div>
            )}
            
            {result.email_searched && (
              <div className="mt-2 text-sm text-red-700">
                <p><strong>Email recherché :</strong> {result.email_searched}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginTest;
