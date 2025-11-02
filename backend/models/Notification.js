const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title']
  },
  body: {
    type: String,
    required: [true, 'Please provide a message body']
  },
  type: {
    type: String,
    enum: ['order', 'promotion', 'general', 'delivery'],
    default: 'general'
  },
  data: {
    type: Map,
    of: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
