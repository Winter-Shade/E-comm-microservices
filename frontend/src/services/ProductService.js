import axios from 'axios';

// Create API instance with base URL
const productApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:5003',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Service registry for service discovery
const serviceRegistryApi = axios.create({
  baseURL: import.meta.env.REGISTRY_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

class ProductService {
  // Get product service URL from registry
  async getProductServiceUrl() {
    try {
      const response = await serviceRegistryApi.get('/service/product');
      return response.data.url;
    } catch (error) {
      console.error('Error fetching product service URL:', error);
      return import.meta.env.PRODUCT_SERVICE_URL || 'http://localhost:5003';
    }
  }

  // Configure productApi with the correct URL
  async configureApi() {
    const serviceUrl = await this.getProductServiceUrl();
    productApi.defaults.baseURL = serviceUrl;
    return productApi;
  }

  // Get all products with pagination and filters
  async getProducts(filters = {}) {
    const api = await this.configureApi();
    const { category, sort, page = 1, limit = 10 } = filters;
    let queryString = `?page=${page}&limit=${limit}`;
    
    if (category) queryString += `&category=${category}`;
    if (sort) queryString += `&sort=${sort}`;
    
    try {
      const response = await api.get(`/api/products${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 6) {
    const api = await this.configureApi();
    try {
      const response = await api.get(`/api/products?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Get product by ID
  async getProductById(productId) {
    const api = await this.configureApi();
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  }

  // Create a new product (admin function)
  async createProduct(productData, token) {
    const api = await this.configureApi();
    const formData = new FormData();
    
    // Add all product data to formData
    Object.keys(productData).forEach(key => {
      if (key !== 'image' || (key === 'image' && productData[key] instanceof File)) {
        formData.append(key, productData[key]);
      }
    });
    
    try {
      const response = await api.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update a product (admin function)
  async updateProduct(productId, productData, token) {
    const api = await this.configureApi();
    const formData = new FormData();
    
    // Add all product data to formData
    Object.keys(productData).forEach(key => {
      if (key !== 'image' || (key === 'image' && productData[key] instanceof File)) {
        formData.append(key, productData[key]);
      }
    });
    
    try {
      const response = await api.put(`/api/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${productId}:`, error);
      throw error;
    }
  }

  // Delete a product (admin function)
  async deleteProduct(productId, token) {
    const api = await this.configureApi();
    try {
      const response = await api.delete(`/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with ID ${productId}:`, error);
      throw error;
    }
  }
}

export default new ProductService();