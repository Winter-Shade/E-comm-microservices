// src/services/apiClient.js
import axios from 'axios';


const REGISTRY_URL = import.meta.env.REGISTRY_URL || 'http://localhost:5000';

// Create API client that works with the service registry
const apiClient = {
  // Get service details from the registry
  getServiceDetails: async (serviceName) => {
    try {
      const response = await axios.get(`${REGISTRY_URL}/service/${serviceName}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get service details for ${serviceName}:`, error);
      throw error;
    }
  },

  // Make request to a specific service
  request: async (serviceName, endpoint, options = {}) => {
    try {
      // Get service details from registry
      const serviceDetails = await apiClient.getServiceDetails(serviceName);

      const { method = 'GET', data, headers = {} } = options;
      const url = `${serviceDetails.url}${endpoint}`;

      const response = await axios({
        method,
        url,
        data,
        headers,
      });

      return response.data;
    } catch (error) {
      console.error(`API request error for ${serviceName}:`, error);
      throw error;
    }
  }
};

export default apiClient;
