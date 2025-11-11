# 🚀 Deployment Guide

Complete guide to deploying your React Native E-Commerce app to production.

## 📱 Pre-Deployment Checklist

### Code Quality
- [ ] All features tested and working
- [ ] No console warnings or errors
- [ ] Code formatted with Prettier
- [ ] ESLint warnings resolved
- [ ] Remove all debug logs
- [ ] Update version numbers

### Configuration
- [ ] Environment variables configured
- [ ] API endpoints point to production
- [ ] Firebase configured for production
- [ ] App icons and splash screens added
- [ ] App name and bundle ID set

### Security
- [ ] Remove sensitive data from code
- [ ] API keys in environment variables
- [ ] ProGuard enabled (Android)
- [ ] Code obfuscation enabled
- [ ] SSL pinning implemented (optional)

---

## 🤖 Android Deployment

### 1. Update App Configuration

**File: `android/app/build.gradle`**
```gradle
android {
    defaultConfig {
        applicationId "com.ecommerceapp"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
}
```

### 2. Generate Signing Key

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore shopapp-release-key.keystore -alias shopapp-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Remember**: Save the keystore password securely!

### 3. Configure Signing

**File: `android/gradle.properties`**
```properties
MYAPP_RELEASE_STORE_FILE=shopapp-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=shopapp-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

**File: `android/app/build.gradle`**
```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 4. Build Release APK

```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

**Output**: `android/app/build/outputs/apk/release/app-release.apk`

### 5. Build Release AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

**Output**: `android/app/build/outputs/bundle/release/app-release.aab`

### 6. Test Release Build

```bash
# Install on device
adb install android/app/build/outputs/apk/release/app-release.apk

# Or
npm run android -- --variant=release
```

### 7. Prepare for Google Play Store

#### 7.1 Create Developer Account
- Sign up at [Google Play Console](https://play.google.com/console)
- Pay one-time $25 registration fee

#### 7.2 Create App Listing
- App name: ShopApp
- Description: Write compelling description
- Screenshots: Prepare screenshots (at least 2)
- Feature graphic: 1024 x 500 px
- App icon: 512 x 512 px

#### 7.3 Upload AAB
1. Go to Production → Releases
2. Create new release
3. Upload `app-release.aab`
4. Add release notes
5. Review and publish

#### 7.4 App Content
- Content rating questionnaire
- Target audience
- Privacy policy (required)
- Data safety form

---

## 🍎 iOS Deployment

### 1. Update App Configuration

**File: `ios/ecommerceapp/Info.plist`**
```xml
<key>CFBundleDisplayName</key>
<string>ShopApp</string>
<key>CFBundleIdentifier</key>
<string>com.ecommerceapp</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

### 2. Configure Xcode Project

1. Open `ios/ecommerceapp.xcworkspace` in Xcode
2. Select project in navigator
3. Update:
   - Display Name: ShopApp
   - Bundle Identifier: com.ecommerceapp
   - Version: 1.0.0
   - Build: 1

### 3. Add App Icons

1. Prepare app icons (use [App Icon Generator](https://appicon.co/))
2. Add to `ios/ecommerceapp/Images.xcassets/AppIcon.appiconset/`

### 4. Add Launch Screen

1. Design launch screen
2. Add to `ios/ecommerceapp/LaunchScreen.storyboard`

### 5. Configure Signing

1. In Xcode, select project
2. Go to Signing & Capabilities
3. Select your Team
4. Enable "Automatically manage signing"

### 6. Archive App

1. Select "Any iOS Device" as build target
2. Product → Archive
3. Wait for archive to complete
4. Organizer window opens

### 7. Upload to App Store

1. In Organizer, click "Distribute App"
2. Select "App Store Connect"
3. Click "Upload"
4. Wait for processing

### 8. Prepare for App Store

#### 8.1 Create Developer Account
- Sign up at [Apple Developer](https://developer.apple.com/)
- $99/year subscription

#### 8.2 App Store Connect Setup
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Create new app
3. Fill in app information:
   - Name: ShopApp
   - Primary language: English
   - Bundle ID: com.ecommerceapp
   - SKU: unique identifier

#### 8.3 App Information
- Description: Compelling app description
- Keywords: Relevant search keywords
- Screenshots: Required for all device sizes
- Preview videos: Optional but recommended
- App icon: 1024 x 1024 px

#### 8.4 Submit for Review
1. Select the build
2. Complete all sections
3. Submit for review
4. Wait for approval (1-7 days)

---

## 🌐 Environment Configuration

### Production Environment Variables

**File: `.env.production`**
```env
API_URL=https://your-production-api.com
FIREBASE_API_KEY=your_production_firebase_key
ENVIRONMENT=production
```

### Load Environment

**File: `babel.config.js`**
```javascript
module.exports = {
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env.production',
    }],
  ],
};
```

---

## 📊 App Store Optimization (ASO)

### App Title
- Keep it under 30 characters
- Include primary keyword
- Example: "ShopApp - Online Shopping"

### Description
- First 170 characters are crucial (preview text)
- Highlight key features
- Include relevant keywords
- Use bullet points

### Keywords (iOS only)
- 100 characters max
- Comma-separated
- No spaces after commas
- Example: "shop,buy,deals,fashion,electronics,online"

### Screenshots
- Show key features
- Use captions
- Maintain consistency
- Update regularly

### Ratings & Reviews
- Prompt users to rate
- Respond to reviews
- Address negative feedback
- Maintain high rating

---

## 🔍 Testing Before Release

### Beta Testing

#### Android - Google Play Internal Testing
1. Upload AAB to Internal Testing track
2. Add testers via email
3. Share testing link
4. Collect feedback

#### iOS - TestFlight
1. Upload build to App Store Connect
2. Add internal/external testers
3. Distribute via TestFlight
4. Monitor crash reports

### Test Checklist
- [ ] All features work
- [ ] No crashes
- [ ] Performance is good
- [ ] UI looks correct on all devices
- [ ] Push notifications work
- [ ] API calls succeed
- [ ] Payments work (if implemented)
- [ ] Deep links work

---

## 📈 Post-Launch

### Monitoring
- Crashlytics for crash reporting
- Analytics for user behavior
- Performance monitoring
- API monitoring

### Updates
- Regular bug fixes
- New features
- Performance improvements
- Security patches

### Marketing
- Social media promotion
- App Store optimization
- User engagement campaigns
- Referral programs

---

## 🔧 Continuous Deployment (CI/CD)

### GitHub Actions (Example)

**File: `.github/workflows/android-release.yml`**
```yaml
name: Android Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up JDK
        uses: actions/setup-java@v2
        with:
          java-version: '11'
      - name: Install dependencies
        run: npm install
      - name: Build Android Release
        run: |
          cd android
          ./gradlew assembleRelease
      - name: Upload APK
        uses: actions/upload-artifact@v2
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/app-release.apk
```

---

## 📝 Version Management

### Semantic Versioning
- Format: MAJOR.MINOR.PATCH (e.g., 1.0.0)
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

### Update Version

**Android**: `android/app/build.gradle`
```gradle
versionCode 2
versionName "1.0.1"
```

**iOS**: Xcode project settings or `Info.plist`
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.1</string>
<key>CFBundleVersion</key>
<string>2</string>
```

---

## 🔐 Security Best Practices

### Before Release
- Remove all console.log statements
- Enable ProGuard/R8 (Android)
- Enable code obfuscation
- Implement SSL pinning
- Validate all user inputs
- Use HTTPS only
- Secure API keys
- Enable app encryption

### Play Store Security
- Add security contact
- Complete Data Safety form
- Implement in-app updates
- Regular security audits

---

## ✅ Final Checklist

### Before Submission
- [ ] Tested on multiple devices
- [ ] All features working
- [ ] No crashes or bugs
- [ ] Performance optimized
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] App icons and screenshots ready
- [ ] Description written
- [ ] Keywords optimized
- [ ] Signing keys secured
- [ ] Environment variables set
- [ ] Analytics integrated
- [ ] Crash reporting setup

### After Submission
- [ ] Monitor reviews
- [ ] Track analytics
- [ ] Respond to users
- [ ] Plan updates
- [ ] Market the app

---

## 🎉 Congratulations!

Your app is now ready for production! 🚀

For support, check:
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/support/app-store-connect/)

**Good luck with your app launch! 🌟**
