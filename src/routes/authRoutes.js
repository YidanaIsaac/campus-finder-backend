const express = require('express');
const { register, login, getCurrentUser, logout, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/update', protect, updateProfile);
router.get('/logout', logout);

module.exports = router;