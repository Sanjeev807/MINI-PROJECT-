@echo off
echo ========================================
echo   E-Shop Android Build and Run Script
echo ========================================
echo.

:: Check if backend is running
echo [1/6] Checking backend server...
curl -s http://localhost:5000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend is NOT running!
    echo Please start backend: npm start in backend folder
    pause
    exit /b 1
)
echo ✅ Backend is running on port 5000
echo.

:: Build React app
echo [2/6] Building React production bundle...
set DISABLE_ESLINT_PLUGIN=true
call npm run build
if %errorlevel% neq 0 (
    echo ❌ React build failed!
    pause
    exit /b 1
)
echo ✅ React build complete
echo.

:: Sync with Capacitor
echo [3/6] Syncing with Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor sync failed!
    pause
    exit /b 1
)
echo ✅ Sync complete
echo.

:: Build Android APK
echo [4/6] Building Android APK...
echo This may take 5-10 minutes on first run...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ❌ Android build failed!
    echo.
    echo Try opening the project in Android Studio instead:
    echo   1. Open Android Studio
    echo   2. Open project: %cd%
    echo   3. Wait for Gradle sync
    echo   4. Click Run button
    pause
    exit /b 1
)
cd ..
echo ✅ APK built successfully!
echo.

:: Show APK location
echo [5/6] APK Location:
echo %cd%\android\app\build\outputs\apk\debug\app-debug.apk
echo.

:: Instructions
echo [6/6] Next Steps:
echo.
echo ══════════════════════════════════════════════════════════
echo   OPTION A: Install on Emulator (if running)
echo ══════════════════════════════════════════════════════════
echo   1. Start Android emulator from Android Studio
echo   2. Run: adb install -r android\app\build\outputs\apk\debug\app-debug.apk
echo   3. Open E-Shop app on emulator
echo.
echo ══════════════════════════════════════════════════════════
echo   OPTION B: Install on Physical Device
echo ══════════════════════════════════════════════════════════
echo   1. Enable USB Debugging on your phone
echo   2. Connect phone via USB
echo   3. Run: adb install -r android\app\build\outputs\apk\debug\app-debug.apk
echo   4. Open E-Shop app on your phone
echo.
echo ══════════════════════════════════════════════════════════
echo   OPTION C: Use Android Studio (Recommended)
echo ══════════════════════════════════════════════════════════
echo   Run: npx cap open android
echo   Then click the Run button in Android Studio
echo.
pause
