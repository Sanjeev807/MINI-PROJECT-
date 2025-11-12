# 📱 E-Shop Notification System Implementation Guide

## ✅ Implemented Notifications

### 🛒 1. Order Notifications

| Notification | Icon | Trigger | Message |
|-------------|------|---------|---------|
| **Order Placed** | 🟢 | When user completes checkout | "Your order #XXXXXX of ₹XXX has been placed and will be delivered soon." |
| **Order Shipped** | 🟡 | Admin updates order status to 'shipped' | "Great news! Your order #XXXXXX has been shipped and is on its way." |
| **Order Delivered** | 🟢 | Admin updates order status to 'delivered' | "Your order #XXXXXX has been delivered successfully. Thank you for shopping with E-Shop!" |
| **Order Cancelled** | 🔴 | User or admin cancels order | "Your order #XXXXXX has been cancelled. Amount will be refunded within 3-5 business days." |

**Backend Code Location:** `backend/controllers/orderController.js`

---

### 💰 2. Offer & Discount Notifications

| Notification | Icon | Trigger | Message |
|-------------|------|---------|---------|
| **Promotional Offer** | 🎉 | Admin sends from dashboard | "Special Offer: 20% off on Electronics today!" |
| **Flash Sale** | 🛍️ | Admin broadcasts | "Flash Sale! Hurry, limited stock!" |
| **Price Drop** | 💸 | Product price changes | "Price dropped for your saved product!" |

**How to Send:**
```bash
POST /api/admin/notifications/offer
```

**Example Request:**
```json
{
  "title": "Special Offer: 20% off on Electronics!",
  "message": "Limited time offer on all electronics. Shop now!",
  "discount": 20,
  "category": "Electronics"
}
```

**Backend Code Location:** `backend/routes/admin.js`

---

### 💬 3. Account Activity Notifications

| Notification | Icon | Trigger | Message |
|-------------|------|---------|---------|
| **Login Successful** | 🔐 | User logs in | "Welcome back, {Name}! You have successfully logged in." |
| **Profile Updated** | 🧾 | User updates profile | "Your profile information has been updated." |
| **Cart Added** | 🛒 | User adds item to cart | "{ProductName} has been added to your cart" |

**Backend Code Location:** 
- `backend/controllers/authController.js` (Login, Profile)
- `backend/controllers/cartController.js` (Cart)

---

### ❤️ 4. Wishlist / Stock Notifications

| Notification | Icon | Trigger | Message |
|-------------|------|---------|---------|
| **Stock Available** | 🛍️ | Product back in stock | "Your wishlist item is now in stock!" |
| **Price Drop Alert** | 💸 | Wishlist product price drops | "Price dropped for your saved product!" |

**Backend Code Location:** `backend/services/notificationScheduler.js`

---

## 🎯 Testing Notifications

### Method 1: Using Postman

#### Step 1: Login as Admin
```bash
POST http://localhost:5000/api/auth/login
```
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Copy the `token` from response.

#### Step 2: Send Promotional Offer
```bash
POST http://localhost:5000/api/admin/notifications/offer
Authorization: Bearer {your_token}
```
```json
{
  "title": "Flash Sale - 50% OFF!",
  "message": "All products 50% off for the next 2 hours!",
  "discount": 50,
  "type": "promotion"
}
```

#### Step 3: View Notifications
Login as a regular user and check the notification bell icon in the header.

---

### Method 2: Automatic Notifications

These are triggered automatically when users perform actions:

1. **Login** → User receives "Login Successful" notification
2. **Place Order** → User receives "Order Placed Successfully" notification
3. **Add to Cart** → User receives "Item Added to Cart" notification
4. **Update Profile** → User receives "Profile Updated Successfully" notification

---

## 📊 Admin Dashboard - Sending Notifications

### Broadcast Announcement
```bash
POST /api/admin/notifications/broadcast
```
```json
{
  "title": "System Maintenance",
  "message": "App will be under maintenance tonight from 2 AM - 4 AM",
  "type": "announcement"
}
```

### Test Notification
```bash
POST /api/admin/notifications/test
```
```json
{
  "userId": 1,
  "title": "Test Notification",
  "message": "This is a test",
  "type": "info"
}
```

---

## 🔔 Frontend Implementation

### Notification Display
- **Location:** Header component (top-right bell icon)
- **Badge:** Shows count of unread notifications
- **Dropdown:** Click bell icon to view all notifications
- **Real-time Updates:** Notifications appear instantly

### Code Location
- **Component:** `frontend/src/components/Header.js`
- **Lines:** Notification icon and dropdown menu

---

## 🚀 Quick Demo Flow

### 1. Order Flow Notifications
```
1. User logs in → "Login Successful" notification
2. User adds product to cart → "Item Added to Cart" notification
3. User places order → "Order Placed Successfully" notification
4. Admin updates order to 'shipped' → "Order Shipped" notification
5. Admin updates to 'delivered' → "Order Delivered" notification
```

### 2. Promotional Flow
```
1. Admin sends promotional offer
2. All users receive notification instantly
3. Users click notification to view offer
```

---

## 📝 Notification Types Reference

| Type | Backend Value | Icon | Color | Use Case |
|------|--------------|------|-------|----------|
| Order Placed | `order_placed` | 🟢 | Green | Order confirmation |
| Order Shipped | `order_shipped` | 🟡 | Orange | Shipping update |
| Order Delivered | `order_delivered` | 🟢 | Green | Delivery confirmation |
| Order Cancelled | `order_cancelled` | 🔴 | Red | Cancellation notice |
| Promotion | `promotion` | 🎉 | Purple | Marketing offers |
| Login | `login_alert` | 🔐 | Blue | Security alert |
| Profile Update | `profile_update` | 🧾 | Blue | Account changes |
| Cart | `cart` | 🛒 | Orange | Cart activities |
| Announcement | `announcement` | 📢 | Yellow | System messages |

---

## 🛠️ Database Schema

### Notification Model
```javascript
{
  id: Integer (Primary Key),
  userId: Integer (Foreign Key),
  title: String,
  body: Text,
  type: String,
  data: JSON,
  isRead: Boolean,
  sentAt: DateTime,
  createdAt: DateTime
}
```

---

## 🎨 UI Features

### Header Notification Bell
- **Unread Badge:** Red badge with count
- **Dropdown Menu:** 
  - Max height: 500px
  - Max width: 380px
  - Scrollable list
  - Unread highlighted in light blue
  - Shows time/date of each notification

### Notification Card
- **Title:** Bold, with emoji icon
- **Body:** Description text
- **Timestamp:** Relative time (e.g., "30 minutes ago")
- **Read Status:** Different background for unread

---

## 📦 Dependencies

### Backend
```json
{
  "node-cron": "^3.0.2",
  "sequelize": "^6.32.1"
}
```

### Frontend
```json
{
  "@mui/material": "^5.14.20",
  "@mui/icons-material": "^5.14.19"
}
```

---

## ✨ Future Enhancements

1. **Real-time Push Notifications** (Firebase Cloud Messaging)
2. **Email Notifications** (NodeMailer)
3. **SMS Notifications** (Twilio)
4. **In-app Sound/Vibration**
5. **Notification Preferences** (User settings)
6. **Mark as Read/Unread**
7. **Delete Notifications**
8. **Notification History Page**

---

## 🐛 Troubleshooting

### Notifications Not Showing?
1. Check if user is logged in
2. Verify notification bell icon in header
3. Check browser console for errors
4. Ensure backend server is running on port 5000

### No Unread Badge?
1. All notifications might be read
2. Check `isRead` field in database
3. Verify notifications exist for user

### Admin Can't Send Notifications?
1. Verify admin token is valid
2. Check endpoint URL (should include `/api/admin/`)
3. Ensure PostgreSQL database is connected

---

## 📞 Support

For issues or questions:
- Check `backend/logs/` for error logs
- Review `API_ENDPOINTS.md` for API documentation
- Test endpoints using Postman collection `E-Shop_Postman_Collection.json`

---

**Happy Coding! 🎉**
