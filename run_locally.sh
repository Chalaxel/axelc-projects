#!/bin/bash

echo "Starting monorepo development environment..."

# Build shared packages first
echo "Building shared packages..."
cd packages/shared-types && npm run build && cd ../..
cd shared/backend && npm run build && cd ../..
cd shared/frontend && npm run build && cd ../..

# Build app backends
echo "Building app backends..."
cd apps/ladm/backend && npm run build && cd ../../..

# Start backend
echo "Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 3

# Start frontend
echo "Starting frontend dev server..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "Development servers started!"
echo "Frontend: http://localhost:8080"
echo "Backend API: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for interrupt
wait $BACKEND_PID $FRONTEND_PID

