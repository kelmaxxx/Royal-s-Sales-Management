import bcrypt from 'bcryptjs';
import db from '../config/database.js';

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, name, email, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query(
      'SELECT id, username, name, email, phone, role, is_active, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, name, email, phone, password, role } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if username or email already exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (username, name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, name, email, phone || null, hashedPassword, role || 'Staff']
    );

    const [newUser] = await db.query(
      'SELECT id, username, name, email, phone, role, is_active, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, password, is_active } = req.body;

    const [existing] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updateQuery = 'UPDATE users SET name = ?, email = ?, phone = ?, role = ?';
    let params = [name, email, phone || null, role];

    // Update is_active if provided
    if (is_active !== undefined) {
      updateQuery += ', is_active = ?';
      params.push(is_active);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ', password = ?';
      params.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await db.query(updateQuery, params);

    const [updated] = await db.query(
      'SELECT id, username, name, email, phone, role, is_active, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting admin users
    const [user] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user[0].role === 'Admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    await db.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
