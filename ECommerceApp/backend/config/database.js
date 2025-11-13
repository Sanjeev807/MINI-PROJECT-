const { Sequelize } = require('sequelize');
require('dotenv').config();

// Ensure password is always a string
const dbPassword = process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : '';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: dbPassword,
  database: process.env.DB_NAME || 'ecommerce',
  logging: false, // Disable logging SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Database connected successfully');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };