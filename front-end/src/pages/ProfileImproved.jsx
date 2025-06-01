import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaCamera, FaIdCard, FaCheck, FaClock, FaSpinner, FaTrash, FaCar, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaPhone, FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';
import DriverTripsManagement from '../components/DriverTripsManagement';
import PassengerReservationsImproved from '../components/PassengerReservationsImproved';
import VehicleForm from '../components/VehicleForm';
import DriverVehicleDisplay from '../components/DriverVehicleDisplay';
import PhoneForm from '../components/PhoneForm';

const ProfileImproved = () => {
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
  const [activeTab, setActiveTab] = useState('trips');

  // États pour les véhicules
  const [vehicle, setVehicle] = useState(null);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    loadProfile();
    if (user?.role === 'conducteur') {
      loadVehicle();
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'conducteur') {
      loadVehicle();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const result = await userService.getProfile();
      if (result.success) {
        setUser(result.data);
        setPreview(result.data.photo_url);
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Erreur lors du chargement du profil' });
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = () => {
    if (!user) return { status: 'non_verifie', label: 'Non vérifié', color: 'text-red-600 bg-red-50', icon: FaTimesCircle };
    
    if (user.cin_path && user.badge_verifie === true) {
      return {
        status: 'verifie',
        label: 'Vérifié',
        color: 'text-green-600 bg-green-50',
        icon: FaCheckCircle
      };
    } else if (user.cin_path && !user.badge_verifie) {
      return {
        status: 'en_attente',
        label: 'En attente',
        color: 'text-yellow-600 bg-yellow-50',
        icon: FaClock
      };
    } else {
      return {
        status: 'non_verifie',
        label: 'Non vérifié',
        color: 'text-red-600 bg-red-50',
        icon: FaTimesCircle
      };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentityFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedIdentityFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
      const result = await userService.updateProfile({
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        genre: user.genre,
        telephone: user.telephone,
        date_naissance: user.date_naissance
      });

      if (result.success) {
        setUser(result.data);
        updateUser(result.data);
        setIsEditing(false);
        setSuccessMessage('Profil mis à jour avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors(result.errors || { general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Erreur lors de la mise à jour' });
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
      setErrors(prev => ({
        ...prev,
        photo: 'Erreur lors de l\'upload de la photo'
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleIdentityUpload = async () => {
    if (!selectedIdentityFile) return;

    setUploadingIdentity(true);
    setErrors(prev => ({ ...prev, identity: null }));

    try {
      const result = await userService.uploadIdentity(selectedIdentityFile);

      if (result.success) {
        setUser(result.data);
        updateUser(result.data);
        setSelectedIdentityFile(null);
        setSuccessMessage('Document d\'identité uploadé avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
        // Recharger le profil pour mettre à jour le statut
        loadProfile();
      } else {
        setErrors(prev => ({
          ...prev,
          identity: result.message || 'Erreur lors de l\'upload'
        }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        identity: 'Erreur lors de l\'upload du document'
      }));
    } finally {
      setUploadingIdentity(false);
    }
  };

  const loadVehicle = async () => {
    if (!user || user.role !== 'conducteur') return;

    setVehicleLoading(true);
    try {
      const result = await userService.getMyVehicle();
      if (result.success) {
        setVehicle(result.data);
      } else {
        console.log('Aucun véhicule trouvé ou erreur:', result.message);
        setVehicle(null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du véhicule:', error);
      setVehicle(null);
    } finally {
      setVehicleLoading(false);
    }
  };

  const handleVehicleAdded = async (vehicleData) => {
    try {
      let result;
      if (editingVehicle) {
        result = await userService.updateVehicle(vehicleData);
      } else {
        result = await userService.addVehicle(vehicleData);
      }

      if (result.success) {
        setVehicle(result.data);
        setShowVehicleForm(false);
        setEditingVehicle(null);
        setSuccessMessage(editingVehicle ? 'Véhicule modifié avec succès !' : 'Véhicule ajouté avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ vehicle: result.message });
      }
    } catch (error) {
      setErrors({ vehicle: 'Erreur lors de l\'opération sur le véhicule' });
    }
  };

  const handleVehicleEdit = (vehicleToEdit) => {
    setEditingVehicle(vehicleToEdit);
    setShowVehicleForm(true);
  };

  const handleVehicleDelete = async () => {
    try {
      const result = await userService.deleteVehicle();
      if (result.success) {
        setVehicle(null);
        setSuccessMessage('Véhicule supprimé avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ vehicle: result.message });
      }
    } catch (error) {
      setErrors({ vehicle: 'Erreur lors de la suppression du véhicule' });
    }
  };

  const handlePhoneUpdate = async (newPhone) => {
    try {
      const result = await userService.updatePhone(newPhone);
      if (result.success) {
        setUser(result.data);
        updateUser(result.data);
        setSuccessMessage('Numéro de téléphone mis à jour avec succès !');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const getUserPhotoUrl = (photoPath) => {
    if (!photoPath) return '/images/default-avatar.svg';
    
    // Si c'est déjà une URL complète
    if (photoPath.startsWith('http')) return photoPath;
    
    // Si c'est un chemin relatif qui commence par /
    if (photoPath.startsWith('/')) return photoPath;
    
    // Sinon, construire l'URL avec le storage Laravel
    return `http://localhost:8000/storage/${photoPath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        <span className="ml-3 text-lg text-gray-600">Chargement du profil...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaUser className="mx-auto text-6xl text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profil non trouvé</h2>
          <p className="text-gray-600">Impossible de charger les informations du profil.</p>
        </div>
      </div>
    );
  }

  const verificationStatus = getVerificationStatus();
  const StatusIcon = verificationStatus.icon;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Messages */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      {errors.general && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <img
                src={getUserPhotoUrl(preview || user.photo_profil)}
                alt="Photo de profil"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
                onError={(e) => {
                  e.target.src = '/images/default-avatar.svg';
                }}
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
              </div>
            </div>
            
            <div className="text-center sm:text-left text-white">
              <h1 className="text-2xl font-bold">{user.prenom} {user.nom}</h1>
              <p className="text-indigo-200">{user.email}</p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'conducteur' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role === 'conducteur' ? <FaCar className="mr-1" /> : <FaUser className="mr-1" />}
                  {user.role}
                </span>
                
                {/* Statut de vérification */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${verificationStatus.color} border`}>
                  <StatusIcon className="mr-1" />
                  {verificationStatus.label}
                </span>
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
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={user.telephone || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: +212612345678"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.telephone ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.telephone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                  )}
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

              <div className="flex justify-end space-x-3">
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
                  Sauvegarder
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <p className="mt-1 text-sm text-gray-900">{user.prenom || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <p className="mt-1 text-sm text-gray-900">{user.nom || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Genre</label>
                <p className="mt-1 text-sm text-gray-900">{user.genre || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <p className="mt-1 text-sm text-gray-900">{user.telephone || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.date_naissance ? new Date(user.date_naissance).toLocaleDateString('fr-FR') : 'Non renseignée'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Documents</h3>
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
                  <button
                    onClick={handlePhotoUpload}
                    disabled={uploading}
                    className="block w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="inline mr-2 animate-spin" />
                        Upload en cours...
                      </>
                    ) : (
                      'Uploader la photo'
                    )}
                  </button>
                )}
              </div>

              {errors.photo && (
                <p className="mt-2 text-sm text-red-600">{errors.photo}</p>
              )}
            </div>

            {/* Identity Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <FaIdCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Document d'identité</h4>
              <p className="text-sm text-gray-500 mb-4">CIN, Passeport - JPG, PNG - Maximum 5MB</p>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
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
                  <button
                    onClick={handleIdentityUpload}
                    disabled={uploadingIdentity}
                    className="block w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                  >
                    {uploadingIdentity ? (
                      <>
                        <FaSpinner className="inline mr-2 animate-spin" />
                        Upload en cours...
                      </>
                    ) : (
                      'Uploader le document'
                    )}
                  </button>
                )}
              </div>

              {user.cin_path && (
                <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-700">
                  <FaCheck className="inline mr-1" />
                  Document uploadé
                </div>
              )}

              {errors.identity && (
                <p className="mt-2 text-sm text-red-600">{errors.identity}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section véhicule pour les conducteurs */}
        {user?.role === 'conducteur' && (
          <div className="border-t border-gray-200 px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Mon véhicule</h2>
              {!vehicle && !showVehicleForm && (
                <button
                  onClick={() => setShowVehicleForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <FaPlus className="mr-2" />
                  Ajouter un véhicule
                </button>
              )}
            </div>

            {errors.vehicle && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errors.vehicle}
              </div>
            )}

            {showVehicleForm ? (
              <VehicleForm
                existingVehicle={editingVehicle}
                onVehicleAdded={handleVehicleAdded}
                onCancel={() => {
                  setShowVehicleForm(false);
                  setEditingVehicle(null);
                }}
              />
            ) : (
              <DriverVehicleDisplay
                vehicle={vehicle}
                loading={vehicleLoading}
                onEdit={handleVehicleEdit}
                onDelete={handleVehicleDelete}
              />
            )}

            {!vehicle && !showVehicleForm && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaExclamationTriangle className="text-yellow-500" />
                  <p className="text-sm text-yellow-700">
                    <strong>Important :</strong> Vous devez ajouter un véhicule pour pouvoir proposer des trajets.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="px-6 py-3 border-b border-gray-200">
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
            {activeTab === 'trips' && user.role === 'conducteur' && (
              <DriverTripsManagement />
            )}

            {activeTab === 'reservations' && user.role === 'voyageur' && (
              <PassengerReservationsImproved />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImproved;
