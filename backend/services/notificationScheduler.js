const cron = require('node-cron');
const { Op } = require('sequelize');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const notificationService = require('./notificationService');

/**
 * Notification Scheduler Service
 * Handles automated notifications based on user behavior and system events
 */

class NotificationScheduler {
  
  /**
   * Initialize all scheduled notification jobs
   */
  static init() {
    console.log('📅 Initializing notification scheduler...');
    
    // Run cart reminder check every hour
    cron.schedule('0 * * * *', () => {
      this.checkAbandonedCarts();
    });
    
    // Run daily deals notification at 9 AM every day
    cron.schedule('0 9 * * *', () => {
      this.sendDailyDeals();
    });
    
    // Run feedback requests 3 days after delivery
    cron.schedule('0 10 * * *', () => {
      this.sendFeedbackRequests();
    });
    
    // Run loyalty points summary weekly (Sundays at 6 PM)
    cron.schedule('0 18 * * 0', () => {
      this.sendWeeklyLoyaltyUpdate();
    });
    
    console.log('✅ Notification scheduler initialized');
  }
  
  /**
   * Check for abandoned carts (24+ hours old) and send reminders
   */
  static async checkAbandonedCarts() {
    try {
      console.log('🛒 Checking for abandoned carts...');
      
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      
      // Find carts updated 24 hours ago (for reminders)
      const abandonedCarts = await Cart.findAll({
        where: {
          updatedAt: {
            [Op.between]: [threeDaysAgo, oneDayAgo]
          },
          items: {
            [Op.ne]: []
          }
        },
        include: [{
          model: User,
          where: { fcmToken: { [Op.ne]: null } }
        }]
      });
      
      for (const cart of abandonedCarts) {
        // Send cart reminder
        await notificationService.sendCartReminderNotification(
          cart.userId,
          cart.items
        );
        
        // After 3 days, send discount offer
        const cartAge = Date.now() - new Date(cart.updatedAt).getTime();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        
        if (cartAge > threeDaysMs) {
          await notificationService.sendAbandonedCartOfferNotification(
            cart.userId,
            cart.items,
            15 // 15% discount
          );
        }
      }
      
      console.log(`🛒 Processed ${abandonedCarts.length} abandoned carts`);
    } catch (error) {
      console.error('❌ Error checking abandoned carts:', error);
    }
  }
  
  /**
   * Send daily deals to all users
   */
  static async sendDailyDeals() {
    try {
      console.log('🔥 Sending daily deals...');
      
      // Get featured products or products with high discounts
      const dealProducts = await Product.findAll({
        where: {
          [Op.or]: [
            { isFeatured: true },
            { discount: { [Op.gte]: 20 } }
          ]
        },
        limit: 5,
        order: [['discount', 'DESC']]
      });
      
      if (dealProducts.length > 0) {
        const topDeal = dealProducts[0];
        await notificationService.sendDailyDealNotification(
          topDeal.name,
          `Limited time offer on ${topDeal.category} items`,
          topDeal.discount,
          dealProducts.map(p => p.id)
        );
      }
      
      console.log('🔥 Daily deals sent successfully');
    } catch (error) {
      console.error('❌ Error sending daily deals:', error);
    }
  }
  
  /**
   * Send feedback requests for delivered orders (3 days after delivery)
   */
  static async sendFeedbackRequests() {
    try {
      console.log('📝 Sending feedback requests...');
      
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
      
      // This would work if you have an Order model
      // For now, we'll simulate with a simple notification
      const users = await User.findAll({
        where: { fcmToken: { [Op.ne]: null } },
        limit: 10 // Limit to prevent spam
      });
      
      for (const user of users) {
        // Send general feedback request
        await notificationService.sendFeedbackRequestNotification(
          user.id,
          'general'
        );
      }
      
      console.log('📝 Feedback requests sent successfully');
    } catch (error) {
      console.error('❌ Error sending feedback requests:', error);
    }
  }
  
  /**
   * Send weekly loyalty points summary
   */
  static async sendWeeklyLoyaltyUpdate() {
    try {
      console.log('🎁 Sending weekly loyalty updates...');
      
      const users = await User.findAll({
        where: { 
          fcmToken: { [Op.ne]: null },
          loyaltyPoints: { [Op.gt]: 0 }
        }
      });
      
      for (const user of users) {
        await notificationService.sendLoyaltyPointsNotification(
          user.id,
          0, // No points earned this time
          user.loyaltyPoints || 0,
          'summary'
        );
      }
      
      console.log('🎁 Weekly loyalty updates sent successfully');
    } catch (error) {
      console.error('❌ Error sending weekly loyalty updates:', error);
    }
  }
  
  /**
   * Send new arrival notifications when products are added
   */
  static async sendNewArrivalNotifications(product) {
    try {
      console.log(`📦 Sending new arrival notifications for ${product.name}...`);
      
      await notificationService.sendNewArrivalNotification(product);
      
      console.log('📦 New arrival notifications sent successfully');
    } catch (error) {
      console.error('❌ Error sending new arrival notifications:', error);
    }
  }
  
  /**
   * Send price drop notifications for users watching products
   */
  static async sendPriceDropNotifications(productId, oldPrice, newPrice) {
    try {
      console.log(`💰 Sending price drop notifications for product ${productId}...`);
      
      // Get users who have this product in wishlist or cart
      const interestedUsers = await User.findAll({
        where: { fcmToken: { [Op.ne]: null } },
        limit: 50 // Limit to prevent spam
      });
      
      const userIds = interestedUsers.map(user => user.id);
      
      await notificationService.sendPriceDropNotification(
        productId,
        oldPrice,
        newPrice,
        userIds
      );
      
      console.log('💰 Price drop notifications sent successfully');
    } catch (error) {
      console.error('❌ Error sending price drop notifications:', error);
    }
  }
  
  /**
   * Send back in stock notifications
   */
  static async sendBackInStockNotifications(productId) {
    try {
      console.log(`📦 Sending back in stock notifications for product ${productId}...`);
      
      // Get users who might be interested (simplified - in real app you'd track wishlist)
      const interestedUsers = await User.findAll({
        where: { fcmToken: { [Op.ne]: null } },
        limit: 20
      });
      
      const userIds = interestedUsers.map(user => user.id);
      
      await notificationService.sendBackInStockNotification(productId, userIds);
      
      console.log('📦 Back in stock notifications sent successfully');
    } catch (error) {
      console.error('❌ Error sending back in stock notifications:', error);
    }
  }
}

module.exports = NotificationScheduler;