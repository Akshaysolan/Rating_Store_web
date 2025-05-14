const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', storeController.getAllStores);
router.get('/filter', storeController.getFilteredStores);
router.post('/', requireAuth, storeController.createStore);
router.post('/rate', requireAuth, storeController.submitRating);
router.get('/ratings', requireAuth, storeController.getStoreRatings);
router.get('/dashboard', requireAuth, storeController.getDashboardStats);

module.exports = router;