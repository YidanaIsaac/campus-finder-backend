const mongoose = require('mongoose');

const notificationPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  pushEnabled: {
    type: Boolean,
    default: true
  },
  itemMatches: {
    type: Boolean,
    default: true
  },
  newMessages: {
    type: Boolean,
    default: true
  },
  itemClaimed: {
    type: Boolean,
    default: true
  },
  itemReturned: {
    type: Boolean,
    default: true
  },
  emailEnabled: {
    type: Boolean,
    default: true
  },
  emailMatches: {
    type: Boolean,
    default: true
  },
  emailMessages: {
    type: Boolean,
    default: false
  },
  emailWeeklySummary: {
    type: Boolean,
    default: true
  },
  soundEnabled: {
    type: Boolean,
    default: true
  },
  vibrationEnabled: {
    type: Boolean,
    default: true
  },
  quietHoursEnabled: {
    type: Boolean,
    default: false
  },
  quietStart: {
    type: String,
    default: '22:00'
  },
  quietEnd: {
    type: String,
    default: '08:00'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NotificationPreference', notificationPreferenceSchema);