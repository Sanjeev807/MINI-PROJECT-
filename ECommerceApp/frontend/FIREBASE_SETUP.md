# Firebase Setup Guide for E-Commerce App

This guide will help you set up Firebase Cloud Messaging (FCM) for push notifications.

## 📱 Step-by-Step Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `ecommerce-app` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 2. Setup Firebase for Android

#### 2.1 Register Android App

1. In Firebase Console, click **"Add app"** → Select **Android**
2. Enter Android package name: `com.ecommerceapp`
3. Optional: Enter app nickname and SHA-1
4. Click **"Register app"**

#### 2.2 Download Configuration File

1. Download `google-services.json`
2. Place it in: `frontend/android/app/google-services.json`

#### 2.3 Add Firebase SDK

**File: `android/build.gradle`**
```gradle
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.4.2'
        classpath 'com.google.gms:google-services:4.3.15'  // Add this line
    }
}
```

**File: `android/app/build.gradle`**
```gradle
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services'  // Add this line at the bottom

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.3.1')
    implementation 'com.google.firebase:firebase-messaging'
}
```

### 3. Setup Firebase for iOS

#### 3.1 Register iOS App

1. In Firebase Console, click **"Add app"** → Select **iOS**
2. Enter iOS bundle ID: `com.ecommerceapp`
3. Optional: Enter app nickname
4. Click **"Register app"**

#### 3.2 Download Configuration File

1. Download `GoogleService-Info.plist`
2. Open `frontend/ios/ecommerceapp.xcworkspace` in Xcode
3. Drag `GoogleService-Info.plist` into the project (make sure "Copy items if needed" is checked)

#### 3.3 Configure Podfile

**File: `ios/Podfile`**
```ruby
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '13.0'

use_frameworks! :linkage => :static
$RNFirebaseAsStaticFramework = true

target 'ecommerceapp' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true
  )

  # Add Firebase pods
  pod 'Firebase/Core'
  pod 'Firebase/Messaging'
end
```

Install pods:
```bash
cd ios && pod install && cd ..
```

### 4. Enable Cloud Messaging

1. In Firebase Console, go to **"Cloud Messaging"**
2. Note your **Server Key** (for backend)
3. Save the **Sender ID**

### 5. Update Backend with Firebase Credentials

In your backend `.env` file, add:

```env
FIREBASE_SERVER_KEY=your_firebase_server_key_here
```

### 6. Configure Notification Permissions

The app already includes permission requests in `src/services/notificationService.js`

For iOS, add to `ios/ecommerceapp/Info.plist`:
```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

### 7. Test Notifications

#### Send Test Notification from Firebase Console

1. Go to Firebase Console → Cloud Messaging
2. Click **"Send your first message"**
3. Enter notification title and text
4. Click **"Send test message"**
5. Enter your FCM token (logged in app console)
6. Click **"Test"**

#### Send Notification from Backend

Use the backend API endpoint:
```bash
POST http://localhost:5000/api/notifications/send
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
Body: {
  "title": "Test Notification",
  "body": "This is a test notification",
  "userId": "user_id_here"
}
```

## 🔧 Troubleshooting

### Android Issues

**Problem**: google-services.json not found
- **Solution**: Make sure file is in `android/app/` directory
- Rebuild: `cd android && ./gradlew clean && cd .. && npm run android`

**Problem**: Duplicate class errors
- **Solution**: Add to `android/gradle.properties`:
  ```
  android.enableJetifier=true
  ```

### iOS Issues

**Problem**: GoogleService-Info.plist not found
- **Solution**: Make sure file is added to Xcode project, not just copied to folder

**Problem**: Pod install fails
- **Solution**: 
  ```bash
  cd ios
  pod deintegrate
  rm -rf Pods Podfile.lock
  pod install
  cd ..
  ```

### Notification Not Received

1. Check app has notification permissions
2. Verify FCM token is generated (check console logs)
3. Ensure Firebase configuration files are correctly placed
4. Make sure app is properly registered in Firebase Console
5. For iOS, check that APNs is configured in Firebase

## 📝 FCM Token Management

The app automatically:
- Requests notification permission on launch
- Retrieves FCM token
- Logs token to console (check Metro bundler logs)
- Can send token to backend for storing

To get the token in your app:
```javascript
import { getFCMToken } from './src/services/notificationService';

const token = await getFCMToken();
console.log('FCM Token:', token);
```

## 🔐 Security Notes

- Never commit `google-services.json` or `GoogleService-Info.plist` to public repos
- Add to `.gitignore`:
  ```
  android/app/google-services.json
  ios/GoogleService-Info.plist
  ```
- Keep your Firebase Server Key secure
- Use environment variables for sensitive data

## 📚 Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase](https://rnfirebase.io/)
- [FCM Setup Guide](https://firebase.google.com/docs/cloud-messaging/android/client)

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Android app registered in Firebase
- [ ] `google-services.json` downloaded and placed correctly
- [ ] iOS app registered in Firebase
- [ ] `GoogleService-Info.plist` downloaded and added to Xcode
- [ ] Gradle files updated with Firebase dependencies
- [ ] Podfile updated and pods installed
- [ ] App builds successfully on Android
- [ ] App builds successfully on iOS
- [ ] Notification permissions requested
- [ ] FCM token generated and logged
- [ ] Test notification received successfully

---

**You're all set! 🎉 Your app is now ready to receive push notifications.**
