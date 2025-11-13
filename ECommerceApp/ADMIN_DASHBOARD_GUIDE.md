# 🎯 Admin Dashboard Guide

## Overview
The E-Shop Admin Dashboard provides comprehensive control over your e-commerce platform with real-time statistics, user management, product oversight, and notification broadcasting capabilities.

## 🔐 Admin Access

### Default Admin Credentials
```
Email: admin@eshop.com
Password: admin123
```

### Creating Admin User
Run the following command to create an admin user:
```bash
cd backend
node utils/createAdminUser.js
```

### Login as Admin
1. Navigate to `/login`
2. Enter admin credentials
3. Click on your profile icon (top right)
4. Select **"🎯 Admin Dashboard"** from the dropdown menu
5. Or directly navigate to `/admin`

## 📊 Dashboard Features

### 1. **Overview Tab** 📈
Real-time statistics and metrics:

#### Statistics Cards
- **👥 Total Users**: Total registered users with growth percentage
- **📦 Total Products**: Total products in the catalog
- **🔔 Total Notifications**: All notifications sent with daily count
- **📊 Active Sessions**: Current active user sessions

#### Recent Activity
- **Recent Users**: Last 5 registered users with email and join date
- **Recent Notifications**: Latest 5 notifications with type and timestamp

### 2. **Users Tab** 👥
Comprehensive user management:

#### Features
- View all registered users in a table format
- Search users by name or email
- User details include:
  - Avatar with first letter of name
  - Full name and email
  - User role (admin/user) with color-coded chips
  - Registration date
  - Account status (Active/Inactive)

#### User Statistics
- Total user count
- User growth percentage
- Recent registrations (last 30 days)

### 3. **Products Tab** 📦
Product catalog overview:

#### Features
- View all products with images
- Product information includes:
  - Product image thumbnail (50x50)
  - Product name
  - Category (chip badge)
  - Price in INR (₹)
  - Stock status (color-coded: green >10, yellow ≤10)
  - Rating with star icon

#### Quick Actions
- **Add Product** button (future implementation)
- Search products by name
- Filter by category

### 4. **Notifications Tab** 🔔
Notification history and monitoring:

#### Features
- Complete notification history
- Each notification card shows:
  - Title with emoji icon
  - Notification body/message
  - Type badge (promotion, order_placed, login_alert, etc.)
  - User ID of recipient
  - Timestamp in locale format

#### Color-Coded Border
- **Orange**: Promotional notifications
- **Green**: Order-related notifications
- **Blue**: Login/account alerts
- **Grey**: General notifications

### 5. **Send Notification Tab** 📢
Powerful broadcast messaging system:

#### Broadcast Notification 📢
Send announcements to **all users** simultaneously:

**Fields:**
- **Title**: Announcement headline (required)
- **Message**: Detailed announcement text (required)

**Example Use Cases:**
- System maintenance announcements
- New feature releases
- Policy updates
- Important notices

**Button:** "Send to All Users" (purple gradient)

#### Promotional Offer 🎁
Send targeted promotional campaigns:

**Fields:**
- **Offer Title**: Promotional headline (required)
- **Offer Message**: Detailed offer description (required)
- **Discount %**: Percentage discount (optional)
- **Category**: Target product category (optional, e.g., "Electronics")

**Example Use Cases:**
- Flash sales (e.g., "50% OFF on Electronics")
- Seasonal offers (e.g., "Diwali Sale - 30% OFF")
- Category-specific deals
- Limited-time discounts

**Button:** "Send Promotional Offer" (pink gradient)

## 🎨 UI Design Features

### Color Scheme
- **Purple Gradient**: User statistics, broadcast notifications
- **Pink Gradient**: Product statistics, promotional offers
- **Cyan Gradient**: Notification statistics
- **Green Gradient**: Active sessions, analytics

### Interactive Elements
- **Hover Effects**: Tables rows highlight on hover
- **Chip Badges**: Color-coded for status, roles, and categories
- **Avatar Icons**: User initials with colored backgrounds
- **Loading States**: Circular progress indicators
- **Toast Notifications**: Success/error feedback

### Responsive Design
- **Desktop**: Full 3-column layout
- **Tablet**: 2-column layout
- **Mobile**: Single column, scrollable tabs

## 🔧 API Endpoints

### Statistics
```
GET /api/admin/stats
```
Returns dashboard statistics including total users, products, notifications, and growth metrics.

### User Management
```
GET /api/admin/users?page=1&limit=10&search=query
GET /api/admin/users/:id
GET /api/admin/users/count
```

### Product Management
```
GET /api/admin/products?page=1&limit=10&category=Electronics&search=query
```

### Notification Management
```
GET /api/admin/notifications/stats
GET /api/admin/notifications/recent?limit=20

POST /api/admin/notifications/broadcast
Body: { title, message, type }

POST /api/admin/notifications/offer
Body: { title, message, discount, category }

POST /api/admin/notifications/test
Body: { userId, title, message, type }
```

### System Health
```
GET /api/admin/system/health
```

## 📱 Notification Examples

### Broadcast Notification
```json
{
  "title": "Website Maintenance Notice",
  "message": "Our website will be under maintenance on Sunday from 2 AM to 4 AM. Thank you for your patience!"
}
```

### Promotional Offer
```json
{
  "title": "Flash Sale - 50% OFF on Electronics",
  "message": "Limited time offer! Get flat 50% discount on all electronics. Hurry up!",
  "discount": "50",
  "category": "Electronics"
}
```

## 🔒 Security Features

### Admin Route Protection
- Automatic redirect to login if not authenticated
- Role-based access control (admin role required)
- Protected API endpoints with `requireAdmin` middleware

### Best Practices
1. Change default admin password immediately
2. Use strong passwords (min 6 characters)
3. Regularly monitor user activity
4. Review notification history for unauthorized broadcasts
5. Keep admin credentials secure

## 🚀 Quick Start Guide

### Step 1: Create Admin User
```bash
cd backend
node utils/createAdminUser.js
```

### Step 2: Login
1. Navigate to `http://localhost:3000/login`
2. Enter: `admin@eshop.com` / `admin123`
3. Click "Login"

### Step 3: Access Dashboard
1. Click profile icon (top right)
2. Select "🎯 Admin Dashboard"
3. Start managing your e-commerce platform!

### Step 4: Send First Notification
1. Go to "Send Notification" tab
2. Choose "Promotional Offer"
3. Enter:
   - Title: "Welcome Offer - 20% OFF"
   - Message: "Get 20% discount on your first purchase!"
   - Discount: "20"
4. Click "Send Promotional Offer"
5. All users will receive the notification instantly!

## 📊 Dashboard Metrics Explained

### User Growth %
```
(Recent Users / Total Users) × 100
```
Recent Users = Users registered in last 30 days

### Notification Growth %
```
(Recent Notifications / Total Notifications) × 100
```
Recent Notifications = Notifications sent in last 24 hours

### Active Sessions
Real-time count of currently logged-in users (mock data for demo)

## 🎯 Future Enhancements

### Planned Features
- [ ] Revenue analytics with charts
- [ ] Order management system
- [ ] Product add/edit/delete functionality
- [ ] User ban/unban capabilities
- [ ] Advanced search and filters
- [ ] Export data to CSV/Excel
- [ ] Email notifications
- [ ] Role management (super admin, moderator)
- [ ] Activity logs and audit trails
- [ ] Custom notification scheduling

### Analytics Dashboard
- [ ] Sales trends graphs
- [ ] User engagement metrics
- [ ] Product performance analytics
- [ ] Notification effectiveness tracking

## 🐛 Troubleshooting

### Can't Access Admin Dashboard
**Problem**: Redirected to home page
**Solution**: Ensure your user has `role: 'admin'` in the database

### Notifications Not Sending
**Problem**: Broadcast fails
**Solution**: Check backend is running on port 5000 and PostgreSQL is connected

### Stats Not Loading
**Problem**: Dashboard shows loading spinner
**Solution**: Verify `/api/admin/stats` endpoint is accessible and database is seeded

### 401 Unauthorized Error
**Problem**: API requests failing
**Solution**: Ensure you're logged in with admin credentials and JWT token is valid

## 📞 Support

For issues or questions:
1. Check console logs (F12 in browser)
2. Review backend terminal output
3. Verify database connection
4. Ensure admin user exists with correct role

## 🎉 Success Metrics

Track your admin dashboard effectiveness:
- **Users Engaged**: Monitor notification open rates
- **Products Managed**: Track catalog growth
- **Campaigns Sent**: Count promotional offers
- **Active Users**: Monitor daily/weekly active users

---

**Built with ❤️ for E-Shop E-Commerce Platform**

*Version 1.0.0 - November 2025*
