# 🔥 Firebase Push Notifications Setup Guide

## ✅ What's Already Done

1. **Backend notification system** - ✅ Complete
2. **Frontend Firebase integration** - ✅ Complete  
3. **Service worker for background notifications** - ✅ Complete
4. **Cart notifications** - ✅ Enabled

## 🔧 What You Need to Do

### Step 1: Firebase Console Setup

1. **Go to [Firebase Console](https://console.firebase.google.com)**
2. **Click "Create a project"** 
3. **Enter project name**: `ECommerce-Notifications`
4. **Continue through setup** (enable Google Analytics if desired)

### Step 2: Enable Cloud Messaging

1. **In Firebase Console, go to "Cloud Messaging"** (left sidebar)
2. **Enable the Cloud Messaging API**

### Step 3: Get Web App Config

1. **Go to Project Settings** (gear icon)
2. **Scroll down to "Your apps"**
3. **Click "Add app" → Web app icon**
4. **Enter app name**: `ECommerce-Web`
5. **Copy the config object** that looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "ecommerce-notifications-xxxxx.firebaseapp.com", 
  projectId: "ecommerce-notifications-xxxxx",
  storageBucket: "ecommerce-notifications-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

### Step 4: Get VAPID Key

1. **Still in Project Settings**
2. **Go to "Cloud Messaging" tab**
3. **Scroll to "Web configuration"**
4. **Generate key pair** (if not already done)
5. **Copy the VAPID key**

### Step 5: Get Service Account Key

1. **Go to "Service accounts" tab**
2. **Click "Generate new private key"**
3. **Download the JSON file**

### Step 6: Update Your Files

#### A. Replace Firebase Config in frontend/index.html

Find this section around line 1495:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com", 
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

Replace with your actual config.

#### B. Add VAPID Key in frontend/index.html

Find this line around line 1525:
```javascript
vapidKey: 'YOUR_VAPID_KEY'
```

Replace with your actual VAPID key.

#### C. Replace Service Account Key

Replace the entire content of `backend/config/serviceAccountKey.json` with the downloaded JSON file.

#### D. Update Firebase Config in Service Worker

Update `frontend/firebase-messaging-sw.js` with the same config as step A.

### Step 7: Test the Setup

1. **Restart your backend server**
2. **Open frontend at localhost:3000**
3. **Login to your account**
4. **Allow notification permissions when prompted**
5. **Add an item to cart**
6. **You should see:**
   - Toast notification in the app
   - Browser push notification
   - Console logs showing FCM token

## 🎯 Testing Commands

After setup, test with:

```bash
# Test cart API (should trigger notification)
curl -X POST "http://localhost:5000/api/cart" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"productId":160,"quantity":1}'

# Test direct notification
curl -X POST "http://localhost:5000/api/notifications/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId":3,"title":"Test Notification","body":"This is a test","type":"general"}'
```

## 🚨 Troubleshooting

**If notifications don't work:**

1. **Check browser console** for errors
2. **Verify notification permissions** are granted
3. **Check Firebase config** values are correct
4. **Ensure service worker** is registered
5. **Check backend logs** for FCM token updates

## 📱 Expected Behavior

Once setup is complete:

✅ User logs in → FCM token is sent to backend
✅ User adds item to cart → Push notification sent
✅ Notification appears as toast + browser notification
✅ Background notifications work when app is closed
✅ Notification polling every 30 seconds for real-time updates

Your push notification system will be fully functional! 🎉