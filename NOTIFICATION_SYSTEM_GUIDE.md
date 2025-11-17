# 📱 E-Commerce Push Notification System

## Overview
This project implements a comprehensive push notification system for an e-commerce application using Firebase Cloud Messaging (FCM). The system includes 20+ different notification types covering all aspects of the customer journey.

## 🎯 Project Goals
The main aim of this project is to implement push notifications for users to enhance engagement, improve user experience, and drive sales through timely, relevant notifications.

## 🏗️ Architecture

### Backend Components
- **Firebase Admin SDK**: Server-side push notification delivery
- **Notification Service**: Core service handling all notification types
- **Notification Scheduler**: Automated time-based notifications
- **Database Models**: User, Product, Cart, Order, and Notification models
- **REST API**: Endpoints for triggering notifications

### Frontend Components
- **Firebase Web SDK**: Client-side notification handling
- **Service Worker**: Background notification processing
- **FCM Token Management**: User device registration
- **Notification UI**: Real-time notification display

## 📋 Notification Types

### 🛍️ Product & Offer Notifications
1. **New Arrival** - Notify about new products in user's preferred categories
2. **Price Drop** - Alert when watched products go on sale
3. **Back in Stock** - Notify when out-of-stock items are available
4. **Seasonal Sale** - Promote seasonal offers and discounts

### 🛒 Cart & Purchase Notifications
5. **Cart Reminder** - Remind about items left in cart (24 hours)
6. **Abandoned Cart** - Offer discount for abandoned carts (3 days)
7. **Order Confirmation** - Confirm successful order placement
8. **Order Shipped** - Notify when order is shipped with tracking
9. **Order Delivered** - Confirm successful delivery

### 🎯 User Engagement Notifications
10. **Daily Deal** - Highlight daily special offers
11. **Product Recommendation** - Suggest products based on history
12. **Loyalty Points** - Updates on points earned/available
13. **App Update** - Notify about new app features

### 🔒 Security & Account Notifications
14. **Login Alert** - Suspicious login attempt notifications
15. **Password Change** - Confirm password changes
16. **Payment Failed** - Alert about failed payment attempts

### 📝 Feedback & Review Notifications
17. **Rate Experience** - Request ratings after delivery (3 days)
18. **Feedback Request** - General app feedback requests

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL database
- Firebase project with FCM enabled

### Installation
```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd frontend
npm install
```

### Firebase Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project or select existing
   - Enable Cloud Messaging

2. **Backend Configuration**
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download JSON file
   - Replace `backend/config/serviceAccountKey.json`

3. **Frontend Configuration**
   - Go to Project Settings > General
   - Add web app and get config
   - Update `frontend/firebase-config.js`

### Environment Setup
```bash
# Backend environment variables
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=your_username
DB_PASS=your_password
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration with FCM token
- `POST /api/auth/login` - User login with FCM token update

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/mark-read/:id` - Mark notification as read
- `POST /api/notifications/fcm-token` - Update FCM token

### Testing Endpoints
- `POST /api/test-notifications/test-all` - Test all notification types
- `POST /api/test-notifications/test/:type` - Test specific notification
- `GET /api/test-notifications/types` - Get available test types

## 🔄 Scheduled Notifications

The system includes automated notifications that run on schedules:

### Cron Jobs
- **Hourly**: Check abandoned carts
- **Daily 9 AM**: Send daily deals
- **Daily 10 AM**: Send feedback requests
- **Weekly Sunday 6 PM**: Send loyalty point summaries

### Manual Triggers
```bash
# Test scheduled notifications
POST /api/test-notifications/test-scheduled/abandoned_carts
POST /api/test-notifications/test-scheduled/daily_deals
POST /api/test-notifications/test-scheduled/feedback_requests
POST /api/test-notifications/test-scheduled/loyalty_update
```

## 🧪 Testing the System

### 1. Start Servers
```bash
# Backend server
cd backend
npm start
# Server runs on http://localhost:5000

# Frontend server
cd frontend
python -m http.server 3000
# Frontend runs on http://localhost:3000
```

### 2. Test Notifications
1. Register/login to get FCM token
2. Use test endpoints to trigger notifications
3. Check browser notifications and database records

### 3. Test All Notifications
```javascript
// Frontend console
fetch('/api/test-notifications/test-all', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

## 📊 Database Schema

### Notification Model
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Notification Types Enum
- `new_arrival`, `price_drop`, `back_in_stock`, `seasonal_sale`
- `cart_reminder`, `abandoned_cart`, `order_confirmation`, `order_shipped`, `order_delivered`
- `daily_deal`, `product_recommendation`, `loyalty_points`, `app_update`
- `login_alert`, `password_change`, `payment_failed`
- `rate_experience`, `feedback_request`

## 🔧 Configuration Options

### Notification Service Settings
```javascript
// Notification frequency limits
const NOTIFICATION_LIMITS = {
  daily_deal: '1/day',
  cart_reminder: '1/24h',
  abandoned_cart: '1/72h',
  feedback_request: '1/week'
};

// User preferences (future enhancement)
const USER_PREFERENCES = {
  marketing: true,
  orders: true,
  security: true,
  recommendations: false
};
```

### Firebase Configuration
```javascript
// Web app config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 🎨 Frontend Integration

### Notification Display
- Real-time notifications via FCM
- In-app notification center
- Push notification badges
- Notification history

### User Experience
- Permission request flow
- Notification preferences
- Opt-in/opt-out controls
- Do not disturb settings

## 📈 Analytics & Monitoring

### Metrics to Track
- Notification delivery rates
- Click-through rates
- Conversion rates by notification type
- User engagement metrics

### Logging
- Notification send attempts
- Delivery confirmations
- User interactions
- Error tracking

## 🔐 Security Considerations

### Data Protection
- Secure FCM token storage
- User consent management
- Data retention policies
- Privacy compliance

### Authentication
- JWT token validation
- User authorization checks
- API rate limiting
- Input validation

## 🚧 Future Enhancements

### Advanced Features
- **Personalization**: AI-driven notification content
- **A/B Testing**: Test different notification strategies
- **Geolocation**: Location-based notifications
- **Rich Media**: Image and video notifications
- **Interactive**: Action buttons in notifications

### User Preferences
- Granular notification categories
- Frequency controls
- Time-based preferences
- Channel preferences (push, email, SMS)

### Analytics Dashboard
- Real-time notification metrics
- User engagement analytics
- Conversion tracking
- Performance optimization

## 📞 Support & Troubleshooting

### Common Issues
1. **Notifications not received**
   - Check FCM token registration
   - Verify Firebase configuration
   - Check browser notification permissions

2. **Database connection errors**
   - Verify PostgreSQL connection
   - Check environment variables
   - Ensure database exists

3. **Firebase authentication issues**
   - Verify service account key
   - Check project permissions
   - Ensure FCM is enabled

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('debug', 'true');

// Check FCM token
console.log('FCM Token:', localStorage.getItem('fcmToken'));

// Test notification permission
console.log('Notification Permission:', Notification.permission);
```

## 📝 License
This project is licensed under the MIT License.

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

---

**Note**: This is a comprehensive e-commerce notification system designed for maximum user engagement while respecting user preferences and privacy. The system is highly scalable and can be extended with additional notification types and features as needed.