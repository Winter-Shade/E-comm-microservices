const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserById } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
//  internal route
router.get('/:userId', getUserById);
module.exports = router;