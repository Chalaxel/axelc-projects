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

# Open backend terminal
echo "🚀 Opening Backend terminal..."
$TTAB_CMD -t "Backend" "cd '$PROJECT_ROOT' && yarn dev:backend"

# Wait a bit before opening the second terminal
sleep 0.5

# Open frontend terminal
echo "🚀 Opening Frontend terminal..."
$TTAB_CMD -t "Frontend" "cd '$PROJECT_ROOT' && yarn dev:frontend"

echo "✅ Backend and Frontend started in separate terminals"

