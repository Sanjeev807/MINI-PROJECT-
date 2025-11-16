@echo off
echo =============================================
echo   E-Shop Android - Complete Workflow
echo =============================================
echo.
echo This script will:
echo   1. Build React production bundle
echo   2. Sync with Capacitor Android
echo   3. Open project in Android Studio
echo.
echo Make sure backend is running first!
echo.
pause

cd /d "e:\MINI PROJECT\ECommerceApp\frontend"

:: Step 1: Build React
echo.
echo [1/3] Building React production bundle...
set DISABLE_ESLINT_PLUGIN=true
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)
echo ✅ Build complete
echo.

:: Step 2: Sync with Android
echo [2/3] Syncing with Capacitor Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Sync failed!
    pause
    exit /b 1
)
echo ✅ Sync complete
echo.

:: Step 3: Open Android Studio
echo [3/3] Opening Android Studio...
call npx cap open android
echo.
echo =============================================
echo   Android Studio Instructions
echo =============================================
echo.
echo 1. Wait for Gradle sync to finish (2-5 min)
echo 2. Create/select emulator in Device Manager
echo 3. Click the green Run button
echo 4. App will build and launch
echo.
echo Backend: http://localhost:5000
echo Android App connects to: http://10.0.2.2:5000
echo.
echo ✅ Setup complete!
pause
