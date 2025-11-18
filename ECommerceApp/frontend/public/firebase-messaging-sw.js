// Firebase Service Worker for handling background push notifications
// This file must be in the public folder and accessible at the root URL

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
const firebaseConfig = {
  apiKey: "AIzaSyB5RY4sAvzez8XevNlhUcNiCLUcrZKxI-k",
  authDomain: "e-shopeasy.firebaseapp.com",
  projectId: "e-shopeasy",
  storageBucket: "e-shopeasy.firebasestorage.app",
  messagingSenderId: "605116703017",
  appId: "1:605116703017:web:1deeb57e99a67522309738",
  measurementId: "G-JT88GF3SF1"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Use EXACT title and body from backend FCM payload
  const notificationTitle = payload.notification?.title || 'E-Shop Notification';
  const notificationBody = payload.notification?.body || '';
  
  console.log('[SW] Showing notification:', notificationTitle, '-', notificationBody);
  
  const notificationOptions = {
    body: notificationBody,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: payload.data?.type || 'ecommerce-notification',
    data: payload.data || {},
    requireInteraction: false,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'open',
        title: '👀 View',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: '✖️ Close'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);
  
  event.notification.close();
  
  let urlToOpen = '/';
  
  // Determine URL based on action and data
  if (event.action === 'view_order' && event.notification.data?.orderId) {
    urlToOpen = `/orders/${event.notification.data.orderId}`;
  } else if (event.action === 'shop_now') {
    urlToOpen = '/products';
  } else if (event.notification.data?.link) {
    urlToOpen = event.notification.data.link;
  } else if (event.action !== 'close') {
    // Default action when clicking notification body
    const notificationType = event.notification.data?.type;
    
    switch(notificationType) {
      case 'order':
        urlToOpen = event.notification.data?.orderId 
          ? `/orders/${event.notification.data.orderId}` 
          : '/orders';
        break;
      case 'promotional':
      case 'engagement':
        urlToOpen = '/products';
        break;
      case 'wishlist':
        urlToOpen = '/wishlist';
        break;
      case 'account':
        urlToOpen = '/profile';
        break;
      default:
        urlToOpen = '/';
    }
  }
  
  // Open the URL
  if (event.action !== 'close') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if there's already a window open
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Handle push events
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push received:', event);
  
  if (event.data) {
    const data = event.data.json();
    console.log('Push data:', data);
  }
});

console.log('[firebase-messaging-sw.js] Service Worker loaded successfully');
