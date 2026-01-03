#!/bin/bash

# Get the absolute path of the project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Function to get ttab command (check global first, then use yarn/npx)
get_ttab() {
    if command -v ttab &> /dev/null; then
        echo "ttab"
    elif command -v yarn &> /dev/null; then
        echo "yarn ttab"
    else
        echo "npx ttab"
    fi
}

TTAB_CMD=$(get_ttab)

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Start PostgreSQL with Docker Compose
echo "🐘 Starting PostgreSQL database..."
cd "$PROJECT_ROOT"
docker-compose up -d db

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1 || docker exec monorepo-postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    attempt=$((attempt + 1))
    sleep 1
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ PostgreSQL failed to start after $max_attempts seconds"
    exit 1
fi

# Open PostgreSQL logs terminal
echo "📊 Opening PostgreSQL logs terminal..."
$TTAB_CMD -t "PostgreSQL Logs" "cd '$PROJECT_ROOT' && docker-compose logs -f db"

# Wait a bit before opening the next terminal
sleep 0.5

# Open backend terminal
echo "🚀 Opening Backend terminal..."
$TTAB_CMD -t "Backend" "cd '$PROJECT_ROOT' && yarn dev:backend"

# Wait a bit before opening the next terminal
sleep 0.5

# Open frontend terminal
echo "🚀 Opening Frontend terminal..."
$TTAB_CMD -t "Frontend" "cd '$PROJECT_ROOT' && yarn dev:frontend"

echo "✅ PostgreSQL logs, Backend and Frontend started in separate terminals"

