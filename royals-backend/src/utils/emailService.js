import nodemailer from 'nodemailer';

/**
 * Email Service for sending verification, reset, and notification emails
 * 
 * For development: uses ethereal.email (temporary inbox)
 * For production: configure with your SMTP provider (SendGrid, AWS SES, etc.)
 */

let transporter = null;

// Initialize email transporter
export const initEmailService = async () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
    // Production configuration
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    console.log('📧 Email service initialized (production mode)');
  } else {
    // Development: use ethereal.email test account
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('📧 Email service initialized (development mode - ethereal.email)');
      console.log('   View emails at: https://ethereal.email/');
    } catch (error) {
      console.warn('⚠️  Email service not initialized:', error.message);
    }
  }
};

export const sendVerificationEmail = async (email, name, token) => {
  if (!transporter) {
    console.warn('Email service not initialized. Verification email not sent.');
    return { success: false, message: 'Email service unavailable' };
  }
  
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Royals Sales'}" <${process.env.EMAIL_FROM || 'noreply@royals.com'}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Royals Sales Management!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you didn't create an account, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Royals Sales Management System</p>
        </div>
      `
    });
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Verification email sent:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { success: false, message: error.message };
  }
};

export const sendPasswordResetEmail = async (email, name, token) => {
  if (!transporter) {
    console.warn('Email service not initialized. Reset email not sent.');
    return { success: false, message: 'Email service unavailable' };
  }
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Royals Sales'}" <${process.env.EMAIL_FROM || 'noreply@royals.com'}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request a password reset, please ignore this email or contact support if you're concerned.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Royals Sales Management System</p>
        </div>
      `
    });
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Password reset email sent:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, message: error.message };
  }
};

export const sendWelcomeEmail = async (email, name) => {
  if (!transporter) return { success: false };
  
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Royals Sales'}" <${process.env.EMAIL_FROM || 'noreply@royals.com'}>`,
      to: email,
      subject: 'Welcome to Royals Sales Management!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Royals Sales Management! 🎉</h2>
          <p>Hi ${name},</p>
          <p>Your email has been verified and your account is now active.</p>
          <p>You can now log in and start managing your sales:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
               style="background-color: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Royals Sales Management System</p>
        </div>
      `
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false };
  }
};

export default {
  initEmailService,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
