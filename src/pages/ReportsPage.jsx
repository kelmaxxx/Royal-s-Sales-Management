import React, { useState, useEffect } from 'react';
import { Download, DollarSign, ShoppingCart, TrendingUp, Package, AlertTriangle, XCircle, FileText, Table, FileJson, ChevronDown } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

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

  // Load data from localStorage and calculate real metrics
  useEffect(() => {
    const loadedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const loadedSales = JSON.parse(localStorage.getItem('sales') || '[]');
    setProducts(loadedProducts);
    setSales(loadedSales);
  }, []);

  // Calculate real sales metrics
  const calculateSalesMetrics = () => {
    if (sales.length === 0) {
      return {
        totalRevenue: 7912000,
        vatAmount: 847714,
        totalTransactions: 1847,
        averageTransaction: 4285,
      };
    }

    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const vatAmount = sales.reduce((sum, sale) => sum + (sale.vat || 0), 0);
    const totalTransactions = sales.length;
    const averageTransaction = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

    return {
      totalRevenue,
      vatAmount,
      totalTransactions,
      averageTransaction,
    };
  };

  // Calculate top selling products from sales data
  const calculateTopProducts = () => {
    if (sales.length === 0) {
      return topProducts; // Return mock data if no sales
    }

    // Aggregate sales by product
    const productSales = {};
    
    sales.forEach(sale => {
      const productName = sale.product;
      if (!productSales[productName]) {
        productSales[productName] = {
          name: productName,
          totalRevenue: 0,
          totalUnits: 0,
        };
      }
      productSales[productName].totalRevenue += sale.total || 0;
      productSales[productName].totalUnits += sale.quantity || 0;
    });

    // Convert to array and sort by revenue
    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5); // Top 5

    // Get product categories from products data
    const getCategory = (productName) => {
      const product = products.find(p => p.name === productName);
      return product ? product.category : 'General';
    };

    // Format as needed for display
    return sortedProducts.map((product, index) => ({
      rank: index + 1,
      name: product.name,
      category: getCategory(product.name),
      revenue: `₱${product.totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      units: product.totalUnits,
    }));
  };

  // Calculate monthly sales data
  const calculateMonthlySales = () => {
    if (sales.length === 0) {
      return monthlySalesData; // Return mock data if no sales
    }

    // Group sales by month
    const monthlyData = {};
    
    sales.forEach(sale => {
      if (sale.timestamp) {
        const date = new Date(sale.timestamp);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        monthlyData[monthKey] += sale.total || 0;
      }
    });

    // Convert to array format
    return Object.entries(monthlyData)
      .map(([month, sales]) => ({ month, sales }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  // Calculate inventory metrics
  const calculateInventoryMetrics = () => {
    if (products.length === 0) {
      return {
        totalProducts: 342,
        totalStock: 8547,
        lowStockItems: 23,
        outOfStockItems: 7,
      };
    }

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStockItems = products.filter(p => p.stock === 0).length;

    return {
      totalProducts,
      totalStock,
      lowStockItems,
      outOfStockItems,
    };
  };

  const salesMetrics = calculateSalesMetrics();
  const realTopProducts = calculateTopProducts();
  const realMonthlySales = calculateMonthlySales();
  const inventoryMetrics = calculateInventoryMetrics();

  const getRankColor = (rank) => {
    const colors = ['bg-accent-gold', 'bg-gray-400', 'bg-amber-700', 'bg-blue-500', 'bg-purple-500'];
    return colors[rank - 1] || 'bg-gray-500';
  };

  // Export Functions
  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const exportToCSV = () => {
    let csvContent = '';
    const timestamp = formatDate();

    if (activeTab === 'sales') {
      // Sales Report CSV
      csvContent = `Sales Report - Generated on ${timestamp}\n\n`;
      csvContent += `Summary\n`;
      csvContent += `Total Revenue,₱7,912,000\n`;
      csvContent += `VAT Amount,₱847,714\n`;
      csvContent += `Total Transactions,1,847\n`;
      csvContent += `Average Transaction,₱4,285\n\n`;
      
      csvContent += `Monthly Sales Trend\n`;
      csvContent += `Month,Sales Amount\n`;
      monthlySalesData.forEach(item => {
        csvContent += `${item.month},₱${item.sales.toLocaleString()}\n`;
      });

      if (sales.length > 0) {
        csvContent += `\nDetailed Sales Transactions\n`;
        csvContent += `Date,Product,Quantity,Total,VAT,Recorded By\n`;
        sales.forEach(sale => {
          csvContent += `${sale.date},"${sale.product}",${sale.quantity},₱${sale.total.toLocaleString()},₱${sale.vat.toFixed(2)},${sale.recordedBy}\n`;
        });
      }
    } else if (activeTab === 'inventory') {
      // Inventory Report CSV
      csvContent = `Inventory Report - Generated on ${timestamp}\n\n`;
      csvContent += `Summary\n`;
      csvContent += `Total Products,342\n`;
      csvContent += `Total Stock,8,547\n`;
      csvContent += `Low Stock Items,23\n`;
      csvContent += `Out of Stock Items,7\n\n`;
      
      csvContent += `Category Distribution\n`;
      csvContent += `Category,Items\n`;
      categoryData.forEach(cat => {
        csvContent += `${cat.name},${cat.value}\n`;
      });

      if (products.length > 0) {
        csvContent += `\nDetailed Product Inventory\n`;
        csvContent += `Product Name,Category,Price,Stock,Status\n`;
        products.forEach(product => {
          csvContent += `"${product.name}",${product.category},₱${product.price.toLocaleString()},${product.stock},${product.status}\n`;
        });
      } else {
        csvContent += `\nInventory Status\n`;
        csvContent += `Product,Category,Stock,Status\n`;
        inventoryStatusData.forEach(item => {
          csvContent += `"${item.product}",${item.category},${item.stock},${item.status}\n`;
        });
      }
    } else if (activeTab === 'revenue') {
      // Revenue Report CSV
      csvContent = `Revenue Report - Generated on ${timestamp}\n\n`;
      csvContent += `Top Selling Products by Revenue\n`;
      csvContent += `Rank,Product,Category,Revenue,Units Sold\n`;
      topProducts.forEach(product => {
        csvContent += `${product.rank},"${product.name}",${product.category},${product.revenue},${product.units}\n`;
      });
    }

    downloadFile(csvContent, `${activeTab}-report-${Date.now()}.csv`, 'text/csv');
    setShowExportMenu(false);
  };

  const exportToHTML = () => {
    const timestamp = formatDate();
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report - ${timestamp}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            border-bottom: 3px solid #1e293b;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #1e293b;
            font-size: 32px;
        }
        .header .date {
            color: #64748b;
            font-size: 14px;
            margin-top: 5px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .metric-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
        }
        .metric-card h3 {
            margin: 0 0 10px 0;
            color: #64748b;
            font-size: 14px;
            font-weight: normal;
        }
        .metric-card .value {
            font-size: 28px;
            font-weight: bold;
            color: #1e293b;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: #1e293b;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        tr:hover {
            background: #f8fafc;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge.in-stock { background: #d1fae5; color: #065f46; }
        .badge.low-stock { background: #fef3c7; color: #92400e; }
        .badge.out-stock { background: #fee2e2; color: #991b1b; }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
        }
        @media print {
            body { margin: 0; background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report</h1>
            <div class="date">Generated on ${timestamp}</div>
        </div>
`;

    if (activeTab === 'sales') {
      htmlContent += `
        <div class="metrics">
            <div class="metric-card">
                <h3>Total Revenue</h3>
                <div class="value">₱7,912,000</div>
                <small style="color: #64748b;">Inc. VAT: ₱847,714</small>
            </div>
            <div class="metric-card">
                <h3>Total Transactions</h3>
                <div class="value">1,847</div>
            </div>
            <div class="metric-card">
                <h3>Avg Transaction</h3>
                <div class="value">₱4,285</div>
            </div>
        </div>
        <h2>Monthly Sales Trend</h2>
        <table>
            <thead>
                <tr><th>Month</th><th>Sales Amount</th></tr>
            </thead>
            <tbody>
`;
      monthlySalesData.forEach(item => {
        htmlContent += `<tr><td>${item.month}</td><td>₱${item.sales.toLocaleString()}</td></tr>`;
      });
      htmlContent += `</tbody></table>`;
    } else if (activeTab === 'inventory') {
      htmlContent += `
        <div class="metrics">
            <div class="metric-card">
                <h3>Total Products</h3>
                <div class="value">342</div>
            </div>
            <div class="metric-card">
                <h3>Total Stock</h3>
                <div class="value">8,547</div>
            </div>
            <div class="metric-card">
                <h3>Low Stock</h3>
                <div class="value">23</div>
            </div>
            <div class="metric-card">
                <h3>Out of Stock</h3>
                <div class="value">7</div>
            </div>
        </div>
        <h2>Inventory Status</h2>
        <table>
            <thead>
                <tr><th>Product</th><th>Category</th><th>Stock</th><th>Status</th></tr>
            </thead>
            <tbody>
`;
      const dataToUse = products.length > 0 ? products : inventoryStatusData;
      dataToUse.forEach(item => {
        const statusClass = item.status === 'In Stock' ? 'in-stock' : item.status === 'Low Stock' ? 'low-stock' : 'out-stock';
        htmlContent += `<tr><td>${item.product || item.name}</td><td>${item.category}</td><td>${item.stock}</td><td><span class="badge ${statusClass}">${item.status}</span></td></tr>`;
      });
      htmlContent += `</tbody></table>`;
    } else if (activeTab === 'revenue') {
      htmlContent += `
        <h2>Top Selling Products by Revenue</h2>
        <table>
            <thead>
                <tr><th>Rank</th><th>Product</th><th>Category</th><th>Revenue</th><th>Units Sold</th></tr>
            </thead>
            <tbody>
`;
      topProducts.forEach(product => {
        htmlContent += `<tr><td><strong>#${product.rank}</strong></td><td>${product.name}</td><td>${product.category}</td><td><strong>${product.revenue}</strong></td><td>${product.units}</td></tr>`;
      });
      htmlContent += `</tbody></table>`;
    }

    htmlContent += `
        <div class="footer">
            <p>Royal Sales System - All amounts include 12% VAT</p>
            <p>This report can be printed using your browser's print function (Ctrl+P or Cmd+P)</p>
        </div>
    </div>
</body>
</html>`;

    downloadFile(htmlContent, `${activeTab}-report-${Date.now()}.html`, 'text/html');
    setShowExportMenu(false);
  };

  const exportToJSON = () => {
    const timestamp = formatDate();
    let jsonData = {
      reportType: activeTab,
      generatedOn: timestamp,
      generatedAt: new Date().toISOString(),
    };

    if (activeTab === 'sales') {
      jsonData.summary = {
        totalRevenue: 7912000,
        vatAmount: 847714,
        totalTransactions: 1847,
        averageTransaction: 4285,
      };
      jsonData.monthlySales = monthlySalesData;
      if (sales.length > 0) {
        jsonData.detailedTransactions = sales;
      }
    } else if (activeTab === 'inventory') {
      jsonData.summary = {
        totalProducts: 342,
        totalStock: 8547,
        lowStockItems: 23,
        outOfStockItems: 7,
      };
      jsonData.categoryDistribution = categoryData;
      jsonData.inventoryStatus = products.length > 0 ? products : inventoryStatusData;
    } else if (activeTab === 'revenue') {
      jsonData.topProducts = topProducts;
    }

    downloadFile(JSON.stringify(jsonData, null, 2), `${activeTab}-report-${Date.now()}.json`, 'application/json');
    setShowExportMenu(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports</h1>
          <p className="text-gray-600">Comprehensive business analytics and insights</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center space-x-2 bg-white border-2 border-primary-dark text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark hover:text-white transition-all shadow-md"
          >
            <Download className="w-5 h-5" />
            <span>Export Report</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="py-2">
                <button
                  onClick={exportToCSV}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <Table className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Export as CSV</div>
                    <div className="text-xs text-gray-500">For Excel & spreadsheets</div>
                  </div>
                </button>
                <button
                  onClick={exportToHTML}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Export as HTML</div>
                    <div className="text-xs text-gray-500">Print-ready document</div>
                  </div>
                </button>
                <button
                  onClick={exportToJSON}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <FileJson className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Export as JSON</div>
                    <div className="text-xs text-gray-500">For data integration</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
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
                {sales.length > 0 && <span className="text-xs text-blue-600 font-semibold">LIVE DATA</span>}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-800">
                ₱{salesMetrics.totalRevenue.toLocaleString('en-PH')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Inc. VAT: ₱{Math.round(salesMetrics.vatAmount).toLocaleString('en-PH')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
                {sales.length > 0 && <span className="text-xs text-blue-600 font-semibold">LIVE DATA</span>}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Transactions</h3>
              <p className="text-3xl font-bold text-gray-800">{salesMetrics.totalTransactions.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                {sales.length > 0 && <span className="text-xs text-blue-600 font-semibold">LIVE DATA</span>}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Transaction</h3>
              <p className="text-3xl font-bold text-gray-800">
                ₱{salesMetrics.averageTransaction.toLocaleString('en-PH')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Inc. 12% VAT</p>
            </div>
          </div>

          {/* Monthly Sales Trend */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Monthly Sales Trend</h2>
                {sales.length > 0 && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    ⚡ Real data from {sales.length} transactions
                  </p>
                )}
              </div>
              <span className="text-sm text-gray-500">All amounts include 12% VAT</span>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={realMonthlySales.length > 0 ? realMonthlySales : monthlySalesData}>
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
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-blue-600" />
                {products.length > 0 && <span className="text-xs text-blue-600 font-semibold">LIVE DATA</span>}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Products</h3>
              <p className="text-3xl font-bold text-gray-800">{inventoryMetrics.totalProducts}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-emerald-600" />
                {products.length > 0 && <span className="text-xs text-blue-600 font-semibold">LIVE DATA</span>}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Stock</h3>
              <p className="text-3xl font-bold text-gray-800">{inventoryMetrics.totalStock.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                {products.length > 0 && <span className="text-xs text-blue-600 font-semibold">LIVE DATA</span>}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Low Stock</h3>
              <p className="text-3xl font-bold text-gray-800">{inventoryMetrics.lowStockItems}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
                {products.length > 0 && <span className="text-xs text-blue-600 font-semibold">LIVE DATA</span>}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Out of Stock</h3>
              <p className="text-3xl font-bold text-gray-800">{inventoryMetrics.outOfStockItems}</p>
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
              <div>
                <h2 className="text-xl font-bold text-gray-800">Top Selling Products by Revenue</h2>
                {sales.length > 0 && realTopProducts.length > 0 && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    ⚡ Real data from {sales.length} sales transactions
                  </p>
                )}
              </div>
              <span className="text-sm text-gray-500">All amounts include 12% VAT</span>
            </div>
            <div className="p-6">
              {realTopProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No sales data available yet</p>
                  <p className="text-gray-400 text-sm mt-2">Start recording sales to see top products here</p>
                </div>
              ) : (
                <div className="space-y-4">
                {realTopProducts.map((product) => (
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
