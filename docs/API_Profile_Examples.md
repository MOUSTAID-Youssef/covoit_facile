# API Profile Management - Exemples pour React.js

## Configuration de base

```javascript
// Configuration Axios pour React
const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 1. Récupérer le profil utilisateur

### GET /api/profile

```javascript
// Hook React pour récupérer le profil
const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/profile');
        setProfile(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error, refetch: fetchProfile };
};

// Composant React pour afficher le profil
const ProfileDisplay = () => {
  const { profile, loading, error } = useProfile();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="profile-card">
      <img 
        src={profile.photo_url} 
        alt="Photo de profil"
        className="profile-avatar"
      />
      <h2>{profile.prenom} {profile.nom}</h2>
      <p>Email: {profile.email}</p>
      <p>Rôle: {profile.role}</p>
      <p>Genre: {profile.genre}</p>
      <p>Date de naissance: {new Date(profile.date_naissance).toLocaleDateString()}</p>
      <p>Badge vérifié: {profile.badge_verifie ? '✅' : '❌'}</p>
    </div>
  );
};
```

## 2. Mettre à jour le profil

### PUT /api/profile

```javascript
// Hook pour mettre à jour le profil
const useUpdateProfile = () => {
  const [updating, setUpdating] = useState(false);

  const updateProfile = async (profileData) => {
    setUpdating(true);
    try {
      const response = await apiClient.put('/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        errors: error.response?.data?.errors || {},
        message: error.response?.data?.message || 'Erreur lors de la mise à jour'
      };
    } finally {
      setUpdating(false);
    }
  };

  return { updateProfile, updating };
};

// Composant formulaire de mise à jour
const ProfileEditForm = ({ profile, onSuccess }) => {
  const [formData, setFormData] = useState({
    prenom: profile?.prenom || '',
    nom: profile?.nom || '',
    email: profile?.email || '',
    genre: profile?.genre || '',
    date_naissance: profile?.date_naissance?.split('T')[0] || '',
  });
  const [errors, setErrors] = useState({});
  const { updateProfile, updating } = useUpdateProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    
    if (result.success) {
      onSuccess(result.data.user);
      alert('Profil mis à jour avec succès !');
    } else {
      setErrors(result.errors);
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-group">
        <label>Prénom:</label>
        <input
          type="text"
          value={formData.prenom}
          onChange={(e) => setFormData({...formData, prenom: e.target.value})}
          className={errors.prenom ? 'error' : ''}
        />
        {errors.prenom && <span className="error-text">{errors.prenom[0]}</span>}
      </div>

      <div className="form-group">
        <label>Nom:</label>
        <input
          type="text"
          value={formData.nom}
          onChange={(e) => setFormData({...formData, nom: e.target.value})}
          className={errors.nom ? 'error' : ''}
        />
        {errors.nom && <span className="error-text">{errors.nom[0]}</span>}
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email[0]}</span>}
      </div>

      <div className="form-group">
        <label>Genre:</label>
        <select
          value={formData.genre}
          onChange={(e) => setFormData({...formData, genre: e.target.value})}
          className={errors.genre ? 'error' : ''}
        >
          <option value="">Sélectionner</option>
          <option value="homme">Homme</option>
          <option value="femme">Femme</option>
        </select>
        {errors.genre && <span className="error-text">{errors.genre[0]}</span>}
      </div>

      <div className="form-group">
        <label>Date de naissance:</label>
        <input
          type="date"
          value={formData.date_naissance}
          onChange={(e) => setFormData({...formData, date_naissance: e.target.value})}
          className={errors.date_naissance ? 'error' : ''}
        />
        {errors.date_naissance && <span className="error-text">{errors.date_naissance[0]}</span>}
      </div>

      <button type="submit" disabled={updating}>
        {updating ? 'Mise à jour...' : 'Mettre à jour'}
      </button>
    </form>
  );
};
```

## 3. Upload de photo de profil

```javascript
// Hook pour l'upload de photo
const usePhotoUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadPhoto = async (file, additionalData = {}) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      // Ajouter d'autres données si nécessaire
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const response = await apiClient.put('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        errors: error.response?.data?.errors || {},
        message: error.response?.data?.message || 'Erreur lors de l\'upload'
      };
    } finally {
      setUploading(false);
    }
  };

  return { uploadPhoto, uploading };
};

// Composant pour l'upload de photo
const PhotoUpload = ({ currentPhotoUrl, onPhotoUpdated }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentPhotoUrl);
  const { uploadPhoto, uploading } = usePhotoUpload();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation côté client
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Format non supporté. Utilisez JPG ou PNG.');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB
        alert('Fichier trop volumineux. Maximum 2MB.');
        return;
      }

      setSelectedFile(file);
      
      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadPhoto(selectedFile);
    
    if (result.success) {
      onPhotoUpdated(result.data.user.photo_url);
      setSelectedFile(null);
      alert('Photo mise à jour avec succès !');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="photo-upload">
      <div className="current-photo">
        <img src={preview} alt="Photo de profil" className="profile-photo" />
      </div>
      
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      
      {selectedFile && (
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Upload en cours...' : 'Mettre à jour la photo'}
        </button>
      )}
    </div>
  );
};
```

## 4. Composant complet de gestion du profil

```javascript
const ProfileManager = () => {
  const { profile, loading, error, refetch } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileUpdate = (updatedProfile) => {
    setIsEditing(false);
    refetch(); // Recharger le profil
  };

  const handlePhotoUpdate = (newPhotoUrl) => {
    refetch(); // Recharger le profil
  };

  if (loading) return <div>Chargement du profil...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="profile-manager">
      <h1>Mon Profil</h1>
      
      <PhotoUpload 
        currentPhotoUrl={profile.photo_url}
        onPhotoUpdated={handlePhotoUpdate}
      />
      
      {isEditing ? (
        <ProfileEditForm 
          profile={profile}
          onSuccess={handleProfileUpdate}
        />
      ) : (
        <ProfileDisplay profile={profile} />
      )}
      
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Annuler' : 'Modifier le profil'}
      </button>
    </div>
  );
};
```

## Styles CSS suggérés

```css
.profile-card {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

.profile-form .form-group {
  margin-bottom: 15px;
}

.profile-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.profile-form input,
.profile-form select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.profile-form input.error,
.profile-form select.error {
  border-color: #e74c3c;
}

.error-text {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}

.photo-upload {
  text-align: center;
  margin-bottom: 20px;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}
```
