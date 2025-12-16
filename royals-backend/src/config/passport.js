import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from './database.js';

/**
 * Google OAuth Strategy Configuration
 * 
 * Setup instructions:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable Google+ API
 * 4. Create OAuth 2.0 credentials (Web application)
 * 5. Add authorized redirect URI: http://localhost:3000/api/auth/google/callback
 * 6. Copy Client ID and Client Secret to .env
 */

export const initPassport = () => {
  // Configure Google OAuth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user info from Google profile
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const avatarUrl = profile.photos?.[0]?.value;

          if (!email) {
            return done(null, false, { message: 'No email provided by Google' });
          }

          // Check if OAuth identity already exists
          const [existingOAuth] = await db.query(
            'SELECT user_id FROM oauth_identities WHERE provider = ? AND provider_user_id = ?',
            ['google', googleId]
          );

          let userId;

          if (existingOAuth.length > 0) {
            // User already linked - use existing account
            userId = existingOAuth[0].user_id;

            // Update OAuth tokens
            await db.query(
              `UPDATE oauth_identities 
               SET access_token = ?, refresh_token = ?, updated_at = NOW() 
               WHERE provider = ? AND provider_user_id = ?`,
              [accessToken, refreshToken, 'google', googleId]
            );

            console.log(`Google OAuth login for existing user ID ${userId}`);
          } else {
            // Check if user with this email already exists (account linking)
            const [existingUser] = await db.query(
              'SELECT id, email_verified FROM users WHERE email = ?',
              [email]
            );

            if (existingUser.length > 0) {
              // Link Google account to existing user
              userId = existingUser[0].id;

              // Create OAuth identity link
              await db.query(
                `INSERT INTO oauth_identities 
                 (user_id, provider, provider_user_id, email, name, avatar_url, access_token, refresh_token) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, 'google', googleId, email, name, avatarUrl, accessToken, refreshToken]
              );

              // Mark email as verified and activate account (since Google verified it)
              await db.query(
                'UPDATE users SET email_verified = 1, is_active = 1 WHERE id = ?',
                [userId]
              );

              console.log(`Google account linked to existing user ID ${userId}`);
            } else {
              // Create new user account from Google profile
              const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(7);

              const [userResult] = await db.query(
                `INSERT INTO users 
                 (username, email, name, role, is_active, email_verified, created_at) 
                 VALUES (?, ?, ?, 'user', 1, 1, NOW())`,
                [username, email, name]
              );

              userId = userResult.insertId;

              // Create OAuth identity
              await db.query(
                `INSERT INTO oauth_identities 
                 (user_id, provider, provider_user_id, email, name, avatar_url, access_token, refresh_token) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, 'google', googleId, email, name, avatarUrl, accessToken, refreshToken]
              );

              console.log(`New user created from Google OAuth: ID ${userId}`);
            }
          }

          // Fetch complete user data
          const [users] = await db.query(
            'SELECT id, username, name, email, role FROM users WHERE id = ?',
            [userId]
          );

          if (users.length === 0) {
            return done(null, false, { message: 'User not found' });
          }

          // Update last login
          await db.query(
            'UPDATE users SET last_login_at = NOW() WHERE id = ?',
            [userId]
          );

          return done(null, users[0]);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );

  // Serialize user for session (not used with JWT, but required by Passport)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const [users] = await db.query(
        'SELECT id, username, name, email, role FROM users WHERE id = ?',
        [id]
      );
      done(null, users[0] || null);
    } catch (error) {
      done(error, null);
    }
  });

  console.log('🔑 Passport configured with Google OAuth strategy');
};

export default passport;
