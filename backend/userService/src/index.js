const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 5002;

connectDB();


app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'User service is running' });
});

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
  const axios = require('axios');
  const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:5000';
  
  axios.post(`${REGISTRY_URL}/register`, {
    name: 'user',
    url: `http://localhost:${PORT}`,
    endpoints: {
      getProfile: '/api/users/profile',
      updateProfile: '/api/users/profile'
    }
  })
  .then(() => {
    console.log('Successfully registered user service with the service registry.');
  })
  .catch(err => {
    console.log('Failed to register with service registry:', err.message);
  });
});
