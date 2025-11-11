# ⚡ Quick Start Guide

Get the React Native E-Commerce app running in 5 minutes!

## 🎯 Prerequisites

- Node.js installed
- Android Studio (for Android) or Xcode (for iOS)
- Backend server running

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd ECommerceApp/frontend
npm install
```

### 2. Configure Backend URL

Create `.env` file:

```bash
# For Android Emulator
API_URL=http://10.0.2.2:5000

# For iOS Simulator
API_URL=http://localhost:5000
```

### 3. Run the App

**Android:**
```bash
npm run android
```

**iOS (macOS only):**
```bash
cd ios && pod install && cd ..
npm run ios
```

## 📱 First Run

1. App will open in emulator/simulator
2. You'll see the Login screen
3. Click "Sign Up" to create an account
4. Or use test credentials:
   - Email: test@example.com
   - Password: test123

## ✨ Key Features to Test

1. **Browse Products** - Home screen shows product carousel and listings
2. **Search** - Use search bar in header
3. **Categories** - Browse by category from Categories tab
4. **Add to Cart** - Click product > Add to Cart
5. **Wishlist** - Heart icon on products
6. **Profile** - View user info and settings
7. **Cart** - Check cart and proceed to checkout

## 🔧 Quick Fixes

**Metro bundler not starting?**
```bash
npm start -- --reset-cache
```

**Build errors?**
```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod install && cd ..
```

**Can't connect to backend?**
- Make sure backend is running on port 5000
- Check your `.env` file has the correct URL
- For physical device, use your computer's IP

## 📚 Full Documentation

For detailed setup and troubleshooting, see:
- [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- [README.md](./README.md)

## 🎉 You're Ready!

The app should now be running. Explore all features and enjoy! 🚀
