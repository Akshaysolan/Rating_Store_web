const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/', requireAuth, requireRole('admin'), userController.getAllUsers);
router.get('/filter', requireAuth, requireRole('admin'), userController.getFilteredUsers);
router.post('/', requireAuth, requireRole('admin'), userController.createUser);
router.get('/:id', requireAuth, requireRole('admin'), userController.getUserDetails);

module.exports = router;