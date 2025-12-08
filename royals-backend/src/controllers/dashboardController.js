import db from '../config/database.js';

export const getOverview = async (req, res) => {
  try {
    const [revenueResult] = await db.query(
      'SELECT COALESCE(SUM(total), 0) as totalRevenue FROM sales'
    );

    const [salesResult] = await db.query(
      'SELECT COUNT(*) as totalSales FROM sales'
    );

    const [productsResult] = await db.query(
      'SELECT COUNT(*) as totalProducts FROM products'
    );

    const [lowStockResult] = await db.query(
      'SELECT COUNT(*) as lowStockItems FROM products WHERE stock <= 10'
    );

    const [revenueData] = await db.query(
      `SELECT 
        DATE_FORMAT(DATE(created_at), '%b %e') as date,
        COALESCE(SUM(total), 0) as revenue
      FROM sales
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE_FORMAT(DATE(created_at), '%b %e')
      ORDER BY MIN(created_at) ASC`
    );

    res.json({
      totalRevenue: revenueResult[0].totalRevenue,
      totalSales: salesResult[0].totalSales,
      totalProducts: productsResult[0].totalProducts,
      lowStockItems: lowStockResult[0].lowStockItems,
      revenueData
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecentSales = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const [sales] = await db.query(
      `SELECT 
        id, product_name as product,
        DATE_FORMAT(created_at, '%b %d, %Y') as date,
        total
      FROM sales
      ORDER BY created_at DESC
      LIMIT ?`,
      [parseInt(limit)]
    );

    res.json(sales);
  } catch (error) {
    console.error('Get recent sales error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const [products] = await db.query(
      `SELECT 
        p.id, p.name,
        COALESCE(SUM(s.quantity), 0) as totalSold,
        COALESCE(SUM(s.total), 0) as revenue
      FROM products p
      LEFT JOIN sales s ON p.id = s.product_id
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT ?`,
      [parseInt(limit)]
    );

    res.json(products);
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const [products] = await db.query(
      `SELECT id, name, stock, category
       FROM products
       WHERE stock <= ?
       ORDER BY stock ASC`,
      [parseInt(threshold)]
    );

    res.json(products);
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
