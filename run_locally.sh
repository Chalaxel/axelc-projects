#!/bin/bash

echo "Starting Todo List application..."

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
