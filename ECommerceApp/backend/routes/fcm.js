const express = require('express');
const router = express.Router();
const fcmService = require('../services/fcmService');
const { protect } = require('../middleware/auth');

router.post('/send-notification', protect, async (req, res) => {
  try {
    const { title, message, token, data } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'FCM token is required'
      });
    }

    const result = await fcmService.sendNotification(token, title, message, data || {});

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send notification'
    });
  }
});

router.post('/send-multicast', protect, async (req, res) => {
  try {
    const { title, message, tokens, data } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tokens array is required'
      });
    }

    const result = await fcmService.sendMulticastNotification(tokens, title, message, data || {});

    res.status(200).json({
      success: true,
      message: 'Multicast notification sent successfully',
      successCount: result.successCount,
      failureCount: result.failureCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send multicast notification'
    });
  }
});

module.exports = router;
