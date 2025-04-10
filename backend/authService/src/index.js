const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Auth service is running' });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
  
  // Register with service registry
  const axios = require('axios');
  const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:5000';
  
  axios.post(`${REGISTRY_URL}/register`, {
    name: 'auth',
    url: `http://localhost:${PORT}`,
    endpoints: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      validateToken: '/api/auth/validate-token',
      getUserInfo: '/api/auth/user'
    }
  })
  .then(() => {
    console.log('Successfully registered auth service with the service registry.');
  })
  .catch(err => {
    console.log('Failed to register with service registry:', err.message);
  });
});
