# 📡 FCM Push Notifications - API Reference

## Base URL
```
http://localhost:5000/api/fcm
```

---

## 🔐 Authentication

All endpoints require JWT authentication via Bearer token:
```
Authorization: Bearer {JWT_TOKEN}
```

Admin endpoints require admin role.

---

## 📋 Endpoints

### 1. Update FCM Token
**Save/update user's FCM device token**

```http
POST /api/fcm/token
```

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "fcmToken": "device_fcm_token_from_firebase"
}
```

**Response:**
```json
{
  "message": "FCM token updated successfully"
}
```

---

### 2. Test Notification
**Send a test notification to the current user**

```http
POST /api/fcm/test
```

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Response:**
```json
{
  "message": "Test notification sent successfully",
  "result": {
    "success": true,
    "messageId": "projects/..."
  }
}
```

---

### 3. Send Engagement Notification
**Send an engagement notification to a user**

```http
POST /api/fcm/engagement/:userId
```

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Response:**
```json
{
  "message": "Engagement notification sent successfully",
  "result": {
    "success": true,
    "messageId": "projects/..."
  }
}
```

**Note:** Users can only send to themselves unless admin.

---

### 4. Send Wishlist Notification
**Notify user about stock or price changes**

```http
POST /api/fcm/wishlist
```

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "userId": 1,
  "productName": "iPhone 15 Pro",
  "notificationType": "stock"  // or "price_drop"
}
```

**Response:**
```json
{
  "message": "Wishlist notification sent successfully",
  "result": {
    "success": true,
    "messageId": "projects/..."
  }
}
```

---

### 5. Send Promotional Notification (Admin)
**Send promotional notification to all users**

```http
POST /api/fcm/promotional
```

**Headers:**
```
Authorization: Bearer {ADMIN_JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "⚡ Flash Sale! 70% OFF",
  "body": "Limited time offer on electronics. Shop now!",
  "promoType": "flash_sale"
}
```

**Response:**
```json
{
  "message": "Promotional notification sent successfully",
  "result": {
    "success": true,
    "successCount": 25,
    "failureCount": 0
  }
}
```

---

### 6. Send Random Promotional Notification (Admin)
**Send a random pre-defined promotional message**

```http
POST /api/fcm/promotional/random
```

**Headers:**
```
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

**Response:**
```json
{
  "message": "Random promotional notification sent successfully",
  "notification": {
    "title": "🎯 Top Picks for You — Customized deals now live!",
    "body": "Handpicked deals based on your preferences. Check them out now!"
  },
  "result": {
    "success": true,
    "successCount": 25,
    "failureCount": 0
  }
}
```

---

### 7. Send Notification to Specific User (Admin)
**Send custom notification to a specific user**

```http
POST /api/fcm/send-to-user
```

**Headers:**
```
Authorization: Bearer {ADMIN_JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "userId": 1,
  "title": "Special Offer for You",
  "body": "You've been selected for exclusive deals",
  "data": {
    "type": "special_offer",
    "link": "/special-offers"
  }
}
```

**Response:**
```json
{
  "message": "Notification sent successfully",
  "result": {
    "success": true,
    "messageId": "projects/..."
  }
}
```

---

### 8. Broadcast Notification (Admin)
**Send notification to all users**

```http
POST /api/fcm/broadcast
```

**Headers:**
```
Authorization: Bearer {ADMIN_JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "🎉 New Feature Released!",
  "body": "Check out our new arrivals section",
  "data": {
    "type": "announcement",
    "link": "/new-arrivals"
  }
}
```

**Response:**
```json
{
  "message": "Broadcast notification sent successfully",
  "result": {
    "success": true,
    "successCount": 100,
    "failureCount": 5
  }
}
```

---

### 9. Get Scheduler Status (Admin)
**Get current status of promotional scheduler**

```http
GET /api/fcm/scheduler/status
```

**Headers:**
```
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

**Response:**
```json
{
  "isRunning": true,
  "activeJobs": 6,
  "jobs": [
    {
      "name": "Morning Promo",
      "schedule": "9 AM daily",
      "status": "active"
    },
    {
      "name": "Afternoon Flash Sale",
      "schedule": "2 PM daily",
      "status": "active"
    },
    {
      "name": "Evening Deals",
      "schedule": "6 PM daily",
      "status": "active"
    },
    {
      "name": "Weekend Special",
      "schedule": "11 AM Sat & Sun",
      "status": "active"
    },
    {
      "name": "Midnight Sale",
      "schedule": "12 AM daily",
      "status": "active"
    },
    {
      "name": "Random Promo",
      "schedule": "Every 4 hours",
      "status": "active"
    }
  ]
}
```

---

### 10. Start Scheduler (Admin)
**Start the promotional notification scheduler**

```http
POST /api/fcm/scheduler/start
```

**Headers:**
```
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

**Response:**
```json
{
  "message": "Promotional scheduler started successfully"
}
```

---

### 11. Stop Scheduler (Admin)
**Stop the promotional notification scheduler**

```http
POST /api/fcm/scheduler/stop
```

**Headers:**
```
Authorization: Bearer {ADMIN_JWT_TOKEN}
```

**Response:**
```json
{
  "message": "Promotional scheduler stopped successfully"
}
```

---

## 🎯 Automatic Notifications

These notifications are sent automatically by the backend:

### Order Notifications
Triggered automatically when order status changes:
- ✅ `placed` - Order placed successfully
- ✅ `confirmed` - Order confirmed
- 🔄 `processing` - Order processing
- 🚚 `shipped` - Order shipped
- 🏃 `out_for_delivery` - Out for delivery
- ✅ `delivered` - Order delivered
- ❌ `cancelled` - Order cancelled

### Account Notifications
Triggered automatically on account actions:
- 🔐 `login` - User logged in
- 🎉 `register` - New user registered
- ✅ `profile_update` - Profile updated

---

## 📱 Example: Complete Integration Flow

### 1. User Registration
```javascript
// Frontend
const register = async (name, email, password) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  
  const data = await response.json();
  const authToken = data.token;
  
  // Initialize FCM
  const fcmToken = await initializeFCM(authToken);
  
  // FCM token is automatically saved during registration
};
```

### 2. User Login
```javascript
// Frontend
const login = async (email, password) => {
  // Get FCM token first
  const fcmToken = await requestNotificationPermission();
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fcmToken })
  });
  
  const data = await response.json();
  
  // Notification is automatically sent by backend
  // User receives: "🔐 Login successful — Happy Shopping!"
};
```

### 3. Place Order
```javascript
// Frontend
const placeOrder = async (orderData, authToken) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(orderData)
  });
  
  // Backend automatically sends:
  // "🎉 Order Placed Successfully!"
};
```

---

## 🧪 Testing with cURL

### Test Notification
```bash
curl -X POST http://localhost:5000/api/fcm/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Send Promotional Notification
```bash
curl -X POST http://localhost:5000/api/fcm/promotional \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "⚡ Flash Sale! 50% OFF",
    "body": "Limited time offer. Shop now!",
    "promoType": "flash_sale"
  }'
```

### Update FCM Token
```bash
curl -X POST http://localhost:5000/api/fcm/token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fcmToken": "your_device_fcm_token"
  }'
```

---

## 🔍 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (missing parameters) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found (user/resource not found) |
| 500 | Server Error |

---

## 💡 Tips

1. **Always update FCM token after login** to ensure notifications work
2. **Test notifications** before deploying to production
3. **Monitor scheduler status** regularly
4. **Use meaningful data payloads** for better notification tracking
5. **Handle notification click events** in your frontend for better UX

---

## 🔗 Related Documentation

- [Complete FCM Guide](./FCM_PUSH_NOTIFICATIONS_GUIDE.md)
- [Firebase Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications)
