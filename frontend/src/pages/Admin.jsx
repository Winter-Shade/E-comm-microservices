import React, { useEffect, useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import ProductForm from '../components/ProductForm';

const Admin = () => {
  const {
    products,
    categories,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCategories,
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId, token);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    fetchProducts(); // Refresh products after close
  };

  return (
    <div className="p-6 bg-[#454545] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Product Management</h1>

      <div className="mb-6">
        <button
          onClick={handleAddClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          + Add New Product
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-[#2e2e2e] border border-gray-700 rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 transition-all duration-300 ease-in-out text-white">
            <button
              onClick={handleFormClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl transition-colors"
              aria-label="Close Form"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <div className="space-y-4">
              <ProductForm product={selectedProduct} onClose={handleFormClose} />
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-10 mb-4">All Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-[#2c2c2c] border border-gray-600 rounded-xl shadow-md p-5 transition hover:shadow-lg text-white"
          >
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-300 mb-1">{product.description}</p>
            <p className="text-green-400 font-semibold mb-1">${product.price}</p>
            <p className="text-sm text-gray-400 mb-3">Category: {product.category}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
