const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a title' }
    }
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a message body' }
    }
  },
  type: {
    type: DataTypes.ENUM('order', 'promotion', 'general', 'delivery'),
    defaultValue: 'general'
  },
  data: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'notifications'
});

module.exports = Notification;
