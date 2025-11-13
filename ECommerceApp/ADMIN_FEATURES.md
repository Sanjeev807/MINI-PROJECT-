# 🎯 Admin Dashboard Features

## 🔐 Admin Login

### Credentials
- **Email:** `admin@eshop.com`
- **Password:** `admin123`

### Login Flow
1. Click **"🎯 Admin Login"** button on homepage
2. Enter admin credentials
3. Automatically redirected to **Admin Dashboard** (`/admin`)

---

## 📊 Dashboard Overview

### Tab 1: Overview
**Real-time Statistics:**
- 👥 **Total Users** - All registered users with 30-day growth %
- 📦 **Total Products** - Complete product catalog count
- 🔔 **Total Notifications** - All sent notifications with daily count
- 📊 **Active Sessions** - Currently active users

**Recent Activity:**
- Last 5 registered users
- Last 5 sent notifications

---

## 📦 Product Management (Tab 3)

### ➕ Add New Product
1. Click **"Add Product"** button
2. Fill in product details:
   - **Name:** Product title (required)
   - **Description:** Detailed description (required)
   - **Price:** Product price in ₹ (required)
   - **Stock:** Available quantity (required)
   - **Category:** Product category (required)
   - **Rating:** Product rating (0-5, default: 4.5)
   - **Images:** Comma-separated image URLs (required)

3. Click **"Add Product"**
4. Product appears in catalog immediately

**Example:**
```
Name: iPhone 15 Pro Max
Description: Latest flagship smartphone with A17 Pro chip
Price: 134900
Stock: 25
Category: Electronics
Rating: 4.8
Images: https://images.unsplash.com/photo-1678652197950-7e6645e1f9e6?w=400
```

### ✏️ Edit Product
1. Click **Edit** icon (blue pencil) on any product
2. Modify product details in dialog
3. Click **"Update Product"**
4. Changes saved instantly

### 🗑️ Delete Product
1. Click **Delete** icon (red trash) on any product
2. Confirm deletion in popup
3. Product removed from catalog

### Product Table Columns
- **Product:** Image + Name
- **Category:** Chip badge
- **Price:** Indian Rupees (₹)
- **Stock:** Color-coded (Green >10, Yellow ≤10)
- **Rating:** Stars ⭐
- **Actions:** Edit & Delete buttons

---

## 📢 Notification System (Tab 5)

### Broadcast Notification
**Send to ALL users simultaneously**

**Fields:**
- Title (required)
- Message (required)

**Use Cases:**
- System maintenance announcements
- New feature releases
- Important policy updates

**Example:**
```
Title: Website Maintenance Notice
Message: Our website will be under maintenance on Sunday from 2 AM to 4 AM. Thank you for your patience!
```

### Promotional Offer
**Send marketing campaigns**

**Fields:**
- Title (required)
- Message (required)
- Discount % (optional)
- Category (optional)

**Use Cases:**
- Flash sales
- Seasonal offers
- Category-specific deals

**Example:**
```
Title: Flash Sale - 50% OFF on Electronics
Message: Limited time offer! Get flat 50% discount on all electronics. Hurry up!
Discount: 50
Category: Electronics
```

---

## 👥 User Management (Tab 2)

### Features
- View all registered users
- Search by name or email
- See user roles (Admin/User)
- Check registration dates
- Monitor account status

### User Details
- Avatar with first letter
- Full name
- Email address
- Role badge (color-coded)
- Join date
- Status chip

---

## 🔔 Notification History (Tab 4)

### View Features
- Complete notification log
- Color-coded by type:
  - **Orange:** Promotional
  - **Green:** Order-related
  - **Blue:** Login/Account alerts
  - **Grey:** General

### Information Displayed
- Notification title with emoji
- Full message body
- Type badge
- Recipient user ID
- Timestamp

---

## 🔒 Admin-Only Features

### Protected Routes
✅ `/admin` - Admin Dashboard (admin role required)

### Protected API Endpoints
✅ `POST /api/products` - Create product (admin only)
✅ `PUT /api/products/:id` - Update product (admin only)
✅ `DELETE /api/products/:id` - Delete product (admin only)
✅ `POST /api/admin/notifications/broadcast` - Send broadcast
✅ `POST /api/admin/notifications/offer` - Send promotion

### Authorization
- JWT token required in headers
- User role must be `'admin'`
- Automatic redirect if not authorized

---

## 🎨 UI Features

### Design Elements
- **Purple Gradient** - Admin branding
- **Responsive Tables** - Mobile-friendly
- **Hover Effects** - Interactive feedback
- **Toast Notifications** - Success/Error messages
- **Loading States** - Smooth UX
- **Color-Coded Chips** - Visual status indicators

### Action Buttons
- **Refresh** - Reload dashboard data
- **Add Product** - Opens product dialog
- **Edit** - Blue pencil icon
- **Delete** - Red trash icon
- **Send Notification** - Gradient buttons

---

## ⚡ Quick Actions

### 1. Add First Product
```bash
# Navigate to Products tab
# Click "Add Product"
# Fill details and save
```

### 2. Send Welcome Notification
```bash
# Navigate to Send Notification tab
# Choose Broadcast
# Title: "Welcome to E-Shop!"
# Message: "Explore amazing deals today!"
# Click "Send to All Users"
```

### 3. Update Product Stock
```bash
# Navigate to Products tab
# Click Edit on any product
# Update stock quantity
# Click "Update Product"
```

---

## 🐛 Troubleshooting

### Can't Access Admin Dashboard?
**Check:**
1. Logged in with admin credentials?
2. User role is `'admin'` in database?
3. Browser console for errors (F12)

### Products Not Saving?
**Verify:**
1. All required fields filled?
2. Backend server running (port 5000)?
3. PostgreSQL database connected?
4. Check backend console logs

### Notifications Not Sending?
**Ensure:**
1. Title and message provided?
2. Backend `/admin` routes accessible?
3. Users exist in database?

---

## 📱 Mobile Access

Admin dashboard is fully responsive:
- **Desktop:** Full 3-column layout
- **Tablet:** 2-column adaptive
- **Mobile:** Single column, scrollable tabs

---

## 🎯 Best Practices

### Product Management
1. ✅ Use high-quality product images
2. ✅ Write detailed descriptions
3. ✅ Keep stock quantities updated
4. ✅ Set competitive prices
5. ✅ Categorize products correctly

### Notification Strategy
1. 📢 Don't spam users with too many notifications
2. 🎁 Send promotions at strategic times
3. 📝 Keep messages clear and concise
4. 🎯 Use relevant emojis for engagement
5. ⏰ Schedule important announcements ahead

### Security
1. 🔐 Change default admin password
2. 🔒 Don't share admin credentials
3. 👀 Monitor user activity regularly
4. 📊 Review notification history
5. 🚫 Remove unauthorized users promptly

---

## 📈 Success Metrics

Track your admin performance:
- **Products Added:** Monitor catalog growth
- **Notifications Sent:** Track engagement campaigns
- **Users Registered:** Measure platform growth
- **Orders Processed:** Revenue generation

---

**🎉 You're ready to manage your E-Shop!**

*Admin Dashboard v1.0.0*
