@echo off
setlocal enabledelayedexpansion

echo =============================================
echo   E-Shop Android Setup Verification
echo =============================================
echo.

set "PASS=0"
set "FAIL=0"

:: Check Node.js
echo [1/12] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js installed
    set /a PASS+=1
) else (
    echo ❌ Node.js NOT installed
    set /a FAIL+=1
)

:: Check npm
echo [2/12] Checking npm...
npm --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ npm installed
    set /a PASS+=1
) else (
    echo ❌ npm NOT installed
    set /a FAIL+=1
)

:: Check Java
echo [3/12] Checking Java...
java -version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Java installed
    set /a PASS+=1
) else (
    echo ❌ Java NOT installed
    set /a FAIL+=1
)

:: Check Android SDK
echo [4/12] Checking Android SDK...
if exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    echo ✅ Android SDK found
    set /a PASS+=1
) else (
    if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" (
        echo ✅ Android SDK found
        set /a PASS+=1
    ) else (
        echo ❌ Android SDK NOT found
        set /a FAIL+=1
    )
)

:: Check Capacitor in package.json
echo [5/12] Checking Capacitor dependencies...
cd /d "e:\MINI PROJECT\ECommerceApp\frontend"
findstr /C:"@capacitor/core" package.json >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Capacitor dependencies found
    set /a PASS+=1
) else (
    echo ❌ Capacitor dependencies NOT found
    set /a FAIL+=1
)

:: Check capacitor.config.json
echo [6/12] Checking capacitor.config.json...
if exist "capacitor.config.json" (
    echo ✅ capacitor.config.json exists
    set /a PASS+=1
) else (
    echo ❌ capacitor.config.json NOT found
    set /a FAIL+=1
)

:: Check android folder
echo [7/12] Checking android platform...
if exist "android\build.gradle" (
    echo ✅ Android platform initialized
    set /a PASS+=1
) else (
    echo ❌ Android platform NOT initialized
    set /a FAIL+=1
)

:: Check build folder
echo [8/12] Checking build folder...
if exist "build\index.html" (
    echo ✅ Build folder exists with content
    set /a PASS+=1
) else (
    echo ⚠️  Build folder missing - run: npm run build
    set /a FAIL+=1
)

:: Check gradlew
echo [9/12] Checking Gradle wrapper...
if exist "android\gradlew.bat" (
    echo ✅ Gradle wrapper found
    set /a PASS+=1
) else (
    echo ❌ Gradle wrapper NOT found
    set /a FAIL+=1
)

:: Check AndroidManifest.xml
echo [10/12] Checking AndroidManifest.xml...
if exist "android\app\src\main\AndroidManifest.xml" (
    echo ✅ AndroidManifest.xml found
    set /a PASS+=1
) else (
    echo ❌ AndroidManifest.xml NOT found
    set /a FAIL+=1
)

:: Check backend server
echo [11/12] Checking backend server...
curl -s http://localhost:5000 >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Backend server is running
    set /a PASS+=1
) else (
    echo ⚠️  Backend server NOT running (start with: npm start in backend folder)
    set /a FAIL+=1
)

:: Check Capacitor plugins
echo [12/12] Checking Capacitor plugins...
findstr /C:"@capacitor/splash-screen" package.json >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Capacitor plugins installed
    set /a PASS+=1
) else (
    echo ⚠️  Some Capacitor plugins may be missing
    set /a FAIL+=1
)

echo.
echo =============================================
echo   Verification Results
echo =============================================
echo.
echo ✅ Passed: %PASS%/12
echo ❌ Failed: %FAIL%/12
echo.

if %FAIL% == 0 (
    echo 🎉 All checks passed! You're ready to build the Android app.
    echo.
    echo Next steps:
    echo   1. Make sure backend is running: npm start in backend folder
    echo   2. Build React app: npm run build
    echo   3. Sync with Android: npx cap sync android
    echo   4. Open in Android Studio: npx cap open android
    echo   5. Click the Run button
) else (
    echo ⚠️  Some checks failed. Please fix the issues above.
    echo.
    if %FAIL% LSS 4 (
        echo You can still try running the app, but it may not work properly.
    ) else (
        echo Please install missing prerequisites before proceeding.
    )
)

echo.
pause
