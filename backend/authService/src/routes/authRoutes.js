const express = require('express');
const router = express.Router();
const { register, login, getUser, validateToken, getUserById, googleLogin } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.get('/validate-token', validateToken);
router.post('/google-login', googleLogin);

router.get('/user', authenticate, getUser);

router.get('/users/:userId', getUserById);

module.exports = router;