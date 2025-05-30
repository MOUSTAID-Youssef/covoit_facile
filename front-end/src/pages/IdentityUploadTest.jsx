import React, { useState } from 'react';
import { FaUpload, FaSpinner, FaCheck, FaTimes, FaIdCard } from 'react-icons/fa';
import userService from '../services/userService';

const IdentityUploadTest = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Format non supporté. Utilisez PDF, JPG ou PNG.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Fichier trop volumineux. Maximum 5MB.');
        return;
      }

      setSelectedFile(file);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      console.log('📄 Test upload document:', selectedFile.name);
      
      const response = await userService.uploadIdentityDocument(selectedFile);
      
      console.log('📤 Réponse upload:', response);
      
      if (response.success) {
        setResult({
          success: true,
          message: response.message,
          data: response.data
        });
        setSelectedFile(null);
        document.getElementById('file-input').value = '';
      } else {
        setError(response.message || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('💥 Erreur upload:', error);
      setError('Erreur lors de l\'upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaIdCard className="mr-3 text-indigo-600" />
          Test Upload Pièce d'Identité
        </h1>

        {/* Sélection de fichier */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un document
          </label>
          <input
            id="file-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="mt-1 text-sm text-gray-500">
            PDF, JPG, PNG - Maximum 5MB
          </p>
        </div>

        {/* Informations du fichier sélectionné */}
        {selectedFile && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Fichier sélectionné:</h3>
            <p className="text-sm text-blue-700">Nom: {selectedFile.name}</p>
            <p className="text-sm text-blue-700">Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className="text-sm text-blue-700">Type: {selectedFile.type}</p>
          </div>
        )}

        {/* Bouton d'upload */}
        <div className="mb-6">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Upload en cours...
              </>
            ) : (
              <>
                <FaUpload className="mr-2" />
                Télécharger le document
              </>
            )}
          </button>
        </div>

        {/* Résultats */}
        {result && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center mb-2">
              <FaCheck className="text-green-600 mr-2" />
              <h3 className="text-sm font-medium text-green-900">Succès!</h3>
            </div>
            <p className="text-sm text-green-700 mb-2">{result.message}</p>
            {result.data && (
              <div className="text-xs text-green-600">
                <p>Données retournées:</p>
                <pre className="mt-1 bg-green-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Erreurs */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center mb-2">
              <FaTimes className="text-red-600 mr-2" />
              <h3 className="text-sm font-medium text-red-900">Erreur</h3>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h3>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1. Sélectionnez un fichier PDF, JPG ou PNG (max 5MB)</li>
            <li>2. Cliquez sur "Télécharger le document"</li>
            <li>3. Observez les résultats et les logs dans la console</li>
            <li>4. Le document sera stocké dans le champ `cin_path` de l'utilisateur</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default IdentityUploadTest;
