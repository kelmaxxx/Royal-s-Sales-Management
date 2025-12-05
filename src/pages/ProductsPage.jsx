import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock products data (prices include 12% VAT)
  const products = [
    {
      id: 1,
      name: 'Laptop Pro 15"',
      category: 'Electronics',
      price: '₱45,000.00',
      stock: 45,
      status: 'In Stock',
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      category: 'Accessories',
      price: '₱850.00',
      stock: 120,
      status: 'In Stock',
    },
    {
      id: 3,
      name: 'USB-C Cable',
      category: 'Accessories',
      price: '₱350.00',
      stock: 8,
      status: 'Low Stock',
    },
    {
      id: 4,
      name: 'Monitor 27"',
      category: 'Electronics',
      price: '₱12,500.00',
      stock: 32,
      status: 'In Stock',
    },
    {
      id: 5,
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      price: '₱3,500.00',
      stock: 67,
      status: 'In Stock',
    },
    {
      id: 6,
      name: 'Webcam HD',
      category: 'Electronics',
      price: '₱2,800.00',
      stock: 5,
      status: 'Low Stock',
    },
    {
      id: 7,
      name: 'Desk Lamp',
      category: 'Office',
      price: '₱1,200.00',
      stock: 89,
      status: 'In Stock',
    },
    {
      id: 8,
      name: 'Office Chair',
      category: 'Furniture',
      price: '₱8,500.00',
      stock: 15,
      status: 'In Stock',
    },
    {
      id: 9,
      name: 'Headphones Pro',
      category: 'Audio',
      price: '₱4,200.00',
      stock: 7,
      status: 'Low Stock',
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
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
              <p className="text-2xl font-bold text-gray-800">{product.price}</p>
              <p className="text-xs text-gray-500 mt-1">Inc. 12% VAT</p>
              <p className="text-sm text-gray-600 mt-2">
                Stock: <span className="font-semibold">{product.stock}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 bg-primary-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition-all">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center justify-center bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
