# ✅ FCM Push Notifications - Quick Start Checklist

## 🚀 Pre-Launch Checklist

Use this checklist to ensure your FCM push notification system is ready to go.

---

## ☑️ Backend Setup

- [ ] **1. Firebase Admin SDK Credentials**
  - File exists: `backend/config/serviceAccountKey.json`
  - Contains valid Firebase credentials (not placeholder values)
  - Project ID matches: `e-shopeasy`

- [ ] **2. Environment Variables**
  - `.env` file exists in backend folder
  - Contains `JWT_SECRET`
  - Contains database credentials

- [ ] **3. Dependencies Installed**
  ```bash
  cd backend
  npm install
  ```

- [ ] **4. Database Schema**
  - PostgreSQL is running
  - Users table has `fcmToken` column (auto-created on server start)

- [ ] **5. Backend Server**
  - Server starts without errors
  - Firebase Admin SDK initializes successfully
  - Promotional scheduler starts automatically
  - Check logs for: "✅ Firebase Admin SDK initialized successfully"

---

## ☑️ Frontend Setup

- [ ] **1. VAPID Key Configuration**
  - Get VAPID key from [Firebase Console](https://console.firebase.google.com/)
  - Navigate to: Project Settings > Cloud Messaging > Web Push certificates
  - Copy the key pair
  - Update `frontend/src/firebase/messaging.js`:
    ```javascript
    vapidKey: 'YOUR_ACTUAL_VAPID_KEY'  // Replace this
    ```

- [ ] **2. Service Worker Location**
  - File exists: `frontend/public/firebase-messaging-sw.js`
  - Accessible at root URL: `/firebase-messaging-sw.js`

- [ ] **3. Firebase Config**
  - File exists: `frontend/src/firebase/config.js`
  - Contains correct Firebase configuration
  - Project ID: `e-shopeasy`

- [ ] **4. Frontend Dependencies**
  ```bash
  cd frontend
  npm install firebase
  ```

---

## ☑️ Testing

- [ ] **1. Test Browser Support**
  - Open `frontend/fcm-demo.html` in browser
  - Check: "Browser supports notifications and service workers"

- [ ] **2. Request Notification Permission**
  - Click "Enable Notifications" button
  - Allow notification permission
  - FCM token should appear

- [ ] **3. Test Local Notification**
  - Click "Test Local Notification"
  - Browser notification should appear

- [ ] **4. Test API - Login**
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}'
  ```
  - Should receive JWT token
  - Should receive login notification

- [ ] **5. Test API - Test Notification**
  ```bash
  curl -X POST http://localhost:5000/api/fcm/test \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```
  - Should receive test notification

- [ ] **6. Test Order Flow**
  - Login as user
  - Place an order
  - Check notification: "Order Placed Successfully!"
  - Update order status (as admin)
  - Check notification: "Your item is shipped. Track now!"

- [ ] **7. Test Promotional Notifications (Admin)**
  ```bash
  curl -X POST http://localhost:5000/api/fcm/promotional/random \
    -H "Authorization: Bearer ADMIN_JWT_TOKEN"
  ```
  - All users should receive promotional notification

- [ ] **8. Test Scheduler Status (Admin)**
  ```bash
  curl http://localhost:5000/api/fcm/scheduler/status \
    -H "Authorization: Bearer ADMIN_JWT_TOKEN"
  ```
  - Should show: `"isRunning": true`
  - Should show: `"activeJobs": 6`

---

## ☑️ Integration Checklist

- [ ] **1. Add FCM to Login Flow**
  ```javascript
  import { initializeFCM } from './firebase/messaging';
  
  const handleLogin = async (authToken) => {
    await initializeFCM(authToken);
  };
  ```

- [ ] **2. Add FCM to Registration Flow**
  ```javascript
  const handleRegister = async (authToken) => {
    await initializeFCM(authToken);
  };
  ```

- [ ] **3. Listen for Foreground Messages**
  ```javascript
  import { onForegroundMessage } from './firebase/messaging';
  
  onForegroundMessage((payload) => {
    showNotificationToast(payload.notification);
  });
  ```

- [ ] **4. Request Permission at Right Time**
  - Don't request on page load
  - Request after user shows interest
  - Request after login/registration

---

## ☑️ Production Checklist

- [ ] **1. Security**
  - Service account key is NOT committed to git
  - Add to `.gitignore`: `serviceAccountKey.json`
  - VAPID key is environment-specific

- [ ] **2. Error Handling**
  - All FCM errors are logged
  - Invalid tokens are handled gracefully
  - Permission denial is handled

- [ ] **3. User Experience**
  - Clear permission request message
  - Users can enable/disable notifications
  - Notifications have clear actions
  - Notification messages are concise

- [ ] **4. Performance**
  - Scheduler doesn't send too frequently
  - Batch notifications when possible
  - Clean up expired tokens

- [ ] **5. Monitoring**
  - Check server logs regularly
  - Monitor notification delivery rates
  - Track user engagement with notifications

---

## ☑️ Documentation Review

- [ ] **Read Complete Guide**
  - `FCM_PUSH_NOTIFICATIONS_GUIDE.md`

- [ ] **Review API Reference**
  - `FCM_API_REFERENCE.md`

- [ ] **Check Implementation Summary**
  - `FCM_IMPLEMENTATION_SUMMARY.md`

---

## 🎯 Common Issues & Solutions

### Issue: "No FCM token available"
**Solution:**
1. Check VAPID key is added to `messaging.js`
2. Ensure notification permission is granted
3. Check browser console for errors

### Issue: "Firebase Admin SDK not initialized"
**Solution:**
1. Verify `serviceAccountKey.json` exists
2. Check file contains real credentials (not placeholders)
3. Restart backend server

### Issue: "Notification not appearing"
**Solution:**
1. Check browser notification permission
2. Verify service worker is registered
3. Check FCM token is saved to database
4. Look at browser console and network tab

### Issue: "Scheduler not running"
**Solution:**
1. Check server logs for "Promotional scheduler started"
2. Verify Firebase is initialized
3. Check for cron job errors in logs

---

## 📊 Success Criteria

✅ **All systems are working when:**

1. Browser notification permission is granted
2. FCM token is generated and saved to database
3. Test notification is received
4. Login notification appears automatically
5. Order notifications are sent for each status change
6. Promotional notifications are scheduled (check scheduler status)
7. Background notifications work (browser closed)
8. Foreground notifications work (browser open)
9. Admin can send broadcasts
10. No errors in server logs

---

## 🚀 Launch Commands

### Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

### Production
```bash
# Backend
cd backend
npm start

# Check logs
tail -f logs/app.log
```

---

## 📞 Need Help?

Refer to these documents:
1. **Setup Guide**: `FCM_PUSH_NOTIFICATIONS_GUIDE.md`
2. **API Docs**: `FCM_API_REFERENCE.md`
3. **Summary**: `FCM_IMPLEMENTATION_SUMMARY.md`

---

## ✨ You're Ready When...

- [x] All backend files are created
- [x] All frontend files are created
- [x] Service worker is in place
- [x] FCM service is implemented
- [x] Scheduler is implemented
- [x] Order notifications work
- [x] Account notifications work
- [x] Promotional notifications work
- [x] Engagement notifications work
- [x] Wishlist notifications work
- [x] API endpoints are functional
- [x] Documentation is complete

**Just add your VAPID key and you're good to go! 🎉**
