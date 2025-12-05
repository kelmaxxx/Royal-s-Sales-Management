import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '../App';

const Dashboard = () => {
  const { currentUser } = useUser();
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const loadedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const loadedSales = JSON.parse(localStorage.getItem('sales') || '[]');
    setProducts(loadedProducts);
    setSales(loadedSales);
  }, []);

  // Calculate real metrics
  const calculateMetrics = () => {
    // Total Revenue
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    
    // Total Sales Count
    const totalSales = sales.length;
    
    // Total Products Count
    const totalProducts = products.length;
    
    // Low Stock Items (stock <= 10)
    const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 10).length;

    return {
      totalRevenue,
      totalSales,
      totalProducts,
      lowStockItems,
    };
  };

  // Calculate revenue chart data (last 7 days)
  const calculateRevenueData = () => {
    if (sales.length === 0) {
      // Return mock data if no sales
      return [
        { date: 'Jan 1', revenue: 4200 },
        { date: 'Jan 5', revenue: 5100 },
        { date: 'Jan 10', revenue: 4800 },
        { date: 'Jan 15', revenue: 6200 },
        { date: 'Jan 20', revenue: 5800 },
        { date: 'Jan 25', revenue: 7100 },
        { date: 'Jan 30', revenue: 6800 },
      ];
    }

    // Group sales by date
    const revenueByDate = {};
    sales.forEach(sale => {
      if (sale.timestamp) {
        const date = new Date(sale.timestamp);
        const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (!revenueByDate[dateKey]) {
          revenueByDate[dateKey] = 0;
        }
        revenueByDate[dateKey] += sale.total || 0;
      }
    });

    // Convert to array and sort by date
    return Object.entries(revenueByDate)
      .map(([date, revenue]) => ({ date, revenue }))
      .slice(-7); // Last 7 entries
  };

  // Get recent sales (last 5)
  const getRecentSales = () => {
    if (sales.length === 0) {
      // Return mock data if no sales
      return [
        { id: 1, product: 'Laptop Pro', date: 'Jan 30, 2024', total: 45000 },
        { id: 2, product: 'Wireless Mouse', date: 'Jan 30, 2024', total: 850 },
        { id: 3, product: 'USB-C Cable', date: 'Jan 29, 2024', total: 350 },
        { id: 4, product: 'Monitor 27"', date: 'Jan 29, 2024', total: 12500 },
        { id: 5, product: 'Mechanical Keyboard', date: 'Jan 28, 2024', total: 3500 },
      ];
    }

    // Get current product names (in case products were renamed)
    const getCurrentProductName = (sale) => {
      if (sale.productId) {
        const product = products.find(p => p.id === sale.productId);
        return product ? product.name : sale.product;
      }
      return sale.product;
    };

    return sales
      .slice()
      .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
      .slice(0, 5)
      .map(sale => ({
        id: sale.id,
        product: getCurrentProductName(sale),
        date: sale.date,
        total: sale.total,
      }));
  };

  const formatPrice = (price) => {
    return `₱${parseFloat(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const metrics = calculateMetrics();
  const revenueData = calculateRevenueData();
  const recentSales = getRecentSales();

  const metricCards = [
    {
      title: 'Total Revenue (Inc. VAT)',
      value: formatPrice(metrics.totalRevenue),
      trend: sales.length > 0 ? `${sales.length} transactions` : '+12.5%',
      bgColor: 'bg-primary-dark',
      textColor: 'text-white',
      icon: DollarSign,
    },
    {
      title: 'Total Sales',
      value: metrics.totalSales.toString(),
      trend: sales.length > 0 ? 'Live data' : '+8.2%',
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      icon: ShoppingCart,
    },
    {
      title: 'Total Products',
      value: metrics.totalProducts.toString(),
      trend: products.length > 0 ? 'Live data' : '+3.1%',
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      icon: Package,
    },
    {
      title: 'Low Stock Items',
      value: metrics.lowStockItems.toString(),
      trend: metrics.lowStockItems > 0 ? 'Action needed' : 'All good',
      bgColor: 'bg-accent-gold',
      textColor: 'text-gray-800',
      icon: AlertTriangle,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {currentUser?.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          {currentUser?.role === 'Admin' 
            ? "Here's what's happening with your store today." 
            : "Here's your daily overview and recent activities."}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`${metric.bgColor} ${metric.textColor} rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8" />
                <div className="flex items-center space-x-1 text-sm">
                  {metric.trend.includes('+') && <TrendingUp className="w-4 h-4" />}
                  <span className="font-medium">{metric.trend}</span>
                </div>
              </div>
              <h3 className="text-sm font-medium opacity-90 mb-1">{metric.title}</h3>
              <p className="text-3xl font-bold">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Revenue Overview</h2>
              {sales.length > 0 && (
                <p className="text-sm text-blue-600 font-medium mt-1">⚡ Live data from sales</p>
              )}
            </div>
            <span className="text-sm text-gray-500">All amounts include 12% VAT</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value) => formatPrice(value)}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Sales</h2>
            {sales.length > 0 && (
              <p className="text-sm text-blue-600 font-medium mt-1">⚡ Latest 5 transactions</p>
            )}
          </div>
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-gray-800">{sale.product}</p>
                  <p className="text-sm text-gray-500">{sale.date}</p>
                </div>
                <p className="font-bold text-gray-800">{formatPrice(sale.total)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
