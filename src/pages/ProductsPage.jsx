import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package, X, Filter } from 'lucide-react';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
  });

  // Initial products data
  const initialProducts = [
    {
      id: 1,
      name: 'Laptop Pro 15"',
      category: 'Electronics',
      price: 45000,
      stock: 45,
      status: 'In Stock',
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      category: 'Accessories',
      price: 850,
      stock: 120,
      status: 'In Stock',
    },
    {
      id: 3,
      name: 'USB-C Cable',
      category: 'Accessories',
      price: 350,
      stock: 8,
      status: 'Low Stock',
    },
    {
      id: 4,
      name: 'Monitor 27"',
      category: 'Electronics',
      price: 12500,
      stock: 32,
      status: 'In Stock',
    },
    {
      id: 5,
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      price: 3500,
      stock: 67,
      status: 'In Stock',
    },
    {
      id: 6,
      name: 'Webcam HD',
      category: 'Electronics',
      price: 2800,
      stock: 5,
      status: 'Low Stock',
    },
    {
      id: 7,
      name: 'Desk Lamp',
      category: 'Office',
      price: 1200,
      stock: 89,
      status: 'In Stock',
    },
    {
      id: 8,
      name: 'Office Chair',
      category: 'Furniture',
      price: 8500,
      stock: 15,
      status: 'In Stock',
    },
    {
      id: 9,
      name: 'Headphones Pro',
      category: 'Audio',
      price: 4200,
      stock: 7,
      status: 'Low Stock',
    },
  ];

  // Mock products data (prices include 12% VAT) - with localStorage persistence
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  // Persist products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const categories = ['All', 'Electronics', 'Accessories', 'Office', 'Furniture', 'Audio'];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'Electronics',
        price: '',
        stock: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Electronics',
      price: '',
      stock: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              ...formData,
              price: parseFloat(formData.price),
              stock: parseInt(formData.stock),
              status: parseInt(formData.stock) <= 10 ? 'Low Stock' : 'In Stock',
            }
          : p
      ));
    } else {
      // Add new product
      const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        status: parseInt(formData.stock) <= 10 ? 'Low Stock' : 'In Stock',
      };
      setProducts([...products, newProduct]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const formatPrice = (price) => {
    return `₱${parseFloat(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.status === 'In Stock'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {product.status}
                </span>
              </div>

              {/* Product Info */}
              <h3 className="text-xl font-bold text-gray-800 mb-1 mt-2">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{product.category}</p>

              <div className="mb-6">
                <p className="text-2xl font-bold text-gray-800">{formatPrice(product.price)}</p>
                <p className="text-xs text-gray-500 mt-1">Inc. 12% VAT</p>
                <p className="text-sm text-gray-600 mt-2">
                  Stock: <span className="font-semibold">{product.stock}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleOpenModal(product)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-primary-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center justify-center bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                  >
                    {categories.filter(cat => cat !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₱) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Price includes 12% VAT</p>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Items with stock ≤ 10 will be marked as Low Stock</p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-dark text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
