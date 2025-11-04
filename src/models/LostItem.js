const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
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
  dateLost: {
    type: Date,
    required: [true, 'Please provide date lost'],
    index: true
  },
  color: String,
  brand: String,
  images: [String],
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active',
    index: true
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

lostItemSchema.index({ itemName: 'text', description: 'text' });
lostItemSchema.index({ userId: 1, status: 1 });
lostItemSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('LostItem', lostItemSchema);
