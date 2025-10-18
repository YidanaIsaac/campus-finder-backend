const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
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
  dateFound: {
    type: Date,
    required: [true, 'Please provide date found']
  },
  color: String,
  brand: String,
  images: [String],
  status: {
    type: String,
    enum: ['available', 'claimed'],
    default: 'available'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
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

module.exports = mongoose.model('FoundItem', foundItemSchema);
