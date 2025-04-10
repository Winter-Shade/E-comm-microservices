// src/services/cartService.js
import axios from 'axios';
import { getServiceUrl } from './registryService';
let CART_SERVICE_URL = null;

const initCartService = async () => {
  try {
    const cartService = await getServiceUrl('cart');

    CART_SERVICE_URL = cartService.url;
    return true;
  } catch (error) {
    console.error('Failed to initialize cart service:', error);
    return false;
  }
};

const ensureServiceUrl = async () => {
  if (!CART_SERVICE_URL) {
    await initCartService();
  }
  return !!CART_SERVICE_URL;
};

export const getUserCart = async () => {
  try {
    await ensureServiceUrl();
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');

    const response = await axios.post(`${CART_SERVICE_URL}/api/carts/get`, {
      userId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user cart:', error);
    throw error;
  }
};

export const addItemToCart = async (product) => {
  try {
    await ensureServiceUrl();
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');

    const response = await axios.post(`${CART_SERVICE_URL}/api/carts/items`, {
      userId,
      productId: product._id,
      quantity: 1
    });
    
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    await ensureServiceUrl();
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');

    const response = await axios.put(`${CART_SERVICE_URL}/api/carts/items/${itemId}`, {
      userId,
      quantity
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    await ensureServiceUrl();
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');

    const response = await axios.post(`${CART_SERVICE_URL}/api/carts/items/${itemId}/remove`, {
      userId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

export const clearUserCart = async () => {
  try {
    await ensureServiceUrl();
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');

    const response = await axios.post(`${CART_SERVICE_URL}/api/carts/clear`, {
      userId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};