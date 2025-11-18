const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { sendNotificationToUser } = require('../services/notificationService');
const fcmService = require('../services/fcmService');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, fcmToken } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      fcmToken
    });

    if (user) {
      logger.info(`New user registered: ${user.email}`);
      
      // Send FCM push notification for registration
      if (user.fcmToken) {
        try {
          await fcmService.sendAccountNotification(user.id, user.name, 'register');
          // Send a welcome promotional notification after 30 seconds
          setTimeout(async () => {
            try {
              await fcmService.sendPromotionalNotification(user.id, user.name, 'discount_offer', {
                discount: '20%',
                category: 'all products',
                link: '/offers'
              });
            } catch (delayedError) {
              logger.error('Delayed promotional notification failed:', delayedError);
            }
          }, 30000);
        } catch (fcmError) {
          logger.error('FCM notification failed:', fcmError);
        }
      }
      
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user.id)
      });
    } else {
      logger.warn(`Failed to create user: ${email}`);
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    logger.error('Error in user registration:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, fcmToken } = req.body;

    // Check for user email
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      // Update FCM token if provided
      if (fcmToken) {
        user.fcmToken = fcmToken;
        await user.save();
      }

      // Send login notification
      await sendNotificationToUser(
        user.id,
        '🔐 Login Successful',
        `Welcome back, ${user.name}! You have successfully logged in.`,
        { type: 'login' },
        'login_alert'
      );

      // Send FCM push notification for login
      if (user.fcmToken) {
        try {
          await fcmService.sendAccountNotification(user.id, user.name, 'login');
          // Also send welcome back engagement notification
          await fcmService.sendEngagementNotification(user.id, user.name, 'welcome_back');
        } catch (fcmError) {
          logger.error('FCM notification failed:', fcmError);
        }
      }

      logger.info(`User logged in: ${user.email}`);

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      // Send profile update notification
      await sendNotificationToUser(
        updatedUser.id,
        '🧾 Profile Updated Successfully',
        'Your profile information has been updated.',
        { type: 'account' },
        'profile_update'
      );

      // Send FCM push notification
      if (updatedUser.fcmToken) {
        try {
          await fcmService.sendAccountNotification(updatedUser.id, updatedUser.name, 'profile_update');
        } catch (fcmError) {
          logger.error('FCM notification failed:', fcmError);
        }
      }

      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        token: generateToken(updatedUser.id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update FCM Token
// @route   PUT /api/auth/fcm-token
// @access  Private
exports.updateFCMToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    if (user) {
      user.fcmToken = fcmToken;
      await user.save();
      
      res.json({ message: 'FCM token updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user (clear FCM token)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (user) {
      // Clear FCM token on logout for security
      user.fcmToken = null;
      await user.save();
      
      logger.info(`User logged out: ${user.email}`);
      res.json({ message: 'Logged out successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    logger.error('Error during logout:', error);
    res.status(500).json({ message: error.message });
  }
};
