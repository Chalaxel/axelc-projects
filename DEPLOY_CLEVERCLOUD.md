# Guide de déploiement sur Clever Cloud

Ce guide explique comment déployer le monorepo sur Clever Cloud.

## Prérequis

1. Compte Clever Cloud créé
2. CLI Clever Cloud installé (optionnel, pour déploiement en ligne de commande)
3. Git configuré avec votre repository

## Architecture

```
┌─────────────────────────────────────┐
│      Clever Cloud Application       │
│  ┌───────────────────────────────┐  │
│  │  Docker Container              │  │
│  │  - Backend (Express) :3000    │  │
│  │  - Frontend (Nginx) :8080      │  │
│  │  - Supervisor (orchestration)  │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   PostgreSQL Addon (Clever Cloud)  │
│   - Base de données gérée           │
│   - Backups automatiques            │
└─────────────────────────────────────┘
```

## Étapes de déploiement

### 1. Créer l'application sur Clever Cloud

1. Connectez-vous à [Clever Cloud Console](https://console.clever-cloud.com)
2. Cliquez sur "Add an application"
3. Sélectionnez "Docker" comme type d'application
4. Choisissez votre organisation
5. Nommez votre application (ex: `monorepo`)
6. Sélectionnez la région (ex: `par` pour Paris)

### 2. Lier le repository Git

1. Dans les paramètres de l'application, allez dans "Git"
2. Connectez votre repository GitHub/GitLab/Bitbucket
3. Sélectionnez la branche à déployer (ex: `main` ou `master`)

### 3. Ajouter le PostgreSQL Addon

1. Dans le dashboard de l'application, cliquez sur "Add an add-on"
2. Sélectionnez "PostgreSQL"
3. Choisissez le plan (ex: "Dev" pour commencer)
4. L'addon sera automatiquement lié à votre application

Clever Cloud fournira automatiquement ces variables d'environnement:
- `POSTGRESQL_ADDON_HOST`
- `POSTGRESQL_ADDON_PORT`
- `POSTGRESQL_ADDON_DB`
- `POSTGRESQL_ADDON_USER`
- `POSTGRESQL_ADDON_PASSWORD`
- `POSTGRESQL_ADDON_URI`

### 4. Configurer les variables d'environnement

Dans les paramètres de l'application, section "Environment variables", ajoutez:

```
NODE_ENV=production
PORT=8080
ENABLED_APPS=template,todo-list
```

**Note:** Les variables PostgreSQL sont automatiquement injectées par Clever Cloud.
Le code détecte automatiquement `POSTGRESQL_ADDON_*` et les utilise.

### 5. Configuration du build

Le fichier `clevercloud.json` est déjà configuré pour:
- Utiliser le Dockerfile à la racine
- Health check sur `/health` port 8080

### 6. Déployer

#### Option A: Déploiement automatique (recommandé)

1. Poussez vos changements sur la branche configurée
2. Clever Cloud détecte automatiquement le push
3. Le build et le déploiement démarrent automatiquement

#### Option B: Déploiement manuel via CLI

```bash
# Installer Clever Cloud CLI
npm install -g clever-tools

# Se connecter
clever login

# Lier l'application
clever link <APP_ID>

# Déployer
clever deploy
```

### 7. Exécuter les migrations

Après le premier déploiement, vous devez exécuter les migrations de base de données.

#### Option A: Via Clever Cloud Console

1. Allez dans "Console" de votre application
2. Exécutez la commande:

```bash
cd /app/apps/todo-list/backend && npm run migrate
```

#### Option B: Via SSH

```bash
# Se connecter en SSH
clever ssh

# Dans le container
cd /app/apps/todo-list/backend
npm run migrate
```

## Configuration avancée

### Variables d'environnement personnalisées

Si vous voulez utiliser des variables personnalisées au lieu de `POSTGRESQL_ADDON_*`:

```
DB_HOST=${POSTGRESQL_ADDON_HOST}
DB_PORT=${POSTGRESQL_ADDON_PORT}
DB_NAME=${POSTGRESQL_ADDON_DB}
DB_USER=${POSTGRESQL_ADDON_USER}
DB_PASSWORD=${POSTGRESQL_ADDON_PASSWORD}
DB_SSL=true
```

### Scaling

Dans les paramètres de l'application:
- **Instances:** Configurez le nombre d'instances (min/max)
- **Resources:** Ajustez CPU et RAM selon vos besoins

### Domaine personnalisé

1. Allez dans "Domain names" dans les paramètres
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions

### Logs

Les logs sont accessibles via:
- Console Clever Cloud > Logs
- CLI: `clever logs`

## Structure des apps déployées

Les apps suivantes sont incluses dans le déploiement:
- `template` - App template de base
- `todo-list` - Application de gestion de tâches

Pour ajouter une nouvelle app:
1. Ajoutez-la dans `ENABLED_APPS`
2. Mettez à jour le Dockerfile pour inclure son build
3. Redéployez

## Dépannage

### Le build échoue

- Vérifiez les logs de build dans la console
- Assurez-vous que tous les dépendances sont dans `package.json`
- Vérifiez que le Dockerfile est correct

### Erreur de connexion à la base de données

- Vérifiez que le PostgreSQL Addon est bien lié
- Vérifiez les variables d'environnement `POSTGRESQL_ADDON_*`
- Assurez-vous que `DB_SSL=true` si vous utilisez Clever Cloud PostgreSQL

### L'application ne démarre pas

- Vérifiez les logs: `clever logs`
- Vérifiez que le port 8080 est bien exposé
- Vérifiez le health check: `https://your-app.cleverapps.io/health`

## Coûts estimés

- **Application Docker:** À partir de ~7€/mois (plan Dev)
- **PostgreSQL Dev:** Gratuit ou ~5€/mois selon le plan
- **Total estimé:** 7-15€/mois pour un projet de taille moyenne

## Support

- Documentation Clever Cloud: https://www.clever-cloud.com/doc/
- Support: support@clever-cloud.com
