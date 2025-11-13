# 📱 Firebase Cloud Messaging (FCM) Push Notifications

## ✅ Implementation Complete

Your E-Commerce backend now has **production-ready Firebase Cloud Messaging** integrated with automatic push notifications for all major events.

---

## 🚀 Features Implemented

### 1. **FCM Service** (`services/fcmService.js`)
Production-ready service for sending push notifications:
- ✅ Single device notifications
- ✅ Multicast notifications (multiple devices)
- ✅ User-based notifications (send by user ID)
- ✅ Error handling for invalid/expired tokens
- ✅ Automatic Firebase SDK initialization check

### 2. **FCM API Endpoints** (`routes/fcm.js`)
```
POST /api/send-notification     - Send to single device
POST /api/send-multicast        - Send to multiple devices
```

### 3. **Automatic Push Notifications**

#### 🔐 **Login Event**
**Trigger:** User logs in successfully  
**Location:** `controllers/authController.js`

```javascript
// Automatic notification sent
Title: "Login Successful"
Message: "Welcome back, {userName}!"
Data: { type: 'login', userId: '...' }
```

#### 🛒 **Order Placed**
**Trigger:** User creates a new order  
**Location:** `controllers/orderController.js`

```javascript
// Automatic notification sent
Title: "Order Placed Successfully"
Message: "Your order #{orderId} has been placed. Total: ₹{amount}"
Data: { type: 'order_placed', orderId: '...', amount: '...' }
```

#### 📦 **Order Status Updates**
**Trigger:** Admin updates order status  
**Location:** `controllers/orderController.js`

**Status: Shipped**
```javascript
Title: "Order Shipped!"
Message: "Your order #{orderId} has been shipped and is on its way."
Data: { type: 'order_shipped', orderId: '...', status: 'shipped' }
```

**Status: Delivered**
```javascript
Title: "Order Delivered!"
Message: "Your order #{orderId} has been delivered successfully."
Data: { type: 'order_delivered', orderId: '...', status: 'delivered' }
```

**Status: Cancelled**
```javascript
Title: "Order Cancelled"
Message: "Your order #{orderId} has been cancelled. Refund within 3-5 days."
Data: { type: 'order_cancelled', orderId: '...', status: 'cancelled' }
```

---

## 📊 How It Works

### Flow Diagram
```
┌─────────────────┐
│  User Action    │
│  (Login/Order)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │ ← authController.js / orderController.js
│  Event Trigger  │
└────────┬────────┘
         │
         ├─────────────────────────┐
         │                         │
         ▼                         ▼
┌────────────────┐      ┌──────────────────┐
│ DB Notification│      │  FCM Service     │
│  (notificationService)│  (fcmService.js) │
└────────────────┘      └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │ Firebase Admin   │
                        │   Messaging      │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │   User Device    │
                        │ Push Notification│
                        └──────────────────┘
```

### Notification Storage
- **Database:** Notification saved to PostgreSQL via `notificationService`
- **FCM:** Real-time push notification sent to user's device
- **Dual System:** Users get notifications in-app (database) AND on device (FCM)

---

## 🔧 API Usage

### Endpoint 1: Send Single Notification

**POST** `/api/send-notification`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "title": "Flash Sale Alert",
  "message": "50% off on electronics! Limited time offer.",
  "token": "USER_FCM_DEVICE_TOKEN",
  "data": {
    "category": "Electronics",
    "discount": "50"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "messageId": "projects/your-project/messages/0:1234567890"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid or expired FCM token"
}
```

---

### Endpoint 2: Send Multicast Notification

**POST** `/api/send-multicast`

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "title": "New Product Launch",
  "message": "iPhone 15 Pro Max now available!",
  "tokens": [
    "TOKEN_1",
    "TOKEN_2",
    "TOKEN_3"
  ],
  "data": {
    "productId": "12345",
    "category": "Electronics"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Multicast notification sent successfully",
  "successCount": 3,
  "failureCount": 0
}
```

---

## 💾 FCM Token Management

### How Users Get FCM Tokens

**Frontend (Firebase SDK):**
```javascript
import { getMessaging, getToken } from 'firebase/messaging';

// Request notification permission
const messaging = getMessaging();
const token = await getToken(messaging, {
  vapidKey: 'YOUR_VAPID_KEY'
});

// Save token to backend
await api.post('/api/auth/update-fcm-token', { fcmToken: token });
```

### Backend Storage

**User Model:**
```javascript
{
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  fcmToken: "eXamPle_fcM_tOkeN...",  // ← Stored here
  ...
}
```

**Update Token Endpoint:**
```
PUT /api/auth/fcm-token
Body: { "fcmToken": "new_token_here" }
```

---

## 🔒 Security Features

### 1. **Authentication Required**
- All FCM endpoints require JWT authentication
- Only authenticated users can send notifications

### 2. **Token Validation**
- FCM tokens validated by Firebase SDK
- Invalid tokens return proper error messages
- Expired tokens automatically detected

### 3. **Error Handling**
- Graceful fallback if Firebase not initialized
- Silent failures for FCM errors (doesn't break main flow)
- Detailed error logging for debugging

---

## 🧪 Testing the System

### Step 1: Get Your FCM Token
```javascript
// In frontend (React)
import { messaging } from './firebase/config';
import { getToken } from 'firebase/messaging';

const token = await getToken(messaging);
console.log('FCM Token:', token);
```

### Step 2: Test Manual Notification
```bash
curl -X POST http://localhost:5000/api/send-notification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "This is a test!",
    "token": "YOUR_FCM_TOKEN"
  }'
```

### Step 3: Test Automatic Notifications

**Test Login Notification:**
1. Login to your app
2. Instant push notification: "Login Successful"

**Test Order Notification:**
1. Place an order
2. Instant push notification: "Order Placed Successfully"

**Test Order Status:**
1. Admin updates order to "shipped"
2. Instant push notification: "Order Shipped!"

---

## 📱 Notification Payload Structure

### Standard Format
```javascript
{
  notification: {
    title: "Your Title Here",
    body: "Your message here"
  },
  data: {
    type: "order_placed",        // Event type
    userId: "123",               // User ID
    orderId: "456",              // Order ID (if applicable)
    timestamp: "2025-11-12T..."  // Auto-added
  },
  token: "user_fcm_token_here"
}
```

### Data Field Uses
- **type**: Filter/categorize notifications in app
- **userId**: Identify target user
- **orderId**: Deep link to order details
- **timestamp**: Sort by recency

---

## 🔥 Firebase Setup (If Not Done)

### 1. Create Firebase Project
```
1. Go to https://console.firebase.google.com
2. Click "Add Project"
3. Enter project name: "e-shop-ecommerce"
4. Enable Google Analytics (optional)
5. Create project
```

### 2. Enable Cloud Messaging
```
1. In Firebase Console, go to "Build" → "Cloud Messaging"
2. Click "Get Started"
3. Enable Cloud Messaging API
```

### 3. Download Service Account Key
```
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save as backend/config/serviceAccountKey.json
```

### 4. Get Web Push Certificate
```
1. Go to Project Settings → Cloud Messaging
2. Under "Web Push certificates"
3. Click "Generate key pair"
4. Copy VAPID key for frontend
```

---

## 📂 File Structure

```
backend/
├── services/
│   ├── fcmService.js           ← FCM notification logic
│   └── notificationService.js  ← Database notifications
├── routes/
│   ├── fcm.js                  ← FCM API endpoints
│   ├── auth.js                 ← Login notifications
│   └── orders.js               ← Order notifications
├── controllers/
│   ├── authController.js       ← Login + FCM trigger
│   └── orderController.js      ← Order + FCM trigger
├── config/
│   ├── firebaseAdmin.js        ← Firebase initialization
│   └── serviceAccountKey.json  ← Firebase credentials
└── models/
    └── User.js                 ← fcmToken field
```

---

## 🎯 Notification Types Summary

| Event | Trigger | Title | Type |
|-------|---------|-------|------|
| Login | User logs in | "Login Successful" | `login` |
| Order Placed | Order created | "Order Placed Successfully" | `order_placed` |
| Order Shipped | Status → shipped | "Order Shipped!" | `order_shipped` |
| Order Delivered | Status → delivered | "Order Delivered!" | `order_delivered` |
| Order Cancelled | Status → cancelled | "Order Cancelled" | `order_cancelled` |

---

## ⚡ Performance Considerations

### Async Operations
```javascript
// Non-blocking FCM calls
try {
  await fcmService.sendNotification(...);
} catch (error) {
  // Silent fail - doesn't break main flow
}
```

### Why Silent Failures?
- User login shouldn't fail if FCM fails
- Order placement shouldn't fail if push fails
- Core business logic remains unaffected

### Error Logging
```javascript
logger.error('FCM notification failed:', fcmError);
// Logged but doesn't throw error to user
```

---

## 🌐 Integration with Frontend

### Required Frontend Setup

**1. Install Firebase SDK:**
```bash
npm install firebase
```

**2. Initialize Firebase:**
```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  projectId: "your-project-id",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
```

**3. Request Permission & Get Token:**
```javascript
import { getToken } from 'firebase/messaging';
import { messaging } from './firebase/config';

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_VAPID_KEY'
    });
    
    // Save to backend
    await api.put('/api/auth/fcm-token', { fcmToken: token });
  }
};
```

---

## 🎉 Success Indicators

After implementation, you should see:

✅ Login → Push notification received  
✅ Order placed → Push notification received  
✅ Order shipped → Push notification received  
✅ Order delivered → Push notification received  
✅ No errors in backend logs  
✅ FCM tokens stored in database  
✅ Firebase Admin SDK initialized  

---

## 🐛 Troubleshooting

### Issue: "Firebase Admin SDK is not initialized"
**Solution:**
```javascript
// Check backend/config/serviceAccountKey.json exists
// Verify Firebase credentials are valid
// Restart backend server
```

### Issue: "Invalid or expired FCM token"
**Solution:**
```javascript
// Token expired - request new token from frontend
// Update token in database
// Try sending notification again
```

### Issue: No notification received
**Check:**
1. ✅ Firebase SDK initialized?
2. ✅ FCM token saved in database?
3. ✅ User granted notification permission?
4. ✅ Service worker registered (for web)?
5. ✅ Backend logs show success?

---

## 📊 Monitoring & Analytics

### Check Notification Success
```sql
-- Count notifications sent
SELECT COUNT(*) FROM notifications WHERE type = 'order_placed';

-- Recent FCM tokens
SELECT id, name, email, fcmToken FROM users WHERE fcmToken IS NOT NULL;
```

### Backend Logs
```bash
# View logs
tail -f backend/logs/app.log

# Filter FCM logs
grep "FCM" backend/logs/app.log
```

---

## 🚀 Next Steps

### Enhancements You Can Add

1. **Scheduled Notifications**
   - Daily deals at 9 AM
   - Cart abandonment reminders
   - Weekly summary emails

2. **Notification Preferences**
   - Let users choose notification types
   - Quiet hours (do not disturb)
   - Notification frequency

3. **Rich Notifications**
   - Product images in notifications
   - Action buttons (View Order, Track)
   - Progress indicators

4. **Analytics**
   - Track notification open rates
   - A/B test notification copy
   - Measure conversion impact

---

**🎉 Your FCM Push Notification System is Production-Ready!**

Users will now receive instant push notifications for all important events automatically.

*Last Updated: November 12, 2025*
