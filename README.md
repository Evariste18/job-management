# 🚀 Job Management API

API NestJS pour la gestion des utilisateurs, des offres d’emploi et des candidatures.

---

## ⚙️ Setup du projet

```bash
# 1. Cloner le projet
git clone <https://github.com/Evariste18/job-management.git> job-management
cd job-management

# 2. Installer les dépendances
npm install

# 3. Créer un fichier .env (voir exemple ci-dessous)
```
## Exemple .env

```bash
APP_NAME=job-management
MONGODB_URI=mongodb://127.0.0.1:27017/job-management
PORT=3000
JWT_SECRET=$2b$10$7LM7OxCQt5xxeM25ms2RbuZ7cH9i9OjbG7muOr1335pZXKx6eQIRy
TOKEN_EXPIRATION= 15m
```

## Commandes de lancement

```bash
npm run start:dev     # Lancer en mode développement (watch)
npm run test          # Exécuter les tests unitaires
```

## Accès Swagger

```bash
Swagger est accessible ici :
http://localhost:3000/api/docs
```

## Données de Test

```bash
{
  "firstName": "Koffi",
  "lastName": "jean",
  "email": "jean@email.com",
  "password": "Jean@email.com1",
  "role": "admin"
}

{
  "firstName": "Koné"
  "lastName": "pascal",
  "email": "pascal@email.com",
  "password": "Pascal@email.com1",
  "role": "recruteur"
}

{
  "firstName": "Kra",
  "lastName": "ama",
  "email": "ama@email.com",
  "password": "Ama@email.com1",
  "role": "candidat"
}
```