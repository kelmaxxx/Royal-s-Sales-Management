git import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

const SalesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock sales data (all prices include 12% VAT)
  const sales = [
    {
      id: 1,
      date: 'Jan 30, 2024 10:45 AM',
      product: 'Laptop Pro 15"',
      quantity: 2,
      total: '₱90,000.00',
      vat: '₱9,642.86',
      recordedBy: 'Admin',
    },
    {
      id: 2,
      date: 'Jan 30, 2024 09:30 AM',
      product: 'Wireless Mouse',
      quantity: 5,
      total: '₱4,250.00',
      vat: '₱455.36',
      recordedBy: 'Staff',
    },
    {
      id: 3,
      date: 'Jan 29, 2024 04:20 PM',
      product: 'USB-C Cable',
      quantity: 10,
      total: '₱3,500.00',
      vat: '₱375.00',
      recordedBy: 'Admin',
    },
    {
      id: 4,
      date: 'Jan 29, 2024 02:15 PM',
      product: 'Monitor 27"',
      quantity: 1,
      total: '₱12,500.00',
      vat: '₱1,339.29',
      recordedBy: 'Staff',
    },
    {
      id: 5,
      date: 'Jan 29, 2024 11:00 AM',
      product: 'Mechanical Keyboard',
      quantity: 3,
      total: '₱10,500.00',
      vat: '₱1,125.00',
      recordedBy: 'Admin',
    },
    {
      id: 6,
      date: 'Jan 28, 2024 03:45 PM',
      product: 'Webcam HD',
      quantity: 4,
      total: '₱11,200.00',
      vat: '₱1,200.00',
      recordedBy: 'Staff',
    },
    {
      id: 7,
      date: 'Jan 28, 2024 01:30 PM',
      product: 'Desk Lamp',
      quantity: 2,
      total: '₱2,400.00',
      vat: '₱257.14',
      recordedBy: 'Admin',
    },
    {
      id: 8,
      date: 'Jan 28, 2024 10:15 AM',
      product: 'Office Chair',
      quantity: 1,
      total: '₱8,500.00',
      vat: '₱910.71',
      recordedBy: 'Staff',
    },
    {
      id: 9,
      date: 'Jan 27, 2024 05:00 PM',
      product: 'Headphones Pro',
      quantity: 6,
      total: '₱25,200.00',
      vat: '₱2,700.00',
      recordedBy: 'Admin',
    },
    {
      id: 10,
      date: 'Jan 27, 2024 02:20 PM',
      product: 'Laptop Pro 15"',
      quantity: 1,
      total: '₱45,000.00',
      vat: '₱4,821.43',
      recordedBy: 'Staff',
    },
  ];

  const filteredSales = sales.filter((sale) =>
    sale.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sales</h1>
          <p className="text-gray-600">Track and manage all sales transactions</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          <span>New Sale</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent outline-none transition"
          />
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
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{sale.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{sale.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sale.quantity}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{sale.total}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sale.vat}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
