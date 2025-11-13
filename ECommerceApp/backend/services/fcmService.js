const admin = require('firebase-admin');

class FCMService {
  async sendNotification(token, title, message, data = {}) {
    try {
      if (!token) {
        throw new Error('FCM token is required');
      }

      if (!title || !message) {
        throw new Error('Title and message are required');
      }

      if (admin.apps.length === 0) {
        throw new Error('Firebase Admin SDK is not initialized');
      }

      const payload = {
        notification: {
          title,
          body: message
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        },
        token
      };

      const response = await admin.messaging().send(payload);
      
      return {
        success: true,
        messageId: response
      };
    } catch (error) {
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        throw new Error('Invalid or expired FCM token');
      }
      throw error;
    }
  }

  async sendMulticastNotification(tokens, title, message, data = {}) {
    try {
      if (!tokens || tokens.length === 0) {
        throw new Error('At least one FCM token is required');
      }

      if (!title || !message) {
        throw new Error('Title and message are required');
      }

      if (admin.apps.length === 0) {
        throw new Error('Firebase Admin SDK is not initialized');
      }

      const payload = {
        notification: {
          title,
          body: message
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        },
        tokens: Array.isArray(tokens) ? tokens : [tokens]
      };

      const response = await admin.messaging().sendMulticast(payload);
      
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
      };
    } catch (error) {
      throw error;
    }
  }

  async sendToUser(userId, title, message, data = {}) {
    try {
      const User = require('../models/User');
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.fcmToken) {
        throw new Error('User has no FCM token registered');
      }

      return await this.sendNotification(user.fcmToken, title, message, {
        ...data,
        userId: userId.toString()
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FCMService();
