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
    return false;
  }
};

module.exports = initializeFirebase;
