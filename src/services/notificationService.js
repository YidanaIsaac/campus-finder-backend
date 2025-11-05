const Notification = require('../models/Notification');

class NotificationService {
  // Create and emit notification
  async createNotification(userId, type, title, message, data = {}, io = null) {
    try {
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        data,
        isRead: false
      });

      // Emit to user via Socket.IO if available
      if (io) {
        io.to(`user_${userId}`).emit('new-notification', notification);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Notify about new match
  async notifyMatch(userId, itemName, matchId, matchType, io = null) {
    return await this.createNotification(
      userId,
      'match',
      'Potential Match Found! 🎯',
      `A potential match was found for your ${matchType} item: ${itemName}`,
      { matchId, itemName, matchType },
      io
    );
  }

  // Notify about new message
  async notifyMessage(userId, senderName, itemName, chatId, io = null) {
    return await this.createNotification(
      userId,
      'message',
      'New Message 💬',
      `${senderName} sent you a message${itemName ? ` about: ${itemName}` : ''}`,
      { chatId, senderName, itemName },
      io
    );
  }

  // Notify about item claimed
  async notifyItemClaimed(userId, itemName, claimerName, itemId, io = null) {
    return await this.createNotification(
      userId,
      'claim',
      'Item Claimed ✅',
      `${claimerName} has claimed your found item: ${itemName}`,
      { itemId, itemName, claimerName },
      io
    );
  }

  // Notify about item status change
  async notifyStatusChange(userId, itemName, newStatus, itemId, io = null) {
    return await this.createNotification(
      userId,
      'status_change',
      'Item Status Updated',
      `Your item "${itemName}" status has been changed to: ${newStatus}`,
      { itemId, itemName, newStatus },
      io
    );
  }

  // Get user notifications
  async getUserNotifications(userId, limit = 50) {
    try {
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);

      return notifications;
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return true;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return false;
    }
  }

  // Get unread count
  async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        userId,
        isRead: false
      });

      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Delete notification
  async deleteNotification(notificationId, userId) {
    try {
      await Notification.findOneAndDelete({
        _id: notificationId,
        userId
      });

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Delete all notifications
  async deleteAllNotifications(userId) {
    try {
      await Notification.deleteMany({ userId });
      return true;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      return false;
    }
  }
}

module.exports = new NotificationService();
