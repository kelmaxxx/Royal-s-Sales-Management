import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('?? Login attempt:', { username, password: '***' });

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    console.log('?? Users found:', users.length);

    if (users.length === 0) {
      console.log('? User not found');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];
    console.log('?? User found:', { username: user.username, role: user.role });
    console.log('?? Stored hash:', user.password);
    console.log('?? Comparing password...');

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    console.log('? Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('? Password comparison failed');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log('?? Login successful!');

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('?? Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, name, email, role FROM users WHERE id = ?',
      [req.user.id]
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
