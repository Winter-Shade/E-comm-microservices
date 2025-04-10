const axios = require('axios');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:5000';
    const registryResponse = await axios.get(`${REGISTRY_URL}/service/auth`);
    const authService = registryResponse.data;

    const authResponse = await axios.post(
      `${authService.url}/api/auth/validate-token`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (authResponse.data && authResponse.data.valid) {

      req.userId = authResponse.data.userId;
      next();
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Token verification failed', error: error.message });
  }
};

module.exports = { verifyToken };