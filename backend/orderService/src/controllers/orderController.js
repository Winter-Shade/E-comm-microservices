const Order = require('../models/orderModel');
const ServiceClient = require('../utils/serviceRegistry');

const orderController = {
  getAllOrders: async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'UserId is required in the request body' });
      }
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'UserId is required in the request body' });
      }

      const order = await Order.findOne({ _id: id, userId });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Get order by ID error:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  },

  createOrder: async (req, res) => {
    try {
      const { userId, items, totalAmount, shippingAddress, paymentMethod } = req.body;
      if (!userId) 
      {
        return res.status(400).json({ error: 'UserId is required' });
      }
      if (!items || !Array.isArray(items) || items.length === 0) 
      {
        return res.status(400).json({ error: 'Order must contain items' });
      }
      
      for (const item of items) {
        try {
          const productDetails = await ServiceClient.getProductDetails(item.productId);
          
          item.name = productDetails.name;
          item.price = productDetails.price;
          item.imageUrl = productDetails.imageUrl;
        } catch (error) {
          console.error(`Failed to verify product ${item.productId}:`, error.message);
          return res.status(400).json({ error: `Invalid product: ${item.productId}` });
        }
      }

      const newOrder = new Order({
        userId,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod
      });

      await newOrder.save();
      
      try {
        await ServiceClient.clearCart(userId);
      } catch (error) {
        console.error('Failed to clear cart after order creation:', error.message);
      }

      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus, userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'UserId is required in the request body' });
      }
      const order = await Order.findOne({ _id: id, userId });
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      order.orderStatus = orderStatus;
      await order.save();
      
      res.json(order);
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  },

  updatePaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentStatus, userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'UserId is required in the request body' });
      }
      const order = await Order.findOne({ _id: id, userId });
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      order.paymentStatus = paymentStatus;
      await order.save();
      
      res.json(order);
    } catch (error) {
      console.error('Update payment status error:', error);
      res.status(500).json({ error: 'Failed to update payment status' });
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'UserId is required in the request body' });
      }

      const order = await Order.findOne({ _id: id, userId });
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (order.orderStatus !== 'Processing') {
        return res.status(400).json({ 
          error: 'Cannot cancel order that has been shipped or delivered' 
        });
      }
      
      order.orderStatus = 'Cancelled';
      await order.save();
      
      res.json(order);
    } catch (error) {
      console.error('Cancel order error:', error);
      res.status(500).json({ error: 'Failed to cancel order' });
    }
  }
};

module.exports = orderController;