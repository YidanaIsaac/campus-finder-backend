const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  itemName: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    enum: ['Electronics', 'Clothing', 'Books', 'Accessories', 'Documents', 'Other'],
    required: [true, 'Please select a category'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    index: true
  },
  dateFound: {
    type: Date,
    required: [true, 'Please provide date found'],
    index: true
  },
  color: String,
  brand: String,
  images: [String],
  status: {
    type: String,
    enum: ['available', 'claimed'],
    default: 'available',
    index: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

foundItemSchema.index({ itemName: 'text', description: 'text' });
foundItemSchema.index({ userId: 1, status: 1 });
foundItemSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('FoundItem', foundItemSchema);
