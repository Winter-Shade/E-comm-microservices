// src/contexts/OrderContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserOrders, createOrder, getOrderById, updateOrderStatus, cancelOrder } from '../services/orderService';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders when user changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchOrders();
    } else {
      // Clear orders when logged out
      setOrders([]);
      setCurrentOrder(null);
    }
  }, [isAuthenticated, currentUser]);

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const orderData = await getUserOrders();
      setOrders(orderData);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch your orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (orderId) => {
    if (!isAuthenticated) {
      setError('Please login to view order details');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const order = await getOrderById(orderId);
      setCurrentOrder(order);
      return order;
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (orderData) => {
    if (!isAuthenticated) {
      setError('Please login to place an order');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const newOrder = await createOrder(orderData);
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      setCurrentOrder(newOrder);
      return newOrder;
    } catch (err) {
      console.error('Error placing order:', err);
      setError('Failed to place order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (orderId, orderStatus) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedOrder = await updateOrderStatus(orderId, orderStatus);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
      
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(updatedOrder);
      }
      
      return updatedOrder;
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order status');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelUserOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      const cancelledOrder = await cancelOrder(orderId);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? cancelledOrder : order
        )
      );
      
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(cancelledOrder);
      }
      
      return cancelledOrder;
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    placeOrder,
    updateOrder,
    cancelOrder: cancelUserOrder,
    clearCurrentOrder: () => setCurrentOrder(null)
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;