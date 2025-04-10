const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: 'http://localhost:5173', // your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // allow preflight
// app.use(cors());
app.use(express.json());

const serviceRegistry = {
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    endpoints: {
      validateToken: '/api/auth/validate-token',
      getUserInfo: '/api/auth/user'
    }
  },
  user: {
    url: process.env.USER_SERVICE_URL || 'http://localhost:5002',
    endpoints: {
      getUser: '/api/users'
    }
  },
  product: {
    url: process.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:5003',
    endpoints: {
      getProducts: '/api/products'
    }
  },
  cart: {
    url: process.env.CART_SERVICE_URL || 'http://localhost:5004',
    endpoints: {
      getCarts: '/api/carts'
    }
  },
  order: {
    url: process.env.ORDER_SERVICE_URL || 'http://localhost:5005',
    endpoints: {
      getOrders: '/api/orders'
    }
  }
};

app.get('/service/:name', (req, res) => {
  const { name } = req.params;
  
  if (serviceRegistry[name]) {
    return res.json(serviceRegistry[name]);
  }
  
  return res.status(404).json({ error: 'Service not found' });
});

app.get('/services', (req, res) => {
  return res.json(serviceRegistry);
});

app.post('/proxy/:service/:endpoint', async (req, res) => {
  const { service, endpoint } = req.params;
  const { method = 'GET', url, data, headers } = req.body;
  
  if (!serviceRegistry[service]) {
    return res.status(404).json({ error: 'Service not found' });
  }
  
  try {
    const serviceUrl = serviceRegistry[service].url;
    const fullUrl = url ? `${serviceUrl}${url}` : `${serviceUrl}/${endpoint}`;
    
    const response = await axios({
      method,
      url: fullUrl,
      data,
      headers
    });
    
    return res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    return res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Service registry is running' });
});

app.post('/register', (req, res) => {
  const { name, url, endpoints } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'Service name and URL are required' });
  }
  serviceRegistry[name] = {
    url,
    endpoints: endpoints || {}
  };
  return res.json({ message: `Service ${name} registered successfully`, service: serviceRegistry[name] });
});

app.listen(PORT, () => {
  console.log(`Service registry running on port ${PORT}`);
});