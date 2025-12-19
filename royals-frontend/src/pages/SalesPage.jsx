import React, { useState, useEffect } from 'react';
import { Plus, Search, X, ShoppingCart, Calendar } from 'lucide-react';
import { salesAPI, productsAPI } from '../services/api';
import { useUser } from '../App';

const SalesPage = () => {
  const { currentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [sales, setSales] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    recordedBy: currentUser?.name || 'User',
  });

  // Fetch sales and products from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [salesData, productsData] = await Promise.all([
        salesAPI.getAll(),
        productsAPI.getAll()
      ]);
      setSales(salesData);
      setAvailableProducts(productsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load sales data');
      setSales([]);
      setAvailableProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getDateCategory = (dateString) => {
    const saleDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    if (saleDate.toDateString() === today.toDateString()) {
      return 'today';
    } else if (saleDate.toDateString() === yesterday.toDateString()) {
      return 'yesterday';
    } else if (saleDate >= lastWeek) {
      return 'week';
    } else {
      return 'older';
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = 
      sale.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.recordedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (dateFilter === 'all') return matchesSearch;
    
    const category = getDateCategory(sale.timestamp || sale.date);
    return matchesSearch && category === dateFilter;
  });

  const handleOpenModal = () => {
    setFormData({
      productId: '',
      quantity: '',
      recordedBy: currentUser?.name || 'User',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      productId: '',
      quantity: '',
      recordedBy: currentUser?.name || 'User',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProduct = availableProducts.find(p => p.id === parseInt(formData.productId));
    
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }

    if (parseInt(formData.quantity) > selectedProduct.stock) {
      alert(`Insufficient stock! Only ${selectedProduct.stock} units available.`);
      return;
    }

    try {
      const saleData = {
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        recordedBy: formData.recordedBy,
      };

      await salesAPI.create(saleData);
      await fetchData(); // Refresh both sales and products
      handleCloseModal();
    } catch (err) {
      console.error('Error creating sale:', err);
      alert('Failed to record sale. Please try again.');
    }
  };

  const handleDelete = async (saleId) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await salesAPI.delete(saleId);
        await fetchData();
      } catch (err) {
        console.error('Error deleting sale:', err);
        alert('Failed to delete sale. Please try again.');
      }
    }
  };

  const formatPrice = (price) => {
    return `₱${parseFloat(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateTotal = () => {
    if (!formData.productId || !formData.quantity) return 0;
    const product = availableProducts.find(p => p.id === parseInt(formData.productId));
    return product ? product.price * parseInt(formData.quantity) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent-gold mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading sales...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

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
                      {sale.product}
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

                {/* Recorded By - Only show for Admin */}
                {currentUser?.role === 'Admin' ? (
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
                    <p className="text-xs text-gray-500 mt-1">
                      Select who recorded this sale
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Recorded By
                    </label>
                    <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium">
                      {currentUser?.name || 'Staff'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This sale will be recorded under your name
                    </p>
                  </div>
                )}

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
