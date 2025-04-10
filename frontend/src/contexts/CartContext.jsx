// src/contexts/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getUserCart, 
  addItemToCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  clearUserCart 
} from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart when user changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Store userId in localStorage for services to use
      localStorage.setItem('userId', currentUser._id);
      fetchCart();
    } else {
      // Clear cart when logged out
      setCart({ items: [] });
      localStorage.removeItem('userId');
    }
  }, [isAuthenticated, currentUser]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const cartData = await getUserCart();
      setCart(cartData);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to fetch your cart');
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      setError('Please login to add items to cart');
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedCart = await addItemToCart(product);
      setCart(updatedCart);
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCart = await updateCartItemQuantity(itemId, quantity);
      setCart(updatedCart);
      return true;
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Failed to update cart item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (itemId) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCart = await removeFromCart(itemId);
      setCart(updatedCart);
      return true;
    } catch (err) {
      console.error('Error removing cart item:', err);
      setError('Failed to remove item from cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await clearUserCart();
      setCart({ items: [] });
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotals = () => {
    const items = cart?.items || [];
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedSubtotal = `$${subtotal.toFixed(2)}`;
    
    return {
      itemCount,
      subtotal,
      formattedSubtotal
    };
  };

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartTotals
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;