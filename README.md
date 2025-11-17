# 🛍️ E-Commerce App - Flipkart Inspired

A complete full-stack e-commerce mobile application with push notifications, built with React Native and Node.js.

![React Native](https://img.shields.io/badge/React_Native-0.72.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)
![Firebase](https://img.shields.io/badge/Firebase-FCM-orange)

## ✨ Features

### 🛒 Shopping Features
- **Product Catalog** - Browse 15+ products with Flipkart images
- **Categories** - 8 categories (Electronics, Fashion, Home, Books, etc.)
- **Live Search** - Real-time product search
- **Product Details** - Images, ratings, specs, pricing
- **Shopping Cart** - Add/remove items, quantity controls

### 👤 User Features
- **Authentication** - Secure JWT-based login/register
- **Profile Management** - Update user details
- **Order Tracking** - View order history and status
- **Address Management** - Save delivery addresses

### 🔔 Push Notifications (Firebase FCM)
- **Welcome Notifications** - Greet new users
- **Order Updates** - Confirmed, shipped, delivered alerts
- **Price Drop Alerts** - Notify when prices decrease
- **Promotional Offers** - Special deals and discounts
- **In-App Inbox** - View all notifications

### 💳 Payment & Orders
- **Multiple Payment Methods** - COD, Card, UPI, Net Banking
- **Order Management** - Place orders, cancel orders
- **Order Status** - Track pending, confirmed, shipped, delivered

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Android Studio (for Android)
- Firebase account

### Installation

**Quick Start (Windows):**
```bash
start.bat
```

**Manual Start:**

Backend:
```bash
cd backend
npm install
npm start
```

Frontend:
```bash
cd frontend
npm install
npx react-native start
# In another terminal:
npx react-native run-android
```

## 📊 Current Status

| Component | Status |
|-----------|--------|
| Backend API | ✅ Complete |
| MongoDB | ✅ 15 products seeded |
| React Native App | ✅ All 13 screens ready |
| Navigation | ✅ Complete |
| State Management | ✅ Complete |
| Dependencies | ✅ Installed (639 packages) |
| Firebase Config | ⚠️ Needs setup |

## 📂 Project Structure

```
ECommerceApp/
├── backend/              # Node.js Express API
│   ├── config/          # Database & Firebase config
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── services/        # Push notifications
├── frontend/            # React Native App
│   └── src/
│       ├── context/     # State management
│       ├── navigation/  # App navigation
│       ├── screens/     # 13 screens
│       └── services/    # API & FCM client
├── SETUP_GUIDE.md       # Detailed setup
└── start.bat            # Quick start script
```

## 🔌 API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/products` - Get all products
- `POST /api/cart` - Add to cart
- `POST /api/orders` - Place order
- `GET /api/notifications` - Get notifications

**See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete API documentation.**

## 🛠️ Technologies

**Backend:** Node.js, Express, MongoDB, Firebase Admin SDK, JWT  
**Frontend:** React Native, React Navigation, FCM, AsyncStorage, Axios

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup & testing guide
- **[CLEANUP_SUMMARY.md](CLEANUP_SUMMARY.md)** - Project history

## 🎯 Next Steps

1. ✅ Create all screens (DONE)
2. ✅ Install dependencies (DONE)
3. 🔲 Configure Firebase
4. 🔲 Test on Android
5. 🔲 Test push notifications

---

**Made with ❤️ using React Native**
