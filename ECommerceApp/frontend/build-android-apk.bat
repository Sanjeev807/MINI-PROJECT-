@echo off
echo ========================================
echo   E-Shop Android Build Script
echo ========================================
echo.

echo [1/4] Building React production bundle...
cd /d "e:\MINI PROJECT\ECommerceApp\frontend"
set DISABLE_ESLINT_PLUGIN=true
call npm run build
if %errorlevel% neq 0 (
    echo ❌ React build failed!
    pause
    exit /b 1
)
echo ✅ React build complete
echo.

echo [2/4] Syncing with Capacitor Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor sync failed!
    pause
    exit /b 1
)
echo ✅ Sync complete
echo.

echo [3/4] Building Android APK with Gradle...
cd android
if exist gradlew.bat (
    call gradlew.bat assembleDebug
    if %errorlevel% neq 0 (
        echo ❌ Gradle build failed!
        echo Try opening in Android Studio: npx cap open android
        cd ..
        pause
        exit /b 1
    )
) else (
    echo ❌ gradlew.bat not found!
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ APK built successfully!
echo.

echo [4/4] APK Location:
echo %cd%\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Installation Options:
echo   A. Emulator: adb install -r android\app\build\outputs\apk\debug\app-debug.apk
echo   B. Device: Connect phone and run same adb command
echo   C. Android Studio: npx cap open android then click Run
echo.
pause
