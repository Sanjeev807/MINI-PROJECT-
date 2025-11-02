const admin = require('firebase-admin');

const initializeFirebase = () => {
  try {
    // Check if Firebase Admin is already initialized
    if (admin.apps.length === 0) {
      // You need to download your Firebase Admin SDK service account key
      // from Firebase Console > Project Settings > Service Accounts
      // and place it in the config folder as 'serviceAccountKey.json'
      
      const serviceAccount = require('./serviceAccountKey.json');
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      console.log('✅ Firebase Admin SDK initialized for Push Notifications');
    }
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization error:', error.message);
    console.log('⚠️  Push notifications will not work without proper Firebase configuration');
    console.log('📖 Please follow the setup guide in README.md to configure Firebase');
  }
};

module.exports = initializeFirebase;
