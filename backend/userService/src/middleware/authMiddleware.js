const axios = require('axios');
require('dotenv').config();

const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:5000';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Token is missing.' });
    }
    
    const registryResponse = await axios.get(`${REGISTRY_URL}/service/auth`);
    const authService = registryResponse.data;
    
    const response = await axios.get(`${authService.url}${authService.endpoints.validateToken}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data.valid) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    
    req.user = {
      userId: response.data.userId,
      username: response.data.username,
      email: response.data.email,
      role: response.data.role
    };
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: 'Authentication failed.' });
  }
};

module.exports = {
  authenticate
};