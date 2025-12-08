import db from '../config/database.js';

export const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT 
        id, name, category, price, stock, image,
        CASE WHEN stock <= 10 THEN 'Low Stock' ELSE 'In Stock' END as status,
        created_at, updated_at
      FROM products
      ORDER BY created_at DESC`
    );
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await db.query(
      `SELECT id, name, category, price, stock, image,
        CASE WHEN stock <= 10 THEN 'Low Stock' ELSE 'In Stock' END as status,
        created_at, updated_at
      FROM products WHERE id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log('📝 Create product request received');
    console.log('Body keys:', Object.keys(req.body));
    console.log('Image length:', req.body.image ? req.body.image.length : 0);
    
    const { name, category, price, stock, image } = req.body;

    if (!name || !category || !price || stock === undefined) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (price <= 0) {
      console.log('❌ Validation failed: Invalid price');
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (stock < 0) {
      console.log('❌ Validation failed: Invalid stock');
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    console.log('✅ Validation passed, inserting into database...');
    
    const [result] = await db.query(
      'INSERT INTO products (name, category, price, stock, image) VALUES (?, ?, ?, ?, ?)',
      [name, category, price, stock, image || null]
    );

    console.log('✅ Product inserted with ID:', result.insertId);

    const [newProduct] = await db.query(
      `SELECT id, name, category, price, stock, image,
        CASE WHEN stock <= 10 THEN 'Low Stock' ELSE 'In Stock' END as status,
        created_at, updated_at
      FROM products WHERE id = ?`,
      [result.insertId]
    );

    console.log('✅ Product created successfully');
    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error('❌ Create product error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, image } = req.body;

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (price !== undefined && price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    await db.query(
      `UPDATE products 
       SET name = COALESCE(?, name), category = COALESCE(?, category),
           price = COALESCE(?, price), stock = COALESCE(?, stock),
           image = COALESCE(?, image)
       WHERE id = ?`,
      [name, category, price, stock, image, id]
    );

    const [updated] = await db.query(
      `SELECT id, name, category, price, stock, image,
        CASE WHEN stock <= 10 THEN 'Low Stock' ELSE 'In Stock' END as status,
        created_at, updated_at
      FROM products WHERE id = ?`,
      [id]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [sales] = await db.query('SELECT COUNT(*) as count FROM sales WHERE product_id = ?', [id]);
    
    if (sales[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete product with existing sales records' 
      });
    }

    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'Valid quantity required' });
    }

    await db.query('UPDATE products SET stock = ? WHERE id = ?', [quantity, id]);

    const [updated] = await db.query(
      `SELECT id, stock,
        CASE WHEN stock <= 10 THEN 'Low Stock' ELSE 'In Stock' END as status
      FROM products WHERE id = ?`,
      [id]
    );

    if (updated.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
