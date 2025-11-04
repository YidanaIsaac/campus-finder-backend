const express = require('express');
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const NotificationPreference = require('../models/NotificationPreference');

const router = express.Router();

// GET all notifications for current user
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH - Mark notification as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH - Mark all as read
router.patch('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE - Delete notification
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET notification preferences
router.get('/preferences', protect, async (req, res) => {
  try {
    let preferences = await NotificationPreference.findOne({ userId: req.user.id });

    if (!preferences) {
      // Return defaults
      return res.json({
        data: {
          pushEnabled: true,
          itemMatches: true,
          newMessages: true,
          itemClaimed: true,
          itemReturned: true,
          emailEnabled: true,
          emailMatches: true,
          emailMessages: false,
          emailWeeklySummary: true,
          soundEnabled: true,
          vibrationEnabled: true,
          quietHoursEnabled: false,
          quietStart: '22:00',
          quietEnd: '08:00'
        }
      });
    }

    res.json({ data: preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT notification preferences
router.put('/preferences', protect, async (req, res) => {
  try {
    const preferences = await NotificationPreference.findOneAndUpdate(
      { userId: req.user.id },
      { userId: req.user.id, ...req.body },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated',
      data: preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;