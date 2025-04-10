import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { 
    featuredProducts, 
    loading, 
    error, 
    fetchFeaturedProducts 
  } = useProducts();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      if (window.confirm('Please log in to add items to your cart. Go to login page?')) {
        navigate('/login');
      }
      return;
    }
    
    try {
      const result = await addToCart(product);
      if (result) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        toast.textContent = `${product.name} added to cart!`;
        document.body.appendChild(toast);

        setTimeout(() => {
          document.body.removeChild(toast);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    // <div className="container mx-auto px-4 py-8">
    //   <div className="text-center mb-10">
    //     <h1 className="text-4xl font-bold mb-4">Welcome to Our E-Commerce Store</h1>
    //     <p className="text-xl text-gray-600">
    //       {isAuthenticated
    //         ? `Hello, ${currentUser.username}! Start shopping now.`
    //         : 'Sign in to start shopping and track your orders.'}
    //     </p>
    //   </div>

    //   {loading ? (
    //     <div className="text-center py-12">
    //       <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
    //       <p className="mt-4 text-gray-600">Loading products...</p>
    //     </div>
    //   ) : error ? (
    //     <div className="text-center bg-red-100 p-4 rounded-md text-red-700">{error}</div>
    //   ) : (
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //       {featuredProducts.map((product) => (
    //         <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    //           <div className="h-48 bg-gray-200">
    //             {product.image ? (
    //               <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
    //             ) : (
    //               <div className="h-full w-full flex items-center justify-center bg-gray-100">
    //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    //                 </svg>
    //               </div>
    //             )}
    //           </div>
    //           <div className="p-4">
    //             <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
    //             <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
    //             <p className="text-lg font-bold text-blue-600">Rs {product.price.toFixed(2)}</p>
    //             <button
    //               className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
    //               onClick={() => handleAddToCart(product)}
    //             >
    //               Add to Cart
    //             </button>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   )}
    // </div>
<div className="min-h-screen w-full bg-[#454545]">
  <div className="container mx-auto px-4 py-12 text-gray-100">
    <div className="text-center mb-14">
      <h1 className="text-4xl font-extrabold text-white mb-3">🏠 Welcome to GroceryShopping Store</h1>
      <p className="text-lg text-gray-300">
        {isAuthenticated
          ? `👋 Hello, ${currentUser.username}! Ready to shop your favorites?`
          : '🔐 Sign in to unlock shopping and order tracking magic.'}
      </p>
    </div>

    {loading ? (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-gray-600 border-t-yellow-400"></div>
        <p className="mt-4 text-gray-400 text-sm">Fetching featured products...</p>
      </div>
    ) : error ? (
      <div className="text-center bg-red-800/30 border border-red-400 p-4 rounded-lg text-red-300 font-medium shadow-md">
        {error}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-[#525252] border-2 border-yellow-400/60 rounded-3xl shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="h-48 bg-[#5e5e5e] rounded-t-3xl overflow-hidden">
              {product.image ? (
                <img
                  src={`${import.meta.env.VITE_PRODUCT_SERVICE_URL}${product.image}`}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-[#5e5e5e]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
              <p className="text-sm text-gray-300 mb-2 line-clamp-2">{product.description}</p>
              <p className="text-xl font-bold text-yellow-400 mb-4">${product.price.toFixed(2)}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-yellow-500 text-black font-semibold py-2 px-4 rounded-xl hover:bg-yellow-400 transition-colors duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>


  );
};

export default Home;