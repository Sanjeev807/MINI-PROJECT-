const admin = require('firebase-admin');
const logger = require('../utils/logger');

class FCMService {
  constructor() {
    this.isInitialized = admin.apps.length > 0;
  }

  async sendNotification(token, title, message, data = {}) {
    try {
      if (!token) {
        throw new Error('FCM token is required');
      }

      if (!title || !message) {
        throw new Error('Title and message are required');
      }

      if (admin.apps.length === 0) {
        logger.warn('Firebase Admin SDK is not initialized - skipping FCM notification');
        return { success: false, error: 'Firebase not initialized' };
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
        token,
        webpush: {
          notification: {
            title,
            body: message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'ecommerce-notification',
            requireInteraction: true
          },
          fcmOptions: {
            link: data.link || '/'
          }
        }
      };

      const response = await admin.messaging().send(payload);
      logger.info(`✅ FCM notification sent successfully: ${response}`);
      
      return {
        success: true,
        messageId: response
      };
    } catch (error) {
      logger.error('❌ Error sending FCM notification:', error.message);
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
        logger.warn('Firebase Admin SDK is not initialized - skipping FCM notifications');
        return { success: false, error: 'Firebase not initialized' };
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
        tokens: Array.isArray(tokens) ? tokens : [tokens],
        webpush: {
          notification: {
            title,
            body: message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            requireInteraction: true
          }
        }
      };

      const response = await admin.messaging().sendEachForMulticast(payload);
      logger.info(`✅ Sent ${response.successCount} notifications, ${response.failureCount} failed`);
      
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
      };
    } catch (error) {
      logger.error('Error sending multicast notification:', error.message);
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
        logger.warn(`User ${userId} has no FCM token registered`);
        return { success: false, error: 'No FCM token' };
      }

      return await this.sendNotification(user.fcmToken, title, message, {
        ...data,
        userId: userId.toString()
      });
    } catch (error) {
      throw error;
    }
  }

  async sendToAllUsers(title, message, data = {}) {
    try {
      const User = require('../models/User');
      const { Op } = require('sequelize');
      
      const users = await User.findAll({
        where: {
          fcmToken: { [Op.ne]: null }
        }
      });

      if (users.length === 0) {
        logger.warn('No users with FCM tokens found');
        return { success: false, error: 'No users with tokens' };
      }

      const tokens = users.map(user => user.fcmToken);
      return await this.sendMulticastNotification(tokens, title, message, data);
    } catch (error) {
      logger.error('Error sending notification to all users:', error.message);
      throw error;
    }
  }

  // ========== ORDER NOTIFICATIONS ==========
  async sendOrderNotification(userId, status, orderId) {
    const notifications = {
      placed: {
        title: '🎉 Order Placed Successfully!',
        body: 'Your order has been placed successfully!'
      },
      confirmed: {
        title: '✅ Order Confirmed',
        body: 'Great news! Your order has been confirmed and is being prepared.'
      },
      processing: {
        title: '🔄 Order Processing',
        body: 'Your order is being processed. We\'ll update you soon!'
      },
      shipped: {
        title: '🚚 Your item is shipped. Track now!',
        body: 'Exciting! Your order is on the way. Track your delivery now!'
      },
      out_for_delivery: {
        title: '🏃 Your order is out for delivery.',
        body: 'Almost there! Your order will arrive soon. Get ready to receive it!'
      },
      delivered: {
        title: '✅ Order delivered! We hope you enjoy it.',
        body: 'Your order has been delivered successfully. Thank you for shopping with us!'
      },
      cancelled: {
        title: '❌ Your order has been cancelled.',
        body: 'Your order has been cancelled as requested.'
      }
    };

    const notification = notifications[status] || {
      title: 'Order Update',
      body: `Your order status has been updated to: ${status}`
    };

    return await this.sendToUser(userId, notification.title, notification.body, {
      type: 'order',
      status: status,
      orderId: orderId.toString(),
      link: `/orders/${orderId}`
    });
  }

  // ========== PROMOTIONAL NOTIFICATIONS ==========
  async sendPromotionalNotification(title, body, promoType = 'general') {
    return await this.sendToAllUsers(title, body, {
      type: 'promotional',
      promoType: promoType,
      link: '/products'
    });
  }

  getRandomPromotionalMessage() {
    const promotions = [
      {
        title: '⚡ Flash Sale! 70% OFF on Electronics — Limited Time!',
        body: 'Hurry! Massive discounts on electronics. Shop now before it ends!'
      },
      {
        title: '👗 Fashion Loot Deal! Buy 1 Get 2 FREE!',
        body: 'Amazing fashion deals waiting for you. Don\'t miss this crazy offer!'
      },
      {
        title: '🍿 Hungry? Try our trending snacks under ₹99!',
        body: 'Delicious snacks at unbeatable prices. Order now and satisfy your cravings!'
      },
      {
        title: '🎯 Top Picks for You — Customized deals now live!',
        body: 'Handpicked deals based on your preferences. Check them out now!'
      },
      {
        title: '💰 Only Today: Extra 20% OFF on your cart!',
        body: 'Special discount just for today. Add items to cart and save big!'
      },
      {
        title: '🔥 Super Saver Sale — Up to 80% OFF!',
        body: 'Biggest sale of the season. Everything must go!'
      },
      {
        title: '🎁 Mystery Box Deal — Surprise Gifts Inside!',
        body: 'Order now and get surprise gifts worth ₹500. Limited boxes available!'
      },
      {
        title: '⏰ Midnight Sale — Extra 30% OFF!',
        body: 'Can\'t sleep? Shop now and grab amazing midnight deals!'
      }
    ];

    return promotions[Math.floor(Math.random() * promotions.length)];
  }

  // ========== WISHLIST & STOCK NOTIFICATIONS ==========
  async sendWishlistNotification(userId, productName, notificationType = 'stock') {
    const notifications = {
      stock: {
        title: '🔔 Your wishlist item is now back in stock!',
        body: `Great news! ${productName} is back in stock. Grab it before it's gone!`
      },
      price_drop: {
        title: '💰 Price dropped for your saved product — Don\'t miss out!',
        body: `${productName} is now available at a lower price. Check it out!`
      }
    };

    const notification = notifications[notificationType] || notifications.stock;

    return await this.sendToUser(userId, notification.title, notification.body, {
      type: 'wishlist',
      notificationType: notificationType,
      productName: productName,
      link: '/wishlist'
    });
  }

  // ========== ENGAGEMENT NOTIFICATIONS ==========
  async sendEngagementNotification(userId, userName) {
    const engagementMessages = [
      {
        title: `👋 Welcome back${userName ? ', ' + userName : ''}! New deals are waiting for you.`,
        body: 'We\'ve got fresh deals just for you. Check them out now!'
      },
      {
        title: '🔥 Trending now: Bestsellers selling out fast!',
        body: 'Don\'t miss our top-selling products. Limited stock available!'
      },
      {
        title: '🎁 Exclusive offer unlocked for you — Tap to view!',
        body: `${userName || 'You'} have special offers waiting. Shop now!`
      },
      {
        title: '💝 Your favorites are on sale!',
        body: 'Products similar to your interests are now discounted. Explore now!'
      },
      {
        title: '🛍️ New Arrivals Just For You!',
        body: 'Check out the latest products matching your style. Browse now!'
      }
    ];

    const randomMessage = engagementMessages[Math.floor(Math.random() * engagementMessages.length)];

    return await this.sendToUser(userId, randomMessage.title, randomMessage.body, {
      type: 'engagement',
      link: '/products'
    });
  }

  // ========== ACCOUNT NOTIFICATIONS ==========
  async sendAccountNotification(userId, userName, action = 'login') {
    const notifications = {
      login: {
        title: '🔐 Login successful — Happy Shopping!',
        body: `Welcome back${userName ? ', ' + userName : ''}! Start shopping for amazing deals.`
      },
      profile_update: {
        title: '✅ Your profile was updated successfully.',
        body: `${userName || 'Your'} profile information has been updated.`
      },
      register: {
        title: '🎉 Welcome to E-Shop!',
        body: `Hi ${userName || 'there'}, thank you for joining us. Start shopping now!`
      }
    };

    const notification = notifications[action] || notifications.login;

    return await this.sendToUser(userId, notification.title, notification.body, {
      type: 'account',
      action: action,
      link: '/profile'
    });
  }
}

module.exports = new FCMService();
