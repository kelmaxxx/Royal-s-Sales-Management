import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { passwordPolicy } from '../utils/passwordPolicy.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../utils/emailService.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Fetch user
    const [users] = await db.query(
      'SELECT id, username, name, email, role, password, is_active FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      // Generic message to prevent user enumeration
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log(`Failed login attempt for user: ${username}`);
      return res.status(401).json({ 
        message: 'Invalid username or password' 
      });
    }

    // Successful login: update last login
    await db.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate JWT with explicit algorithm
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m', algorithm: 'HS256' }
    );

    console.log(`Login successful for user ID ${user.id}`);

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
    console.error('Login error:', error.message);
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

// Signup with email verification
export const signup = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Validate inputs
    if (!username || !email || !password || !name) {
      return res.status(400).json({ 
        message: 'Username, email, password, and name are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate username format (alphanumeric, underscore, hyphen, 3-30 chars)
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        message: 'Username must be 3-30 characters and contain only letters, numbers, underscores, or hyphens' 
      });
    }

    // Validate password strength
    const passwordValidation = passwordPolicy.validate(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors 
      });
    }

    // Check if username already exists
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Check if email already exists
    const [existingEmails] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existingEmails.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const verificationToken = uuidv4();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user (active immediately, email verification optional)
    const [result] = await db.query(
      `INSERT INTO users (username, email, phone, password, name, role, is_active, email_verified, 
       email_verify_token, email_verify_expires, created_at) 
       VALUES (?, ?, ?, ?, ?, 'Staff', 1, 0, ?, ?, NOW())`,
      [username, email, req.body.phone || null, hashedPassword, name, verificationToken, verificationExpires]
    );

    const userId = result.insertId;

    // Send verification email
    const emailResult = await sendVerificationEmail(email, name, verificationToken);

    console.log(`New user registered: ID ${userId}, email verification sent`);

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      userId,
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Find user with valid token
    const [users] = await db.query(
      'SELECT id, email, name, email_verify_expires FROM users WHERE email_verify_token = ?',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    const user = users[0];

    // Check if token expired
    if (new Date(user.email_verify_expires) < new Date()) {
      return res.status(400).json({ message: 'Verification token has expired. Please request a new one.' });
    }

    // Activate user and mark email as verified
    await db.query(
      `UPDATE users 
       SET email_verified = 1, is_active = 1, email_verify_token = NULL, email_verify_expires = NULL 
       WHERE id = ?`,
      [user.id]
    );

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    console.log(`Email verified for user ID ${user.id}`);

    res.json({ message: 'Email verified successfully! You can now log in.' });

  } catch (error) {
    console.error('Email verification error:', error.message);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

// Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const [users] = await db.query(
      'SELECT id, email, name, email_verified, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Generic message to prevent email enumeration
      return res.json({ message: 'If the email exists, a verification link has been sent.' });
    }

    const user = users[0];

    // Check if already verified
    if (user.email_verified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = uuidv4();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.query(
      'UPDATE users SET email_verify_token = ?, email_verify_expires = ? WHERE id = ?',
      [verificationToken, verificationExpires, user.id]
    );

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    console.log(`Verification email resent for user ID ${user.id}`);

    res.json({ message: 'Verification email sent. Please check your inbox.' });

  } catch (error) {
    console.error('Resend verification error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Request password reset (disabled - columns removed)
export const requestPasswordReset = async (req, res) => {
  res.status(501).json({ message: 'Password reset feature is not available. Please contact support.' });
};

// Reset password (disabled - columns removed)
export const resetPassword = async (req, res) => {
  res.status(501).json({ message: 'Password reset feature is not available. Please contact support.' });
};
