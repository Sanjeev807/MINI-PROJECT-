# E-Shop Android Application - Complete Setup Guide

## ✅ Capacitor Configuration Complete

Your React web application has been successfully configured for Android using Capacitor.

---

## 📱 Application Configuration

- **App ID**: `com.myapp.eshop`
- **App Name**: E-Shop
- **Build Directory**: `build`
- **Android SDK**: 
  - Minimum SDK: 23 (Android 6.0)
  - Target SDK: 35 (Android 14)
  - Compile SDK: 35
- **Android Gradle Plugin**: 8.7.2

---

## 🚀 How to Run the Project in Android Studio

### **STEP 1: Start Backend Server (REQUIRED)**

The Android app needs the backend API running. Open a terminal and run:

```bash
cd "e:\MINI PROJECT\ECommerceApp\backend"
npm start
```

**Backend will run on:** `http://localhost:5000`
**Android app will connect to:** `http://10.0.2.2:5000` (emulator) or `http://192.168.x.x:5000` (physical device)

---

### **STEP 2: Build React App for Production**

```bash
cd "e:\MINI PROJECT\ECommerceApp\frontend"
set DISABLE_ESLINT_PLUGIN=true
npm run build
```

**This creates the optimized production build in the `build/` folder.**

---

### **STEP 3: Sync Web Build with Android**

```bash
npx cap sync android
```

**This copies the web build to Android and updates native dependencies.**

---

### **STEP 4: Open Project in Android Studio**

```bash
npx cap open android
```

**Or manually:**
1. Open Android Studio
2. Click "Open an Existing Project"
3. Navigate to: `e:\MINI PROJECT\ECommerceApp\frontend\android`
4. Click "OK"

---

### **STEP 5: Wait for Gradle Sync**

After opening in Android Studio:
- Gradle will automatically start syncing (see bottom status bar)
- **Wait 2-5 minutes** for first-time sync
- You'll see "Gradle sync finished" when complete

---

### **STEP 6: Create/Select Android Emulator**

**Option A: Create New Emulator**
1. Click **Device Manager** icon (phone icon on right)
2. Click **"Create Device"**
3. Select **Pixel 5** or **Pixel 6**
4. Click **Next**
5. Select **Android 11 (API 30)** or higher
6. Click **Download** if needed, then **Next** → **Finish**

**Option B: Use Existing Emulator**
- Select from the device dropdown at the top

**Option C: Use Physical Device**
1. Enable Developer Options on your Android phone
2. Enable USB Debugging
3. Connect via USB
4. Select your device from the dropdown

---

### **STEP 7: Run the App**

1. Make sure your device/emulator is selected in the dropdown
2. Click the green **▶️ Run** button (or press `Shift + F10`)
3. Wait for build to complete (5-10 minutes first time)
4. App will install and launch automatically

---

## 🛠️ Alternative: Build APK Without Android Studio

### **Option 1: Use the Batch Script**

Double-click: `e:\MINI PROJECT\ECommerceApp\frontend\build-android-apk.bat`

This script will:
- Build React app
- Sync with Capacitor
- Build Android APK using Gradle
- Show APK location

### **Option 2: Manual Commands**

```bash
cd "e:\MINI PROJECT\ECommerceApp\frontend"

# Build React app
set DISABLE_ESLINT_PLUGIN=true
npm run build

# Sync with Android
npx cap sync android

# Build APK
cd android
gradlew.bat assembleDebug
cd ..
```

**APK Location:** `android\app\build\outputs\apk\debug\app-debug.apk`

---

## 📲 Installing APK on Device

### **On Emulator:**
```bash
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

### **On Physical Device:**
1. Enable USB Debugging
2. Connect phone via USB
3. Run:
```bash
adb devices  # Verify connection
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🔄 After Making Code Changes

Whenever you modify React code:

```bash
# 1. Rebuild React app
npm run build

# 2. Sync with Android
npx cap sync android

# 3. Rebuild in Android Studio (click Run button)
# OR rebuild APK using gradlew
```

---

## 🔌 Capacitor Plugins Installed

✅ **@capacitor/core** - Core functionality
✅ **@capacitor/android** - Android platform
✅ **@capacitor/splash-screen** - Splash screen control
✅ **@capacitor/status-bar** - Status bar styling
✅ **@capacitor/network** - Network status monitoring

---

## 🌐 API Configuration

The app automatically detects the platform and uses the correct API URL:

- **Web Browser**: `http://localhost:5000`
- **Android Emulator**: `http://10.0.2.2:5000`
- **Physical Device**: You may need to update to your computer's local IP

**To update for physical device:**
Edit `frontend/src/services/api.js` and replace `10.0.2.2` with your computer's IP address (find it using `ipconfig`).

---

## ✅ Verification Checklist

Before running the app, ensure:

- [ ] Node.js installed (v16+)
- [ ] Android Studio installed
- [ ] Android SDK installed (via Android Studio)
- [ ] JDK 11 or 17 installed
- [ ] Backend server is running
- [ ] React app built successfully
- [ ] Capacitor sync completed
- [ ] Emulator created or device connected

---

## 🐛 Common Issues & Solutions

### **Issue: "Gradle sync failed"**
**Solution:** 
- Check internet connection
- File → Invalidate Caches → Invalidate and Restart
- Tools → SDK Manager → Install recommended updates

### **Issue: "SDK not found"**
**Solution:**
- Open Android Studio
- Tools → SDK Manager
- Install Android SDK Platform 35 and Build Tools

### **Issue: "App shows blank screen"**
**Solution:**
- Verify backend is running (`http://localhost:5000`)
- Check API URL configuration in `src/services/api.js`
- Clear app data in emulator settings

### **Issue: "Cannot connect to API"**
**Solution:**
- Emulator: Use `http://10.0.2.2:5000`
- Physical device: Use your computer's local IP
- Check firewall settings

### **Issue: Java version error**
**Solution:**
- Install JDK 17 (recommended)
- Set JAVA_HOME environment variable
- Restart Android Studio

---

## 📊 Build Times

- **First build**: 10-15 minutes (downloading dependencies)
- **Subsequent builds**: 2-5 minutes
- **Gradle sync**: 2-5 minutes first time, 30 seconds after

---

## 🎯 Quick Start Commands

**Complete workflow in one terminal session:**

```bash
# Terminal 1: Start backend
cd "e:\MINI PROJECT\ECommerceApp\backend"
npm start

# Terminal 2: Build and run Android
cd "e:\MINI PROJECT\ECommerceApp\frontend"
set DISABLE_ESLINT_PLUGIN=true && npm run build && npx cap sync android && npx cap open android
```

Then click Run in Android Studio!

---

## 📱 App Features Verified for Android

✅ Product listing and filtering
✅ Category navigation
✅ Search functionality
✅ Shopping cart
✅ User authentication
✅ Admin dashboard
✅ Order management
✅ Push notifications (via Firebase)
✅ Promotional banners
✅ All API endpoints

---

## 🔐 Security Configuration

- ✅ HTTPS scheme enabled
- ✅ Cleartext traffic allowed (for development)
- ✅ Mixed content allowed
- ✅ Network security config applied
- ✅ Internet permission granted

---

## 📞 Support

If you encounter any issues:

1. Check the console in Android Studio (Logcat)
2. Verify all prerequisites are installed
3. Ensure backend is running
4. Try cleaning and rebuilding: Build → Clean Project → Rebuild Project

---

**🎉 Your E-Shop Android app is ready to run!**

Follow the steps above and your app will be running on Android in minutes.
