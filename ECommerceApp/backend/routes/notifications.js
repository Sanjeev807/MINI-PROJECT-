const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  sendToUser,
  sendToAll,
  deleteNotification
} = require('../controllers/notificationController');
const fcmService = require('../services/fcmService');
const { protect, admin } = require('../middleware/auth');
const logger = require('../utils/logger');

// User routes
router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

// Admin routes - for sending push notifications
router.post('/send', protect, admin, sendToUser);
router.post('/broadcast', protect, admin, sendToAll);

// FCM Test Routes
router.post('/test', protect, async (req, res) => {
  try {
    const { type = 'account', action = 'login' } = req.body;
    let result;

    switch (type) {
      case 'account':
        result = await fcmService.sendAccountNotification(req.user.id, req.user.name, action);
        break;
      case 'order':
        result = await fcmService.sendOrderNotification(req.user.id, req.user.name, action, 'TEST123');
        break;
      case 'promotional':
        result = await fcmService.sendPromotionalNotification(req.user.id, req.user.name, action, {
          discount: '50%',
          category: 'electronics',
          link: '/offers'
        });
        break;
      case 'wishlist':
        result = await fcmService.sendWishlistNotification(req.user.id, req.user.name, action, 'Test Product', 'PROD123');
        break;
      case 'engagement':
        result = await fcmService.sendEngagementNotification(req.user.id, req.user.name, action);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid notification type' });
    }

    res.json({
      success: result.success,
      message: 'Test notification sent',
      result
    });

  } catch (error) {
    logger.error('Error sending test notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send test notification',
      error: error.message 
    });
  }
});

router.post('/test-all', protect, async (req, res) => {
  try {
    const results = [];

    // Account notifications
    results.push({
      type: 'account-login',
      result: await fcmService.sendAccountNotification(req.user.id, req.user.name, 'login')
    });

    // Order notifications  
    results.push({
      type: 'order-placed',
      result: await fcmService.sendOrderNotification(req.user.id, req.user.name, 'placed', 'TEST001')
    });

    // Promotional notifications
    results.push({
      type: 'promotional-flash-sale', 
      result: await fcmService.sendPromotionalNotification(req.user.id, req.user.name, 'flash_sale', {
        discount: '70%',
        category: 'electronics'
      })
    });

    // Wishlist notifications
    results.push({
      type: 'wishlist-back-in-stock',
      result: await fcmService.sendWishlistNotification(req.user.id, req.user.name, 'back_in_stock', 'iPhone 15', 'IPHONE15')
    });

    // Engagement notifications
    results.push({
      type: 'engagement-welcome-back',
      result: await fcmService.sendEngagementNotification(req.user.id, req.user.name, 'welcome_back')
    });

    const successful = results.filter(r => r.result.success).length;
    const failed = results.length - successful;

    res.json({
      success: true,
      message: `All test notifications sent: ${successful} successful, ${failed} failed`,
      results
    });

  } catch (error) {
    logger.error('Error sending all test notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send test notifications',
      error: error.message 
    });
  }
});

module.exports = router;
