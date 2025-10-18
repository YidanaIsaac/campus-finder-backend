const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

// ===== LOST ITEMS =====

// Create Lost Item
exports.createLostItem = async (req, res) => {
  try {
    const { itemName, category, description, location, dateLost, color, brand } = req.body;

    if (!itemName || !category || !description || !location || !dateLost) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const lostItem = await LostItem.create({
      userId: req.user.id,
      itemName,
      category,
      description,
      location,
      dateLost,
      color: color || '',
      brand: brand || ''
    });

    res.status(201).json({
      success: true,
      message: 'Lost item reported successfully',
      data: lostItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Lost Items
exports.getAllLostItems = async (req, res) => {
  try {
    const { category, location, search } = req.query;
    let query = { status: 'active' };

    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (search) {
      query.$or = [
        { itemName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const lostItems = await LostItem.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: lostItems.length,
      data: lostItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Lost Item
exports.getLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id)
      .populate('userId', 'name email phone department');

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lostItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Lost Item
exports.updateLostItem = async (req, res) => {
  try {
    let lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found'
      });
    }

    if (lostItem.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    lostItem = await LostItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Lost item updated successfully',
      data: lostItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Lost Item
exports.deleteLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: 'Lost item not found'
      });
    }

    if (lostItem.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await LostItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lost item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== FOUND ITEMS =====

// Create Found Item
exports.createFoundItem = async (req, res) => {
  try {
    const { itemName, category, description, location, dateFound, color, brand } = req.body;

    if (!itemName || !category || !description || !location || !dateFound) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const foundItem = await FoundItem.create({
      userId: req.user.id,
      itemName,
      category,
      description,
      location,
      dateFound,
      color: color || '',
      brand: brand || ''
    });

    res.status(201).json({
      success: true,
      message: 'Found item reported successfully',
      data: foundItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Found Items
exports.getAllFoundItems = async (req, res) => {
  try {
    const { category, location, search } = req.query;
    let query = { status: 'available' };

    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (search) {
      query.$or = [
        { itemName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const foundItems = await FoundItem.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foundItems.length,
      data: foundItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Found Item
exports.getFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id)
      .populate('userId', 'name email phone department')
      .populate('claimedBy', 'name email');

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: foundItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Found Item
exports.updateFoundItem = async (req, res) => {
  try {
    let foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    if (foundItem.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    foundItem = await FoundItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Found item updated successfully',
      data: foundItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Found Item
exports.deleteFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    if (foundItem.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await FoundItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Found item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Claim Found Item
exports.claimFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    if (foundItem.status === 'claimed') {
      return res.status(400).json({
        success: false,
        message: 'Item already claimed'
      });
    }

    foundItem.status = 'claimed';
    foundItem.claimedBy = req.user.id;
    await foundItem.save();

    res.status(200).json({
      success: true,
      message: 'Item claimed successfully',
      data: foundItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get User's Items
exports.getUserItems = async (req, res) => {
  try {
    const lostItems = await LostItem.find({ userId: req.user.id });
    const foundItems = await FoundItem.find({ userId: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        lostItems,
        foundItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
