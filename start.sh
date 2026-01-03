#!/bin/bash

# Script pour démarrer le projet dans 3 onglets séparés
# Usage: ./start.sh

# Obtenir le répertoire du projet
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Démarrage du projet dans 3 onglets..."
echo ""

# Onglet 1: Docker Compose
echo "📦 Ouverture de l'onglet Docker Compose..."
ttab -d "$PROJECT_DIR" "docker-compose up"

# Onglet 2: Backend
echo "🔧 Ouverture de l'onglet Backend..."
ttab -d "$PROJECT_DIR/backend" "npm run dev"

# Onglet 3: Frontend
echo "🎨 Ouverture de l'onglet Frontend..."
ttab -d "$PROJECT_DIR/frontend" "npm run dev"

echo ""
echo "✅ Tous les onglets ont été ouverts!"
echo ""
echo "Onglets ouverts:"
echo "  1. Docker Compose (base de données)"
echo "  2. Backend (API)"
echo "  3. Frontend (Application React)"
