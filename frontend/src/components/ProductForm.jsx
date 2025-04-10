// import React, { useState, useEffect } from 'react';
// import { useProducts } from '../contexts/ProductContext';

// const ProductForm = ({ product, onClose }) => {
//   const { createProduct, updateProduct } = useProducts();
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     image: null,
//   });
  
//   useEffect(() => {
//     if (product) {
//       setFormData({
//         name: product.name,
//         description: product.description,
//         price: product.price,
//         category: product.category,
//         image: null, 
//       });
//     }
//   }, [product]);
  
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: files ? files[0] : value,
//     }));
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     try {
//       if (product) {
//         // Editing existing product
//         await updateProduct(product._id, formData, token);
//       } else {
//         // Creating new product
//         await createProduct(formData, token);
//       }
//       onClose();
//     } catch (error) {
//       console.error('Error submitting product form:', error);
//     }
//   };
  
//   return (
//     <div className="product-form">
//       <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Name:
//           <input 
//             type="text" 
//             name="name" 
//             value={formData.name} 
//             onChange={handleChange} 
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           Description:
//           <textarea 
//             name="description" 
//             value={formData.description} 
//             onChange={handleChange} 
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           Price:
//           <input 
//             type="number" 
//             name="price" 
//             value={formData.price} 
//             onChange={handleChange} 
//             required 
//           />
//         </label>
//         <br />
//         <label>
//           Category:
//           <input 
//             type="text" 
//             name="category" 
//             value={formData.category} 
//             onChange={handleChange} 
//           />
//         </label>
//         <br />
//         <label>
//           Image:
//           <input 
//             type="file" 
//             name="image" 
//             onChange={handleChange} 
//             accept="image/*"
//           />
//         </label>
//         <br />
//         <button type="submit">{product ? 'Update' : 'Create'}</button>
//         <button type="button" onClick={onClose}>Cancel</button>
//       </form> 
//     </div>
//   );
// };

// export default ProductForm;


import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';

const ProductForm = ({ product, onClose }) => {
  const { createProduct, updateProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: null,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (product) {
        await updateProduct(product._id, formData, token);
      } else {
        await createProduct(formData, token);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting product form:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#1e1e1e] rounded-xl p-6 border border-gray-700"
    >
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#2c2c2c] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#2c2c2c] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product description"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#2c2c2c] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Price"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#2c2c2c] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Category"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Product Image
        </label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
        >
          {product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
