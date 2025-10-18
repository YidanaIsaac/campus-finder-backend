const express = require('express');
const {
  createLostItem,
  getAllLostItems,
  getLostItem,
  updateLostItem,
  deleteLostItem,
  createFoundItem,
  getAllFoundItems,
  getFoundItem,
  updateFoundItem,
  deleteFoundItem,
  claimFoundItem,
  getUserItems
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Lost Items Routes
router.post('/lost', protect, createLostItem);
router.get('/lost', getAllLostItems);
router.get('/lost/:id', getLostItem);
router.put('/lost/:id', protect, updateLostItem);
router.delete('/lost/:id', protect, deleteLostItem);

// Found Items Routes
router.post('/found', protect, createFoundItem);
router.get('/found', getAllFoundItems);
router.get('/found/:id', getFoundItem);
router.put('/found/:id', protect, updateFoundItem);
router.delete('/found/:id', protect, deleteFoundItem);
router.patch('/found/:id/claim', protect, claimFoundItem);

// User Items
router.get('/user/items', protect, getUserItems);

module.exports = router;
