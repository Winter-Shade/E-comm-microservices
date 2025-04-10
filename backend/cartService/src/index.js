const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const cartRoutes = require('./routes/cartRoutes');
const app = express();
const PORT = process.env.PORT || 5004;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/carts', cartRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Cart service is running' });
});

app.listen(PORT, () => {
  console.log(`Cart service running on port ${PORT}`);

  const axios = require('axios');
  const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:5000';

  axios.post(`${REGISTRY_URL}/register`, {
    name: 'cart',
    url: `http://localhost:${PORT}`,
    endpoints: {
      getUserCart: '/api/carts/get',
      addCartItem: '/api/carts/items',
      updateCartItem: '/api/carts/items/:itemId',
      removeCartItem: '/api/carts/items/:itemId/remove',
      clearCart: '/api/carts/clear'
    }
  }).then(() => {
    console.log('Successfully registered cart service with the service registry.');
  }).catch(err => {
    console.log('Failed to register with service registry:', err.message);
  });
});