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
const { protect, admin } = require('../middleware/auth');

// User routes
router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

// Admin routes - for sending push notifications
router.post('/send', protect, admin, sendToUser);
router.post('/broadcast', protect, admin, sendToAll);

module.exports = router;
