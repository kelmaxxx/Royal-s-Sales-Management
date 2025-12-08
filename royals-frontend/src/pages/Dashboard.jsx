import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '../App';
import { dashboardAPI, salesAPI, productsAPI } from '../services/api';

const Dashboard = () => {
  const { currentUser } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all dashboard data in parallel
        const [overview, recent, top, lowStock] = await Promise.all([
          dashboardAPI.getOverview(),
          dashboardAPI.getRecentSales(5),
          dashboardAPI.getTopProducts(5),
          dashboardAPI.getLowStockProducts(10),
        ]);

        setDashboardData(overview);
        setRecentSales(recent);
        setTopProducts(top);
        setLowStockProducts(lowStock);

        // If overview includes revenue trend data, use it
        if (overview.revenueData) {
          setRevenueData(overview.revenueData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        console.error('Full error details:', err.response?.data);
        setError('Failed to load dashboard data. Using fallback data.');
        
        // Fallback to mock data if API fails
        setDashboardData({
          totalRevenue: 45000,
          totalSales: 128,
          totalProducts: 45,
          lowStockItems: 3,
        });
        setRecentSales([
          { id: 1, product: 'Sample Product', date: 'Jan 30, 2024', total: 1000 },
        ]);
        setRevenueData([
          { date: 'Jan 1', revenue: 4200 },
          { date: 'Jan 5', revenue: 5100 },
          { date: 'Jan 10', revenue: 4800 },
          { date: 'Jan 15', revenue: 6200 },
          { date: 'Jan 20', revenue: 5800 },
          { date: 'Jan 25', revenue: 7100 },
          { date: 'Jan 30', revenue: 6800 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (price) => {
    return `₱${parseFloat(price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent-gold mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error banner if there's an error
  const ErrorBanner = () => error ? (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
        <p className="text-sm text-yellow-700">{error}</p>
      </div>
    </div>
  ) : null;

  const metricCards = [
    {
      title: 'Total Revenue (Inc. VAT)',
      value: formatPrice(dashboardData?.totalRevenue || 0),
      trend: `${dashboardData?.totalSales || 0} transactions`,
      bgColor: 'bg-primary-dark',
      textColor: 'text-white',
      icon: DollarSign,
    },
    {
      title: 'Total Sales',
      value: (dashboardData?.totalSales || 0).toString(),
      trend: 'Live data',
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      icon: ShoppingCart,
    },
    {
      title: 'Total Products',
      value: (dashboardData?.totalProducts || 0).toString(),
      trend: 'Live data',
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      icon: Package,
    },
    {
      title: 'Low Stock Items',
      value: (dashboardData?.lowStockItems || 0).toString(),
      trend: (dashboardData?.lowStockItems || 0) > 0 ? 'Action needed' : 'All good',
      bgColor: 'bg-accent-gold',
      textColor: 'text-gray-800',
      icon: AlertTriangle,
    },
  ];

  return (
    <div>
      <ErrorBanner />
      
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
              <p className="text-sm text-blue-600 font-medium mt-1">⚡ Live data from API</p>
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
            <p className="text-sm text-blue-600 font-medium mt-1">⚡ Latest {recentSales.length} transactions</p>
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
