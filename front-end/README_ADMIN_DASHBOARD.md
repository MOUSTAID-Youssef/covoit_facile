# CovoitFacile - Dashboard Admin

Interface d'administration moderne pour la plateforme de covoiturage CovoitFacile, inspirée de Paper Dashboard React.

## 🚀 Fonctionnalités

### ✅ **Dashboard Principal** (`/admin/dashboard`)
- **Statistiques en temps réel** : Utilisateurs, trajets, véhicules, revenus
- **Graphiques interactifs** : Évolution des utilisateurs et trajets
- **Activité récente** : Dernières actions sur la plateforme
- **Trajets populaires** : Routes les plus demandées
- **Utilisateurs actifs** : Statistiques d'engagement

### ✅ **Gestion des Trajets** (`/admin/trips`)
- **Liste complète** des trajets avec filtres
- **Recherche avancée** par ville, conducteur, date
- **Statuts** : Actif, Complet, Terminé, Annulé
- **Actions** : Voir, Modifier, Supprimer
- **Informations détaillées** : Route, horaires, prix, passagers

### ✅ **Gestion des Utilisateurs** (`/admin/users`)
- **Base d'utilisateurs complète** avec profils détaillés
- **Filtres** par rôle (Conducteur/Voyageur) et statut
- **Vérification** des comptes et badges
- **Statistiques** : Nombre de trajets, date d'inscription
- **Actions** : Voir profil, Modifier, Suspendre

### ✅ **Gestion des Véhicules** (`/admin/vehicles`)
- **Inventaire complet** des véhicules enregistrés
- **Informations détaillées** : Marque, modèle, année, couleur
- **Plaques d'immatriculation** avec validation
- **Statuts** : Actif, En attente, Suspendu
- **Vérification** des documents

### ✅ **Analytics & Statistiques** (`/admin/analytics`)
- **Graphiques avancés** : Croissance, revenus, performances
- **Métriques clés** : Taux de conversion, satisfaction, annulation
- **Répartition géographique** des utilisateurs
- **Analyse démographique** par âge
- **Top routes** avec revenus générés

## 🎨 Design System

### **Couleurs**
```css
--admin-primary: #1f8ef1    /* Bleu principal */
--admin-secondary: #11cdef  /* Bleu secondaire */
--admin-success: #00d4aa    /* Vert succès */
--admin-warning: #ff8d72    /* Orange avertissement */
--admin-danger: #fd5d93     /* Rouge danger */
--admin-info: #1d8cf8       /* Bleu info */
--admin-dark: #344675       /* Gris foncé */
--admin-light: #f8f9fa      /* Gris clair */
```

### **Composants**
- **Sidebar responsive** avec navigation intuitive
- **Navbar** avec recherche globale et notifications
- **Cards** avec ombres et animations
- **Tables** avec tri, filtres et pagination
- **Graphiques** interactifs avec Chart.js
- **Badges** colorés pour les statuts
- **Boutons d'action** avec hover effects

## 📱 Structure des Fichiers

```
src/
├── layouts/
│   └── AdminLayout.jsx          # Layout principal admin
├── pages/admin/
│   ├── Dashboard.jsx            # Tableau de bord
│   ├── TripsManagement.jsx      # Gestion trajets
│   ├── UsersManagement.jsx      # Gestion utilisateurs
│   ├── VehiclesManagement.jsx   # Gestion véhicules
│   └── Analytics.jsx            # Statistiques
├── components/admin/
│   ├── Sidebar.jsx              # Menu latéral
│   ├── AdminNavbar.jsx          # Barre de navigation
│   ├── StatsCard.jsx            # Cartes statistiques
│   ├── ChartCard.jsx            # Cartes graphiques
│   └── RecentActivity.jsx       # Activité récente
└── styles/
    └── admin.css                # Styles admin complets
```

## 🔧 Technologies Utilisées

- **React 19** : Framework principal
- **React Router** : Navigation
- **Chart.js + React-Chartjs-2** : Graphiques
- **React Icons** : Icônes
- **CSS3** : Styles personnalisés (pas de Tailwind dans l'admin)
- **Responsive Design** : Mobile-first

## 🚀 Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Build pour la production
npm run build
```

## 📊 Pages Disponibles

### **Dashboard** - `/admin/dashboard`
- Vue d'ensemble avec KPIs
- Graphiques de tendances
- Activité en temps réel

### **Trajets** - `/admin/trips`
- Liste paginée avec filtres
- Recherche par critères multiples
- Gestion des statuts

### **Utilisateurs** - `/admin/users`
- Profils détaillés
- Vérification des comptes
- Statistiques d'utilisation

### **Véhicules** - `/admin/vehicles`
- Inventaire complet
- Validation des documents
- Suivi des vérifications

### **Analytics** - `/admin/analytics`
- Rapports détaillés
- Métriques de performance
- Analyses géographiques

## 🎯 Fonctionnalités Avancées

### **Recherche Globale**
- Recherche instantanée dans la navbar
- Filtres contextuels par page
- Suggestions automatiques

### **Notifications**
- Centre de notifications
- Alertes en temps réel
- Historique des actions

### **Responsive Design**
- **Desktop** : Sidebar fixe, layout complet
- **Tablet** : Sidebar collapsible
- **Mobile** : Navigation optimisée

### **Animations**
- Transitions fluides
- Hover effects
- Loading states

## 🔐 Sécurité

- **Routes protégées** : Accès admin uniquement
- **Validation** des données côté client
- **Sanitisation** des entrées utilisateur
- **Gestion des erreurs** robuste

## 📈 Métriques Suivies

### **Utilisateurs**
- Nouveaux inscrits
- Utilisateurs actifs
- Taux de rétention
- Répartition géographique

### **Trajets**
- Trajets créés/complétés
- Taux d'occupation
- Routes populaires
- Revenus générés

### **Performance**
- Temps de réponse
- Taux de conversion
- Satisfaction utilisateur
- Taux d'annulation

## 🔄 Intégration API

Le dashboard est prêt pour l'intégration avec l'API Laravel :

```javascript
// Exemple d'appel API
const fetchDashboardStats = async () => {
  const response = await fetch('/api/admin/dashboard/stats');
  return response.json();
};
```

## 🎨 Personnalisation

### **Couleurs**
Modifiez les variables CSS dans `admin.css` :

```css
:root {
  --admin-primary: #votre-couleur;
  /* ... autres variables */
}
```

### **Layout**
Ajustez les dimensions dans les variables :

```css
:root {
  --sidebar-width: 260px;
  --navbar-height: 70px;
}
```

## 📱 Responsive Breakpoints

- **Desktop** : `> 1024px`
- **Tablet** : `768px - 1024px`
- **Mobile** : `< 768px`

## 🚀 Prochaines Étapes

- [ ] Intégration API Laravel complète
- [ ] Authentification admin
- [ ] Notifications en temps réel
- [ ] Export de rapports PDF
- [ ] Mode sombre
- [ ] Gestion des permissions
- [ ] Audit trail
- [ ] Backup/Restore

---

**CovoitFacile Admin Dashboard** - Interface d'administration moderne et intuitive pour votre plateforme de covoiturage 🚗✨
