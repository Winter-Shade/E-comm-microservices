const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);

router.post('/', orderController.createOrder);

router.patch('/:id/status', authMiddleware.verifyToken, orderController.updateOrderStatus);
router.patch('/:id/payment', authMiddleware.verifyToken, orderController.updatePaymentStatus);
router.patch('/:id/cancel', authMiddleware.verifyToken, orderController.cancelOrder);

module.exports = router;