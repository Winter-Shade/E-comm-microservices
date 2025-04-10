const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/get', cartController.getUserCart);
router.post('/items', cartController.addCartItem);
router.post('/items/:itemId/remove', cartController.removeCartItem);
router.post('/clear', cartController.clearCart);

router.put('/items/:itemId', cartController.updateCartItem);

module.exports = router;