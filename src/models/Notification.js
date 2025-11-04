const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['match_found', 'item_returned', 'message', 'item_claimed', 'general'],
    default: 'general'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedItem: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemModel'
  },
  itemModel: {
    type: String,
    enum: ['LostItem', 'FoundItem']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);