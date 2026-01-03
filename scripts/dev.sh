#!/bin/bash

# Start backend and frontend in development mode
cd "$(dirname "$0")/.."

echo "Starting development servers..."

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
