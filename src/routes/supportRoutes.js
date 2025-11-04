const express = require('express');
const { protect } = require('../middleware/auth');
const SupportMessage = require('../models/SupportMessage');

const router = express.Router();

// POST - Send support message
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Create support message
    const supportMessage = await SupportMessage.create({
      name,
      email,
      subject,
      message,
      status: 'pending',
      userId: req.user ? req.user.id : null // Optional: if user is logged in
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully',
      data: supportMessage
    });
  } catch (error) {
    console.error('Error sending support message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send message', 
      error: error.message 
    });
  }
});

// GET - Get all FAQs
router.get('/faqs', async (req, res) => {
  try {
    const faqs = [
      {
        id: 1,
        question: 'How do I report a lost item?',
        answer: 'Click the red "Report Lost Item" button on the home page, fill in the details about your lost item including description, location, and date. You can also upload photos to help identify your item.',
        category: 'reporting'
      },
      {
        id: 2,
        question: 'How do I report a found item?',
        answer: 'Click the green "Report Found Item" button on the home page, provide details about the item you found, and submit the form. The owner will be notified if there is a match.',
        category: 'reporting'
      },
      {
        id: 3,
        question: 'How long are items kept in the system?',
        answer: 'Items remain active in the system for 90 days. After that period, they are archived but still searchable in case someone is looking for an older item.',
        category: 'general'
      },
      {
        id: 4,
        question: 'Can I contact the person who found my item?',
        answer: 'Yes! Click on the item details page and use the contact options available (message, call, or email) to reach out to the person who reported finding the item.',
        category: 'contact'
      },
      {
        id: 5,
        question: 'Is my personal information safe?',
        answer: 'Yes, we take your privacy seriously. Your contact information is only shared when you report an item or choose to contact someone about their report.',
        category: 'privacy'
      }
    ];

    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch FAQs', 
      error: error.message 
    });
  }
});

// POST - Report a bug
router.post('/bug-report', protect, async (req, res) => {
  try {
    const { title, description, steps, severity } = req.body;

    const bugReport = await SupportMessage.create({
      name: req.user.name,
      email: req.user.email,
      subject: `Bug Report: ${title}`,
      message: `Title: ${title}\n\nDescription: ${description}\n\nSteps to reproduce: ${steps}\n\nSeverity: ${severity}`,
      userId: req.user.id,
      type: 'bug',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Bug report submitted successfully',
      data: bugReport
    });
  } catch (error) {
    console.error('Error submitting bug report:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit bug report', 
      error: error.message 
    });
  }
});

module.exports = router;