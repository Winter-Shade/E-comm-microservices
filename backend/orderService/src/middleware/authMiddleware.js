const axios = require('axios');
require('dotenv').config();

const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:5000';

const authMiddleware = {
  verifyToken: async (req, res, next) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'UserId is required in the request body' });
      }
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  }
};

module.exports = authMiddleware;