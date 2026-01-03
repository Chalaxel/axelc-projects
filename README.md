# Todo List Application

Application simple de gestion de liste de tâches (todo list) avec backend Express/TypeScript et frontend React.

## Structure du projet

```
/
├── backend/          # Backend Express + Sequelize
│   ├── src/
│   │   ├── models/   # Modèles Sequelize
│   │   ├── routes/   # Routes API
│   │   ├── services/ # Services métier
│   │   ├── migrations/ # Migrations base de données
│   │   └── server.ts # Point d'entrée serveur
│   └── package.json
├── frontend/         # Frontend React + Vite
│   ├── src/
│   │   ├── components/ # Composants React
│   │   ├── services/   # Services API
│   │   └── main.tsx    # Point d'entrée
│   └── package.json
└── docker-compose.yaml # Configuration PostgreSQL
```

## Développement local

### Prérequis

- Node.js 20+
- Docker (pour la base de données PostgreSQL)

### Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer la base de données PostgreSQL :
```bash
npm run db:up
```

3. Configurer les variables d'environnement (créer un fichier `.env` dans `backend/`) :
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_list
DB_USER=postgres
DB_PASSWORD=password
```

4. Exécuter les migrations :
```bash
cd backend
npm run migrate
```

5. Démarrer les serveurs de développement :
```bash
npm run dev
```

Le frontend sera accessible sur http://localhost:8080
Le backend API sera accessible sur http://localhost:3000

## Build et déploiement

### Build

```bash
npm run build
```

### Docker

Construire l'image Docker :
```bash
docker build -t todo-list .
```

Lancer le conteneur :
```bash
docker run -p 8080:8080 -e DB_HOST=host.docker.internal -e DB_PORT=5432 -e DB_NAME=todo_list -e DB_USER=postgres -e DB_PASSWORD=password todo-list
```

## API

### Endpoints

- `GET /api/todos` - Récupérer tous les todos
- `GET /api/todos/:id` - Récupérer un todo par ID
- `POST /api/todos` - Créer un nouveau todo
- `PUT /api/todos/:id` - Mettre à jour un todo
- `DELETE /api/todos/:id` - Supprimer un todo
- `GET /health` - Health check

### Format des données

**Todo:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string (optionnel)",
  "completed": boolean,
  "createdAt": "date",
  "updatedAt": "date"
}
```
