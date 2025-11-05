const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService');

// Get or create a chat between two users
exports.getOrCreateChat = async (req, res) => {
  try {
    const { receiverId, itemId } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Generate chatId
    const chatId = Chat.generateChatId(senderId, receiverId);

    // Find or create chat
    let chat = await Chat.findOne({ chatId })
      .populate('participants', 'name email avatar userType')
      .populate('itemId', 'title category imageUrl');

    if (!chat) {
      chat = await Chat.create({
        chatId,
        participants: [senderId, receiverId],
        itemId: itemId || null,
        unreadCount: {
          [senderId.toString()]: 0,
          [receiverId.toString()]: 0
        }
      });
      
      await chat.populate('participants', 'name email avatar userType');
      if (itemId) {
        await chat.populate('itemId', 'title category imageUrl');
      }
    }

    res.json({ chat });
  } catch (error) {
    console.error('Get/Create chat error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all chats for current user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId
    })
      .populate('participants', 'name email avatar userType')
      .populate('itemId', 'title category imageUrl')
      .sort({ updatedAt: -1 });

    // Add other participant info
    const chatsWithDetails = chats.map(chat => {
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== userId.toString()
      );
      
      return {
        ...chat.toObject(),
        otherParticipant,
        unreadCount: chat.unreadCount?.get(userId.toString()) || 0
      };
    });

    res.json({ chats: chatsWithDetails });
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get messages for a specific chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of this chat
    const chat = await Chat.findOne({ 
      chatId,
      participants: userId 
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or access denied' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({ chatId })
      .populate('sender', 'name avatar userType')
      .populate('receiver', 'name avatar userType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ chatId });

    res.json({
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content, receiverId, itemId } = req.body;
    const senderId = req.user._id;

    if (!chatId || !content || !receiverId) {
      return res.status(400).json({ 
        message: 'Chat ID, content, and receiver ID are required' 
      });
    }

    // Get sender and receiver info
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Verify chat exists and user is participant
    let chat = await Chat.findOne({ 
      chatId,
      participants: senderId 
    }).populate('itemId', 'itemName');

    if (!chat) {
      // Create chat if it doesn't exist
      chat = await Chat.create({
        chatId,
        participants: [senderId, receiverId],
        itemId: itemId || null,
        unreadCount: {
          [senderId.toString()]: 0,
          [receiverId.toString()]: 0
        }
      });
      if (itemId) {
        await chat.populate('itemId', 'itemName');
      }
    }

    // Create message
    const message = await Message.create({
      chatId,
      sender: senderId,
      receiver: receiverId,
      content,
      itemId: itemId || null
    });

    await message.populate('sender', 'name avatar userType');
    await message.populate('receiver', 'name avatar userType');

    // Update chat's last message and unread count
    const currentUnreadCount = chat.unreadCount?.get(receiverId.toString()) || 0;
    chat.lastMessage = {
      content,
      sender: senderId,
      timestamp: new Date()
    };
    chat.unreadCount.set(receiverId.toString(), currentUnreadCount + 1);
    await chat.save();

    // Send email notification (don't block if it fails)
    try {
      const messagePreview = content.length > 100 ? content.substring(0, 100) + '...' : content;
      await emailService.sendNewMessageNotification(receiver, sender, chat.itemId, messagePreview);
    } catch (emailError) {
      console.error('Failed to send new message email:', emailError);
    }

    // Emit socket event (handled by Socket.IO in server.js)
    const io = req.app.get('io');
    if (io) {
      io.to(chatId).emit('new-message', message);
    }

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Verify user is part of chat
    const chat = await Chat.findOne({ 
      chatId,
      participants: userId 
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark all unread messages as read
    await Message.updateMany(
      { 
        chatId, 
        receiver: userId,
        read: false 
      },
      { 
        read: true,
        readAt: new Date()
      }
    );

    // Reset unread count
    chat.unreadCount.set(userId.toString(), 0);
    await chat.save();

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: userId
    });

    if (!message) {
      return res.status(404).json({ 
        message: 'Message not found or you are not authorized to delete it' 
      });
    }

    await message.deleteOne();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
