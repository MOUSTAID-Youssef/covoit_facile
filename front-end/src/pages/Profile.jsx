import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaCamera, FaIdCard, FaCheck, FaClock, FaSpinner, FaTrash, FaCar, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import DriverTripsManagement from '../components/DriverTripsManagement';
import PassengerReservations from '../components/PassengerReservations';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedIdentityFile, setSelectedIdentityFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingIdentity, setUploadingIdentity] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      console.log('🔄 Chargement du profil...');
      setLoading(true);
      setErrors({}); // Reset des erreurs

      const result = await userService.getProfile();
      console.log('📥 Résultat du chargement:', result);

      if (result.success) {
        console.log('✅ Profil chargé avec succès:', result.data);
        setUser(result.data);
        setPreview(result.data.photo_url);
      } else {
        console.error('❌ Erreur lors du chargement du profil:', result.message);
        setErrors({ general: result.message || 'Erreur lors du chargement du profil' });
      }
    } catch (error) {
      console.error('💥 Exception lors du chargement du profil:', error);
      setErrors({ general: 'Erreur de connexion lors du chargement du profil' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('📁 Fichier sélectionné:', file);

    if (file) {
      // Validation du fichier
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          photo: 'Format non supporté. Utilisez JPG ou PNG.'
        }));
        console.log('❌ Format non supporté:', file.type);
        return;
      }

      if (file.size > 2 * 1024 * 1024) { // 2MB
        setErrors(prev => ({
          ...prev,
          photo: 'Fichier trop volumineux. Maximum 2MB.'
        }));
        console.log('❌ Fichier trop volumineux:', file.size);
        return;
      }

      console.log('✅ Fichier valide, mise à jour de selectedFile');
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, photo: null }));

      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('🖼️ Prévisualisation mise à jour');
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('❌ Aucun fichier sélectionné');
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
      console.log('💾 Mise à jour du profil avec les données:', {
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        genre: user.genre,
        date_naissance: user.date_naissance
      });

      const result = await userService.updateProfile({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        genre: user.genre,
        date_naissance: user.date_naissance
      });

      if (result.success) {
        console.log('✅ Profil mis à jour avec succès:', result.data);
        setUser(result.data);
        updateUser(result.data);
        setIsEditing(false);
        setSuccessMessage('Profil mis à jour avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);

        // Recharger le profil pour s'assurer d'avoir les dernières données
        setTimeout(() => {
          loadProfile();
        }, 1000);
      } else {
        console.error('❌ Erreur lors de la mise à jour:', result);
        setErrors(result.errors || { general: result.message || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error('💥 Exception lors de la mise à jour:', error);
      setErrors({ general: 'Erreur lors de la mise à jour du profil' });
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setErrors(prev => ({ ...prev, photo: null }));

    try {
      const result = await userService.uploadPhoto(selectedFile);

      if (result.success) {
        setUser(result.data);
        updateUser(result.data);
        setSelectedFile(null);
        setPreview(result.data.photo_url);
        setSuccessMessage('Photo mise à jour avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors(prev => ({
          ...prev,
          photo: result.message || 'Erreur lors de l\'upload'
        }));
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setErrors(prev => ({
        ...prev,
        photo: 'Erreur lors de l\'upload de la photo'
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleIdentityFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          identity: 'Format non supporté. Utilisez PDF, JPG ou PNG.'
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors(prev => ({
          ...prev,
          identity: 'Fichier trop volumineux. Maximum 5MB.'
        }));
        return;
      }

      setSelectedIdentityFile(file);
      setErrors(prev => ({ ...prev, identity: null }));
    }
  };

  const handleIdentityUpload = async () => {
    if (!selectedIdentityFile) return;

    setUploadingIdentity(true);
    setErrors(prev => ({ ...prev, identity: null }));

    try {
      console.log('📄 Upload du document d\'identité:', selectedIdentityFile.name);

      const result = await userService.uploadIdentityDocument(selectedIdentityFile);

      if (result.success) {
        setSelectedIdentityFile(null);
        setSuccessMessage('Document d\'identité téléchargé avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
        // Recharger le profil pour obtenir les dernières informations
        loadProfile();
        // Réinitialiser le champ de fichier
        document.getElementById('identity-upload').value = '';
      } else {
        setErrors(prev => ({
          ...prev,
          identity: result.message || 'Erreur lors de l\'upload'
        }));
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setErrors(prev => ({
        ...prev,
        identity: 'Erreur lors de l\'upload du document'
      }));
    } finally {
      setUploadingIdentity(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      return;
    }

    setUploading(true);
    try {
      const result = await userService.deletePhoto();

      if (result.success) {
        setUser(result.data);
        updateUser(result.data);
        setPreview(result.data.photo_url);
        setSuccessMessage('Photo supprimée avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors(prev => ({
          ...prev,
          photo: result.message || 'Erreur lors de la suppression'
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setErrors(prev => ({
        ...prev,
        photo: 'Erreur lors de la suppression de la photo'
      }));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600">Impossible de charger les informations du profil.</p>
          <button
            onClick={loadProfile}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Messages de succès et d'erreur */}
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <img
                src={preview || user.photo_url || '/default-avatar.png'}
                alt="Photo de profil"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
              <div className="absolute bottom-0 right-0 flex space-x-1">
                <button
                  onClick={() => document.getElementById('photo-upload').click()}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                  disabled={uploading}
                >
                  {uploading ? (
                    <FaSpinner className="w-4 h-4 text-gray-600 animate-spin" />
                  ) : (
                    <FaCamera className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                {user.photo_profil && (
                  <button
                    onClick={handleDeletePhoto}
                    className="bg-red-500 rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors"
                    disabled={uploading}
                  >
                    <FaTrash className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>
            </div>
            <div className="text-white text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user.prenom} {user.nom}</h1>
              <p className="text-indigo-100 capitalize">{user.role}</p>
              <div className="flex justify-center sm:justify-start items-center mt-2">
                {user.badge_verifie ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FaCheck className="w-4 h-4 mr-1" />
                    Vérifié
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <FaClock className="w-4 h-4 mr-1" />
                    En attente
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-2xl font-semibold text-gray-900">Informations personnelles</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaEdit className="w-4 h-4 mr-2" />
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={user.prenom || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.prenom ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={user.nom || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.nom ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <select
                    name="genre"
                    value={user.genre || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="date_naissance"
                    value={user.date_naissance || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Prénom</label>
                  <p className="mt-1 text-lg text-gray-900">{user.prenom || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nom</label>
                  <p className="mt-1 text-lg text-gray-900">{user.nom || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-lg text-gray-900">{user.email || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Genre</label>
                  <p className="mt-1 text-lg text-gray-900 capitalize">{user.genre || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date de naissance</label>
                  <p className="mt-1 text-lg text-gray-900">
                    {user.date_naissance ? new Date(user.date_naissance).toLocaleDateString('fr-FR') : 'Non renseigné'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date d'inscription</label>
                  <p className="mt-1 text-lg text-gray-900">
                    {user.date_inscription ? new Date(user.date_inscription).toLocaleDateString('fr-FR') : 'Non renseigné'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Documents</h3>
            {/* Debug info - à supprimer en production */}
            <div className="text-xs text-gray-500">
              Debug: selectedFile = {selectedFile ? '✅ Défini' : '❌ Null'}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Photo Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <FaCamera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Photo de profil</h4>
              <p className="text-sm text-gray-500 mb-4">JPG, PNG - Maximum 2MB</p>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />

              <div className="space-y-3">
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <FaCamera className="mr-2" />
                  Choisir une photo
                </label>

                {selectedFile && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center justify-center mb-3">
                      <FaCheck className="text-green-600 mr-2" />
                      <p className="text-sm font-medium text-green-800">Fichier sélectionné</p>
                    </div>
                    <p className="text-sm text-green-700 mb-3 font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-green-600 mb-4">
                      Taille: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={handlePhotoUpload}
                        disabled={uploading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                      >
                        {uploading ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <FaCamera className="mr-2" />
                            Enregistrer la photo
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(user.photo_url);
                          document.getElementById('photo-upload').value = '';
                        }}
                        disabled={uploading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {errors.photo && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600 font-medium">{errors.photo}</p>
                </div>
              )}
            </div>

            {/* Identity Document Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <FaIdCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Pièce d'identité</h4>
              <p className="text-sm text-gray-500 mb-4">PDF, JPG, PNG - Maximum 5MB</p>

              {/* Statut du document */}
              {user.cin_path && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center justify-center mb-2">
                    <FaCheck className="text-green-600 mr-2" />
                    <p className="text-sm font-medium text-green-800">Document téléchargé</p>
                  </div>
                  <p className="text-xs text-green-600">
                    Votre document d'identité a été téléchargé avec succès
                  </p>
                </div>
              )}

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleIdentityFileChange}
                className="hidden"
                id="identity-upload"
              />

              <div className="space-y-3">
                <label
                  htmlFor="identity-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <FaIdCard className="mr-2" />
                  Choisir un document
                </label>

                {selectedIdentityFile && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center justify-center mb-3">
                      <FaCheck className="text-blue-600 mr-2" />
                      <p className="text-sm font-medium text-blue-800">Document sélectionné</p>
                    </div>
                    <p className="text-sm text-blue-700 mb-3 font-medium">{selectedIdentityFile.name}</p>
                    <p className="text-xs text-blue-600 mb-4">
                      Taille: {(selectedIdentityFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={handleIdentityUpload}
                        disabled={uploadingIdentity}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                      >
                        {uploadingIdentity ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Téléchargement...
                          </>
                        ) : (
                          <>
                            <FaIdCard className="mr-2" />
                            Enregistrer le document
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIdentityFile(null);
                          document.getElementById('identity-upload').value = '';
                        }}
                        disabled={uploadingIdentity}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {errors.identity && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600 font-medium">{errors.identity}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Onglets pour la gestion des trajets/réservations */}
        <div className="border-t border-gray-200 mt-8">
          <div className="flex space-x-8 px-6 py-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUser className="inline mr-2" />
              Profil
            </button>

            {user.role === 'conducteur' && (
              <button
                onClick={() => setActiveTab('trips')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trips'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaCar className="inline mr-2" />
                Mes Trajets
              </button>
            )}

            {user.role === 'voyageur' && (
              <button
                onClick={() => setActiveTab('reservations')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reservations'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FaCalendarAlt className="inline mr-2" />
                Mes Réservations
              </button>
            )}
          </div>

          {/* Contenu des onglets */}
          <div className="px-6 py-6">
            {activeTab === 'profile' && (
              <div className="text-center text-gray-600">
                <p>Les informations de profil sont affichées ci-dessus.</p>
              </div>
            )}

            {activeTab === 'trips' && user.role === 'conducteur' && (
              <DriverTripsManagement />
            )}

            {activeTab === 'reservations' && user.role === 'voyageur' && (
              <PassengerReservations />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;