require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const initializeFirebase = require('./config/firebaseAdmin');
const logger = require('./utils/logger');

const app = express();

// Trust proxy for accurate IP detection
app.set('trust proxy', true);

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Override res.end to log when response is finished
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    logger.request(req, res, duration);
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
});

// Connect to PostgreSQL and sync models
(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true }); // This will update table schemas based on model changes
    logger.info('Database tables synchronized successfully');
  } catch (error) {
    logger.error('Error syncing database tables:', error);
    process.exit(1);
  }
})();

// Initialize Firebase Admin SDK for Push Notifications
let firebaseEnabled = false;
try {
  firebaseEnabled = initializeFirebase();
  if (firebaseEnabled) {
    logger.info('✅ Firebase Admin SDK initialized successfully');
    logger.info('📱 Push notifications enabled via Firebase Cloud Messaging');
  }
} catch (error) {
  logger.error('Failed to initialize Firebase Admin SDK:', error);
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for admin panel
app.use(express.static('../frontend'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API with Push Notifications is running!',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      notifications: '/api/notifications',
      admin: '/api/admin'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, err);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 E-commerce server running on port ${PORT}`);
  logger.info(`🌐 API endpoints: http://localhost:${PORT}/api`);
  logger.info(`📊 Health check: http://localhost:${PORT}/`);
});
