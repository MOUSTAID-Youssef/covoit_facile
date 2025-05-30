import React, { useState } from 'react';
import { FaCamera, FaCheck, FaSpinner, FaTimes } from 'react-icons/fa';
import userService from '../services/userService';

const UploadTest = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('🔍 Test Upload - Fichier sélectionné:', file);
    
    if (file) {
      // Validation du fichier
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setErrors({ photo: 'Format non supporté. Utilisez JPG ou PNG.' });
        console.log('❌ Format non supporté:', file.type);
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB
        setErrors({ photo: 'Fichier trop volumineux. Maximum 2MB.' });
        console.log('❌ Fichier trop volumineux:', file.size);
        return;
      }

      console.log('✅ Fichier valide, mise à jour de selectedFile');
      setSelectedFile(file);
      setErrors({});

      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('🖼️ Prévisualisation mise à jour');
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('❌ Aucun fichier sélectionné');
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log('❌ Aucun fichier à uploader');
      return;
    }

    console.log('🚀 Début de l\'upload:', selectedFile.name);
    setUploading(true);
    setResult(null);
    setErrors({});

    try {
      const uploadResult = await userService.uploadPhoto(selectedFile);
      console.log('📤 Résultat de l\'upload:', uploadResult);
      
      setResult(uploadResult);
      
      if (uploadResult.success) {
        setSelectedFile(null);
        setPreview(null);
        document.getElementById('test-photo-upload').value = '';
      } else {
        setErrors({ photo: uploadResult.message || 'Erreur lors de l\'upload' });
      }
    } catch (error) {
      console.error('💥 Erreur lors de l\'upload:', error);
      setErrors({ photo: 'Erreur lors de l\'upload de la photo' });
      setResult({
        success: false,
        message: 'Erreur: ' + error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setErrors({});
    document.getElementById('test-photo-upload').value = '';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Upload Photo</h1>
        
        {/* Zone d'upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors mb-6">
          <FaCamera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Test Upload Photo</h4>
          <p className="text-sm text-gray-500 mb-4">JPG, PNG - Maximum 2MB</p>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="hidden"
            id="test-photo-upload"
          />

          <div className="space-y-3">
            <label
              htmlFor="test-photo-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <FaCamera className="mr-2" />
              Choisir une photo
            </label>

            {/* Prévisualisation */}
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Prévisualisation"
                  className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-gray-200"
                />
              </div>
            )}

            {/* Informations du fichier */}
            {selectedFile && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center justify-center mb-3">
                  <FaCheck className="text-green-600 mr-2" />
                  <p className="text-sm font-medium text-green-800">Fichier sélectionné</p>
                </div>
                <p className="text-sm text-green-700 mb-2 font-medium">{selectedFile.name}</p>
                <p className="text-xs text-green-600 mb-4">
                  Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-xs text-green-600 mb-4">
                  Type: {selectedFile.type}
                </p>
                
                <div className="flex space-x-2 justify-center">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Upload en cours...
                      </>
                    ) : (
                      <>
                        <FaCamera className="mr-2" />
                        Uploader la photo
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetForm}
                    disabled={uploading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <FaTimes className="mr-2" />
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Erreurs */}
          {errors.photo && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 font-medium">{errors.photo}</p>
            </div>
          )}
        </div>

        {/* Résultat */}
        {result && (
          <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✅ Upload réussi' : '❌ Upload échoué'}
            </h3>
            <p className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message}
            </p>
            
            {result.success && result.photo_url && (
              <div className="mt-3">
                <p className="text-sm text-green-700 mb-2">Photo uploadée :</p>
                <img
                  src={result.photo_url}
                  alt="Photo uploadée"
                  className="w-24 h-24 object-cover rounded-lg border-2 border-green-200"
                />
              </div>
            )}
          </div>
        )}

        {/* Debug info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Debug Info:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>selectedFile: {selectedFile ? `✅ ${selectedFile.name}` : '❌ null'}</p>
            <p>preview: {preview ? '✅ Défini' : '❌ null'}</p>
            <p>uploading: {uploading ? '✅ true' : '❌ false'}</p>
            <p>errors: {Object.keys(errors).length > 0 ? `❌ ${JSON.stringify(errors)}` : '✅ Aucune'}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/profile"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ← Retour au profil
          </a>
        </div>
      </div>
    </div>
  );
};

export default UploadTest;
