@echo off
setlocal enabledelayedexpansion
color 0A

:MENU
cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║          E-SHOP ANDROID APPLICATION LAUNCHER           ║
echo ║                    Capacitor 7.4.4                     ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo   [1] 🚀 Quick Start (Build + Open Android Studio)
echo   [2] 📱 Build APK Only
echo   [3] ✅ Verify Setup
echo   [4] 🔄 Rebuild React App
echo   [5] 🔌 Sync with Android
echo   [6] 🖥️  Open in Android Studio
echo   [7] 🏗️  Full Clean Build
echo   [8] 📋 Show Configuration
echo   [9] ❌ Exit
echo.
set /p choice="Select option (1-9): "

if "%choice%"=="1" goto QUICKSTART
if "%choice%"=="2" goto BUILD_APK
if "%choice%"=="3" goto VERIFY
if "%choice%"=="4" goto BUILD_REACT
if "%choice%"=="5" goto SYNC
if "%choice%"=="6" goto OPEN_STUDIO
if "%choice%"=="7" goto CLEAN_BUILD
if "%choice%"=="8" goto SHOW_CONFIG
if "%choice%"=="9" goto END
goto MENU

:QUICKSTART
cls
echo ╔════════════════════════════════════════════════════════╗
echo ║                     QUICK START                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo This will:
echo   1. Build React production bundle
echo   2. Sync with Capacitor
echo   3. Open Android Studio
echo.
echo ⚠️  Make sure backend is running first!
echo.
pause

cd /d "e:\MINI PROJECT\ECommerceApp\frontend"

echo [1/3] Building React app...
set DISABLE_ESLINT_PLUGIN=true
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    goto MENU
)
echo ✅ React build complete
echo.

echo [2/3] Syncing with Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Sync failed!
    pause
    goto MENU
)
echo ✅ Sync complete
echo.

echo [3/3] Opening Android Studio...
call npx cap open android
echo.
echo ✅ Android Studio is opening!
echo.
echo Next steps in Android Studio:
echo   1. Wait for Gradle sync (2-5 min)
echo   2. Create/select emulator
echo   3. Click the green Run button
echo.
pause
goto MENU

:BUILD_APK
cls
echo ╔════════════════════════════════════════════════════════╗
echo ║                    BUILD APK                           ║
echo ╚════════════════════════════════════════════════════════╝
echo.
cd /d "e:\MINI PROJECT\ECommerceApp\frontend"

echo [1/4] Building React app...
set DISABLE_ESLINT_PLUGIN=true
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    goto MENU
)
echo ✅ React build complete
echo.

echo [2/4] Syncing with Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Sync failed!
    pause
    goto MENU
)
echo ✅ Sync complete
echo.

echo [3/4] Building APK with Gradle...
cd android
if exist gradlew.bat (
    call gradlew.bat assembleDebug
    if %errorlevel% neq 0 (
        echo ❌ APK build failed!
        cd ..
        pause
        goto MENU
    )
) else (
    echo ❌ gradlew.bat not found!
    cd ..
    pause
    goto MENU
)
cd ..
echo ✅ APK built successfully!
echo.

echo [4/4] APK Location:
echo %cd%\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo To install:
echo   adb install -r android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
goto MENU

:VERIFY
cls
echo ╔════════════════════════════════════════════════════════╗
echo ║                  VERIFY SETUP                          ║
echo ╚════════════════════════════════════════════════════════╝
echo.
cd /d "e:\MINI PROJECT\ECommerceApp\frontend"
if exist verify-setup.bat (
    call verify-setup.bat
) else (
    echo Verification script not found!
    pause
)
goto MENU

:BUILD_REACT
cls
echo ╔════════════════════════════════════════════════════════╗
echo ║                 REBUILD REACT APP                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.
cd /d "e:\MINI PROJECT\ECommerceApp\frontend"
set DISABLE_ESLINT_PLUGIN=true
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
) else (
    echo ✅ Build complete!
)
pause
goto MENU

:SYNC
cls
echo ╔════════════════════════════════════════════════════════╗
echo ║                 SYNC WITH ANDROID                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.
cd /d "e:\MINI PROJECT\ECommerceApp\frontend"
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Sync failed!
) else (
    echo ✅ Sync complete!
)
pause
goto MENU

:OPEN_STUDIO
cls
echo ╔════════════════════════════════════════════════════════╗
echo ║              OPEN ANDROID STUDIO                       ║
echo ╚════════════════════════════════════════════════════════╝
echo.
cd /d "e:\MINI PROJECT\ECommerceApp\frontend"
call npx cap open android
echo ✅ Android Studio is opening...
pause
goto MENU

:CLEAN_BUILD
cls
echo ╔════════════════════════════════════════════════════════╗
echo ║                  CLEAN BUILD                           ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo This will:
echo   - Delete build folder
echo   - Clean Gradle cache
echo   - Rebuild everything
echo.
pause

cd /d "e:\MINI PROJECT\ECommerceApp\frontend"

echo [1/4] Cleaning build folder...
if exist build rmdir /s /q build
echo ✅ Build folder cleaned
echo.

echo [2/4] Cleaning Gradle...
cd android
if exist gradlew.bat call gradlew.bat clean
cd ..
echo ✅ Gradle cleaned
echo.

echo [3/4] Rebuilding React...
set DISABLE_ESLINT_PLUGIN=true
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    goto MENU
)
echo ✅ React rebuilt
echo.

echo [4/4] Syncing with Android...
call npx cap sync android
echo ✅ Clean build complete!
echo.
pause
goto MENU

:SHOW_CONFIG
cls
echo ╔════════════════════════════════════════════════════════╗
echo ║                  CONFIGURATION                         ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo App Configuration:
echo   App ID: com.myapp.eshop
echo   App Name: E-Shop
echo   Web Dir: build
echo.
echo SDK Versions:
echo   Min SDK: 23 (Android 6.0)
echo   Target SDK: 35 (Android 14)
echo   Compile SDK: 35
echo.
echo Gradle:
echo   Android Gradle Plugin: 8.7.2
echo   Gradle Version: 8.11.1
echo.
echo Capacitor Plugins:
echo   - @capacitor/core (7.4.4)
echo   - @capacitor/android (7.4.4)
echo   - @capacitor/splash-screen (7.0.3)
echo   - @capacitor/status-bar (7.0.3)
echo   - @capacitor/network (7.0.2)
echo.
echo API URLs:
echo   Backend: http://localhost:5000
echo   Emulator: http://10.0.2.2:5000
echo.
echo Project Path:
echo   Frontend: e:\MINI PROJECT\ECommerceApp\frontend
echo   Android: e:\MINI PROJECT\ECommerceApp\frontend\android
echo.
pause
goto MENU

:END
cls
echo.
echo Thank you for using E-Shop Android Launcher!
echo.
timeout /t 2 >nul
exit

