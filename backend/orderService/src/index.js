const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/orderRoutes');
const { registerService } = require('./utils/serviceRegistry');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/orders', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Order service is running' });
});

app.listen(PORT, async () => {
  console.log(`Order service running on port ${PORT}`);
  
  // Register with service registry
  try {
    await registerService('order', `http://localhost:${PORT}`, {
      getOrders: '/api/orders',
      createOrder: '/api/orders',
      getOrderById: '/api/orders/:id'
    });
    console.log('Successfully registered with service registry');
  } catch (error) {
    console.error('Failed to register with service registry:', error.message);
  }
});