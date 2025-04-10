import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { UserProvider } from './contexts/UserContext';
import { OrderProvider } from './contexts/OrderContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer'; // 💡 Import Footer

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Order from './pages/Order';
import OrderConfirmation from './components/OrderConfirmation';
import Product from './pages/Product';

import Admin from './pages/Admin';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <UserProvider>
                <div className="min-h-screen flex flex-col bg-gray-50">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/products" element={<Product/>}/>
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order" element={<Order />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />


                      <Route element={<AdminRoute />}>
  <Route path="/admin" element={<Admin />} />
</Route>
                    </Routes>
                  </main>
                  <Footer /> {/* ✅ Add Footer here so it's always visible */}
                </div>
              </UserProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
