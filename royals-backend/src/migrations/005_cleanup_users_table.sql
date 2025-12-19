-- Remove unnecessary email verification columns (ignoring errors if columns don't exist)
-- These columns may or may not exist depending on previous migrations
-- ALTER TABLE users DROP COLUMN email_verify_token;
-- ALTER TABLE users DROP COLUMN email_verify_expires;
-- ALTER TABLE users DROP COLUMN email_verified;

-- Remove password reset columns
-- ALTER TABLE users DROP COLUMN reset_token;
-- ALTER TABLE users DROP COLUMN reset_expires;

-- Remove security/locking columns
-- ALTER TABLE users DROP COLUMN failed_attempts;
-- ALTER TABLE users DROP COLUMN lock_until;
-- ALTER TABLE users DROP COLUMN password_changed_at;

-- Remove tracking columns
-- ALTER TABLE users DROP COLUMN last_login_at;
-- ALTER TABLE users DROP COLUMN updated_at;

-- This migration is commented out to avoid errors
-- Run these manually if needed based on your actual table structure
