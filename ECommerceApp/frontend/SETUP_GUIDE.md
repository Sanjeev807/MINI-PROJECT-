# 🚀 React Native Frontend Setup Guide

Complete step-by-step guide to set up and run the E-Commerce React Native app.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** or **yarn**
   - npm comes with Node.js
   - Verify: `npm --version`

3. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

### For Android Development

4. **Java Development Kit (JDK 11)**
   - Download from: https://www.oracle.com/java/technologies/downloads/

5. **Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API Level 33 or higher)
   - Set up Android environment variables:
     ```bash
     # Add to your ~/.bashrc or ~/.zshrc
     export ANDROID_HOME=$HOME/Android/Sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/tools/bin
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

### For iOS Development (macOS only)

6. **Xcode** (latest version)
   - Download from Mac App Store
   - Install Command Line Tools:
     ```bash
     xcode-select --install
     ```

7. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

---

## 🛠 Installation Steps

### Step 1: Navigate to Frontend Directory

```bash
cd ECommerceApp/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

Or if you prefer yarn:
```bash
yarn install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the frontend directory:

```bash
# For local backend (same machine)
API_URL=http://localhost:5000

# For Android Emulator (accessing localhost)
# API_URL=http://10.0.2.2:5000

# For iOS Simulator (accessing localhost)
# API_URL=http://localhost:5000

# For Physical Device (replace with your computer's IP)
# API_URL=http://192.168.1.100:5000

# For deployed backend
# API_URL=https://your-backend.onrender.com
```

### Step 4: Setup Firebase (for Push Notifications)

#### 4.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the wizard
3. Enable Cloud Messaging in Firebase Console

#### 4.2 Setup for Android

1. In Firebase Console, add an Android app
2. Register with package name: `com.ecommerceapp`
3. Download `google-services.json`
4. Place it in `android/app/` directory

Add to `android/build.gradle`:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

Add to `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.3.1')
}
```

#### 4.3 Setup for iOS

1. In Firebase Console, add an iOS app
2. Register with bundle ID: `com.ecommerceapp`
3. Download `GoogleService-Info.plist`
4. Open `ios/ecommerceapp.xcworkspace` in Xcode
5. Drag `GoogleService-Info.plist` into the project

Add to `ios/Podfile`:
```ruby
use_frameworks! :linkage => :static
$RNFirebaseAsStaticFramework = true
```

Install iOS dependencies:
```bash
cd ios && pod install && cd ..
```

---

## 🏃 Running the App

### Start Metro Bundler

In the frontend directory:
```bash
npm start
```

Or to clear cache:
```bash
npm start -- --reset-cache
```

### Run on Android

#### Option 1: Android Emulator

1. Open Android Studio
2. Open AVD Manager (Tools > AVD Manager)
3. Create or start an Android Virtual Device
4. In a new terminal, run:
   ```bash
   npm run android
   ```

#### Option 2: Physical Android Device

1. Enable Developer Options on your device
2. Enable USB Debugging
3. Connect device via USB
4. Verify connection: `adb devices`
5. Run: `npm run android`

### Run on iOS (macOS only)

#### Option 1: iOS Simulator

```bash
npm run ios
```

To specify a device:
```bash
npm run ios -- --simulator="iPhone 14 Pro"
```

#### Option 2: Physical iOS Device

1. Open `ios/ecommerceapp.xcworkspace` in Xcode
2. Select your device from the device dropdown
3. Click the Run button or press Cmd+R

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Metro Bundler Issues

**Problem**: Metro bundler won't start or shows errors

**Solution**:
```bash
# Clear Metro cache
npm start -- --reset-cache

# Clear watchman
watchman watch-del-all

# Delete node_modules and reinstall
rm -rf node_modules && npm install
```

#### 2. Android Build Failures

**Problem**: Gradle build fails

**Solution**:
```bash
# Clean Gradle build
cd android && ./gradlew clean && cd ..

# Delete build folder
cd android && rm -rf .gradle build app/build && cd ..

# Rebuild
npm run android
```

#### 3. iOS Build Failures

**Problem**: CocoaPods or build errors

**Solution**:
```bash
# Clean iOS build
cd ios && rm -rf Pods Podfile.lock build && cd ..

# Reinstall pods
cd ios && pod deintegrate && pod install && cd ..

# Clean Xcode build
# Open Xcode > Product > Clean Build Folder

# Rebuild
npm run ios
```

#### 4. Firebase Not Working

**Problem**: Push notifications not received

**Solution**:
- Verify `google-services.json` is in `android/app/`
- Verify `GoogleService-Info.plist` is added to Xcode project
- Rebuild the app completely after adding Firebase files
- Check Firebase Console for correct app configuration
- Verify notification permissions are granted

#### 5. Cannot Connect to Backend

**Problem**: API calls failing

**Solution**:
- Verify backend server is running
- Check `.env` file has correct `API_URL`
- For Android emulator, use `http://10.0.2.2:5000`
- For physical device, use your computer's IP address
- Ensure device/emulator is on the same network

#### 6. React Native Vector Icons Not Showing

**Problem**: Icons not displaying

**Solution**:
```bash
# For Android - already configured in build.gradle
# Just rebuild the app

# For iOS
cd ios && pod install && cd ..
npm run ios
```

---

## 📱 Testing the App

### Test User Account

For testing, you can create a test account or use:
- Email: test@example.com
- Password: test123

### Test Features Checklist

- ✅ Login/Register
- ✅ Browse products
- ✅ Search products
- ✅ Add to cart
- ✅ Update cart quantities
- ✅ Add to wishlist
- ✅ View product details
- ✅ Push notifications
- ✅ Profile management
- ✅ Order history

---

## 🔐 Production Build

### Android APK

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Android AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

AAB location: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS Archive (for App Store)

1. Open `ios/ecommerceapp.xcworkspace` in Xcode
2. Select "Any iOS Device" as the build destination
3. Product > Archive
4. Follow the archive organizer to upload to App Store

---

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Elements](https://reactnativeelements.com/)

---

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Search for the error message online
3. Check React Native GitHub issues
4. Ask in React Native community forums

---

## 📞 Support

For project-specific issues, please create an issue in the repository.

**Happy Coding! 🚀**
