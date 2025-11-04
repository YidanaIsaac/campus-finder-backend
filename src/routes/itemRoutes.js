const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  validateRequest,
  lostItemSchema,
  foundItemSchema
} = require('../middleware/validator');
const { apiLimiter } = require('../middleware/rateLimiter');
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

router.use(apiLimiter);

router.get('/user', protect, getUserItems);

router.route('/lost')
  .get(getAllLostItems)
  .post(protect, validateRequest(lostItemSchema), createLostItem);

router.route('/lost/:id')
  .get(getLostItem)
  .put(protect, updateLostItem)
  .delete(protect, deleteLostItem);

router.route('/found')
  .get(getAllFoundItems)
  .post(protect, validateRequest(foundItemSchema), createFoundItem);

router.route('/found/:id')
  .get(getFoundItem)
  .put(protect, updateFoundItem)
  .delete(protect, deleteFoundItem);

router.put('/found/:id/claim', protect, claimFoundItem);

module.exports = router;
