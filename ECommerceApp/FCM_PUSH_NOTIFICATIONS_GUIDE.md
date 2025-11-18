# 🔔 Firebase Cloud Messaging (FCM) Push Notifications - Complete Guide

## 📋 Overview

This E-Commerce application now includes a complete real-time push notification system using Firebase Cloud Messaging (FCM). Notifications work even when the browser is closed or the user is inactive.

---

## 🎯 Features Implemented

### 1. **Order Notifications** 📦
Automatic notifications are sent when:
- ✅ Order is placed successfully
- ✅ Order is confirmed
- 🔄 Order is processing
- 🚚 Order is shipped
- 🏃 Order is out for delivery
- ✅ Order is delivered
- ❌ Order is cancelled

### 2. **Promotional & Marketing Notifications** 🎁
- **Scheduled Notifications** (Automatic):
  - Morning Promo: 9 AM daily
  - Afternoon Flash Sale: 2 PM daily
  - Evening Deals: 6 PM daily
  - Weekend Special: 11 AM (Saturday & Sunday)
  - Midnight Sale: 12 AM daily
  - Random Promos: Every 4 hours

- **Example Messages**:
  - ⚡ Flash Sale! 70% OFF on Electronics — Limited Time!
  - 👗 Fashion Loot Deal! Buy 1 Get 2 FREE!
  - 🍿 Hungry? Try our trending snacks under ₹99!
  - 🎯 Top Picks for You — Customized deals now live!
  - 💰 Only Today: Extra 20% OFF on your cart!

### 3. **Wishlist & Stock Notifications** 🔔
- Back in stock alerts
- Price drop notifications

### 4. **Engagement Notifications** 💝
Auto-triggered when users open the app:
- 👋 Welcome back! New deals are waiting for you.
- 🔥 Trending now: Bestsellers selling out fast!
- 🎁 Exclusive offer unlocked for you — Tap to view!

### 5. **Account & Login Notifications** 🔐
- Login successful notifications
- Profile update confirmations
- Registration welcome messages

---

## 🚀 Setup Instructions

### Step 1: Firebase Console Setup

1. **Get Your VAPID Key**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `e-shopeasy`
   - Navigate to: **Project Settings** > **Cloud Messaging**
   - Scroll to **Web Push certificates**
   - Copy the **Key pair** (VAPID key)

2. **Update the VAPID Key**:
   Open `frontend/src/firebase/messaging.js` and replace the placeholder:
   ```javascript
   vapidKey: 'YOUR_VAPID_KEY_HERE'
   ```

3. **Ensure Service Account Key is Present**:
   - File: `backend/config/serviceAccountKey.json`
   - This should contain your Firebase Admin SDK credentials
   - If missing, download from Firebase Console > Project Settings > Service Accounts

### Step 2: Update Frontend Code

Add FCM initialization to your main application file (e.g., `App.js` or `index.js`):

```javascript
import { initializeFCM, onForegroundMessage } from './firebase/messaging';

// After user logs in
const handleLogin = async (authToken) => {
  // Initialize FCM
  const fcmToken = await initializeFCM(authToken);
  
  if (fcmToken) {
    console.log('FCM initialized successfully');
    
    // Listen for foreground messages
    onForegroundMessage((payload) => {
      console.log('Notification received:', payload);
      // You can show custom UI notifications here
    });
  }
};
```

### Step 3: Service Worker Registration

The service worker is already created at:
- `frontend/public/firebase-messaging-sw.js`

Ensure your web app serves this file at the root URL (`/firebase-messaging-sw.js`).

---

## 📡 API Endpoints

All FCM endpoints are under `/api/fcm/`:

### **User Endpoints** (Requires Authentication)

#### Update FCM Token
```bash
POST /api/fcm/token
Authorization: Bearer {JWT_TOKEN}

{
  "fcmToken": "device_fcm_token"
}
```

#### Test Notification
```bash
POST /api/fcm/test
Authorization: Bearer {JWT_TOKEN}
```

#### Send Engagement Notification
```bash
POST /api/fcm/engagement/:userId
Authorization: Bearer {JWT_TOKEN}
```

### **Admin Endpoints** (Requires Admin Role)

#### Send Promotional Notification
```bash
POST /api/fcm/promotional
Authorization: Bearer {ADMIN_JWT_TOKEN}

{
  "title": "⚡ Flash Sale! 70% OFF",
  "body": "Limited time offer. Shop now!",
  "promoType": "flash_sale"
}
```

#### Send Random Promotional Notification
```bash
POST /api/fcm/promotional/random
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

#### Broadcast to All Users
```bash
POST /api/fcm/broadcast
Authorization: Bearer {ADMIN_JWT_TOKEN}

{
  "title": "🎉 New Feature Released!",
  "body": "Check out our new arrivals section",
  "data": {
    "link": "/new-arrivals"
  }
}
```

#### Send to Specific User
```bash
POST /api/fcm/send-to-user
Authorization: Bearer {ADMIN_JWT_TOKEN}

{
  "userId": 1,
  "title": "Special Offer for You",
  "body": "You've been selected for exclusive deals",
  "data": {
    "type": "special_offer"
  }
}
```

#### Send Wishlist Notification
```bash
POST /api/fcm/wishlist
Authorization: Bearer {JWT_TOKEN}

{
  "userId": 1,
  "productName": "iPhone 15 Pro",
  "notificationType": "stock"  // or "price_drop"
}
```

### **Scheduler Control Endpoints** (Admin Only)

#### Get Scheduler Status
```bash
GET /api/fcm/scheduler/status
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

#### Start Scheduler
```bash
POST /api/fcm/scheduler/start
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

#### Stop Scheduler
```bash
POST /api/fcm/scheduler/stop
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

---

## 🔧 Backend Implementation

### Automatic Order Notifications

Order notifications are automatically triggered when:

```javascript
// Order placed
await fcmService.sendOrderNotification(userId, 'placed', orderId);

// Order status updated
await fcmService.sendOrderNotification(userId, 'shipped', orderId);
await fcmService.sendOrderNotification(userId, 'out_for_delivery', orderId);
await fcmService.sendOrderNotification(userId, 'delivered', orderId);
await fcmService.sendOrderNotification(userId, 'cancelled', orderId);
```

### Automatic Login/Account Notifications

```javascript
// After successful login
await fcmService.sendAccountNotification(userId, userName, 'login');

// After profile update
await fcmService.sendAccountNotification(userId, userName, 'profile_update');

// After registration
await fcmService.sendAccountNotification(userId, userName, 'register');
```

---

## 📱 Frontend Usage Examples

### Initialize FCM on App Load

```javascript
import React, { useEffect } from 'react';
import { initializeFCM, onForegroundMessage } from './firebase/messaging';

function App() {
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    
    if (authToken) {
      // Initialize FCM
      initializeFCM(authToken).then((fcmToken) => {
        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
          
          // Listen for foreground notifications
          onForegroundMessage((payload) => {
            // Show custom notification UI
            showNotificationToast(payload.notification);
          });
        }
      });
    }
  }, []);

  return <div>Your App</div>;
}
```

### Request Notification Permission

```javascript
import { requestNotificationPermission } from './firebase/messaging';

const handleEnableNotifications = async () => {
  const token = await requestNotificationPermission();
  
  if (token) {
    alert('Notifications enabled!');
  } else {
    alert('Please enable notifications in browser settings');
  }
};
```

### Send Test Notification

```javascript
import { sendTestNotification } from './firebase/messaging';

const handleTestNotification = async () => {
  const authToken = localStorage.getItem('authToken');
  const success = await sendTestNotification(authToken);
  
  if (success) {
    alert('Test notification sent!');
  }
};
```

---

## 🎨 Notification Message Examples

### Order Notifications
- ✅ **Order Placed**: "Your order has been placed successfully!"
- 🚚 **Shipped**: "Your item is shipped. Track now!"
- 🏃 **Out for Delivery**: "Your order is out for delivery."
- ✅ **Delivered**: "Order delivered! We hope you enjoy it."
- ❌ **Cancelled**: "Your order has been cancelled."

### Promotional Notifications
- ⚡ "Flash Sale! 70% OFF on Electronics — Limited Time!"
- 👗 "Fashion Loot Deal! Buy 1 Get 2 FREE!"
- 🍿 "Hungry? Try our trending snacks under ₹99!"
- 🎯 "Top Picks for You — Customized deals now live!"
- 💰 "Only Today: Extra 20% OFF on your cart!"

### Engagement Notifications
- 👋 "Welcome back! New deals are waiting for you."
- 🔥 "Trending now: Bestsellers selling out fast!"
- 🎁 "Exclusive offer unlocked for you — Tap to view!"

### Wishlist Notifications
- 🔔 "Your wishlist item is now back in stock!"
- 💰 "Price dropped for your saved product — Don't miss out!"

---

## 🔒 Security Notes

1. **FCM Tokens are User-Specific**: Each user's FCM token is stored in the database and cleared on logout
2. **Authentication Required**: All notification endpoints require valid JWT tokens
3. **Admin-Only Features**: Promotional broadcasts and scheduler control require admin role
4. **Token Validation**: Invalid tokens are automatically detected and can be cleared

---

## 📊 Promotional Scheduler

The promotional scheduler automatically sends notifications at scheduled times:

| Schedule | Time | Notification Type |
|----------|------|-------------------|
| Morning Promo | 9:00 AM Daily | Random promotional message |
| Afternoon Flash Sale | 2:00 PM Daily | Flash sale announcement |
| Evening Deals | 6:00 PM Daily | Random promotional message |
| Weekend Special | 11:00 AM Sat & Sun | Weekend bonanza |
| Midnight Sale | 12:00 AM Daily | Midnight madness |
| Random Promo | Every 4 hours | Random promotional message |

Timezone: **Asia/Kolkata** (IST)

---

## 🧪 Testing

### 1. Test with Postman/cURL

```bash
# Send test notification
curl -X POST http://localhost:5000/api/fcm/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Send promotional notification
curl -X POST http://localhost:5000/api/fcm/promotional \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Sale",
    "body": "This is a test promotional notification"
  }'
```

### 2. Test in Browser Console

```javascript
// Request permission
Notification.requestPermission().then(permission => {
  console.log('Permission:', permission);
});

// Check if FCM is working
console.log('Notification supported:', 'Notification' in window);
console.log('Service Worker supported:', 'serviceWorker' in navigator);
```

---

## 🐛 Troubleshooting

### Notifications Not Working?

1. **Check Browser Permission**:
   - Open browser settings
   - Ensure notifications are allowed for your site

2. **Verify Service Worker**:
   - Open DevTools > Application > Service Workers
   - Check if `firebase-messaging-sw.js` is registered

3. **Check FCM Token**:
   - Open DevTools > Console
   - Look for FCM token in logs
   - Ensure it's saved to backend

4. **Verify Firebase Config**:
   - Check `serviceAccountKey.json` exists in backend
   - Verify VAPID key is correct in frontend

5. **Check Server Logs**:
   - Look for Firebase initialization messages
   - Ensure scheduler is started

---

## 📈 Best Practices

1. **Request Permission Wisely**: Ask for notification permission after user shows interest
2. **Don't Spam**: Use promotional notifications sparingly
3. **Personalize**: Use user's name in notifications when possible
4. **Clear Actions**: Each notification should have a clear purpose
5. **Test Regularly**: Test notifications across different browsers
6. **Monitor Tokens**: Clean up invalid/expired tokens regularly

---

## 🔗 Related Files

### Backend
- `backend/services/fcmService.js` - Main FCM service
- `backend/services/promotionalScheduler.js` - Scheduled promotions
- `backend/routes/fcm.js` - FCM API endpoints
- `backend/controllers/authController.js` - Login/account notifications
- `backend/controllers/orderController.js` - Order notifications

### Frontend
- `frontend/src/firebase/config.js` - Firebase configuration
- `frontend/src/firebase/messaging.js` - FCM initialization
- `frontend/public/firebase-messaging-sw.js` - Service worker

---

## ✅ Summary

Your E-Commerce app now has a **production-ready push notification system** with:

- ✅ Real push notifications via FCM
- ✅ Background notifications (browser closed)
- ✅ Automatic order status updates
- ✅ Scheduled promotional campaigns
- ✅ Engagement notifications
- ✅ Wishlist alerts
- ✅ Account notifications
- ✅ Admin controls
- ✅ Complete API endpoints

**Next Steps**:
1. Add VAPID key to `frontend/src/firebase/messaging.js`
2. Integrate FCM initialization in your frontend app
3. Test notifications with different user scenarios
4. Customize notification messages as needed

🎉 **Happy Notifying!**
