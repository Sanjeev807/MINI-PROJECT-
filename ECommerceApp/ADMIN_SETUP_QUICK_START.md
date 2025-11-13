# 🚀 Quick Setup: Admin Dashboard

## 📋 Prerequisites
- Backend server running on port 5000
- PostgreSQL database connected
- Frontend running on port 3000

## ⚡ Quick Setup (3 Steps)

### Step 1: Start Backend (if not running)
```bash
cd backend
npm start
```
Wait for: ✅ `Server running on port 5000`

### Step 2: Create Admin User
```bash
# In a new terminal
cd backend
node utils/createAdminUser.js
```

**Admin Credentials Created:**
- 📧 Email: `admin@eshop.com`
- 🔑 Password: `admin123`

### Step 3: Login & Access Dashboard
1. Navigate to: `http://localhost:3000/login`
2. Login with admin credentials
3. Click **profile icon** (top right)
4. Select **"🎯 Admin Dashboard"**

## 🎯 Admin Dashboard Features

### 1️⃣ Overview Tab
- 👥 Total Users (with growth %)
- 📦 Total Products
- 🔔 Total Notifications
- 📊 Active Sessions
- Recent users & notifications

### 2️⃣ Users Tab
- View all registered users
- Search by name/email
- User roles (admin/user)
- Registration dates
- Account status

### 3️⃣ Products Tab
- Product catalog with images
- Stock status monitoring
- Price & rating information
- Category filters

### 4️⃣ Notifications Tab
- Complete notification history
- Type-based filtering
- User-specific notifications
- Timestamp tracking

### 5️⃣ Send Notification Tab
**Broadcast Notification:**
- Send to ALL users
- System announcements
- General notices

**Promotional Offer:**
- Discount campaigns
- Category-specific offers
- Flash sales

## 📱 Testing the Dashboard

### Test Broadcast Notification
1. Go to "Send Notification" tab
2. Select "Broadcast Notification"
3. Enter:
   ```
   Title: System Update
   Message: New features have been added to the platform!
   ```
4. Click "Send to All Users"
5. ✅ Success! All users receive notification

### Test Promotional Offer
1. Go to "Send Notification" tab
2. Select "Promotional Offer"
3. Enter:
   ```
   Title: Flash Sale - 50% OFF
   Message: Limited time offer on all electronics!
   Discount: 50
   Category: Electronics
   ```
4. Click "Send Promotional Offer"
5. ✅ Success! Promotional notification sent

## 🔐 Security

### Access Control
- ✅ Only users with `role: 'admin'` can access
- ✅ Automatic redirect if not admin
- ✅ Protected API routes

### Change Admin Password
Update in database or via profile settings:
```sql
UPDATE users 
SET password = 'new_hashed_password' 
WHERE email = 'admin@eshop.com';
```

## 📊 API Endpoints

All admin routes are prefixed with `/api/admin/`

### Statistics
```
GET /api/admin/stats
```

### Users
```
GET /api/admin/users
GET /api/admin/users/:id
GET /api/admin/users/count
```

### Products
```
GET /api/admin/products
```

### Notifications
```
GET /api/admin/notifications/stats
GET /api/admin/notifications/recent

POST /api/admin/notifications/broadcast
POST /api/admin/notifications/offer
```

## 🎨 UI Screenshots

### Dashboard Overview
```
┌─────────────────────────────────────────────┐
│  🎯 Admin Dashboard          [Refresh]      │
├─────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │
│  │  100   │ │   50   │ │  250   │ │  15  │ │
│  │ Users  │ │Products│ │Notifs  │ │Active│ │
│  │ +12%   │ │ Active │ │ +45 📈 │ │ Live │ │
│  └────────┘ └────────┘ └────────┘ └──────┘ │
├─────────────────────────────────────────────┤
│  [Overview][Users][Products][Notifs][Send]  │
└─────────────────────────────────────────────┘
```

### Send Notification Panel
```
┌─────────────────────────────────────┐
│  📢 Broadcast Notification          │
├─────────────────────────────────────┤
│  Title: [Enter title...]            │
│  Message: [Enter message...]        │
│                                     │
│  [Send to All Users] 👥             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🎁 Promotional Offer               │
├─────────────────────────────────────┤
│  Title: [Flash Sale - 50% OFF]      │
│  Message: [Limited time offer...]   │
│  Discount: [50]  Category: [Elec]   │
│                                     │
│  [Send Promotional Offer] 🎉        │
└─────────────────────────────────────┘
```

## 🐛 Troubleshooting

### Can't see Admin Dashboard link?
**Issue:** No admin option in profile menu

**Solution:**
1. Check user role in database:
   ```sql
   SELECT id, name, email, role FROM users WHERE email = 'admin@eshop.com';
   ```
2. If role is not 'admin', update:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@eshop.com';
   ```
3. Logout and login again

### 404 Error on /admin route?
**Issue:** Page not found

**Solution:**
- Ensure frontend is rebuilt: `npm start` in frontend folder
- Clear browser cache
- Check AppRoutes.js includes admin route

### Stats showing 0?
**Issue:** All statistics show 0

**Solution:**
1. Seed database with products:
   ```bash
   cd backend
   node utils/newSeed.js
   ```
2. Register some test users
3. Refresh admin dashboard

## 📈 Usage Statistics

After setup, you can monitor:
- ✅ Total registered users
- ✅ Product catalog size
- ✅ Notifications sent
- ✅ User engagement metrics

## 🎉 Success Checklist

- [ ] Backend server running
- [ ] Database connected
- [ ] Admin user created
- [ ] Can login with admin credentials
- [ ] Admin Dashboard link visible in profile menu
- [ ] Can access /admin route
- [ ] Statistics loading correctly
- [ ] Can view users table
- [ ] Can view products table
- [ ] Can send broadcast notification
- [ ] Can send promotional offer

## 📞 Need Help?

Check these files:
- `ADMIN_DASHBOARD_GUIDE.md` - Complete feature documentation
- `backend/routes/admin.js` - API endpoints
- `frontend/src/screens/AdminDashboard.js` - UI component
- Console logs (F12 in browser)
- Backend terminal output

---

**Ready to manage your E-Shop! 🚀**

*Version 1.0.0*
