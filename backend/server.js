require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const initializeFirebase = require('./config/firebaseAdmin');

const app = express();

// Connect to PostgreSQL and sync models
(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true }); // This will update table schemas based on model changes
    console.log('✅ Database tables synchronized successfully');
  } catch (error) {
    console.error('❌ Error syncing database tables:', error);
    process.exit(1);
  }
})();

// Initialize Firebase Admin SDK for Push Notifications
initializeFirebase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/notifications', require('./routes/notifications'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API with Push Notifications is running!',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      notifications: '/api/notifications'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Push Notifications enabled via Firebase Cloud Messaging`);
});
