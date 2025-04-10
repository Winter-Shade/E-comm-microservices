// src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, error, fetchCart, updateCartItem, removeCartItem, clearCart, getCartTotals } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
  const { placeOrder } = useOrder();
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [checkoutError, setCheckoutError] = useState(null);
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      // Pre-fill address if user has one stored in their profile
      if (currentUser?.address) {
        setShippingAddress(currentUser.address);
      }
    }
  }, [isAuthenticated, currentUser]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      await removeCartItem(itemId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    setCheckoutMode(true);
    window.scrollTo(0, 0);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setCheckoutError(null);
    setProcessingOrder(true);
    
    try {
      // Validate form
      for (const [key, value] of Object.entries(shippingAddress)) {
        if (!value.trim()) {
          throw new Error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
        }
      }
      
      if (!paymentMethod) {
        throw new Error('Payment method is required');
      }
      
      const { subtotal } = getCartTotals();
      
     // Create order object
    const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.image
        })),
        totalAmount: subtotal,
        shippingAddress,
        paymentMethod
      };
      
      // Place order
      const newOrder = await placeOrder(orderData);
      if (newOrder) {
        await clearCart(); // Clear the cart after successful order
        navigate('/'); // Redirect to home page instead of order details
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setCheckoutError(err.message || 'Failed to place order');
    } finally {
      setProcessingOrder(false);
    }
  };

  const { itemCount, subtotal, formattedSubtotal } = getCartTotals();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="mb-4 text-gray-700">Please sign in to view your cart.</p>
            <Link to="/login" className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 inline-block">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={fetchCart} 
              className=" text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#454545] text-white">
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
</div>

    );
  }

  if (checkoutMode) {
    return (
      <div className="min-h-screen bg-[#454545] text-white">
      <div className="container mx-auto px-4 py-8 bg-[#454545] min-h-screen text-white">
  <div className="flex items-center mb-6">
    <button
      onClick={() => setCheckoutMode(false)}
      className="mr-4 text-blue-400 hover:text-blue-300 transition-colors"
    >
      &larr; Back to Cart
    </button>
    <h1 className="text-3xl font-bold">Checkout</h1>
  </div>

  {checkoutError && (
    <div className="bg-red-500/20 border border-red-400 text-red-300 rounded-lg p-4 mb-6">
      <p>{checkoutError}</p>
    </div>
  )}

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
    {/* Checkout Form */}
    <div>
      <form onSubmit={handleSubmitOrder} className="bg-[#525252] rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="street" className="block text-sm font-medium mb-1">Street Address</label>
            <input
              type="text"
              id="street"
              name="street"
              value={shippingAddress.street}
              onChange={handleAddressChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#3c3c3c] text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#3c3c3c] text-white focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={shippingAddress.state}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#3c3c3c] text-white focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium mb-1">ZIP / Postal Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={shippingAddress.zipCode}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#3c3c3c] text-white focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-[#3c3c3c] text-white focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

        <div className="space-y-4 mb-8 text-sm text-gray-300">
          {["Credit Card", "PayPal", "Cash on Delivery"].map((method) => (
            <div key={method} className="flex items-center">
              <input
                type="radio"
                id={method.toLowerCase().replace(/\s/g, "-")}
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor={method.toLowerCase().replace(/\s/g, "-")} className="ml-2">
                {method}
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-500"
          disabled={processingOrder}
        >
          {processingOrder ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Place Order'
          )}
        </button>
      </form>
    </div>

    {/* Order Summary */}
    <div>
      <div className="bg-[#525252] rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b border-gray-500 pb-4">
              <div className="flex items-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded object-cover mr-4"
                  />
                ) : (
                  <div className="h-16 w-16 rounded bg-gray-600 mr-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-300">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{formattedSubtotal}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>Free</p>
          </div>
          <div className="flex justify-between font-bold text-base text-white pt-2 border-t border-gray-600">
            <p>Total</p>
            <p>{formattedSubtotal}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
</div>

    );
  }

  return (
    // <div className="container mx-auto px-4 py-8">
    //   <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
    //   <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    //     <div className="overflow-x-auto">
    //       <table className="min-w-full divide-y divide-gray-200">
    //         <thead className="bg-gray-50">
    //           <tr>
    //             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //               Product
    //             </th>
    //             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //               Price
    //             </th>
    //             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //               Quantity
    //             </th>
    //             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //               Total
    //             </th>
    //             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //               Actions
    //             </th>
    //           </tr>
    //         </thead>
    //         <tbody className="bg-white divide-y divide-gray-200">
    //           {cart.items.map((item) => (
    //             <tr key={item._id}>
    //               <td className="px-6 py-4 whitespace-nowrap">
    //                 <div className="flex items-center">
    //                   {item.image ? (
    //                     <img 
    //                       src={item.image} 
    //                       alt={item.name} 
    //                       className="h-10 w-10 rounded-full mr-4 object-cover"
    //                     />
    //                   ) : (
    //                     <div className="h-10 w-10 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
    //                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    //                       </svg>
    //                     </div>
    //                   )}
    //                   <div>
    //                     <Link to={`/products/${item.productId}`} className="text-blue-600 hover:text-blue-800 font-medium">
    //                       {item.name}
    //                     </Link>
    //                   </div>
    //                 </div>
    //               </td>
    //               <td className="px-6 py-4 whitespace-nowrap">
    //                 Rs{item.price.toFixed(2)}
    //               </td>
    //               <td className="px-6 py-4 whitespace-nowrap">
    //                 <div className="flex items-center space-x-2">
    //                   <button
    //                     onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
    //                     className="bg-gray-100 rounded-md p-1 hover:bg-gray-200"
    //                     disabled={item.quantity <= 1}
    //                   >
    //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    //                     </svg>
    //                   </button>
    //                   <span>{item.quantity}</span>
    //                   <button
    //                     onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
    //                     className="bg-gray-100 rounded-md p-1 hover:bg-gray-200"
    //                   >
    //                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    //                     </svg>
    //                   </button>
    //                 </div>
    //               </td>
    //               <td className="px-6 py-4 whitespace-nowrap font-medium">
    //                 Rs{(item.price * item.quantity).toFixed(2)}
    //               </td>
    //               <td className="px-6 py-4 whitespace-nowrap">
    //                 <button
    //                   onClick={() => handleRemoveItem(item._id)}
    //                   className="text-red-600 hover:text-red-800"
    //                 >
    //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    //                   </svg>
    //                 </button>
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
      
    //   <div className="flex flex-wrap justify-between items-center gap-4">
    //     <div className="flex space-x-4">
    //       <Link 
    //         to="/products" 
    //         className="bg-gray-100 text-gray-700 py-2 px-6 rounded hover:bg-gray-200"
    //       >
    //         Continue Shopping
    //       </Link>
    //       <button
    //         onClick={handleClearCart}
    //         className="bg-red-50 text-red-600 py-2 px-6 rounded hover:bg-red-100"
    //       >
    //         Clear Cart
    //       </button>
    //     </div>
        
    //     <div className="bg-gray-50 p-4 rounded-lg">
    //       <div className="flex justify-between items-center mb-2">
    //         <span className="text-gray-600">Subtotal ({itemCount} items):</span>
    //         <span className="font-bold text-xl">{formattedSubtotal}</span>
    //       </div>
    //       <button
    //         onClick={handleCheckout}
    //         className="w-full bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
    //       >
    //         Proceed to Checkout
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen bg-[#454545]">
<div className="container mx-auto px-4 py-10 bg-[#454545] min-h-screen text-white">
  <h1 className="text-4xl font-semibold mb-8 text-white">Your Cart</h1>

  <div className="bg-[#3a3a3a] rounded-2xl shadow-lg overflow-hidden mb-10">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#2e2e2e]">
          <tr>
            {['Product', 'Price', 'Quantity', 'Total', 'Actions'].map((col) => (
              <th key={col} className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wide">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {cart.items.map((item) => (
            <tr key={item._id} className="hover:bg-[#505050] transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full mr-4 object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-600 mr-4 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <Link to={`/products/${item.productId}`} className="text-blue-400 hover:text-blue-300 font-medium">
                    {item.name}
                  </Link>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-200">${item.price.toFixed(2)}</td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="bg-[#2e2e2e] rounded-md p-1.5 hover:bg-gray-600 disabled:opacity-40"
                    disabled={item.quantity <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-white">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="bg-[#2e2e2e] rounded-md p-1.5 hover:bg-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 font-semibold text-white">
                ${(item.price * item.quantity).toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div className="flex space-x-4 w-full md:w-auto">
      <Link to="/products" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 font-medium transition">
        Continue Shopping
      </Link>
      <button
        onClick={handleClearCart}
        className="bg-red-900 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium transition"
      >
        Clear Cart
      </button>
    </div>

    <div className="w-full md:w-80 bg-[#2e2e2e] p-6 rounded-xl shadow-inner">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-300">Subtotal ({itemCount} items):</span>
        <span className="text-xl font-bold text-white">{formattedSubtotal}</span>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition"
      >
        Proceed to Checkout
      </button>
    </div>
  </div>
</div>
</div>

  );
};

export default Cart;