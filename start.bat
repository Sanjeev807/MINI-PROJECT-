@echo off
REM E-Commerce App Quick Start Script for Windows
REM This script helps you start the backend and frontend

echo.
echo ========================================
echo   E-Commerce App Quick Start
echo ========================================
echo.

REM Check if backend node_modules exist
if not exist "backend\node_modules\" (
  echo [INFO] Installing backend dependencies...
  cd backend
  call npm install
  cd ..
)

REM Check if frontend node_modules exist
if not exist "frontend\node_modules\" (
  echo [INFO] Installing frontend dependencies...
  cd frontend
  call npm install
  cd ..
)

echo.
echo Choose an option:
echo 1. Start Backend Server only
echo 2. Start Frontend Metro Bundler only
echo 3. Start Backend in new window
echo 4. Run Android App
echo 5. Open Setup Guide
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
  echo.
  echo [INFO] Starting Backend Server...
  cd backend
  call npm start
) else if "%choice%"=="2" (
  echo.
  echo [INFO] Starting Metro Bundler...
  cd frontend
  call npx react-native start
) else if "%choice%"=="3" (
  echo.
  echo [INFO] Starting Backend in new window...
  start "E-Commerce Backend" cmd /k "cd backend && npm start"
  echo [INFO] Backend started in new window
  echo [INFO] Starting Metro Bundler...
  cd frontend
  call npx react-native start
) else if "%choice%"=="4" (
  echo.
  echo [INFO] Running Android App...
  echo [INFO] Make sure Metro Bundler is running in another terminal
  cd frontend
  call npx react-native run-android
) else if "%choice%"=="5" (
  echo.
  echo [INFO] Opening Setup Guide...
  start SETUP_GUIDE.md
) else (
  echo.
  echo [ERROR] Invalid choice. Exiting.
  pause
  exit /b 1
)

pause
