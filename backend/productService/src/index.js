const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const app = express();
const PORT = process.env.PORT || 5003;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Product service is running' });
});

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);

  const axios = require('axios');
  const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:5000';

  axios.post(`${REGISTRY_URL}/register`, {
    name: 'product',
    url: `http://localhost:${PORT}`,
    endpoints: {
      getProducts: '/api/products',
      getProductById: '/api/products/:id'
    }
  }).then(() => {
    console.log('✅ Successfully registered product service with the service registry.');
  }).catch(err => {
    console.log('Failed to register with service registry:', err.message);
  });
});