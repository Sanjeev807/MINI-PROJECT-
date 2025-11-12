# E-Shop API Endpoints Documentation

**Base URL:** `http://localhost:5000`

---

## 🔐 Authentication Endpoints (`/api/auth`)

### 1. Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```
- **Response:**
```json
{
  "_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "customer",
  "token": "jwt_token_here"
}
```

### 2. Login User
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "customer",
  "token": "jwt_token_here"
}
```

### 3. Get User Profile
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
```json
{
  "_id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "role": "customer"
}
```

### 4. Update User Profile
- **PUT** `/api/auth/profile`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543211",
  "address": "456 New St",
  "password": "newpassword123"
}
```

### 5. Update FCM Token
- **PUT** `/api/auth/fcm-token`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
{
  "fcmToken": "firebase_token_here"
}
```

### 6. Logout
- **POST** `/api/auth/logout`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 🛍️ Product Endpoints (`/api/products`)

### 1. Get All Products
- **GET** `/api/products`
- **Query Parameters:**
  - `category` (optional): Filter by category
  - `search` (optional): Search by name/description
  - `sort` (optional): `price_low`, `price_high`, `rating`
  - `minPrice` (optional): Minimum price filter
  - `maxPrice` (optional): Maximum price filter
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 1000)
- **Example:** `/api/products?category=Electronics&sort=price_low&page=1&limit=20`
- **Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Smart LED TV 55 inch",
      "description": "4K Ultra HD Smart TV",
      "price": 44999,
      "originalPrice": 64999,
      "discount": 31,
      "category": "Electronics",
      "images": ["url"],
      "stock": 45,
      "rating": 4.5,
      "reviews": 1234,
      "isFeatured": true
    }
  ],
  "page": 1,
  "pages": 3,
  "total": 50
}
```

### 2. Get Featured Products
- **GET** `/api/products/featured`
- **Response:** Array of featured products (limit 10)

### 3. Get Product by ID
- **GET** `/api/products/:id`
- **Example:** `/api/products/1`
- **Response:**
```json
{
  "id": 1,
  "name": "Smart LED TV 55 inch",
  "description": "4K Ultra HD Smart TV",
  "price": 44999,
  "originalPrice": 64999,
  "discount": 31,
  "category": "Electronics",
  "images": ["url"],
  "stock": 45,
  "rating": 4.5,
  "reviews": 1234,
  "isFeatured": true,
  "specifications": {}
}
```

### 4. Create Product (Admin Only)
- **POST** `/api/products`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 999,
  "originalPrice": 1299,
  "category": "Electronics",
  "images": ["url"],
  "stock": 100,
  "rating": 4.5,
  "reviews": 0,
  "isFeatured": false
}
```

### 5. Update Product (Admin Only)
- **PUT** `/api/products/:id`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:** Same as create product

### 6. Delete Product (Admin Only)
- **DELETE** `/api/products/:id`
- **Headers:** `Authorization: Bearer {admin_token}`

---

## 🛒 Cart Endpoints (`/api/cart`)

### 1. Get User Cart
- **GET** `/api/cart`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
```json
{
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 2,
      "product": {
        "id": 1,
        "name": "Product Name",
        "price": 999,
        "image": "url"
      }
    }
  ],
  "totalItems": 2,
  "totalPrice": 1998
}
```

### 2. Add to Cart
- **POST** `/api/cart`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

### 3. Update Cart Item
- **PUT** `/api/cart/:itemId`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
{
  "quantity": 3
}
```

### 4. Remove from Cart
- **DELETE** `/api/cart/:itemId`
- **Headers:** `Authorization: Bearer {token}`

### 5. Clear Cart
- **DELETE** `/api/cart`
- **Headers:** `Authorization: Bearer {token}`

---

## 📦 Order Endpoints (`/api/orders`)

### 1. Create Order
- **POST** `/api/orders`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 999
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "phone": "9876543210"
  },
  "paymentMethod": "cod"
}
```

### 2. Get My Orders
- **GET** `/api/orders`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
```json
[
  {
    "id": 1,
    "orderNumber": "ORD-20231115-001",
    "items": [],
    "totalAmount": 1998,
    "status": "pending",
    "createdAt": "2023-11-15T10:30:00Z"
  }
]
```

### 3. Get Order by ID
- **GET** `/api/orders/:id`
- **Headers:** `Authorization: Bearer {token}`

### 4. Update Order Status (Admin Only)
- **PUT** `/api/orders/:id/status`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**
```json
{
  "status": "processing"
}
```

### 5. Cancel Order
- **PUT** `/api/orders/:id/cancel`
- **Headers:** `Authorization: Bearer {token}`

---

## 🔔 Notification Endpoints (`/api/notifications`)

### 1. Get User Notifications
- **GET** `/api/notifications`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
```json
[
  {
    "id": 1,
    "title": "Welcome!",
    "body": "Thank you for joining E-Shop",
    "type": "welcome",
    "isRead": false,
    "createdAt": "2023-11-15T10:30:00Z"
  }
]
```

### 2. Mark Notification as Read
- **PUT** `/api/notifications/:id/read`
- **Headers:** `Authorization: Bearer {token}`

### 3. Mark All as Read
- **PUT** `/api/notifications/read-all`
- **Headers:** `Authorization: Bearer {token}`

### 4. Delete Notification
- **DELETE** `/api/notifications/:id`
- **Headers:** `Authorization: Bearer {token}`

### 5. Send Notification to User (Admin Only)
- **POST** `/api/notifications/send`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**
```json
{
  "userId": 1,
  "title": "Special Offer",
  "body": "50% off on all electronics!",
  "type": "promotion"
}
```

### 6. Broadcast Notification (Admin Only)
- **POST** `/api/notifications/broadcast`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**
```json
{
  "title": "Flash Sale",
  "body": "Limited time offer!",
  "type": "announcement"
}
```

### 7. Send Promotional Offer (Admin Only)
- **POST** `/api/admin/notifications/offer`
- **Headers:** `Authorization: Bearer {admin_token}`
- **Body:**
```json
{
  "title": "Special Offer: 20% off on Electronics!",
  "message": "Limited time offer on all electronics. Shop now!",
  "discount": 20,
  "category": "Electronics",
  "type": "promotion"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Promotional notification sent to 150 users!",
  "recipientCount": 150,
  "offer": {
    "title": "Special Offer: 20% off on Electronics!",
    "message": "Limited time offer on all electronics. Shop now!",
    "discount": 20,
    "category": "Electronics"
  },
  "timestamp": "2023-11-15T10:30:00Z"
}
```

---

## 👨‍💼 Admin Endpoints (`/api/admin`)

### 1. Get Dashboard Stats
- **GET** `/api/admin/stats`
- **Response:**
```json
{
  "totalUsers": 150,
  "totalProducts": 50,
  "totalOrders": 0,
  "totalRevenue": 0,
  "totalNotifications": 300,
  "activeSessions": 15,
  "growth": {
    "users": "12.5",
    "notifications": "8.3"
  }
}
```

### 2. Get All Users
- **GET** `/api/admin/users`
- **Query Parameters:**
  - `page` (optional): Page number
  - `limit` (optional): Users per page
  - `search` (optional): Search by name/email
- **Example:** `/api/admin/users?page=1&limit=10&search=john`

### 3. Get User Count
- **GET** `/api/admin/users/count`

### 4. Get User Details
- **GET** `/api/admin/users/:id`

### 5. Get All Products (Admin View)
- **GET** `/api/admin/products`
- **Query Parameters:**
  - `page`, `limit`, `category`, `search`

### 6. Get Notification Stats
- **GET** `/api/admin/notifications/stats`

### 7. Get Recent Notifications
- **GET** `/api/admin/notifications/recent?limit=20`

### 8. Send Broadcast Notification
- **POST** `/api/admin/notifications/broadcast`
- **Body:**
```json
{
  "title": "System Update",
  "message": "App will be under maintenance",
  "type": "announcement"
}
```

### 9. Send Test Notification
- **POST** `/api/admin/notifications/test`
- **Body:**
```json
{
  "userId": 1,
  "title": "Test",
  "message": "This is a test notification",
  "type": "info"
}
```

### 10. System Health Check
- **GET** `/api/admin/system/health`

---

## 🏠 Health Check

### Root Endpoint
- **GET** `/`
- **Response:**
```json
{
  "message": "E-commerce API with Push Notifications is running!",
  "endpoints": {
    "auth": "/api/auth",
    "products": "/api/products",
    "cart": "/api/cart",
    "orders": "/api/orders",
    "notifications": "/api/notifications",
    "admin": "/api/admin"
  }
}
```

---

## 📝 Notes for Postman Testing

### Setting up Authorization:
1. After login/register, copy the `token` from response
2. In Postman, go to **Authorization** tab
3. Select **Type**: Bearer Token
4. Paste the token in the **Token** field

### Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (admin access required)
- `404` - Not Found
- `500` - Server Error

### Test Flow:
1. **Register** a new user → Get token
2. **Login** with credentials → Verify token
3. **Get Products** → Test product listing
4. **Add to Cart** → Test cart functionality
5. **Create Order** → Test order creation
6. **Get Notifications** → Test notification system

### Sample Test Data:
```
Email: test@example.com
Password: password123
Name: Test User
Phone: 9876543210
```

---

## 🚀 Quick Start Commands

```bash
# Start Backend Server
cd backend
npm run dev

# Server runs on: http://localhost:5000
# Test health: http://localhost:5000/
```

---

**Happy Testing! 🎉**
