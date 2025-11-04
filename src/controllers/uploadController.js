const cloudinary = require('cloudinary').v2;
const User = require('../models/User');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: 'campus-finder/profiles',
      transformation: [
        { width: 500, height: 500, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    // Update user profile with image URL
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old image from Cloudinary if exists
    if (user.profileImage) {
      const publicId = user.profileImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`campus-finder/profiles/${publicId}`).catch(() => {});
    }

    user.profileImage = result.secure_url;
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl: result.secure_url,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        idNumber: user.idNumber,
        phone: user.phone,
        department: user.department,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading image'
    });
  }
};
