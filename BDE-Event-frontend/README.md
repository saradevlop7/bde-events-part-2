# 🎓 BDE-Events

**BDE-Events** est une application web Full-Stack dédiée à la gestion des événements universitaires.

La plateforme permet aux administrateurs de gérer les événements du campus et aux étudiants de consulter les événements, réserver leur place et accéder à leurs tickets.

---

## 📌 Présentation du projet

Le projet est composé de deux parties principales :

* **Frontend** : interface utilisateur développée avec React.
* **Backend** : API REST développée avec Laravel.
* **Base de données** : MySQL.

L'application utilise une authentification par token et un système de rôles permettant de distinguer les **administrateurs** et les **étudiants**.

---

## ✨ Fonctionnalités

### 👨‍💼 Administrateur

L'administrateur peut :

* Se connecter à son espace.
* Consulter les statistiques.
* Ajouter un événement.
* Modifier un événement.
* Supprimer un événement.
* Consulter la liste des événements.
* Consulter les réservations.
* Gérer les tickets.

### 🎓 Étudiant

L'étudiant peut :

* Se connecter à son espace.
* Consulter les événements disponibles.
* Voir les informations d'un événement.
* Réserver une place.
* Consulter ses réservations.
* Accéder à ses tickets numériques.
* Consulter ses informations personnelles.
* Se déconnecter.

---

## 🏗️ Architecture

```text
BDE-Events/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── admin/
│   │   │   ├── student/
│   │   │   └── services/
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
└── backend/
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/
    │   │   └── Middleware/
    │   ├── Models/
    │   └── ...
    │
    ├── database/
    │   └── migrations/
    │
    ├── routes/
    │   └── api.php
    │
    ├── .env
    └── ...
```

---

## 🛠️ Technologies utilisées

### Frontend

* React
* JavaScript
* React Router
* Axios
* CSS
* Vite

### Backend

* PHP
* Laravel
* Laravel API
* Middleware
* Authentication
* REST API

### Base de données

* MySQL
* SQL
* Migrations Laravel
* Relations entre les données

### Outils

* Git
* GitHub
* VS Code
* Postman
* Trello / Jira

---

## 🔐 Authentification

L'utilisateur se connecte avec son email et son mot de passe.

Après une connexion réussie, le backend retourne un token ainsi que les informations de l'utilisateur.

Le frontend stocke ces informations dans `localStorage`.

Le rôle de l'utilisateur détermine ensuite son espace :

```text
Admin
   ↓
/admin/dashboard

Student
   ↓
/student/dashboard
```

Les routes et actions sensibles sont protégées par l'authentification et les rôles.

---

## 🔌 API principale

Quelques endpoints utilisés par l'application :

```text
POST   /api/login

GET    /api/events
POST   /api/events
PUT    /api/events/{id}
DELETE /api/events/{id}

POST   /api/events/{id}/book

GET    /api/admin/events/stats
```

---

## 📅 Gestion des événements

Un événement contient notamment :

```text
Titre
Description
Date
Heure
Lieu
Prix
Capacité maximale
```

L'administrateur peut créer, modifier et supprimer les événements.

Les étudiants peuvent ensuite consulter les événements disponibles et effectuer une réservation.

---

## 🎟️ Réservations et tickets

Lorsqu'un étudiant réserve une place pour un événement :

```text
Étudiant
   ↓
Choisit un événement
   ↓
Réserve une place
   ↓
Réservation enregistrée
   ↓
Ticket numérique
```

Le système permet ainsi de garder une trace des réservations et des tickets associés.

---

## 🗄️ Base de données

La base de données MySQL contient les données nécessaires au fonctionnement de la plateforme, notamment :

* utilisateurs
* événements
* réservations
* tickets

Les tables et leurs relations sont gérées avec les **migrations Laravel** et les modèles Eloquent.

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <URL_DU_REPOSITORY>
cd BDE-Events
```

### 2. Backend Laravel

```bash
cd backend
composer install
```

Créer le fichier `.env` :

```bash
cp .env.example .env
```

Configurer la base de données MySQL dans `.env`.

Puis :

```bash
php artisan key:generate
php artisan migrate
php artisan serve
```

Le backend sera disponible sur :

```text
http://127.0.0.1:8000
```

### 3. Frontend React

Dans un autre terminal :

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera disponible sur :

```text
http://localhost:5173
```

---

## 🧪 Tests API

Les endpoints peuvent être testés avec **Postman** avant leur utilisation depuis React.

Exemple de connexion :

```http
POST /api/login
```

```json
{
    "email": "admin@example.com",
    "password": "password"
}
```

---

## 🔄 Fonctionnement global

```text
             ┌───────────────┐
             │    React      │
             │   Frontend    │
             └───────┬───────┘
                     │
                     │ HTTP / JSON
                     ▼
             ┌───────────────┐
             │    Laravel    │
             │      API      │
             └───────┬───────┘
                     │
                     │ Eloquent / SQL
                     ▼
             ┌───────────────┐
             │     MySQL     │
             │   Database    │
             └───────────────┘
```

---

## 🎯 Objectif

L'objectif de BDE-Events est de centraliser la gestion des événements universitaires dans une seule plateforme, tout en offrant :

* une interface simple pour les étudiants ;
* un espace de gestion pour les administrateurs ;
* une gestion des réservations ;
* un système de tickets numériques ;
* une communication entre frontend et backend via une API REST.

---

## 👩‍💻 Projet Full-Stack

**BDE-Events**

> Campus • Events • Experience

**Frontend :** React
**Backend :** Laravel
**Database :** MySQL
