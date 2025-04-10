const axios = require('axios');
require('dotenv').config();

const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:5000';
const getUserFromAuthService = async (userId, token) => {
  try {
    const registryResponse = await axios.get(`${REGISTRY_URL}/service/auth`);
    const authService = registryResponse.data;
    
    const response = await axios.get(`${authService.url}/api/auth/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (err) {
    console.error('Error getting user from auth service:', err.message);
    throw new Error('Failed to fetch user data from auth service');
  }
};

module.exports = {
  getUserFromAuthService
};