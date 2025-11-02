# E-Commerce App - React Native Setup Guide

## ✅ Completed Tasks

### Backend (Fully Running)
- ✅ Node.js Express server running on `http://localhost:5000`
- ✅ MongoDB connected to `localhost:27017/ecommerce`
- ✅ 15 products seeded with Flipkart images
- ✅ All API endpoints functional:
  - `/api/auth` - Register, Login, Profile, FCM token
  - `/api/products` - CRUD, Search, Filter, Featured products
  - `/api/cart` - Add, Update, Remove, Clear cart
  - `/api/orders` - Create, Get orders, Order details, Cancel
  - `/api/notifications` - Get, Mark as read, Send notifications
- ✅ JWT authentication middleware
- ✅ Firebase Admin SDK integrated (placeholder config)
- ✅ Push notification service ready

### Frontend Web (HTML)
- ✅ Standalone Flipkart-style UI at `/frontend/index.html`
- ✅ Product grid with search and filters
- ✅ Can be opened in any browser to test backend

### Frontend React Native (Complete Structure)
- ✅ React Native 0.72.0 project initialized
- ✅ All dependencies installed (639 packages)
- ✅ Navigation configured (Stack + Bottom Tabs)
- ✅ State management (AuthContext, CartContext)
- ✅ API service layer with Axios
- ✅ Push notification service (FCM)
- ✅ All 13 screens created:
  1. ✅ HomeScreen - Featured products, categories, product grid
  2. ✅ LoginScreen - Email/password authentication
  3. ✅ RegisterScreen - User registration with notification opt-in
  4. ✅ CartScreen - Shopping cart with quantity controls
  5. ✅ CategoriesScreen - All product categories
  6. ✅ ProfileScreen - User profile and settings
  7. ✅ ProductDetailScreen - Product details with add to cart
  8. ✅ CategoryProductsScreen - Products by category
  9. ✅ SearchScreen - Live product search
  10. ✅ CheckoutScreen - Order placement with address
  11. ✅ OrdersScreen - Order history with status
  12. ✅ OrderDetailScreen - Detailed order view
  13. ✅ NotificationsScreen - Push notification inbox

---

## 🔧 Next Steps to Run the App

### Step 1: Firebase Configuration (CRITICAL)

#### A. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `ecommerce-app`
4. Disable Google Analytics (optional)
5. Click "Create Project"

#### B. Enable Firebase Cloud Messaging (FCM)
1. In Firebase Console, go to Project Settings (⚙️ icon)
2. Click on "Cloud Messaging" tab
3. Enable "Cloud Messaging API (Legacy)" if asked

#### C. Download Firebase Config Files

**For Android:**
1. In Firebase Console → Project Settings → Add app → Android (🤖)
2. Android package name: `com.ecommerceapp` (same as in `package.json`)
3. Download `google-services.json`
4. Create folder: `ECommerceApp/frontend/android/app/`
5. Place `google-services.json` in that folder

**For iOS (if testing on iOS):**
1. In Firebase Console → Project Settings → Add app → iOS (🍎)
2. iOS bundle ID: `com.ecommerceapp`
3. Download `GoogleService-Info.plist`
4. Place in `ECommerceApp/frontend/ios/` folder

#### D. Update Backend Firebase Credentials
1. In Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. **Replace** `backend/config/serviceAccountKey.json` with this file
5. Restart backend server:
   ```bash
   cd backend
   npm start
   ```

---

### Step 2: Android Setup

#### A. Install Android Studio
1. Download from [developer.android.com](https://developer.android.com/studio)
2. Install Android Studio
3. During installation, ensure these are checked:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
4. Open Android Studio → More Actions → SDK Manager
5. Install:
   - Android SDK Platform 33 (or higher)
   - Android SDK Build-Tools
   - Android Emulator

#### B. Configure Environment Variables
Add to your system environment variables:
```
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

#### C. Create Android Virtual Device (AVD)
1. Open Android Studio → More Actions → Virtual Device Manager
2. Click "Create Device"
3. Select phone model (e.g., Pixel 5)
4. Download system image (API 33 recommended)
5. Click "Finish"

#### D. Link React Native Assets
```bash
cd /e/MINI\ PROJECT/ECommerceApp/frontend
npx react-native-asset
```

---

### Step 3: Run the App

#### A. Start Backend Server (if not running)
```bash
cd /e/MINI\ PROJECT/ECommerceApp/backend
npm start
```
Should show: `✅ Server is running on port 5000`

#### B. Start Metro Bundler
```bash
cd /e/MINI\ PROJECT/ECommerceApp/frontend
npx react-native start
```

#### C. Run on Android (in new terminal)
```bash
cd /e/MINI\ PROJECT/ECommerceApp/frontend
npx react-native run-android
```

**OR for iOS (Mac only):**
```bash
cd /e/MINI\ PROJECT/ECommerceApp/frontend
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## 🧪 Testing the App

### Test Flow 1: Registration & Shopping
1. **Open app** → Should show Login screen
2. **Click "Create Account"** → Register screen
3. **Fill details:**
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Password: Test@123
4. **Click "Create Account"** → Should login and show Home screen
5. **Browse products** → Should see 15 products with Flipkart images
6. **Click on a product** → Product detail screen
7. **Click "Add to Cart"** → Success message
8. **Go to Cart tab** → Should show cart item
9. **Click "Proceed to Checkout"** → Checkout screen
10. **Fill address** and select payment method
11. **Click "Place Order"** → Order confirmation

### Test Flow 2: Push Notifications
1. **In Firebase Console** → Cloud Messaging → Send test message
2. **Target:** FCM token (check backend logs after login)
3. **App in foreground:** Alert dialog should show
4. **App in background:** Notification in system tray
5. **Tap notification:** Should open Notifications screen
6. **Mark as read:** Unread badge should disappear

### Test Flow 3: Order Tracking
1. **After placing order** → Go to Profile tab
2. **Click "My Orders"** → Should show order list
3. **Click on an order** → Order detail screen
4. **Check status:** Should show "pending" or "confirmed"
5. **Click "Cancel Order"** → Confirmation dialog
6. **Confirm cancellation** → Order status changes to "cancelled"

---

## 📱 App Features (Flipkart-Inspired)

### Bottom Tab Navigation
- 🏠 **Home:** Featured products, categories, search
- 📂 **Categories:** 8 categories with icons
- 🛒 **Cart:** Shopping cart with badge count
- 👤 **Profile:** User settings and orders

### Product Features
- ⭐ Product ratings and reviews
- 💰 Discount badges
- 📸 High-quality product images
- 📦 Stock availability
- 🔍 Live search functionality
- 🏷️ Category filtering

### Cart Features
- ➕➖ Quantity controls
- 🗑️ Remove items
- 💵 Real-time total calculation
- 🧹 Clear all cart
- 💳 Checkout flow

### Order Features
- 📦 Order history
- 🚚 Order status tracking
- 📍 Delivery address
- 💳 Payment methods (COD, Card, UPI, Net Banking)
- ❌ Order cancellation

### Notification Features
- 🔔 Welcome notifications
- 📦 Order updates (confirmed, shipped, delivered)
- 💰 Price drop alerts
- 🎉 Promotional offers
- 📱 In-app notification inbox
- ✅ Mark as read functionality

---

## 🛠️ Troubleshooting

### Issue: "Unable to connect to server"
**Solution:**
- Ensure backend is running on port 5000
- For Android emulator, change API base URL:
  ```javascript
  // In frontend/src/services/api.js
  baseURL: 'http://10.0.2.2:5000/api'  // For Android Emulator
  ```

### Issue: "Firebase not configured"
**Solution:**
- Ensure `google-services.json` is in `android/app/`
- Rebuild the app: `npx react-native run-android --reset-cache`

### Issue: "Push notifications not working"
**Solution:**
- Check Firebase credentials in backend
- Verify FCM token is saved in database (check user document)
- Test with Firebase Console test message first
- Ensure app has notification permissions

### Issue: "Build failed on Android"
**Solution:**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue: "Metro bundler errors"
**Solution:**
```bash
npx react-native start --reset-cache
```

---

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile (requires token)
PUT /api/auth/profile (requires token)
PUT /api/auth/fcm-token (requires token)
```

### Product Endpoints
```
GET /api/products
GET /api/products/featured
GET /api/products/:id
GET /api/products/search?q=query
```

### Cart Endpoints
```
GET /api/cart (requires token)
POST /api/cart (requires token)
PUT /api/cart/:productId (requires token)
DELETE /api/cart/:productId (requires token)
DELETE /api/cart (requires token)
```

### Order Endpoints
```
POST /api/orders (requires token)
GET /api/orders (requires token)
GET /api/orders/:id (requires token)
PUT /api/orders/:id/cancel (requires token)
```

### Notification Endpoints
```
GET /api/notifications (requires token)
PUT /api/notifications/:id/read (requires token)
PUT /api/notifications/read-all (requires token)
DELETE /api/notifications/:id (requires token)
```

---

## 🎨 Customization

### Change Theme Colors
Edit `FLIPKART_BLUE` in files:
- `frontend/src/navigation/AppNavigator.js`
- `frontend/src/screens/*.js`

### Add More Products
Run seed script with more data:
```bash
cd backend
node utils/seed.js
```

### Customize Notifications
Edit `backend/services/notificationService.js`:
- Modify notification templates
- Add new notification types
- Configure scheduling

---

## 📦 Project Structure

```
ECommerceApp/
├── backend/                    # Node.js Express API
│   ├── config/                 # Database, Firebase config
│   ├── controllers/            # Business logic
│   ├── middleware/             # Auth middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API routes
│   ├── services/               # Notification service
│   └── utils/                  # Seed script
├── frontend/                   # React Native app
│   ├── android/                # Android native code
│   ├── ios/                    # iOS native code
│   ├── src/
│   │   ├── context/            # React Context (Auth, Cart)
│   │   ├── navigation/         # Navigation config
│   │   ├── screens/            # All app screens (13)
│   │   └── services/           # API & notification services
│   ├── App.js                  # Root component
│   └── index.js                # App entry point
└── README.md                   # This file
```

---

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
cd backend
heroku create ecommerce-api
heroku addons:create mongolab
git push heroku main
```

### Update API URL in Frontend
```javascript
// frontend/src/services/api.js
baseURL: 'https://your-api.herokuapp.com/api'
```

### Build Android APK
```bash
cd android
./gradlew assembleRelease
# APK location: android/app/build/outputs/apk/release/app-release.apk
```

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] `google-services.json` downloaded and placed
- [ ] `serviceAccountKey.json` updated in backend
- [ ] Backend server running
- [ ] Android Studio installed
- [ ] AVD created
- [ ] Metro bundler started
- [ ] App running on emulator/device
- [ ] User registration successful
- [ ] Products displayed correctly
- [ ] Add to cart working
- [ ] Checkout flow complete
- [ ] Push notifications received
- [ ] Order tracking working

---

## 🎯 Key Features Summary

✨ **13 Complete Screens** - All UI components ready  
🔐 **JWT Authentication** - Secure login/register  
🛒 **Shopping Cart** - Full cart management  
📦 **Order Management** - Track order status  
🔔 **Push Notifications** - FCM integration  
🔍 **Search & Filter** - Find products easily  
💾 **State Management** - Context API  
📱 **Responsive UI** - Flipkart-inspired design  
🎨 **Material Icons** - Beautiful iconography  
🔄 **Auto-sync** - Cart & auth persistence  

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review Firebase configuration steps
3. Verify backend is running
4. Check console logs for errors

**Current Status:** ✅ All frontend screens complete, dependencies installed, ready for Firebase configuration and testing!
