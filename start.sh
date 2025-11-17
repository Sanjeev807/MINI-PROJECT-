#!/bin/bash

# E-Commerce App Quick Start Script
# This script helps you start the backend and frontend

echo "🚀 Starting E-Commerce App..."
echo ""

# Check if backend node_modules exist
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

# Check if frontend node_modules exist
if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

# Start MongoDB check
echo "🔍 Checking MongoDB connection..."
mongo_status=$(mongod --version 2>&1)
if [[ $? -eq 0 ]]; then
  echo "✅ MongoDB is installed"
else
  echo "⚠️  MongoDB not found. Please install MongoDB from https://www.mongodb.com/try/download/community"
fi

echo ""
echo "Choose an option:"
echo "1. Start Backend Server only"
echo "2. Start Frontend Metro Bundler only"
echo "3. Start Both (Backend + Frontend)"
echo "4. Run Android App"
echo "5. Full Setup (Backend + Frontend + Android)"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
  1)
    echo "🚀 Starting Backend Server..."
    cd backend && npm start
    ;;
  2)
    echo "🚀 Starting Metro Bundler..."
    cd frontend && npx react-native start
    ;;
  3)
    echo "🚀 Starting Backend and Frontend..."
    # Start backend in background
    cd backend && npm start &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    # Wait a moment for backend to start
    sleep 3
    # Start Metro
    cd ../frontend && npx react-native start
    ;;
  4)
    echo "📱 Running Android App..."
    cd frontend && npx react-native run-android
    ;;
  5)
    echo "🚀 Full Setup..."
    # Start backend
    cd backend && npm start &
    BACKEND_PID=$!
    echo "Backend started (PID: $BACKEND_PID)"
    sleep 3
    # Start Metro in background
    cd ../frontend
    npx react-native start &
    METRO_PID=$!
    echo "Metro started (PID: $METRO_PID)"
    sleep 5
    # Run Android
    npx react-native run-android
    ;;
  *)
    echo "❌ Invalid choice. Exiting."
    exit 1
    ;;
esac
