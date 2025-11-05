const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getOrCreateChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/chatController');

// All routes require authentication
router.use(protect);

// Get or create a chat
router.post('/create', getOrCreateChat);

// Get all chats for current user
router.get('/', getUserChats);

// Get messages for a specific chat
router.get('/:chatId/messages', getChatMessages);

// Send a message
router.post('/message', sendMessage);

// Mark messages as read
router.patch('/:chatId/read', markAsRead);

// Delete a message
router.delete('/message/:messageId', deleteMessage);

module.exports = router;
