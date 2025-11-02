const admin = require('firebase-admin');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * Send push notification to a specific user
 * @param {String} userId - User ID
 * @param {String} title - Notification title
 * @param {String} body - Notification body
 * @param {Object} data - Additional data
 * @param {String} type - Notification type
 */
exports.sendNotificationToUser = async (userId, title, body, data = {}, type = 'general') => {
  try {
    // Get user's FCM token
    const user = await User.findById(userId);
    
    if (!user || !user.fcmToken) {
      console.log(`No FCM token found for user ${userId}`);
      return { success: false, error: 'No FCM token' };
    }

    // Save notification to database
    await Notification.create({
      user: userId,
      title,
      body,
      type,
      data
    });

    // Send push notification via Firebase
    const message = {
      token: user.fcmToken,
      notification: {
        title,
        body
      },
      data: {
        ...data,
        type,
        timestamp: new Date().toISOString()
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'ecommerce_notifications'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await admin.messaging().send(message);
    console.log(`✅ Notification sent to user ${userId}:`, response);
    
    return { success: true, messageId: response };
  } catch (error) {
    console.error(`❌ Error sending notification to user ${userId}:`, error.message);
    
    // If token is invalid, remove it from user
    if (error.code === 'messaging/invalid-registration-token' || 
        error.code === 'messaging/registration-token-not-registered') {
      await User.findByIdAndUpdate(userId, { fcmToken: null });
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Send push notification to all users
 * @param {String} title - Notification title
 * @param {String} body - Notification body
 * @param {Object} data - Additional data
 * @param {String} type - Notification type
 */
exports.sendNotificationToAll = async (title, body, data = {}, type = 'general') => {
  try {
    // Get all users with FCM tokens
    const users = await User.find({ fcmToken: { $ne: null } });
    
    if (users.length === 0) {
      console.log('No users with FCM tokens found');
      return { successCount: 0, failureCount: 0 };
    }

    const tokens = users.map(user => user.fcmToken);
    
    // Save notifications to database for all users
    const notifications = users.map(user => ({
      user: user._id,
      title,
      body,
      type,
      data
    }));
    
    await Notification.insertMany(notifications);

    // Send multicast message
    const message = {
      tokens,
      notification: {
        title,
        body
      },
      data: {
        ...data,
        type,
        timestamp: new Date().toISOString()
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'ecommerce_notifications'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    
    console.log(`✅ Broadcast sent: ${response.successCount} successful, ${response.failureCount} failed`);
    
    // Remove invalid tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      
      await User.updateMany(
        { fcmToken: { $in: failedTokens } },
        { fcmToken: null }
      );
    }
    
    return {
      successCount: response.successCount,
      failureCount: response.failureCount
    };
  } catch (error) {
    console.error('❌ Error sending broadcast notification:', error.message);
    throw error;
  }
};

/**
 * Send promotional notification to all users
 * @param {String} title - Promotion title
 * @param {String} body - Promotion details
 * @param {Object} data - Additional data (e.g., productId, discount)
 */
exports.sendPromotionalNotification = async (title, body, data = {}) => {
  return await exports.sendNotificationToAll(title, body, data, 'promotion');
};

/**
 * Send order update notification
 * @param {String} userId - User ID
 * @param {String} orderId - Order ID
 * @param {String} status - Order status
 */
exports.sendOrderNotification = async (userId, orderId, status) => {
  const statusMessages = {
    confirmed: { title: 'Order Confirmed! 📦', body: 'Your order has been confirmed and will be processed soon.' },
    processing: { title: 'Order Processing 🔄', body: 'Your order is being prepared for shipment.' },
    shipped: { title: 'Order Shipped! 🚚', body: 'Your order is on the way!' },
    delivered: { title: 'Order Delivered! ✅', body: 'Your order has been delivered successfully.' },
    cancelled: { title: 'Order Cancelled ❌', body: 'Your order has been cancelled.' }
  };

  const message = statusMessages[status] || { title: 'Order Update', body: `Order status: ${status}` };
  
  return await exports.sendNotificationToUser(
    userId,
    message.title,
    message.body,
    { orderId, status },
    'order'
  );
};
