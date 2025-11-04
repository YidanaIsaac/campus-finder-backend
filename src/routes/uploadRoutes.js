const express = require('express');
const { uploadProfileImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/profile-image', protect, uploadProfileImage);

module.exports = router;
