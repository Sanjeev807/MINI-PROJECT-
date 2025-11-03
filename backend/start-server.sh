#!/bin/bash

# Kill any process using port 5000
echo "Checking for processes on port 5000..."
PORT=5000

# For Windows (Git Bash)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Find and kill process on Windows
    PID=$(netstat -ano | grep ":$PORT " | grep "LISTENING" | awk '{print $5}' | head -1)
    if [ ! -z "$PID" ]; then
        echo "Found process $PID on port $PORT. Killing it..."
        taskkill //PID $PID //F
        sleep 2
    else
        echo "No process found on port $PORT"
    fi
else
    # For Linux/Mac
    PID=$(lsof -ti:$PORT)
    if [ ! -z "$PID" ]; then
        echo "Found process $PID on port $PORT. Killing it..."
        kill -9 $PID
        sleep 2
    else
        echo "No process found on port $PORT"
    fi
fi

echo "Starting backend server..."
npm run dev
