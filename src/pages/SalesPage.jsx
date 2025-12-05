import React, { useState, useEffect } from 'react';
import { Plus, Search, X, ShoppingCart, Calendar } from 'lucide-react';

const SalesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    recordedBy: 'Admin',
  });

  // Available products for sale - sync with products from localStorage
  const [availableProducts, setAvailableProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
    return [
      { id: 1, name: 'Laptop Pro 15"', price: 45000, stock: 45 },
      { id: 2, name: 'Wireless Mouse', price: 850, stock: 120 },
      { id: 3, name: 'USB-C Cable', price: 350, stock: 8 },
      { id: 4, name: 'Monitor 27"', price: 12500, stock: 32 },
      { id: 5, name: 'Mechanical Keyboard', price: 3500, stock: 67 },
      { id: 6, name: 'Webcam HD', price: 2800, stock: 5 },
      { id: 7, name: 'Desk Lamp', price: 1200, stock: 89 },
      { id: 8, name: 'Office Chair', price: 8500, stock: 15 },
      { id: 9, name: 'Headphones Pro', price: 4200, stock: 7 },
    ];
  });

  // Keep availableProducts in sync with products from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setAvailableProducts(JSON.parse(savedProducts));
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (in case changes happen in same tab)
    const interval = setInterval(() => {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        setAvailableProducts(products);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Initial sales data (stored with product ID for future reference)
  const initialSales = [
    {
      id: 1,
      date: 'Jan 30, 2024 10:45 AM',
      productId: 1,
      product: 'Laptop Pro 15"',
      quantity: 2,
      total: 90000,
      vat: 9642.86,
      recordedBy: 'Admin',
      timestamp: new Date('2024-01-30T10:45:00'),
    },
    {
      id: 2,
      date: 'Jan 30, 2024 09:30 AM',
      productId: 2,
      product: 'Wireless Mouse',
      quantity: 5,
      total: 4250,
      vat: 455.36,
      recordedBy: 'Staff',
      timestamp: new Date('2024-01-30T09:30:00'),
    },
    {
      id: 3,
      date: 'Jan 29, 2024 04:20 PM',
      productId: 3,
      product: 'USB-C Cable',
      quantity: 10,
      total: 3500,
      vat: 375,
      recordedBy: 'Admin',
      timestamp: new Date('2024-01-29T16:20:00'),
    },
    {
      id: 4,
      date: 'Jan 29, 2024 02:15 PM',
      productId: 4,
      product: 'Monitor 27"',
      quantity: 1,
      total: 12500,
      vat: 1339.29,
      recordedBy: 'Staff',
      timestamp: new Date('2024-01-29T14:15:00'),
    },
    {
      id: 5,
      date: 'Jan 29, 2024 11:00 AM',
      productId: 5,
      product: 'Mechanical Keyboard',
      quantity: 3,
      total: 10500,
      vat: 1125,
      recordedBy: 'Admin',
      timestamp: new Date('2024-01-29T11:00:00'),
    },
    {
      id: 6,
      date: 'Jan 28, 2024 03:45 PM',
      productId: 6,
      product: 'Webcam HD',
      quantity: 4,
      total: 11200,
      vat: 1200,
      recordedBy: 'Staff',
      timestamp: new Date('2024-01-28T15:45:00'),
    },
    {
      id: 7,
      date: 'Jan 28, 2024 01:30 PM',
      productId: 7,
      product: 'Desk Lamp',
      quantity: 2,
      total: 2400,
      vat: 257.14,
      recordedBy: 'Admin',
      timestamp: new Date('2024-01-28T13:30:00'),
    },
    {
      id: 8,
      date: 'Jan 28, 2024 10:15 AM',
      productId: 8,
      product: 'Office Chair',
      quantity: 1,
      total: 8500,
      vat: 910.71,
      recordedBy: 'Staff',
      timestamp: new Date('2024-01-28T10:15:00'),
    },
    {
      id: 9,
      date: 'Jan 27, 2024 05:00 PM',
      productId: 9,
      product: 'Headphones Pro',
      quantity: 6,
      total: 25200,
      vat: 2700,
      recordedBy: 'Admin',
      timestamp: new Date('2024-01-27T17:00:00'),
    },
    {
      id: 10,
      date: 'Jan 27, 2024 02:20 PM',
      productId: 1,
      product: 'Laptop Pro 15"',
      quantity: 1,
      total: 45000,
      vat: 4821.43,
      recordedBy: 'Staff',
      timestamp: new Date('2024-01-27T14:20:00'),
    },
  ];

  // Mock sales data (all prices include 12% VAT) - with localStorage persistence
  const [sales, setSales] = useState(() => {
    const savedSales = localStorage.getItem('sales');
    if (savedSales) {
      // Parse and restore Date objects
      const parsedSales = JSON.parse(savedSales);
      return parsedSales.map(sale => ({
        ...sale,
        timestamp: sale.timestamp ? new Date(sale.timestamp) : new Date(),
      }));
    }
    return initialSales;
  });

  // Persist sales to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  const getDateCategory = (dateString) => {
    const saleDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - saleDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'today';
    if (diffDays <= 7) return 'week';
    if (diffDays <= 30) return 'month';
    return 'older';
  };

  // Get current product name by ID (in case product was renamed)
  const getCurrentProductName = (sale) => {
    if (sale.productId) {
      const currentProduct = availableProducts.find(p => p.id === sale.productId);
      return currentProduct ? currentProduct.name : sale.product; // Fallback to stored name if product deleted
    }
    return sale.product; // Old sales without productId
  };

  const filteredSales = sales.filter((sale) => {
    const currentProductName = getCurrentProductName(sale);
    const matchesSearch = currentProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.recordedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (dateFilter === 'all') return matchesSearch;
    
    const category = getDateCategory(sale.timestamp || sale.date);
    return matchesSearch && category === dateFilter;
  });

  const handleOpenModal = () => {
    setFormData({
      productId: '',
      quantity: '',
      recordedBy: 'Admin',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      productId: '',
      quantity: '',
      recordedBy: 'Admin',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const product = availableProducts.find(p => p.id === parseInt(formData.productId));
    if (!product) return;

    const quantity = parseInt(formData.quantity);
    
    // Check if there's enough stock
    if (quantity > product.stock) {
      alert(`Not enough stock! Only ${product.stock} units available.`);
      return;
    }

    const total = product.price * quantity;
    const vat = total * 0.12 / 1.12; // Calculate VAT from total (12% VAT included)

    const newSale = {
      id: Math.max(...sales.map(s => s.id), 0) + 1,
      date: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      productId: product.id, // Store product ID for future reference
      product: product.name, // Store current product name for display
      quantity: quantity,
      total: total,
      vat: vat,
      recordedBy: formData.recordedBy,
      timestamp: new Date(),
    };

    // Update the product stock in localStorage
    const productsFromStorage = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = productsFromStorage.map(p => {
      if (p.id === product.id) {
        const newStock = p.stock - quantity;
        return {
          ...p,
          stock: newStock,
          status: newStock <= 10 ? 'Low Stock' : 'In Stock'
        };
      }
      return p;
    });
    
    // Save updated products to localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Update local availableProducts state
    setAvailableProducts(updatedProducts);

    setSales([newSale, ...sales]);
    handleCloseModal();
  };

  const formatPrice = (price) => {
    return `₱${parseFloat(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateTotal = () => {
    if (!formData.productId || !formData.quantity) return 0;
    const product = availableProducts.find(p => p.id === parseInt(formData.productId));
    return product ? product.price * parseInt(formData.quantity) : 0;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sales</h1>
          <p className="text-gray-600">Track and manage all sales transactions</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center space-x-2 bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Sale</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
          <span className="text-sm text-gray-500">All amounts include 12% VAT</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">VAT (12%)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {getCurrentProductName(sale)}
                      {sale.productId && getCurrentProductName(sale) !== sale.product && (
                        <span className="ml-2 text-xs text-gray-400 italic">(renamed)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.quantity}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">{formatPrice(sale.total)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatPrice(sale.vat)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sale.recordedBy === 'Admin'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {sale.recordedBy}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No sales found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">New Sale</h2>
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
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Product *
                  </label>
                  <select
                    required
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                  >
                    <option value="">Choose a product...</option>
                    {availableProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {formatPrice(product.price)} (Stock: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={formData.productId ? availableProducts.find(p => p.id === parseInt(formData.productId))?.stock : 999}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                    placeholder="0"
                  />
                  {formData.productId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Available stock: {availableProducts.find(p => p.id === parseInt(formData.productId))?.stock}
                    </p>
                  )}
                </div>

                {/* Recorded By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recorded By *
                  </label>
                  <select
                    required
                    value={formData.recordedBy}
                    onChange={(e) => setFormData({ ...formData, recordedBy: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                {/* Total Preview */}
                {formData.productId && formData.quantity && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm font-semibold text-gray-800">{formatPrice(calculateTotal())}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">VAT (12%):</span>
                      <span className="text-sm font-semibold text-gray-800">{formatPrice(calculateTotal() * 0.12 / 1.12)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                      <span className="text-base font-bold text-gray-800">Total:</span>
                      <span className="text-xl font-bold text-primary-dark">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                )}
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
                  Record Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
