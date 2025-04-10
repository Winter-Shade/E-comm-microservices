// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { getCartTotals } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  // Get cart totals from CartContext
  const { itemCount } = getCartTotals();

  return (
    // <nav className="bg-gray-800 text-white shadow-md">
    //   <div className="container mx-auto px-4">
    //     <div className="flex justify-between items-center py-4">
    //       {/* Logo and main nav */}
    //       <div className="flex items-center">
    //         <Link to="/" className="text-xl font-bold">GroceryShopping</Link>
    //         <div className="ml-10 hidden md:flex space-x-4">
    //           <Link to="/" className="hover:text-gray-300 px-3 py-2">Home</Link>
    //           <Link to="/products" className="hover:text-gray-300 px-3 py-2">Products</Link>
    //         </div>
    //       </div>

    //       {/* Cart and Profile section */}
    //       <div className="flex items-center">
    //         {/* Cart Icon with Count */}
    //         <Link to="/cart" className="mr-4 relative">
    //           <div className="p-2 hover:bg-gray-700 rounded-full">
    //             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    //             </svg>
    //             {isAuthenticated && itemCount > 0 && (
    //               <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
    //                 {itemCount > 99 ? '99+' : itemCount}
    //               </span>
    //             )}
    //           </div>
    //         </Link>

    //         {/* Profile dropdown */}
    //         <div className="relative" ref={dropdownRef}>
    //           <button
    //             className="flex items-center focus:outline-none"
    //             onClick={toggleDropdown}
    //             aria-expanded={dropdownOpen}
    //             aria-haspopup="true"
    //           >
    //             <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
    //               {isAuthenticated ? (
    //                 <span>{currentUser.username?.charAt(0).toUpperCase() || 'U'}</span>
    //               ) : (
    //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    //                   <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    //                 </svg>
    //               )}
    //             </div>
    //           </button>

    //           {/* Dropdown menu */}
    //           {dropdownOpen && (
    //             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
    //               {isAuthenticated ? (
    //                 <>
    //                   <div className="px-4 py-2 text-sm text-gray-700 border-b">
    //                     <p className="font-medium">{currentUser.username}</p>
    //                     <p className="text-xs text-gray-500">{currentUser.email}</p>
    //                   </div>
    //                   <Link
    //                     to="/profile"
    //                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    //                     onClick={() => setDropdownOpen(false)}
    //                   >
    //                     My Account
    //                   </Link>
    //                   <button
    //                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    //                     onClick={handleLogout}
    //                   >
    //                     Logout
    //                   </button>
    //                 </>
    //               ) : (
    //                 <>
    //                   <Link
    //                     to="/login"
    //                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    //                     onClick={() => setDropdownOpen(false)}
    //                   >
    //                     Login
    //                   </Link>
    //                   <Link
    //                     to="/register"
    //                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    //                     onClick={() => setDropdownOpen(false)}
    //                   >
    //                     Register
    //                   </Link>
    //                 </>
    //               )}
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </nav>
<div className="bg-[#454545]">
<nav className="bg-[#e6f9f0] text-green-900 shadow-md sticky top-0 z-50 rounded-b-2xl ring-1 ring-green-100 backdrop-blur-md">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center py-4">
      {/* Logo and main nav */}
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-green-700 hover:text-green-800 transition-colors duration-300">
          Grocery<span className="text-green-900">Shop</span>
        </Link>
        <div className="ml-10 hidden md:flex space-x-6 text-base font-medium">
          <Link to="/" className="hover:text-green-600 transition duration-300">Home</Link>
          <Link to="/products" className="hover:text-green-600 transition duration-300">Products</Link>
        </div>
      </div>

      {/* Cart and Profile section */}
      <div className="flex items-center gap-4">
        {/* Cart Icon with Count */}
        <Link to="/cart" className="relative group">
          <div className="p-2 rounded-xl group-hover:bg-green-100 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-800 group-hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {isAuthenticated && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold shadow-md">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </div>
        </Link>

        {/* Logout button */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="hidden md:inline-block bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-full shadow-sm transition duration-300"
          >
            Logout
          </button>
        )}

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 focus:outline-none group"
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="h-9 w-9 rounded-full bg-green-200 text-green-900 font-semibold flex items-center justify-center group-hover:bg-green-300 transition duration-300">
              {isAuthenticated ? (
                <span>{currentUser.username?.charAt(0).toUpperCase() || 'U'}</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl py-2 border border-green-100 z-20 animate-fade-in-up transition-all duration-300">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-green-800 border-b">
                    <p className="font-medium">{currentUser.username}</p>
                    <p className="text-xs text-green-600">{currentUser.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-green-100 text-green-800 rounded-md transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Account
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-green-800 hover:bg-green-100 rounded-md transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-green-800 hover:bg-green-100 rounded-md transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-sm text-green-800 hover:bg-green-100 rounded-md transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</nav>
</div>

  );
};

export default Navbar;