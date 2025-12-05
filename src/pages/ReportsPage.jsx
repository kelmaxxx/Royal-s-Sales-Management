import React, { useState } from 'react';
import { Download, DollarSign, ShoppingCart, TrendingUp, Package, AlertTriangle, XCircle } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('sales');

  // Mock data for Sales Report
  const monthlySalesData = [
    { month: 'Jul', sales: 12400 },
    { month: 'Aug', sales: 15200 },
    { month: 'Sep', sales: 13800 },
    { month: 'Oct', sales: 16500 },
    { month: 'Nov', sales: 14900 },
    { month: 'Dec', sales: 18200 },
    { month: 'Jan', sales: 17600 },
  ];

  // Mock data for Inventory Report
  const categoryData = [
    { name: 'Electronics', value: 145, color: '#3b82f6' },
    { name: 'Accessories', value: 98, color: '#f59e0b' },
    { name: 'Office', value: 56, color: '#10b981' },
    { name: 'Furniture', value: 43, color: '#8b5cf6' },
  ];

  const inventoryStatusData = [
    { id: 1, product: 'Laptop Pro 15"', category: 'Electronics', stock: 45, status: 'In Stock' },
    { id: 2, product: 'USB-C Cable', category: 'Accessories', stock: 8, status: 'Low Stock' },
    { id: 3, product: 'Wireless Mouse', category: 'Accessories', stock: 120, status: 'In Stock' },
    { id: 4, product: 'Webcam HD', category: 'Electronics', stock: 5, status: 'Low Stock' },
    { id: 5, product: 'Desk Lamp', category: 'Office', stock: 89, status: 'In Stock' },
    { id: 6, product: 'Monitor Stand', category: 'Accessories', stock: 0, status: 'Out of Stock' },
  ];

  // Mock data for Revenue Report (prices include 12% VAT)
  const topProducts = [
    { rank: 1, name: 'Laptop Pro 15"', category: 'Electronics', revenue: '₱6,435,000', units: 143 },
    { rank: 2, name: 'Monitor 27"', category: 'Electronics', revenue: '₱500,000', units: 40 },
    { rank: 3, name: 'Office Chair', category: 'Furniture', revenue: '₱340,000', units: 40 },
    { rank: 4, name: 'Mechanical Keyboard', category: 'Accessories', revenue: '₱385,000', units: 110 },
    { rank: 5, name: 'Headphones Pro', category: 'Audio', revenue: '₱252,000', units: 60 },
  ];

  const tabs = [
    { id: 'sales', label: 'Sales Report' },
    { id: 'inventory', label: 'Inventory Report' },
    { id: 'revenue', label: 'Revenue Report' },
  ];

  const getRankColor = (rank) => {
    const colors = ['bg-accent-gold', 'bg-gray-400', 'bg-amber-700', 'bg-blue-500', 'bg-purple-500'];
    return colors[rank - 1] || 'bg-gray-500';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
          <p className="text-gray-600">Comprehensive business analytics and insights</p>
        </div>
        <button className="flex items-center space-x-2 bg-white border-2 border-primary-dark text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark hover:text-white transition-all shadow-md">
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-8 bg-white rounded-lg p-2 shadow-md w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-primary-dark text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'sales' && (
        <div>
          {/* Sales Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-accent-gold" />
                <span className="text-emerald-600 text-sm font-semibold">+15.3%</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-800">₱7,912,000</p>
              <p className="text-xs text-gray-500 mt-1">Inc. VAT: ₱847,714</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
                <span className="text-emerald-600 text-sm font-semibold">+8.7%</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Transactions</h3>
              <p className="text-3xl font-bold text-gray-800">1,847</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                <span className="text-emerald-600 text-sm font-semibold">+5.2%</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Transaction</h3>
              <p className="text-3xl font-bold text-gray-800">₱4,285</p>
              <p className="text-xs text-gray-500 mt-1">Inc. 12% VAT</p>
            </div>
          </div>

          {/* Monthly Sales Trend */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Monthly Sales Trend</h2>
              <span className="text-sm text-gray-500">All amounts include 12% VAT</span>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div>
          {/* Inventory Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <Package className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Products</h3>
              <p className="text-3xl font-bold text-gray-800">342</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <Package className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Stock</h3>
              <p className="text-3xl font-bold text-gray-800">8,547</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mb-4" />
              <h3 className="text-sm font-medium text-gray-600 mb-1">Low Stock</h3>
              <p className="text-3xl font-bold text-gray-800">23</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <XCircle className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="text-sm font-medium text-gray-600 mb-1">Out of Stock</h3>
              <p className="text-3xl font-bold text-gray-800">7</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Distribution Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Category Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Inventory Summary</h2>
              <div className="space-y-4">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="font-medium text-gray-700">{category.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">{category.value} items</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Total Items</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {categoryData.reduce((sum, cat) => sum + cat.value, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Status Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Inventory Status</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inventoryStatusData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.product}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{item.stock}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'In Stock'
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.status === 'Low Stock'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Top Selling Products by Revenue</h2>
              <span className="text-sm text-gray-500">All amounts include 12% VAT</span>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div
                    key={product.rank}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`w-12 h-12 ${getRankColor(
                        product.rank
                      )} rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}
                    >
                      {product.rank}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-gray-800">{product.revenue}</p>
                      <p className="text-xs text-gray-500">Inc. 12% VAT</p>
                      <p className="text-sm text-gray-600 mt-1">{product.units} units sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
