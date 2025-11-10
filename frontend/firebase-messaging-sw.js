// Firebase Service Worker for handling background push notifications
// This file should be in the root of your web app (same level as index.html)

// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker - Updated with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyB5RY4sAvzez8XevNlhUcNiCLUcrZKxI-k",
  authDomain: "e-shopeasy.firebaseapp.com",
  projectId: "e-shopeasy",
  storageBucket: "e-shopeasy.firebasestorage.app",
  messagingSenderId: "605116703017",
  appId: "1:605116703017:web:e9dc9fc29ac5fb82309738",
  measurementId: "G-3BVZ8CK6HD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'E-Shop Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'ecommerce-notification',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close', 
        title: 'Close'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received:', event);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});