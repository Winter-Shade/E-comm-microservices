// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, error: cartError, getCartTotals } = useCart();
  const { createOrder, loading: orderLoading, error: orderError } = useOrder();
  const { isAuthenticated, currentUser } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'Credit Card'
  });
  
  // Pre-fill email if user is logged in
  useEffect(() => {
    if (currentUser && currentUser.email) {
      setFormData(prevData => ({
        ...prevData,
        email: currentUser.email
      }));
    }
  }, [currentUser]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const shippingAddress = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country
    };
    
    const order = await createOrder(shippingAddress, formData.paymentMethod);
    
    if (order) {
      // Redirect to order confirmation page
      navigate(`/order-confirmation/${order._id}`);
    }
  };
  
  // Get cart totals
  const { itemCount, subtotal, formattedSubtotal } = getCartTotals();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="mb-4 text-gray-700">Please sign in to proceed with checkout.</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 inline-block"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (cartLoading || orderLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Processing...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (cartError || orderError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-700 mb-4">{cartError || orderError}</p>
            <button 
              onClick={() => navigate(-1)} 
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show empty cart message
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#454545] min-h-screen">
  <div className="text-center">
    <h1 className="text-3xl font-bold text-white mb-6">Checkout</h1>
    <div className="bg-[#525252] border border-gray-600 rounded-2xl p-6 max-w-md mx-auto shadow-lg">
      <p className="mb-4 text-gray-200">Your cart is empty.</p>
      <button 
        onClick={() => navigate('/products')} 
        className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
      >
        Browse Products
      </button>
    </div>
  </div>
</div>


    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 min-h-screen text-gray-100">
  <h1 className="text-3xl font-bold mb-6 text-white">Checkout</h1>

  <div className="flex flex-wrap -mx-4">
    {/* Checkout Form */}
    <div className="w-full lg:w-2/3 px-4 mb-8">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Shipping Information</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              ['First Name', 'firstName'],
              ['Last Name', 'lastName'],
              ['Email', 'email', true],
              ['Street Address', 'street', true],
              ['City', 'city'],
              ['State/Province', 'state'],
              ['ZIP/Postal Code', 'zipCode'],
              ['Country', 'country'],
            ].map(([label, id, fullWidth]) => (
              <div key={id} className={fullWidth ? 'md:col-span-2' : ''}>
                <label className="block text-gray-300 mb-2" htmlFor={id}>{label}</label>
                <input
                  type={id === 'email' ? 'email' : 'text'}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  className="w-full border border-gray-700 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4 text-white">Payment Method</h2>
          <div className="mb-6 space-y-2">
            {['Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
              <div key={method} className="flex items-center">
                <input
                  type="radio"
                  id={method.toLowerCase().replace(/ /g, '')}
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={handleChange}
                  className="mr-2 accent-blue-500"
                />
                <label htmlFor={method.toLowerCase().replace(/ /g, '')}>{method}</label>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="bg-gray-700 text-gray-200 py-2 px-6 rounded hover:bg-gray-600 transition"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition disabled:opacity-60"
              disabled={orderLoading}
            >
              {orderLoading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* Order Summary */}
    <div className="w-full lg:w-1/3 px-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>

        <div className="mb-6">
          <div className="max-h-64 overflow-y-auto mb-4 space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="flex items-center py-2 border-b border-gray-700">
                <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-sm font-medium text-white">{item.name}</h3>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium text-gray-200">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-600 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Subtotal ({itemCount} items)</span>
              <span className="text-gray-100">{formattedSubtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Shipping</span>
              <span className="text-gray-100">Free</span>
            </div>
            <div className="flex justify-between font-semibold text-lg text-white">
              <span>Total</span>
              <span>{formattedSubtotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  );
};

export default Checkout;