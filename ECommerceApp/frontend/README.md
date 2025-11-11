# E-Commerce Mobile App - React Native Frontend

A full-featured e-commerce mobile application built with React Native, featuring authentication, product browsing, cart management, and push notifications.

## 📱 Features

- **User Authentication**: JWT-based login and registration
- **Product Browsing**: Browse products by categories with search functionality
- **Shopping Cart**: Add/remove items, update quantities with persistent storage
- **Wishlist**: Save favorite products for later
- **Order History**: View past orders and order details
- **Push Notifications**: Firebase Cloud Messaging integration
- **Profile Management**: User profile and settings
- **Modern UI**: Flipkart-inspired blue-white theme

## 🛠 Tech Stack

- **Framework**: React Native CLI
- **Navigation**: React Navigation v6 (Stack & Bottom Tabs)
- **State Management**: Context API
- **API Client**: Axios
- **Storage**: AsyncStorage
- **Notifications**: Firebase Cloud Messaging
- **UI Components**: React Native Elements
- **Icons**: React Native Vector Icons

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ProductCard.js
│   │   ├── CategoryCard.js
│   │   ├── CarouselBanner.js
│   │   ├── Header.js
│   │   └── Loader.js
│   ├── screens/           # App screens
│   │   ├── HomeScreen.js
│   │   ├── ProductDetailsScreen.js
│   │   ├── CartScreen.js
│   │   ├── CategoriesScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── OrderHistoryScreen.js
│   │   └── WishlistScreen.js
│   ├── navigation/        # Navigation setup
│   │   ├── TabNavigator.js
│   │   └── StackNavigator.js
│   ├── services/          # API and services
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── notificationService.js
│   ├── context/           # Context providers
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── utils/             # Helper functions
│   │   ├── storage.js
│   │   ├── constants.js
│   │   └── helpers.js
│   └── assets/            # Images and icons
├── App.js
├── package.json
└── .env
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)
- Firebase account (for push notifications)

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd ECommerceApp/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the frontend directory:
   ```
   API_URL=http://localhost:5000
   ```
   Update the URL to your backend server address.

4. **Setup Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add Android/iOS app to your Firebase project
   - Download `google-services.json` (Android) and place it in `android/app/`
   - Download `GoogleService-Info.plist` (iOS) and add it to your Xcode project
   - Follow Firebase setup instructions for React Native

### Running the App

#### Android
```bash
# Start Metro bundler
npm start

# In a new terminal, run Android app
npm run android
```

#### iOS (macOS only)
```bash
# Install iOS dependencies
cd ios && pod install && cd ..

# Run iOS app
npm run ios
```

## 🔧 Configuration

### Backend API Setup

Make sure your backend server is running and update the `API_URL` in `.env` file:

```
API_URL=http://your-backend-url:5000
```

For local development:
- Android Emulator: `http://10.0.2.2:5000`
- iOS Simulator: `http://localhost:5000`
- Physical Device: `http://YOUR_COMPUTER_IP:5000`

### Firebase Configuration

1. Add your Firebase configuration in a new file `src/config/firebase.js`:
```javascript
import messaging from '@react-native-firebase/messaging';

// Request permission and get FCM token
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};
```

## 📱 Features Overview

### Authentication
- Login with email and password
- Register new account
- JWT token storage
- Auto-login with stored credentials

### Product Features
- Browse all products
- Filter by categories
- Search products
- View product details
- Product ratings and reviews
- Stock availability

### Shopping Cart
- Add products to cart
- Update quantities
- Remove items
- Persistent cart storage
- Calculate totals with delivery charges

### Wishlist
- Add/remove products from wishlist
- Quick add to cart from wishlist
- Persistent storage

### Push Notifications
- Receive promotional notifications
- Order status updates
- Navigate to specific screens from notifications
- Background and foreground notification handling

## 🎨 UI Design

The app follows a Flipkart-inspired design with:
- Primary Color: #2874f0 (Blue)
- Secondary Color: #fb641b (Orange)
- Clean, modern interface
- Responsive layouts
- Smooth animations

## 🔐 Security

- JWT authentication
- Secure token storage
- API request interceptors
- Auto-logout on token expiration

## 📦 Key Dependencies

```json
{
  "@react-native-async-storage/async-storage": "^1.19.3",
  "@react-native-firebase/app": "^18.6.1",
  "@react-native-firebase/messaging": "^18.6.1",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "axios": "^1.6.0",
  "react-native-elements": "^3.4.3",
  "react-native-vector-icons": "^10.0.2"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npm start -- --reset-cache
   ```

2. **Android build fails**:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

3. **iOS build fails**:
   ```bash
   cd ios && pod deintegrate && pod install && cd ..
   ```

4. **Firebase not working**:
   - Verify `google-services.json` is in `android/app/`
   - Verify `GoogleService-Info.plist` is added to Xcode project
   - Rebuild the app after adding Firebase files

## 📝 API Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove from cart
- `GET /api/orders` - Get user orders
- `POST /api/orders/create` - Create order

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions, please create an issue in the repository.

---

**Happy Coding! 🚀**
