// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { fetchOrderById, currentOrder, loading, error } = useOrder();
  const [orderFetched, setOrderFetched] = useState(false);
  
  useEffect(() => {
    // Fetch order details when component mounts
    if (orderId && !orderFetched) {
      fetchOrderById(orderId);
      setOrderFetched(true);
    }
  }, [orderId, fetchOrderById, orderFetched]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-700 mb-4">{error}</p>
            <Link to="/orders" className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="mb-4 text-gray-700">Order not found.</p>
            <Link to="/orders" className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const { _id, items, totalAmount, shippingAddress, paymentMethod, orderStatus, createdAt } = currentOrder;
  const orderDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl font-bold text-center mb-2">Thank You For Your Order!</h1>
        <p className="text-lg text-center text-gray-700 mb-2">
          Your order has been successfully placed.
        </p>
        <p className="text-center text-gray-700">
          Order ID: <span className="font-semibold">{_id}</span>
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 mb-1">Order Date:</p>
              <p className="font-medium">{orderDate}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Order Status:</p>
              <p className="font-medium">
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  orderStatus === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                  orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {orderStatus}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Payment Method:</p>
              <p className="font-medium">{paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Total Amount:</p>
              <p className="font-medium">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
          <div className="bg-gray-50 p-4 rounded mb-6">
            <p>{shippingAddress.street}</p>
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
            <p>{shippingAddress.country}</p>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
          <table className="min-w-full divide-y divide-gray-200 mb-6">
          <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Product</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Quantity</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Price</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded mr-3 object-cover" />
                      )}
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center">
            <Link to="/orders" className="inline-block mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;