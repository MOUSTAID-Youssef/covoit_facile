import React, { useState } from 'react';
import { FaPhone, FaEdit, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const PhoneForm = ({ currentPhone, onPhoneUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(currentPhone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phoneNumber) => {
    // Validation pour numéro marocain
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  };

  const formatPhone = (phoneNumber) => {
    // Supprimer tous les espaces et caractères non numériques sauf +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Si commence par 0, remplacer par +212
    if (cleaned.startsWith('0')) {
      cleaned = '+212' + cleaned.substring(1);
    }
    
    // Si ne commence pas par +212, l'ajouter
    if (!cleaned.startsWith('+212')) {
      cleaned = '+212' + cleaned;
    }
    
    return cleaned;
  };

  const handleSave = async () => {
    if (!phone.trim()) {
      setError('Le numéro de téléphone est obligatoire');
      return;
    }

    const formattedPhone = formatPhone(phone);
    
    if (!validatePhone(formattedPhone)) {
      setError('Format de numéro invalide. Utilisez le format marocain (ex: +212612345678 ou 0612345678)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (onPhoneUpdated) {
        await onPhoneUpdated(formattedPhone);
      }
      setPhone(formattedPhone);
      setIsEditing(false);
    } catch (error) {
      setError('Erreur lors de la mise à jour du numéro');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPhone(currentPhone || '');
    setIsEditing(false);
    setError('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaPhone className="text-indigo-500" />
          <h3 className="font-medium text-gray-900">Numéro de téléphone</h3>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <FaEdit className="text-sm" />
            <span className="text-sm">Modifier</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: +212612345678 ou 0612345678"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Format accepté: +212612345678 ou 0612345678
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
              <span className="text-sm">Sauvegarder</span>
            </button>
            
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <FaTimes />
              <span className="text-sm">Annuler</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          {currentPhone ? (
            <div className="flex items-center space-x-2">
              <FaPhone className="text-gray-400" />
              <span className="text-gray-900">{currentPhone}</span>
            </div>
          ) : (
            <div className="text-center py-4">
              <FaPhone className="mx-auto text-2xl text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm mb-3">
                Aucun numéro de téléphone enregistré
              </p>
              <p className="text-xs text-gray-400">
                Ajoutez votre numéro pour faciliter la communication avec les autres utilisateurs
              </p>
            </div>
          )}
        </div>
      )}

      {/* Note informative */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <FaPhone className="text-blue-500 mt-1 text-sm" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Pourquoi ajouter votre numéro ?</p>
            <ul className="space-y-1">
              <li>• Communication directe avec les conducteurs/voyageurs</li>
              <li>• Coordination pour les points de rendez-vous</li>
              <li>• Contact en cas d'urgence ou de retard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneForm;
