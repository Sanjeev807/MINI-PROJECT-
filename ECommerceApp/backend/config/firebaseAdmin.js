const admin = require('firebase-admin');

const initializeFirebase = () => {
  try {
    // Check if Firebase Admin is already initialized
    if (admin.apps.length === 0) {
      
      // For development - create a mock service account or use environment variables
      let serviceAccount;
      
      try {
        // Try to load the service account key file
        serviceAccount = require('./serviceAccountKey.json');
        
        // Check if it has real values (not placeholder)
        if (serviceAccount.private_key === 'YOUR_PRIVATE_KEY' || 
            serviceAccount.project_id === 'YOUR_PROJECT_ID') {
          throw new Error('Service account key contains placeholder values');
        }
        
      } catch (error) {
        // If no valid service account, create a mock one for development
        console.log('🔧 Using development mode for Firebase (push notifications disabled)');
        console.log('📝 To enable push notifications:');
        console.log('   1. Go to Firebase Console: https://console.firebase.google.com');
        console.log('   2. Create a new project or select existing');
        console.log('   3. Go to Project Settings > Service Accounts');
        console.log('   4. Generate new private key and download the JSON');
        console.log('   5. Replace backend/config/serviceAccountKey.json with the downloaded file');
        
        // Return false to indicate Firebase is NOT initialized
        return false;
      }
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      // Return true to indicate Firebase IS initialized
      return true;
    }
    
    // Already initialized
    return true;
    
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization error:', error.message);
    console.log('⚠️  Push notifications will not work without proper Firebase configuration');
    console.log('📖 Please follow the setup guide in README.md to configure Firebase');
    return false;
  }
};

module.exports = initializeFirebase;
