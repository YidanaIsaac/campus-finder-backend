const express = require('express');
const { protect } = require('../middleware/auth');
const { 
  sendMatchNotification, 
  sendItemClaimedNotification, 
  testEmailConnection,
  isValidEmail 
} = require('../utils/emailService');

const router = express.Router();

// Test email connection
router.get('/test-connection', protect, async (req, res) => {
  try {
    const result = await testEmailConnection();
    res.status(200).json({
      success: true,
      message: result ? 'Email service connected successfully' : 'Email service connection failed',
      connected: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing email connection',
      error: error.message
    });
  }
});

// Send test email (for development only)
router.post('/test-send', protect, async (req, res) => {
  try {
    const { type, email, itemName } = req.body;

    if (!email || !itemName) {
      return res.status(400).json({
        success: false,
        message: 'Email and itemName are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    let result;
    if (type === 'match') {
      result = await sendMatchNotification(email, itemName, 'Test User', 'test123');
    } else if (type === 'claimed') {
      result = await sendItemClaimedNotification(email, itemName, 'Test Claimer', 'test123');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid email type. Use "match" or "claimed"'
      });
    }

    res.status(200).json({
      success: result.success,
      message: result.success ? 'Test email sent successfully' : 'Failed to send test email',
      error: result.error || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending test email',
      error: error.message
    });
  }
});

module.exports = router;
