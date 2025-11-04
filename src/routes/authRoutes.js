const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  validateRequest,
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema
} = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  register,
  login,
  getCurrentUser,
  logout,
  updateProfile,
  changePassword,
  uploadProfileImage,
  getStats
} = require('../controllers/authController');

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);
router.put('/profile', protect, validateRequest(updateProfileSchema), updateProfile);
router.put('/change-password', protect, validateRequest(changePasswordSchema), changePassword);
router.post('/profile-image', protect, upload.single('image'), uploadProfileImage);
router.get('/stats', protect, getStats);

module.exports = router;
