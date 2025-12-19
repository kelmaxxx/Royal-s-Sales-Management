import db from '../config/database.js';

export const getAllSales = async (req, res) => {
  try {
    const [sales] = await db.query(
      `SELECT 
        s.id, s.product_id as productId, s.product_name as product,
        s.quantity, s.total, s.vat, s.recorded_by as recordedBy,
        DATE_FORMAT(s.created_at, '%b %d, %Y %h:%i %p') as date,
        s.created_at as timestamp
      FROM sales s
      ORDER BY s.created_at DESC`
    );
    res.json(sales);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [sales] = await db.query(
      `SELECT 
        s.id, s.product_id as productId, s.product_name as product,
        s.quantity, s.total, s.vat, s.recorded_by as recordedBy,
        DATE_FORMAT(s.created_at, '%b %d, %Y %h:%i %p') as date,
        s.created_at as timestamp
      FROM sales s WHERE s.id = ?`,
      [id]
    );

    if (sales.length === 0) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sales[0]);
  } catch (error) {
    console.error('Get sale error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSale = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { productId, quantity, recordedBy } = req.body;
    
    // Get the user who is creating this sale from the authenticated session
    const createdByUserId = req.user?.id || null;
    const createdByUserName = req.user?.name || null;

    if (!productId || !quantity || !recordedBy) {
      return res.status(400).json({ message: 'Product, quantity, and recorder are required' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const [products] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    if (products.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    if (product.stock < quantity) {
      await connection.rollback();
      return res.status(400).json({ 
        message: `Insufficient stock. Only ${product.stock} units available.` 
      });
    }

    const total = product.price * quantity;
    const vat = total * 0.12 / 1.12;

    const [saleResult] = await connection.query(
      `INSERT INTO sales (product_id, product_name, quantity, total, vat, recorded_by, created_by_user_id, created_by_user_name) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [productId, product.name, quantity, total, vat, recordedBy, createdByUserId, createdByUserName]
    );

    await connection.query(
      'UPDATE products SET stock = stock - ? WHERE id = ?',
      [quantity, productId]
    );

    await connection.commit();

    const [newSale] = await db.query(
      `SELECT 
        s.id, s.product_id as productId, s.product_name as product,
        s.quantity, s.total, s.vat, s.recorded_by as recordedBy,
        s.created_by_user_name as createdBy,
        DATE_FORMAT(s.created_at, '%b %d, %Y %h:%i %p') as date,
        s.created_at as timestamp
      FROM sales s WHERE s.id = ?`,
      [saleResult.insertId]
    );

    res.status(201).json(newSale[0]);
  } catch (error) {
    await connection.rollback();
    console.error('Create sale error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

export const deleteSale = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const [sales] = await connection.query('SELECT * FROM sales WHERE id = ?', [id]);

    if (sales.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Sale not found' });
    }

    const sale = sales[0];

    await connection.query(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [sale.quantity, sale.product_id]
    );

    await connection.query('DELETE FROM sales WHERE id = ?', [id]);

    await connection.commit();

    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Delete sale error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

export const getSalesStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    let dateFilter = '';
    switch (period) {
      case 'day':
        dateFilter = 'DATE(created_at) = CURDATE()';
        break;
      case 'week':
        dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
        break;
      case 'month':
        dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
        break;
      case 'year':
        dateFilter = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)';
        break;
      default:
        dateFilter = '1=1';
    }

    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as totalSales,
        COALESCE(SUM(total), 0) as totalRevenue,
        COALESCE(AVG(total), 0) as averageSaleValue
      FROM sales
      WHERE ${dateFilter}`
    );

    const [topProducts] = await db.query(
      `SELECT 
        product_id as productId, product_name as productName,
        SUM(quantity) as totalQuantity, SUM(total) as totalRevenue
      FROM sales
      WHERE ${dateFilter}
      GROUP BY product_id, product_name
      ORDER BY totalRevenue DESC
      LIMIT 5`
    );

    res.json({
      ...stats[0],
      topProducts
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
