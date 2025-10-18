const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Electronics', 'Clothing', 'Books', 'Accessories', 'Documents', 'Other'],
    required: [true, 'Please select a category']
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  location: {
    type: String,
    required: [true, 'Please provide location']
  },
  dateLost: {
    type: Date,
    required: [true, 'Please provide date lost']
  },
  color: String,
  brand: String,
  images: [String],
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LostItem', lostItemSchema);
